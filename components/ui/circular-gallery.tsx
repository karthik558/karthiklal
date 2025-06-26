"use client"

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from "ogl";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type GL = Renderer["gl"];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = "bold 30px monospace",
  color: string = "black"
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2d context");

  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const fontSize = getFontSize(font);
  const textHeight = Math.ceil(fontSize * 1.2);

  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor = "#545050",
    font = "30px sans-serif",
  }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.15;
    const textWidthScaled = textHeightScaled * aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y =
      -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text?: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text?: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    // this.createTitle(); // Disabled to remove text labels
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    if (!this.text) return; // Skip title creation if no text provided
    
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(
    scroll: { current: number; last: number },
    direction: "right" | "left"
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({
    screen,
    viewport,
  }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

interface AppConfig {
  items?: { image: string; text?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  onComplete?: () => void;
}

class App {
  container: HTMLElement;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
    velocity: number;
    maxVelocity: number;
  };
  onCheckDebounce: (...args: any[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text?: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  rotationProgress: number = 0;
  maxRotation: number = 1; // One full rotation
  isScrollControlled: boolean = false; // Disabled automatic scroll control
  onComplete?: () => void;
  
  // Auto-rotation properties
  autoRotateSpeed: number = 0.008; // Increased speed for visible rotation
  autoRotateEnabled: boolean = true;
  userInteractionTime: number = 0;
  interactionTimeout: NodeJS.Timeout | null = null;
  
  // Velocity damping properties - more conservative values
  velocityDamping: number = 0.7; // Increased damping
  lastWheelTime: number = 0;
  wheelTimeout: NodeJS.Timeout | null = null;

  boundOnResize!: () => void;
  boundOnWheel!: (e: WheelEvent) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;

  isDown: boolean = false;
  start: number = 0;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = "#ffffff",
      borderRadius = 0,
      font = "bold 30px DM Sans",
      onComplete,
    }: AppConfig
  ) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.scroll = { 
      ease: 0.06, // Slightly increased for more responsive movement
      current: 0, 
      target: 0, 
      last: 0, 
      velocity: 0, 
      maxVelocity: 2.5 // Increased max velocity for better responsiveness
    };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.onComplete = onComplete;
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    // Remove automatic ScrollTrigger setup - make it manual only
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0); // Transparent background for the canvas
    
    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    // Ensure canvas is interactive
    canvas.style.pointerEvents = 'auto';
    canvas.style.touchAction = 'none'; // Prevent default touch behaviors
    canvas.style.userSelect = 'none';
    canvas.style.cursor = 'grab';
    
    this.container.appendChild(canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(
    items: { image: string; text?: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const defaultItems = [
      {
        image: `https://picsum.photos/seed/1/800/600?grayscale`,
        text: "Bridge",
      },
      {
        image: `https://picsum.photos/seed/2/800/600?grayscale`,
        text: "Desk Setup",
      },
      {
        image: `https://picsum.photos/seed/3/800/600?grayscale`,
        text: "Waterfall",
      },
      {
        image: `https://picsum.photos/seed/4/800/600?grayscale`,
        text: "Strawberries",
      },
      {
        image: `https://picsum.photos/seed/5/800/600?grayscale`,
        text: "Deep Diving",
      },
      {
        image: `https://picsum.photos/seed/16/800/600?grayscale`,
        text: "Train Track",
      },
      {
        image: `https://picsum.photos/seed/17/800/600?grayscale`,
        text: "Santorini",
      },
      {
        image: `https://picsum.photos/seed/8/800/600?grayscale`,
        text: "Blurry Lights",
      },
      {
        image: `https://picsum.photos/seed/9/800/600?grayscale`,
        text: "New York",
      },
      {
        image: `https://picsum.photos/seed/10/800/600?grayscale`,
        text: "Good Boy",
      },
      {
        image: `https://picsum.photos/seed/21/800/600?grayscale`,
        text: "Coastline",
      },
      {
        image: `https://picsum.photos/seed/12/800/600?grayscale`,
        text: "Palm Trees",
      },
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text || "", // Provide empty string as fallback
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
    
    // Disable auto-rotation when user interacts
    this.autoRotateEnabled = false;
    this.userInteractionTime = Date.now();
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * 0.08; // Significantly increased sensitivity for better dragging
    
    // Apply less damping for more responsive dragging
    const dampedDistance = distance * 0.9; // Increased responsiveness
    this.scroll.target = (this.scroll.position ?? 0) + dampedDistance;
    
    // Update interaction time
    this.userInteractionTime = Date.now();
  }

  onTouchUp() {
    this.isDown = false;
    
    // Re-enable auto-rotation after a delay
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout);
    }
    
    this.interactionTimeout = setTimeout(() => {
      this.autoRotateEnabled = true;
    }, 3000); // Resume auto-rotation after 3 seconds of no interaction
    
    this.onCheck();
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    
    // Disable auto-rotation during wheel interaction
    this.autoRotateEnabled = false;
    this.userInteractionTime = Date.now();
    
    const currentTime = Date.now();
    const timeDelta = currentTime - this.lastWheelTime;
    this.lastWheelTime = currentTime;
    
    // More responsive wheel delta calculation
    let wheelDelta = Math.abs(e.deltaY) * 0.008; // Increased from 0.003
    
    // Reasonable velocity cap
    wheelDelta = Math.min(wheelDelta, this.scroll.maxVelocity * 0.5);
    
    // Moderate velocity damping
    if (timeDelta < 100) {
      wheelDelta *= 0.7; // Reduced damping for better responsiveness
    }
    
    // Apply scroll direction
    const direction = e.deltaY > 0 ? 1 : -1;
    this.scroll.target += direction * wheelDelta;
    
    // Clear existing timeout and set new one
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    
    // Re-enable auto-rotation after wheel stops
    this.wheelTimeout = setTimeout(() => {
      this.autoRotateEnabled = true;
      this.onCheckDebounce();
    }, 2000); // Resume auto-rotation after 2 seconds
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {
    // Apply gentle auto-rotation when enabled
    if (this.autoRotateEnabled && !this.isDown && Date.now() - this.userInteractionTime > 2000) {
      this.scroll.target += this.autoRotateSpeed;
    }
    
    // Calculate velocity with moderate damping
    this.scroll.velocity = (this.scroll.target - this.scroll.current) * 0.5;
    
    // Apply velocity-based damping with more lenient limits for better responsiveness
    const velocityMagnitude = Math.abs(this.scroll.velocity);
    let dynamicEase = this.scroll.ease;
    
    if (velocityMagnitude > this.scroll.maxVelocity) {
      // Moderate damping for very high velocities
      dynamicEase = this.scroll.ease * 0.4;
    } else if (velocityMagnitude > this.scroll.maxVelocity * 0.7) {
      // Light damping for medium-high velocities
      dynamicEase = this.scroll.ease * 0.7;
    }
    
    // Always use smooth lerp interpolation
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      dynamicEase
    );
    
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this) as (e: Event) => void;
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    
    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    
    window.addEventListener("resize", this.boundOnResize);
    
    // Add events to both canvas and container for better interaction
    canvas.addEventListener("wheel", this.boundOnWheel, { passive: false });
    canvas.addEventListener("mousedown", this.boundOnTouchDown);
    canvas.addEventListener("touchstart", this.boundOnTouchDown, { passive: false });
    
    // Mouse and touch move/up events should be on window to capture movements outside canvas
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchmove", this.boundOnTouchMove, { passive: false });
    window.addEventListener("touchend", this.boundOnTouchUp);
    
    // Update cursor on mouse down/up
    canvas.addEventListener("mousedown", () => {
      canvas.style.cursor = 'grabbing';
    });
    
    canvas.addEventListener("mouseup", () => {
      canvas.style.cursor = 'grab';
    });
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    
    // Clear timeouts
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    if (this.interactionTimeout) {
      clearTimeout(this.interactionTimeout);
    }
    
    const canvas = this.renderer?.gl?.canvas as HTMLCanvasElement;
    
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    
    if (canvas) {
      canvas.removeEventListener("wheel", this.boundOnWheel);
      canvas.removeEventListener("mousedown", this.boundOnTouchDown);
      canvas.removeEventListener("touchstart", this.boundOnTouchDown);
    }
    
    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(
        this.renderer.gl.canvas as HTMLCanvasElement
      );
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  onComplete?: () => void;
}

const CircularGallery = ({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px DM Sans",
  onComplete,
}: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      onComplete,
    });
    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, onComplete]);
  
  return (
    <div
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-transparent"
      ref={containerRef}
    />
  );
}

export const Component = CircularGallery;
