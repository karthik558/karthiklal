(function ($) {
  "use strict";

  // Detect Firefox
  let firefoxAgent = navigator.userAgent.indexOf("Firefox") > -1;

  // Add class "is-firefox" to </body>
  if (firefoxAgent) {
    $("body").addClass("is-firefox");
  }

  // Detect mobile device (Do not remove!!!)
  var isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini/i.test(
      navigator.userAgent
    )
      ? true
      : false;

  // Add class "is-mobile" to </body>
  if (isMobile) {
    $("body").addClass("is-mobile");
  }

  if ($("body").hasClass("tt-transition")) {
    // Wait until the whole page is loaded.
    $(window).on("load", function () {
      setTimeout(function () {
        HideLoad();
      }, 0);
    });

    function RevealLoad() {
      var tl_transitIn = gsap.timeline({
        defaults: { duration: 1.5, ease: Expo.easeInOut },
      });

      if ($("#page-transition").length) {
        tl_transitIn.set("#page-transition", { autoAlpha: 1 });
        tl_transitIn.to(
          ".ptr-overlay",
          { scaleY: 1, transformOrigin: "center bottom" },
          0
        );
        tl_transitIn.to(".ptr-preloader", { autoAlpha: 1 }, 0.4);
      }
      tl_transitIn.to("#content-wrap", { y: -80, autoAlpha: 0 }, 0);
      tl_transitIn.to("#tt-header", { y: -20, autoAlpha: 0 }, 0);
    }

    // Transitions Out (when "ptr-overlay" slides out)
    function HideLoad() {
      var tl_transitOut = gsap.timeline();

      if ($("#page-transition").length) {
        tl_transitOut.to(".ptr-preloader", {
          duration: 1.5,
          autoAlpha: 0,
          ease: Expo.easeInOut,
        });
        tl_transitOut.to(
          ".ptr-overlay",
          {
            duration: 1.5,
            scaleY: 0,
            transformOrigin: "center top",
            ease: Expo.easeInOut,
          },
          0.3
        );
      }

      // tt-Header appear
      tl_transitOut.from(
        "#tt-header",
        {
          duration: 1.5,
          y: 20,
          autoAlpha: 0,
          ease: Expo.easeInOut,
          clearProps: "all",
        },
        0.6
      );

      // tt-Footer appear
      tl_transitOut.from(
        "#tt-footer",
        {
          duration: 1.5,
          y: 20,
          autoAlpha: 0,
          ease: Expo.easeInOut,
          clearProps: "all",
        },
        0.2
      );

      // Page header image appear
      if ($(".ph-image").length) {
        if ($("#page-header").hasClass("ph-bg-image")) {
          tl_transitOut.from(
            ".ph-image img, .ph-video",
            {
              duration: 2,
              y: 80,
              autoAlpha: 0,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            0.8
          );
        } else {
          tl_transitOut.from(
            ".ph-image",
            {
              duration: 2,
              y: 80,
              autoAlpha: 0,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            1.2
          );
        }
      }

      // Page header elements appear (elements with class "ph-appear")
      var $phAppear = $(".ph-appear");
      if ($phAppear.length) {
        tl_transitOut.from(
          $phAppear,
          {
            duration: 2,
            y: 40,
            autoAlpha: 0,
            stagger: 0.3,
            ease: Expo.easeOut,
            clearProps: "all",
          },
          1.5
        );
      }

      // Portfolio interactive elements appear
      var $pi = $(".portfolio-interactive");
      var $piItem = $(".portfolio-interactive-item");
      var $piGhost = $(".portfolio-interactive-ghost");
      var $piPagination = $(".portfolio-interactive .tt-pagination");

      if ($pi.length) {
        if ($pi.hasClass("pi-full")) {
          if ($pi.hasClass("pi-inline")) {
            tl_transitOut.from(
              $piItem,
              {
                duration: 2,
                y: 60,
                autoAlpha: 0,
                stagger: 0.15,
                ease: Expo.easeOut,
                clearProps: "all",
              },
              1.3
            );
          } else {
            tl_transitOut.from(
              $piItem,
              {
                duration: 2,
                y: 100,
                autoAlpha: 0,
                stagger: 0.15,
                ease: Expo.easeOut,
                clearProps: "all",
              },
              1.3
            );
          }

          if ($piGhost.length) {
            $piGhost.wrapInner('<div class="pi-ghost-appear"></div>');
            tl_transitOut.from(
              ".pi-ghost-appear",
              {
                duration: 2,
                y: 80,
                autoAlpha: 0,
                ease: Expo.easeOut,
                clearProps: "all",
              },
              1.5
            );
          }

          if ($piPagination.length) {
            $piPagination.wrap('<div class="pi-pagination-appear"></div>');
            tl_transitOut.from(
              ".pi-pagination-appear",
              {
                duration: 2,
                y: 60,
                autoAlpha: 0,
                ease: Expo.easeOut,
                clearProps: "all",
              },
              3
            );
          }
        }
      }

      // Portfolio split elements appear
      var $portfolioSplit = $(".portfolio-split");
      var $psplItem = $(".portfolio-split-item");
      var $psplImages = $(".pspl-images-inner");
      var $psplGhost = $(".pspl-ghost");
      if ($portfolioSplit.length) {
        tl_transitOut.from(
          $psplItem,
          {
            duration: 2,
            y: 40,
            autoAlpha: 0,
            stagger: 0.1,
            ease: Expo.easeOut,
            clearProps: "all",
          },
          1.3
        );
        tl_transitOut.from(
          $psplImages,
          {
            duration: 2,
            scale: 1.1,
            autoAlpha: 0,
            ease: Expo.easeOut,
            clearProps: "all",
          },
          1
        );
        if ($portfolioSplit.hasClass("pspl-reverse")) {
          tl_transitOut.from(
            $psplGhost,
            {
              duration: 2,
              x: 40,
              autoAlpha: 0,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            2
          );
        } else {
          tl_transitOut.from(
            $psplGhost,
            {
              duration: 2,
              x: -40,
              autoAlpha: 0,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            2
          );
        }
      }

      // Portfolio slider appear (full screen slider)
      var $portfolioSlider = $(".tt-portfolio-slider");
      var $psiElem = $(".tt-psc-elem");
      if ($portfolioSlider.length) {
        tl_transitOut.from(
          $portfolioSlider,
          {
            duration: 2,
            autoAlpha: 0,
            y: 40,
            ease: Expo.easeOut,
            clearProps: "all",
          },
          1
        );
        if ($psiElem.length) {
          $psiElem.wrap('<div class="tt-ps-appear"></div>');
          tl_transitOut.fromTo(
            ".tt-ps-appear",
            { autoAlpha: 0, x: 40, scaleX: 1.1, transformOrigin: "left" },
            {
              duration: 1.5,
              autoAlpha: 1,
              x: 0,
              scaleX: 1,
              transformOrigin: "left",
              stagger: 0.15,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            1.4
          );
        }
      }

      // Portfolio carousel appear
      var $portfolioCarousel = $(".tt-portfolio-carousel");
      var $pciTitle = $(".tt-pci-title");
      var $pciCategory = $(".tt-pci-category");
      if ($portfolioCarousel.length) {
        tl_transitOut.from(
          $portfolioCarousel,
          {
            duration: 2,
            autoAlpha: 0,
            y: 40,
            ease: Expo.easeOut,
            clearProps: "all",
          },
          1
        );
        if ($pciTitle.length) {
          tl_transitOut.fromTo(
            $pciTitle,
            { autoAlpha: 0, x: 100, scaleX: 1.3, transformOrigin: "left" },
            {
              duration: 1.5,
              autoAlpha: 1,
              x: 0,
              scaleX: 1,
              transformOrigin: "left",
              ease: Expo.easeOut,
              clearProps: "all",
            },
            1.4
          );
        }
        if ($pciCategory.length) {
          tl_transitOut.fromTo(
            $pciCategory,
            { autoAlpha: 0, x: 60, scaleX: 1.3, transformOrigin: "left" },
            {
              duration: 1.5,
              autoAlpha: 1,
              x: 0,
              scaleX: 1,
              transformOrigin: "left",
              ease: Expo.easeOut,
              clearProps: "all",
            },
            1.6
          );
        }
      }

      // Portfolio hover carousel appear
      var $portfolioHoverCarousel = $(".tt-portfolio-hover-carousel");
      var $portfolioHoverCarouselImages = $(
        ".tt-portfolio-hover-carousel-images"
      );
      var $portfolioHoverCarouselItem = $portfolioHoverCarousel
        .find(".swiper-slide-visible")
        .find(".tt-phc-item");
      var $portfolioHoverCarouselCounter = $(".tt-phc-counter");
      if ($portfolioHoverCarousel.length) {
        if ($portfolioHoverCarouselImages.length) {
          tl_transitOut.from(
            $portfolioHoverCarouselImages,
            {
              duration: 2,
              autoAlpha: 0,
              y: 40,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            1
          );
        }
        if ($portfolioHoverCarouselItem.length) {
          tl_transitOut.from(
            $portfolioHoverCarouselItem,
            {
              duration: 2,
              autoAlpha: 0,
              x: 180,
              scaleX: 1.3,
              stagger: 0.15,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            1.4
          );
        }
        if ($portfolioHoverCarouselCounter.length) {
          tl_transitOut.from(
            $portfolioHoverCarouselCounter,
            {
              duration: 2,
              y: 20,
              autoAlpha: 0,
              ease: Expo.easeInOut,
              clearProps: "all",
            },
            0.4
          );
        }

        setTimeout(function () {
          $portfolioHoverCarousel.addClass("tt-phc-ready");
        }, 2000);
      }

      // Sliding sidebar trigger appear
      var $ssWrap = $(".tt-sliding-sidebar-wrap");
      var $ssTrigger = $(".tt-sliding-sidebar-trigger");
      if ($ssWrap.length) {
        if (!isMobile) {
          if ($ssWrap.hasClass("tt-ss-right")) {
            tl_transitOut.from(
              $ssTrigger,
              { duration: 1.5, autoAlpha: 0, x: 50, ease: Expo.easeOut },
              2
            );
          } else {
            tl_transitOut.from(
              $ssTrigger,
              { duration: 1.5, autoAlpha: 0, x: -50, ease: Expo.easeOut },
              2
            );
          }
        } else {
          tl_transitOut.from(
            $ssTrigger,
            { duration: 1.5, autoAlpha: 0, y: 20, ease: Expo.easeOut },
            2
          );
        }
      }

      // Blog elements appear
      var $blogElem = $("#blog-list, .tt-blog-post, .tt-sidebar");
      if ($blogElem.length) {
        tl_transitOut.from(
          $blogElem,
          {
            duration: 2,
            autoAlpha: 0,
            y: 80,
            ease: Expo.easeOut,
            clearProps: "all",
          },
          1
        );
      }

      // Page other elements appear
      if ($("#page-content").length) {
        tl_transitOut.from(
          "#page-content",
          { duration: 2, autoAlpha: 0, ease: Expo.easeOut, clearProps: "all" },
          1
        );
      }

      if ($("#page-transition").length) {
        tl_transitOut.set("#page-transition", {
          duration: 1.5,
          autoAlpha: 0,
          ease: Expo.easeInOut,
        });
      }
    }

    // Force page a reload when browser "Back" button click.
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload();
      }
    };

    // On link click
    $("a")
      .not('[target="_blank"]')
      .not('[href^="#"]')
      .not('[href^="mailto"]')
      .not('[href^="tel"]')
      .not(".lg-trigger")
      .not(".tt-btn-disabled")
      .not(".no-transition")
      .on("click", function (e) {
        e.preventDefault();

        setTimeout(
          function (url) {
            window.location = url;
          },
          1500,
          this.href
        );

        RevealLoad();
      });
  }

  if ($("body").hasClass("tt-smooth-scroll")) {
    if (!isMobile) {
      var Scrollbar = window.Scrollbar;
      class AnchorPlugin extends Scrollbar.ScrollbarPlugin {
        static pluginName = "anchor";

        onHashChange = () => {
          this.jumpToHash(window.location.hash);
        };

        onClick = (event) => {
          const { target } = event;
          if (target.tagName !== "A") {
            return;
          }
          const hash = target.getAttribute("href");
          if (!hash || hash.charAt(0) !== "#") {
            return;
          }
          this.jumpToHash(hash);
        };

        jumpToHash = (hash) => {
          if (!hash) {
            return;
          }
          const { scrollbar } = this;
          scrollbar.containerEl.scrollTop = 0;
          const target = document.querySelector(hash);
          if (target) {
            scrollbar.scrollIntoView(target, {
              offsetTop: parseFloat(target.getAttribute("data-offset")) || 0, // Change to set default offset
            });
          }
        };

        onInit() {
          this.jumpToHash(window.location.hash);
          window.addEventListener("hashchange", this.onHashChange);
          this.scrollbar.contentEl.addEventListener("click", this.onClick);
        }

        onDestory() {
          window.removeEventListener("hashchange", this.onHashChange);
          this.scrollbar.contentEl.removeEventListener("click", this.onClick);
        }
      }
      Scrollbar.use(AnchorPlugin);

      // Init Smooth Scrollbar
      Scrollbar.init(document.querySelector("#scroll-container"), {
        damping: 0.05,
        renderByPixel: true,
        continuousScrolling: true,
        alwaysShowTracks: true,
      });

      // 3rd party library setup
      let scrollPositionX = 0,
        scrollPositionY = 0,
        bodyScrollBar = Scrollbar.init(
          document.getElementById("scroll-container")
        );

      bodyScrollBar.addListener(({ offset }) => {
        scrollPositionX = offset.x;
        scrollPositionY = offset.y;
      });

      bodyScrollBar.setPosition(0, 0);
      bodyScrollBar.track.xAxis.element.remove();

      // tell ScrollTrigger to use these proxy getter/setter methods for the "body" element:
      ScrollTrigger.scrollerProxy("body", {
        scrollTop(value) {
          if (arguments.length) {
            bodyScrollBar.scrollTop = value;
          }
          return bodyScrollBar.scrollTop;
        },
      });

      // when smooth scroller updates, tell ScrollTrigger to update() too.
      bodyScrollBar.addListener(ScrollTrigger.update);

      // Move "tt-header" out of "scroll-container"
      if ($("#tt-header").hasClass("tt-header-fixed")) {
        $("#scroll-container").before($("#tt-header"));
      }
    }
  }

  ScrollTrigger.config({ limitCallbacks: true });

  gsap.utils.toArray(".tt-lazy").forEach((image) => {
    let newSRC = image.dataset.src,
      newImage = document.createElement("img"),
      loadImage = () => {
        newImage.onload = () => {
          newImage.onload = null; 
          newImage.src = image.src;
          image.src = newSRC;
          gsap.set(newImage, {
            position: "absolute",
            top: image.offsetTop,
            left: image.offsetLeft,
            width: image.offsetWidth,
            height: image.offsetHeight,
          });
          image.parentNode.appendChild(newImage);
          gsap.to(newImage, {
            opacity: 0,
            onComplete: () => {
              newImage.parentNode.removeChild(newImage);
              image.removeAttribute("data-src");
            },
          });
          st && st.kill();
        };
        newImage.src = newSRC;

        ScrollTrigger.refresh(true);
      },
      st = ScrollTrigger.create({
        trigger: image,
        start: "-50% bottom",
        onEnter: loadImage,
        onEnterBack: loadImage, // make sure it works in either direction
      });
  });

  if ($(window).width() > 1024) {
    $(".tt-submenu-trigger")
      .parent()
      .on("mouseenter", function () {
        var menu = $("> .tt-submenu", this);
        var menupos = $(menu).offset();

        if (menupos.left + menu.width() > $(window).width()) {
          var newpos = -$(menu).width();

          menu.css({ left: newpos });
        }
      });
  }

  // Main menu hover
  $(".tt-main-menu-list")
    .on("mouseenter", function () {
      $(this).addClass("tt-mm-hover");
    })
    .on("mouseleave", function () {
      $(this).removeClass("tt-mm-hover");
    });

  // Submenu wrap hover
  $(".tt-submenu-wrap")
    .on("mouseenter", function () {
      $(this).addClass("tt-submenu-open");
    })
    .on("mouseleave", function () {
      $(this).removeClass("tt-submenu-open");
    });

  // Open/close mobile menu on toggle button click
  $("#tt-m-menu-toggle-btn-wrap").on("click", function () {
    $("html").toggleClass("tt-no-scroll");
    $("body").toggleClass("tt-m-menu-open").addClass("tt-m-menu-active");
    if ($("body").hasClass("tt-m-menu-open")) {
      // Menu step in animations
      $("body").addClass("tt-m-menu-toggle-no-click"); 
      // Menu in animations
      var tl_MenuIn = gsap.timeline({
        onComplete: function () {
          $("body").removeClass("tt-m-menu-toggle-no-click");
        },
      });

      tl_MenuIn.to(".tt-main-menu", { duration: 0.4, autoAlpha: 1 });
      tl_MenuIn.from(".tt-main-menu-content > ul > li", {
        duration: 0.4,
        y: 80,
        autoAlpha: 0,
        stagger: 0.05,
        ease: Power2.easeOut,
        clearProps: "all",
      });

      // On menu link click
      $(".tt-main-menu a, .tt-logo a")
        .not('[target="_blank"]')
        .not('[href^="#"]')
        .not('[href^="mailto"]')
        .not('[href^="tel"]')
        .on("click", function () {
          gsap.set("#content-wrap", { autoAlpha: 0 });
          gsap.to(".tt-main-menu-content > ul > li", {
            duration: 0.4,
            y: -80,
            autoAlpha: 0,
            stagger: 0.05,
            ease: Power2.easeIn,
          });
        });
    } else {
      // Menu step out animations
      $("body").addClass("tt-m-menu-toggle-no-click"); 

      // Menu out animations
      var tl_MenuOut = gsap.timeline({
        onComplete: function () {
          $("body").removeClass("tt-m-menu-toggle-no-click");
        },
      });

      tl_MenuOut.to(".tt-main-menu-content > ul > li", {
        duration: 0.4,
        y: -80,
        autoAlpha: 0,
        stagger: 0.05,
        ease: Power2.easeIn,
      });
      tl_MenuOut.to(
        ".tt-main-menu",
        { duration: 0.4, autoAlpha: 0, clearProps: "all" },
        "+=0.2"
      );
      tl_MenuOut.to(".tt-main-menu-content > ul > li", { clearProps: "all" }); // clearProps only

      // Close open submenus
      setTimeout(function () {
        $(".tt-submenu").slideUp(350);
        $(".tt-submenu-trigger").removeClass("tt-m-submenu-open");
        $("body").removeClass("tt-m-menu-active");
      }, 900);
    }

    return false;
  });

  // Append element if link href contains #
  $('.tt-submenu-trigger > a[href^="#"]')
    .parent(".tt-submenu-trigger")
    .append('<span class="tt-submenu-trigger-m"></span>');

  // Open submenu if link href contains #
  if ($(".tt-submenu-trigger > a").is('[href^="#"]')) {
    $(".tt-submenu-trigger-m").on("click", function () {
      var $this = $(this).parent();
      if ($this.hasClass("tt-m-submenu-open")) {
        $this.removeClass("tt-m-submenu-open");
        $this.next().slideUp(350);
      } else {
        $this
          .parent()
          .parent()
          .find(".tt-submenu")
          .prev()
          .removeClass("tt-m-submenu-open");
        $this.parent().parent().find(".tt-submenu").slideUp(350);
        $this.toggleClass("tt-m-submenu-open");
        $this.next().slideToggle(350);
      }
    });
  }

  // Open submenu on caret click
  $(".tt-submenu-trigger").append('<span class="tt-m-caret"></span>');
  $(".tt-m-caret").on("click", function () {
    var $this = $(this).parent();
    if ($this.hasClass("tt-m-submenu-open")) {
      $this.removeClass("tt-m-submenu-open");
      $this.next().slideUp(350);
    } else {
      $this
        .parent()
        .parent()
        .find(".tt-submenu")
        .prev()
        .removeClass("tt-m-submenu-open");
      $this.parent().parent().find(".tt-submenu").slideUp(350);
      $this.toggleClass("tt-m-submenu-open");
      $this.next().slideToggle(350);
    }
  });

  // Add class "tt-header-fixed-on" to <body> if "tt-header-fixed" enabled.
  if ($("#tt-header").hasClass("tt-header-fixed")) {
    $("body").addClass("tt-header-fixed-on");
  }

  // On menu toggle button click
  var $olMenuToggleBtn = $(
    ".tt-ol-menu-toggle-btn-text, .tt-ol-menu-toggle-btn"
  );

  $olMenuToggleBtn.on("click", function () {
    $("html").toggleClass("tt-no-scroll");
    $("body").toggleClass("tt-ol-menu-open").addClass("tt-ol-menu-active");
    if ($("body").hasClass("tt-ol-menu-open")) {
      $("body").addClass("olm-toggle-no-click");

      var tl_olMenuIn = gsap.timeline({
        onComplete: function () {
          $("body").removeClass("olm-toggle-no-click");
        },
      });

      tl_olMenuIn.to(".tt-overlay-menu", { duration: 0.4, autoAlpha: 1 });
      tl_olMenuIn.from(".tt-ol-menu-list > li", {
        duration: 0.4,
        y: 80,
        autoAlpha: 0,
        stagger: 0.05,
        ease: Power2.easeOut,
        clearProps: "all",
      });
      if ($(".tt-ol-menu-social").length) {
        tl_olMenuIn.to(
          ".tt-ol-menu-social",
          { duration: 0.4, autoAlpha: 1 },
          "-=0.4"
        );
        tl_olMenuIn.from(
          ".tt-ol-menu-social > li",
          {
            duration: 0.4,
            y: 80,
            autoAlpha: 0,
            stagger: 0.05,
            ease: Power2.easeOut,
            clearProps: "all",
          },
          "-=0.4"
        );
      }
      if ($(".tt-ol-menu-ghost").length) {
        tl_olMenuIn.from(
          ".tt-ol-menu-ghost",
          {
            duration: 0.4,
            y: 80,
            autoAlpha: 0,
            ease: Power2.easeOut,
            clearProps: "all",
          },
          "-=0.4"
        );
      }

      // On menu link click
      $(".tt-overlay-menu a, .tt-logo a")
        .not('[target="_blank"]')
        .not('[href^="#"]')
        .not('[href^="mailto"]')
        .not('[href^="tel"]')
        .on("click", function () {
          gsap.set("#content-wrap, .ttgr-cat-nav", { autoAlpha: 0 });
          var tl_olMenuClick = gsap.timeline();
          tl_olMenuClick.to(".tt-ol-menu-list > li", {
            duration: 0.4,
            y: -80,
            autoAlpha: 0,
            stagger: 0.05,
            ease: Power2.easeIn,
          });
          if ($(".tt-ol-menu-social").length) {
            tl_olMenuClick.to(
              ".tt-ol-menu-social > li",
              {
                duration: 0.4,
                y: -80,
                autoAlpha: 0,
                stagger: 0.05,
                ease: Power2.easeIn,
              },
              "-=0.4"
            );
            tl_olMenuClick.to(
              ".tt-ol-menu-social",
              { duration: 0.4, autoAlpha: 0 },
              "-=0.4"
            );
          }
          if ($(".tt-ol-menu-ghost").length) {
            tl_olMenuClick.to(
              ".tt-ol-menu-ghost",
              { duration: 0.4, y: -40, autoAlpha: 0, ease: Power2.easeIn },
              "-=0.4"
            );
          }
        });

      // Hide sliding sidebar
      if ($(".tt-sliding-sidebar-wrap").length) {
        gsap.to(".tt-sliding-sidebar-trigger", {
          duration: 1,
          autoAlpha: 0,
          ease: Expo.easeOut,
        });
      }

      if ($("body").hasClass("tt-smooth-scroll")) {
        if (!$("#tt-header").hasClass("tt-header-fixed")) {
          $("#scroll-container").before($("#tt-header"));
        }
      }

      if ($(".tt-ol-menu-social").length) {
        function ttOlMenuSocialResize() {
          if (window.matchMedia("(min-width: 768px)").matches) {
            $("#tt-header").before($(".tt-ol-menu-social"));
          } else {
            $(".tt-ol-menu-list").after($(".tt-ol-menu-social"));
          }
        }
        ttOlMenuSocialResize();

        $(window).resize(function () {
          ttOlMenuSocialResize();
        });
      }
    } else {      
      $("body").addClass("olm-toggle-no-click"); 

      var tl_olMenuOut = gsap.timeline({
        onComplete: function () {
          $("body").removeClass("olm-toggle-no-click");
        },
      });
      tl_olMenuOut.to(".tt-ol-menu-list > li", {
        duration: 0.4,
        y: -80,
        autoAlpha: 0,
        stagger: 0.05,
        ease: Power2.easeIn,
      });
      if ($(".tt-ol-menu-social").length) {
        tl_olMenuOut.to(
          ".tt-ol-menu-social > li",
          {
            duration: 0.4,
            y: -80,
            autoAlpha: 0,
            stagger: 0.05,
            ease: Power2.easeIn,
          },
          "-=0.4"
        );
        tl_olMenuOut.to(
          ".tt-ol-menu-social",
          { duration: 0.4, autoAlpha: 0, clearProps: "all" },
          "-=0.4"
        );
      }
      if ($(".tt-ol-menu-ghost").length) {
        tl_olMenuOut.to(
          ".tt-ol-menu-ghost",
          { duration: 0.4, y: -60, autoAlpha: 0, ease: Power2.easeIn },
          "-=0.4"
        );
      }
      tl_olMenuOut.to(
        ".tt-overlay-menu",
        { duration: 0.4, autoAlpha: 0, clearProps: "all" },
        "+=0.2"
      );
      tl_olMenuOut.set(
        ".tt-ol-menu-list > li, .tt-ol-menu-social > li, .tt-ol-menu-ghost",
        { clearProps: "all" }
      ); 

      // Show sliding sidebar
      if ($(".tt-sliding-sidebar-wrap").length) {
        gsap.to(
          ".tt-sliding-sidebar-trigger",
          { duration: 1, autoAlpha: 1, ease: Expo.easeOut, clearProps: "all" },
          "-=0.3"
        );
      }

      // Close open submenus
      setTimeout(function () {
        $(".tt-ol-submenu").slideUp(350);
        $(".tt-ol-submenu-trigger").removeClass("tt-ol-submenu-open");
        $("body").removeClass("tt-ol-menu-active");

        if ($("body").hasClass("tt-smooth-scroll")) {
          if (!$("#tt-header").hasClass("tt-header-fixed")) {
            $("#content-wrap").before($("#tt-header"));
          }
        }

        // Move "tt-ol-menu-social" back to the "tt-overlay-menu"
        if ($(".tt-ol-menu-social").length) {
          $(".tt-ol-menu-list").after($(".tt-ol-menu-social"));
        }
      }, 900);
    }

    return false;
  });

  // Menu list hover
  $(".tt-ol-menu-list")
    .on("mouseenter", function () {
      $(this).addClass("tt-ol-menu-hover");
    })
    .on("mouseleave", function () {
      $(this).removeClass("tt-ol-menu-hover");
    });

  // Open submenu if link href contains #
  $(".tt-ol-submenu-trigger > a").on("click", function () {
    if ($(this).is('[href^="#"]')) {
      var $this = $(this).parent();
      if ($this.hasClass("tt-ol-submenu-open")) {
        $this.removeClass("tt-ol-submenu-open");
        $this.next().slideUp(350);
      } else {
        $this
          .parent()
          .parent()
          .find(".tt-ol-submenu")
          .prev()
          .removeClass("tt-ol-submenu-open");
        $this.parent().parent().find(".tt-ol-submenu").slideUp(350);
        $this.toggleClass("tt-ol-submenu-open");
        $this.next().slideToggle(350);
      }
    }
    return false;
  });

  // Open submenu on caret click
  $(".tt-ol-submenu-caret-wrap").on("click", function () {
    var $this = $(this).parent();
    if ($this.hasClass("tt-ol-submenu-open")) {
      $this.removeClass("tt-ol-submenu-open");
      $this.next().slideUp(350);
    } else {
      $this
        .parent()
        .parent()
        .find(".tt-ol-submenu")
        .prev()
        .removeClass("tt-ol-submenu-open");
      $this.parent().parent().find(".tt-ol-submenu").slideUp(350);
      $this.toggleClass("tt-ol-submenu-open");
      $this.next().slideToggle(350);
    }
  });

  if ($(".tt-portfolio-slider").length) {
    $("body").addClass("tt-portfolio-slider-on");

    $(".tt-portfolio-slider").each(function () {
      var $ttPortfolioSlider = $(this);

      // Data attributes
      var $dataMousewheel = $ttPortfolioSlider.data("mousewheel");
      var $dataKeyboard = $ttPortfolioSlider.data("keyboard");
      var $dataSimulateTouch = $ttPortfolioSlider.data("simulate-touch");
      var $dataGrabCursor = $ttPortfolioSlider.data("grab-cursor");
      var $dataAutoplay = $ttPortfolioSlider.data("autoplay")
        ? { delay: $ttPortfolioSlider.data("autoplay") }
        : $ttPortfolioSlider.data("autoplay");
      var $dataLoop = $ttPortfolioSlider.data("loop")
        ? { loopedSlides: 100 }
        : $ttPortfolioSlider.data("loop"); // Not recommended!

      if ($ttPortfolioSlider.is("[data-speed]")) {
        var $dataSpeed = $ttPortfolioSlider.data("speed");
      } else {
        var $dataSpeed = 900; // by default
      }

      if ($ttPortfolioSlider.is("[data-pagination-type]")) {
        var $dataPaginationType = $ttPortfolioSlider.data("pagination-type");
      } else {
        var $dataPaginationType = "fraction"; // by default (bullets/fraction/progressbar)
      }

      // Init Swiper
      var $ttPortfolioSliderSwiper = new Swiper(
        $ttPortfolioSlider.find(".swiper")[0],
        {
          // Parameters
          direction: "horizontal",
          effect: "slide",
          speed: 600, // slider speed for smaller screens (when window width is 1024px or smaller)
          parallax: true,
          resistanceRatio: 0,
          longSwipesRatio: 0.02,
          preloadImages: false, // Needed for lazy loading
          preventInteractionOnTransition: true, // No actions during transition
          autoplay: $dataAutoplay,
          mousewheel: $dataMousewheel,
          keyboard: $dataKeyboard,
          simulateTouch: $dataSimulateTouch,
          grabCursor: $dataGrabCursor,
          loop: $dataLoop, // Not recommended!

          lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
          },

          breakpoints: {
            // when window width is 1025px or larger
            1025: {
              speed: $dataSpeed,
            },
          },

          // Navigation arrows
          navigation: {
            nextEl: $ttPortfolioSlider.find(".tt-ps-nav-arrow-next")[0],
            prevEl: $ttPortfolioSlider.find(".tt-ps-nav-arrow-prev")[0],
            disabledClass: "tt-ps-nav-arrow-disabled",
          },

          // Pagination
          pagination: {
            el: $ttPortfolioSlider.find(".tt-ps-nav-pagination")[0],
            type: $dataPaginationType,
            modifierClass: "tt-ps-nav-pagination-",
            dynamicBullets: true,
            dynamicMainBullets: 1,
            clickable: true,
          },

          // Events
          on: {
            init: function () {
              var $this = this;
              var $slideActive = $($this.slides[$this.activeIndex]);              

              // Portfolio slider caption on load
              if (
                $ttPortfolioSlider.find(".tt-ps-caption-title").find("a").length
              ) {
                $ttPortfolioSlider
                  .find(".tt-ps-caption-title a")
                  .html($slideActive.attr("data-title"));
                $ttPortfolioSlider
                  .find(".tt-ps-caption-title a")
                  .attr("href", $slideActive.attr("data-url"));
              } else {
                $ttPortfolioSlider
                  .find(".tt-ps-caption-title")
                  .html($slideActive.attr("data-title"));
              }

              // Portfolio slider caption category on load
              $ttPortfolioSlider
                .find(".tt-ps-caption-category")
                .text($slideActive.attr("data-category"));

              // If slider image is light on load
              setTimeout(function () {
                if ($slideActive.hasClass("psi-image-is-light")) {
                  $("body").addClass("tt-light-bg-on psi-light-bg-on");
                } else {
                  $("body").removeClass("tt-light-bg-on psi-light-bg-on");
                }
              }, 400);
            },

            transitionStart: function () {
              var $this = this;
              var $slideActive = $($this.slides[$this.activeIndex]);

              // If slider image is light
              setTimeout(function () {
                if ($slideActive.hasClass("psi-image-is-light")) {
                  $("body").addClass("tt-light-bg-on psi-light-bg-on");
                } else {
                  $("body").removeClass("tt-light-bg-on psi-light-bg-on");
                }
              }, 400);

              // Portfolio slider caption
              if (
                $ttPortfolioSlider.find(".tt-ps-caption-title").find("a").length
              ) {
                $ttPortfolioSlider
                  .find(".tt-ps-caption-title a")
                  .html($slideActive.attr("data-title"));
                $ttPortfolioSlider
                  .find(".tt-ps-caption-title a")
                  .attr("href", $slideActive.attr("data-url"));
              } else {
                $ttPortfolioSlider
                  .find(".tt-ps-caption-title")
                  .html($slideActive.attr("data-title"));
              }

              // Portfolio slider caption category
              $ttPortfolioSlider
                .find(".tt-ps-caption-category")
                .text($slideActive.attr("data-category"));
            },

            slideNextTransitionStart: function () {
              // Animate portfolio slider caption
              gsap.fromTo(
                $ttPortfolioSlider.find(".tt-psc-elem"),
                { autoAlpha: 1, x: 0, scaleX: 1, transformOrigin: "right" },
                {
                  duration: 0.25,
                  autoAlpha: 0,
                  x: -40,
                  scaleX: 1.1,
                  transformOrigin: "right",
                  stagger: 0.15,
                  ease: Power1.easeIn,
                }
              );
            },

            slideNextTransitionEnd: function () {
              // Animate portfolio slider caption
              gsap.fromTo(
                $ttPortfolioSlider.find(".tt-psc-elem"),
                { autoAlpha: 0, x: 40, scaleX: 1.1, transformOrigin: "left" },
                {
                  duration: 0.25,
                  autoAlpha: 1,
                  x: 0,
                  scaleX: 1,
                  transformOrigin: "left",
                  stagger: 0.15,
                  ease: Power1.easeOut,
                  clearProps: "all",
                }
              );
            },

            slidePrevTransitionStart: function () {
              // Animate portfolio slider caption
              gsap.fromTo(
                $ttPortfolioSlider.find(".tt-psc-elem"),
                { autoAlpha: 1, x: 0, scaleX: 1, transformOrigin: "left" },
                {
                  duration: 0.25,
                  autoAlpha: 0,
                  x: 40,
                  scaleX: 1.1,
                  transformOrigin: "left",
                  stagger: 0.15,
                  ease: Power1.easeIn,
                }
              );
            },

            slidePrevTransitionEnd: function () {
              // Animate portfolio slider caption
              gsap.fromTo(
                $ttPortfolioSlider.find(".tt-psc-elem"),
                { autoAlpha: 0, x: -40, scaleX: 1.1, transformOrigin: "right" },
                {
                  duration: 0.25,
                  autoAlpha: 1,
                  x: 0,
                  scaleX: 1,
                  transformOrigin: "right",
                  stagger: 0.15,
                  ease: Power1.easeOut,
                  clearProps: "all",
                }
              );
            },
          },
        }
      );

      // Parallax effect on mouse move (no effect on mobile devices!)
      if (!isMobile) {
        if ($ttPortfolioSlider.data("parallax-mouse-move")) {
          gsap.set($ttPortfolioSlider.find(".tt-psi-image"), { scale: 1.05 });

          $ttPortfolioSlider.mousemove(function (e) {
            parallaxIt(e, $ttPortfolioSlider.find(".tt-psi-image"), -25); // Parallax element
            parallaxIt(e, $ttPortfolioSlider.find(".tt-ps-caption-inner"), -35); // Parallax element
          });

          function parallaxIt(e, target, movement) {
            var $this = $ttPortfolioSlider;
            var relX = e.pageX - $this.offset().left;
            var relY = e.pageY - $this.offset().top;

            gsap.to(target, {
              duration: 1,
              x: ((relX - $this.width() / 2) / $this.width()) * movement,
              y: ((relY - $this.height() / 2) / $this.height()) * movement,
            });
          }
        }
      }
    });
  }

  if ($(".tt-portfolio-carousel").length) {
    $(".tt-portfolio-carousel").each(function () {
      var $ttPortfolioCarousel = $(this);

      // Data attributes     
      var $dataMousewheel = $ttPortfolioCarousel.data("mousewheel");
      var $dataKeyboard = $ttPortfolioCarousel.data("keyboard");
      var $dataSimulateTouch = $ttPortfolioCarousel.data("simulate-touch");
      var $dataGrabCursor = $ttPortfolioCarousel.data("grab-cursor");
      var $dataAutoplay = $ttPortfolioCarousel.data("autoplay")
        ? { delay: $ttPortfolioCarousel.data("autoplay") }
        : $ttPortfolioCarousel.data("autoplay");
      var $dataLoop = $ttPortfolioCarousel.data("loop")
        ? { loopedSlides: 100 }
        : $ttPortfolioCarousel.data("loop"); // Not recommended!

      if ($ttPortfolioCarousel.is("[data-speed]")) {
        var $dataSpeed = $ttPortfolioCarousel.data("speed"); // speed for larger screens
      } else {
        var $dataSpeed = 1200; // speed for larger screens (by default)
      }

      if ($ttPortfolioCarousel.is("[data-pagination-type]")) {
        var $dataPaginationType = $ttPortfolioCarousel.data("pagination-type");
      } else {
        var $dataPaginationType = "fraction"; // by default (bullets/fraction/progressbar)
      }

      // Init Swiper
      var $ttPortfolioCarouselSwiper = new Swiper(
        $ttPortfolioCarousel.find(".swiper")[0],
        {
          // Parameters
          direction: "horizontal",
          slidesPerView: "auto",
          spaceBetween: 0,
          resistanceRatio: 0.85,
          longSwipesRatio: 0.3,
          shortSwipes: true,
          centeredSlides: true,
          preloadImages: false, // Needed for lazy loading
          watchSlidesProgress: true, // Needed for lazy loading (if slidesPerView is "auto" or more than 1)
          preventInteractionOnTransition: false, // No actions during transition
          speed: 900, // Slider speed for smaller screens (when window width is 1024px or smaller)
          keyboard: $dataKeyboard,
          mousewheel: $dataMousewheel,
          autoplay: $dataAutoplay,
          simulateTouch: $dataSimulateTouch,
          grabCursor: $dataGrabCursor,
          loop: $dataLoop, // Not recommended!

          lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
          },

          breakpoints: {
            // When window width is 1025px or larger
            1025: {
              speed: $dataSpeed,
            },
          },

          // Navigation arrows
          navigation: {
            nextEl: $ttPortfolioCarousel.find(".tt-pc-arrow-next")[0],
            prevEl: $ttPortfolioCarousel.find(".tt-pc-arrow-prev")[0],
            disabledClass: "tt-pc-arrow-disabled",
          },

          // Pagination
          pagination: {
            el: $ttPortfolioCarousel.find(".tt-pc-pagination")[0],
            type: $dataPaginationType,
            modifierClass: "tt-pc-pagination-",
            dynamicBullets: true,
            dynamicMainBullets: 1,
            clickable: true,
          },

          // Events
          on: {
            lazyImageReady: (swiper) => {
              // Lazy load + slidesPerView:"auto" fix.
              $ttPortfolioCarouselSwiper.update();
            },

            init: function () {
              var $this = this;
              var $slideActive = $($this.slides[$this.activeIndex]);

              // Active slide class (custom) on load
              $slideActive.addClass("tt-slide-active"); // Add class to active slide.

              // Carousel slide disabled (prev/next slide) on load
              $slideActive.prevAll().addClass("tt-pcs-disabled");
              $slideActive.nextAll().addClass("tt-pcs-disabled");
            },

            transitionStart: function () {
              var $this = this;
              var $slideActive = $($this.slides[$this.activeIndex]);

              // Active slide classes (custom).
              $slideActive.addClass("tt-slide-active"); 
              $slideActive.prev().addClass("tt-slide-active-start");
              $slideActive.next().addClass("tt-slide-active-start");

              // Carousel slide disabled (prev/next slide)
              $slideActive.prevAll().addClass("tt-pcs-disabled");
              $slideActive.removeClass("tt-pcs-disabled");
              $slideActive.nextAll().addClass("tt-pcs-disabled");

              // Disable nav arrow action.
              $(".tt-pc-arrow").addClass("tt-pc-arrow-disabled");
            },

            transitionEnd: function () {
              var $this = this;
              var $slideActive = $($this.slides[$this.activeIndex]);

              // Active slide classes (custom)
              $slideActive.prevAll().removeClass("tt-slide-active");
              $slideActive.nextAll().removeClass("tt-slide-active");
              $slideActive.prev().removeClass("tt-slide-active-start");
              $slideActive.next().removeClass("tt-slide-active-start");

              // Disable nav arrow action.
              $(".tt-pc-arrow").removeClass("tt-pc-arrow-disabled");
            },
          },
        }
      );

      // Scale down animation on carousel click
      if ($ttPortfolioCarousel.attr("data-simulate-touch") == "true") {
        if ($ttPortfolioCarousel.hasClass("pc-scale-down")) {
          $ttPortfolioCarousel
            .find(".swiper")
            .on("mousedown touchstart pointerdown", function (e) {
              if (e.which === 1) {
                // Affects the left mouse button only!
                gsap.to($ttPortfolioCarousel.find(".tt-pci-inner"), {
                  duration: 0.7,
                  scale: 0.9,
                });
              }
            });
          $("body").on("mouseup touchend pointerup mouseleave", function () {
            gsap.to($ttPortfolioCarousel.find(".tt-pci-inner"), {
              duration: 0.7,
              scale: 1,
              clearProps: "scale",
            });
          });
        }
      }

      // Update slider when windows resize or orientation change
      $(window).on("resize orientationchange", function () {
        setTimeout(function () {
          $ttPortfolioCarouselSwiper.update();
          $ttPortfolioCarousel.find(".swiper-wrapper").addClass("swtr-smooth");
        }, $dataSpeed);

        setTimeout(function () {
          $ttPortfolioCarousel
            .find(".swiper-wrapper")
            .removeClass("swtr-smooth");
        }, $dataSpeed + $dataSpeed);
      });
    });
  }

  if ($(".tt-portfolio-hover-carousel").length) {
    $("body").addClass("tt-portfolio-hover-carousel-on");

    $(".tt-portfolio-hover-carousel").each(function () {
      var $ttPortfolioHoverCarousel = $(this);

      // Data attributes
      var $dataSimulateTouch = $ttPortfolioHoverCarousel.data("simulate-touch");
      var $dataGrabCursor = $ttPortfolioHoverCarousel.data("grab-cursor");
      var $dataLoop = $ttPortfolioHoverCarousel.data("loop")
        ? { loopedSlides: 100 }
        : $ttPortfolioHoverCarousel.data("loop");

      // Init Swiper
      var $ttPortfolioHoverCarouselSwiper = new Swiper(
        $ttPortfolioHoverCarousel.find(".swiper")[0],
        {
          // Parameters
          direction: "horizontal",
          slidesPerView: "auto",
          spaceBetween: 0,
          shortSwipes: true,
          speed: 900,
          keyboard: false,
          mousewheel: true,
          watchSlidesProgress: true,
          simulateTouch: $dataSimulateTouch,
          grabCursor: $dataGrabCursor,
          loop: $dataLoop,

          // Events
          on: {
            init: function () {
              // Fix position issue on load.
              setTimeout(function () {
                $ttPortfolioHoverCarouselSwiper.update();
              }, 100);
              // First image
              var $phcFirstImage = $(".phc-image").first();
              $phcFirstImage.addClass("active");
              $phcFirstImage.find("video").each(function () {
                $(this).get(0).play();
              });

              // First slide
              var $phcFirstSlide = $(".tt-portfolio-hover-carousel")
                .find(".swiper-slide")
                .not(".swiper-slide-duplicate")
                .first();
              $phcFirstSlide.addClass("active");

              // If first slide image is light
              if ($phcFirstSlide.hasClass("active")) {
                if ($phcFirstImage.hasClass("phc-image-is-light")) {
                  $("body").addClass("tt-light-bg-on");
                } else {
                  $("body").removeClass("tt-light-bg-on");
                }
              }

              // Mouse hover
              $ttPortfolioHoverCarousel
                .find(".swiper-slide")
                .on("mouseenter touchstart", function () {
                  if (!$(this).hasClass("active")) {
                    $(".phc-image")
                      .find("video")
                      .each(function () {
                        $(this).get(0).pause();
                      });
                    $(this).addClass("active").siblings().removeClass("active");
                    var $phcSlide = $(this).data("slide");
                    var $phcImage = $(
                      '.phc-image[data-slide="' + $phcSlide + '"]'
                    );
                    $ttPortfolioHoverCarousel
                      .find(".phc-image")
                      .removeClass("active");
                    $phcImage.addClass("active");
                    $phcImage.find("video").each(function () {
                      $(this).get(0).play();
                    });

                    // If image is light
                    if (
                      $(this)
                        .parents($ttPortfolioHoverCarousel)
                        .find($phcImage)
                        .hasClass("phc-image-is-light")
                    ) {
                      $("body").addClass("tt-light-bg-on");
                    } else {
                      $("body").removeClass("tt-light-bg-on");
                    }

                    // Slides count
                    var $phcCounter = $(
                      '.tt-phc-count span[data-slide="' + $phcSlide + '"]'
                    );
                    gsap.to(".tt-phc-count span", {
                      duration: 0.1,
                      autoAlpha: 0,
                      ease: Power2.easeIn,
                    });
                    gsap.to($phcCounter, {
                      duration: 0.1,
                      autoAlpha: 1,
                      ease: Power2.easeOut,
                    });
                  }
                });

              // Slides total count
              var $phcTotalCount = $ttPortfolioHoverCarousel
                .find(".swiper-slide")
                .not(".swiper-slide-duplicate").length;
              $(".tt-phc-counter-separator").after(
                '<span class="tt-phc-total">' + $phcTotalCount
              );
            },
          },
        }
      );
    });
  }

  if ($(".tt-blog-carousel").length) {
    $(".tt-blog-carousel").each(function () {
      var $ttBlogCarousel = $(this);

      // Data attributes
      var $dataSimulateTouch = $ttBlogCarousel.data("simulate-touch");
      var $autoplay = $ttBlogCarousel.data("autoplay")
        ? { delay: $ttBlogCarousel.data("autoplay") }
        : $ttBlogCarousel.data("autoplay");
      var $dataLoop = $ttBlogCarousel.data("loop")
        ? { loopedSlides: 3 }
        : $ttBlogCarousel.data("loop");

      if ($ttBlogCarousel.is("[data-speed]")) {
        var $dataSpeed = $ttBlogCarousel.data("speed");
      } else {
        var $dataSpeed = 900; // by default
      }

      if ($ttBlogCarousel.is("[data-pagination-type]")) {
        var $dataPaginationType = $ttBlogCarousel.data("pagination-type");
      } else {
        var $dataPaginationType = "bullets";
      }

      // Init Swiper      
      var $ttBlogCarouselSwiper = new Swiper(
        $ttBlogCarousel.find(".swiper")[0],
        {
          // Parameters
          direction: "horizontal",
          slidesPerView: 1,
          spaceBetween: 30,
          longSwipesRatio: 0.3,
          mousewheel: false,
          keyboard: false,
          preloadImages: false,
          watchSlidesProgress: true,
          preventInteractionOnTransition: false,
          grabCursor: true,
          simulateTouch: $dataSimulateTouch,
          speed: $dataSpeed,
          autoplay: $autoplay,
          loop: $dataLoop,

          lazy: {
            loadPrevNext: false,
            loadOnTransitionStart: true,
          },

          breakpoints: {            
            1025: {
              slidesPerView: 3,
              spaceBetween: 0,
            },
            // when window width is 769px or larger
            769: {
              slidesPerView: 2,
              spaceBetween: 0,
            },
          },
          // Navigation (arrows)
          navigation: {
            nextEl: $ttBlogCarousel.find(".tt-blc-nav-next")[0],
            prevEl: $ttBlogCarousel.find(".tt-blc-nav-prev")[0],
            disabledClass: "tt-blc-nav-arrow-disabled",
          },
          // Pagination
          pagination: {
            el: $ttBlogCarousel.find(".tt-blc-pagination")[0],
            type: $dataPaginationType,
            modifierClass: "tt-blc-pagination-",
            dynamicBullets: true,
            dynamicMainBullets: 1,
            clickable: true,
          },

          // Events
          on: {
            lazyImageReady: (swiper) => {
              // Lazy load + slidesPerView:"auto" fix.
              $ttBlogCarouselSwiper.update();
            },
          },
        }
      );
    });
  }

  if ($(".tt-content-carousel").length) {
    $(".tt-content-carousel").each(function () {
      var $ttContentCarousel = $(this);

      // Data attributes
      var $dataSimulateTouch = $ttContentCarousel.data("simulate-touch");
      var $autoplay = $ttContentCarousel.data("autoplay")
        ? { delay: $ttContentCarousel.data("autoplay") }
        : $ttContentCarousel.data("autoplay");
      var $dataLoop = $ttContentCarousel.data("loop")
        ? { loopedSlides: 100 }
        : $ttContentCarousel.data("loop");

      if ($ttContentCarousel.is("[data-speed]")) {
        var $dataSpeed = $ttContentCarousel.data("speed");
      } else {
        var $dataSpeed = 900; // by default
      }

      if ($ttContentCarousel.is("[data-pagination-type]")) {
        var $dataPaginationType = $ttContentCarousel.data("pagination-type");
      } else {
        var $dataPaginationType = "bullets";
      }

      // Init Swiper
      var $ttContentCarouselSwiper = new Swiper(
        $ttContentCarousel.find(".swiper")[0],
        {
          // Parameters
          direction: "horizontal",
          slidesPerView: "auto",
          spaceBetween: 0,
          centeredSlides: true,
          longSwipesRatio: 0.3,
          mousewheel: false,
          keyboard: false,
          preloadImages: false, 
          watchSlidesProgress: true, 
          preventInteractionOnTransition: false,
          simulateTouch: $dataSimulateTouch,
          grabCursor: $dataSimulateTouch,
          speed: $dataSpeed,
          autoplay: $autoplay,
          loop: $dataLoop,
          lazy: true,

          // Navigation (arrows)
          navigation: {
            nextEl: $ttContentCarousel.find(".tt-cc-nav-next")[0],
            prevEl: $ttContentCarousel.find(".tt-cc-nav-prev")[0],
            disabledClass: "tt-cc-nav-arrow-disabled",
          },

          // Pagination
          pagination: {
            el: $ttContentCarousel.find(".tt-cc-pagination")[0],
            type: $dataPaginationType,
            modifierClass: "tt-cc-pagination-",
            dynamicBullets: true,
            dynamicMainBullets: 1,
            clickable: true,
          },

          // Events
          on: {
            lazyImageReady: (swiper) => {              
              $ttContentCarouselSwiper.update();
            },

            transitionStart: function () {
              // Play video
              $(".swiper-slide-active")
                .find("video")
                .each(function () {
                  $(this).get(0).play();
                });
            },            
          },
        }
      );

      // Scale down animation on carousel click
      if ($ttContentCarousel.attr("data-simulate-touch") == "true") {
        if ($ttContentCarousel.hasClass("cc-scale-down")) {
          $ttContentCarousel
            .find(".swiper-wrapper")
            .on("mousedown touchstart pointerdown", function (e) {
              if (e.which === 1) {
                // Affects the left mouse button only!
                gsap.to($ttContentCarousel.find(".tt-content-carousel-item"), {
                  duration: 0.7,
                  scale: 0.9,
                });
              }
            });
          $("body").on("mouseup touchend pointerup mouseleave", function () {
            gsap.to($ttContentCarousel.find(".tt-content-carousel-item"), {
              duration: 0.7,
              scale: 1,
              clearProps: "scale",
            });
          });
        }
      }
    });
  }

  if ($(".tt-testimonials-slider").length) {
    $(".tt-testimonials-slider").each(function () {
      var $ttTestimonialsSlider = $(this);

      // Data attributes
      var $dataSimulateTouch = $ttTestimonialsSlider.data("simulate-touch");
      var $autoplay = $ttTestimonialsSlider.data("autoplay")
        ? { delay: $ttTestimonialsSlider.data("autoplay") }
        : $ttTestimonialsSlider.data("autoplay");
      var $dataLoop = $ttTestimonialsSlider.data("loop")
        ? { loopedSlides: 100 }
        : $ttTestimonialsSlider.data("loop");

      if ($ttTestimonialsSlider.is("[data-speed]")) {
        var $dataSpeed = $ttTestimonialsSlider.data("speed");
      } else {
        var $dataSpeed = 900; // by default
      }

      // Init Swiper
      var $ttTestimonialsSliderSwiper = new Swiper(
        $ttTestimonialsSlider.find(".swiper")[0],
        {
          // Parameters
          direction: "horizontal",
          slidesPerView: "auto",
          spaceBetween: 0,
          mousewheel: false,
          longSwipesRatio: 0.3,
          grabCursor: true,
          autoHeight: true,
          centeredSlides: true,
          preventInteractionOnTransition: false, // No actions during transition
          speed: $dataSpeed,
          simulateTouch: $dataSimulateTouch,
          autoplay: $autoplay,
          loop: $dataLoop,

          // Navigation (arrows)
          navigation: {
            nextEl: $ttTestimonialsSlider.find(".tt-ts-nav-next")[0],
            prevEl: $ttTestimonialsSlider.find(".tt-ts-nav-prev")[0],
            disabledClass: "tt-ts-nav-arrow-disabled",
          },

          // Pagination
          pagination: {
            el: $ttTestimonialsSlider.find(".tt-ts-pagination")[0],
            type: "bullets",
            modifierClass: "tt-ts-pagination-",
            dynamicBullets: true,
            dynamicMainBullets: 1,
            clickable: true,
          },
        }
      );

      // Auto height fix
      setTimeout(function () {
        $ttTestimonialsSliderSwiper.updateAutoHeight();
      }, 100);

      // Scale down animation on slider click
      if ($ttTestimonialsSlider.hasClass("ts-scale-down")) {
        $ttTestimonialsSlider
          .find(".swiper-wrapper")
          .on("mousedown touchstart pointerdown", function (e) {
            if (e.which === 1) {
              // Affects the left mouse button only!
              gsap.to($ttTestimonialsSlider.find(".tt-ts-item-inner"), {
                duration: 0.7,
                scale: 0.9,
              });
            }
          });
        $("body").on("mouseup touchend pointerup", function () {
          gsap.to($ttTestimonialsSlider.find(".tt-ts-item-inner"), {
            duration: 0.7,
            scale: 1,
            clearProps: "scale",
          });
        });
      }
    });
  }

  // init Isotope
  var $container = $(".isotope-items-wrap");
  $container.imagesLoaded(function () {
    $container.isotope({
      itemSelector: ".isotope-item",
      layoutMode: "packery",
      transitionDuration: "0.7s",
      percentPosition: true,
    });

    setTimeout(function () {
      $container.isotope("layout"); // Refresh Isotope
      ScrollTrigger.refresh(true); // Refresh ScrollTrigger
    }, 500);
  });

  // Filter
  $(".ttgr-cat-list > li > a, .ttgr-cat-classic-list > li > a").on(
    "click",
    function () {
      var selector = $(this).attr("data-filter");
      $container.isotope({
        filter: selector,
      });

      // Refresh ScrollTrigger
      setTimeout(function () {
        ScrollTrigger.refresh(true);
      }, 500);

      return false;
    }
  );

  // Filter item active
  var filterItemActive = $(
    ".ttgr-cat-list > li > a, .ttgr-cat-classic-list > li > a"
  );
  filterItemActive.on("click", function () {
    var $this = $(this);
    if (!$this.hasClass("active")) {
      filterItemActive.removeClass("active");
      $this.addClass("active");
    }
  });

  $(".lightgallery").lightGallery({

    // lightGallery core
    selector: ".lg-trigger",
    mode: "lg-fade", // Type of transition between images ('lg-fade' or 'lg-slide').
    height: "100%", // Height of the gallery (ex: '100%' or '300px').
    width: "100%", // Width of the gallery (ex: '100%' or '300px').
    iframeMaxWidth: "100%", // Set maximum width for iframe.
    loop: true, // If false, will disable the ability to loop back to the beginning of the gallery when on the last element.
    speed: 600, // Transition duration (in ms).
    closable: true, // Allows clicks on dimmer to close gallery.
    escKey: true, // Whether the LightGallery could be closed by pressing the "Esc" key.
    keyPress: true, // Enable keyboard navigation.
    hideBarsDelay: 3000, // Delay for hiding gallery controls (in ms).
    controls: true, // If false, prev/next buttons will not be displayed.
    mousewheel: true, // Chane slide on mousewheel.
    download: false, // Enable download button. By default download url will be taken from data-src/href attribute but it supports only for modern browsers. If you want you can provide another url for download via data-download-url.
    counter: true, // Whether to show total number of images and index number of currently displayed image.
    swipeThreshold: 50, // By setting the swipeThreshold (in px) you can set how far the user must swipe for the next/prev image.
    enableDrag: true, // Enables desktop mouse drag support.
    enableTouch: true, // Enables touch support.
    getCaptionFromTitleOrAlt: false, // Option to get captions from alt or title tags.

    // Thumbnail plugin
    thumbnail: false, // Enable thumbnails for the gallery.
    showThumbByDefault: false, // Show/hide thumbnails by default.
    thumbMargin: 5, // Spacing between each thumbnails.
    toogleThumb: true, // Whether to display thumbnail toggle button.
    enableThumbSwipe: true, // Enables thumbnail touch/swipe support for touch devices.
    exThumbImage: "data-exthumbnail", // If you want to use external image for thumbnail, add the path of that image inside "data-" attribute and set value of this option to the name of your custom attribute.

    // Autoplay plugin
    autoplay: false, // Enable gallery autoplay.
    autoplayControls: true, // Show/hide autoplay controls.
    pause: 6000, // The time (in ms) between each auto transition.
    progressBar: true, // Enable autoplay progress bar.
    fourceAutoplay: false, // If false autoplay will be stopped after first user action

    // Full Screen plugin
    fullScreen: true, // Enable/Disable fullscreen mode.

    // Zoom plugin
    zoom: false, // Enable/Disable zoom option.
    scale: 0.5, // Value of zoom should be incremented/decremented.
    enableZoomAfter: 50, // Some css styles will be added to the images if zoom is enabled. So it might conflict if you add some custom styles to the images such as the initial transition while opening the gallery. So you can delay adding zoom related styles to the images by changing the value of enableZoomAfter.    

    // Hash plugin (unique url for each slides)
    hash: false, // Enable/Disable hash plugin.
    hgalleryId: 1, // Unique id for each gallery. It is mandatory when you use hash plugin for multiple galleries on the same page.

    // Rotate plugin
    rotate: false,
  });

  // If page header exist
  if ($("#page-header").length) {
    $("body").addClass("page-header-on");

    // If full height enabled
    if ($("#page-header").hasClass("ph-full")) {
      $("body").addClass("ph-full-on");
    }

    // If position center enabled
    if ($("#page-header").hasClass("ph-center")) {
      $("body").addClass("ph-center-on");
    }

    // If page header image exist
    if ($(".ph-image").length) {
      $("body").addClass("ph-image-on");

      // If page header image is background image
      if ($("#page-header").hasClass("ph-bg-image")) {
        $("body").addClass("ph-bg-image-on");
      }
    }
  }

  // If page header background image is light
  if ($("#page-header").is(".ph-bg-image.ph-bg-image-is-light")) {
    $(".ph-bg-image-is-light")
      .on("mouseenter mouseover", function () {
        $("body").addClass("tt-light-bg-hover");
      })
      .on("mouseleave", function () {
        $("body").removeClass("tt-light-bg-hover");
      });
  }

  if ($(".tt-np-image").length) {
    $("body").addClass("tt-np-image-on");
  }

  // Page header elements scrolling effects
  if ($("#page-header").hasClass("ph-content-parallax")) {
    let tlPhParallax = gsap.timeline({
      scrollTrigger: {
        trigger: "#page-header",
        start: "top top",
        end: "bottom top",
        scrub: true,
        markers: false,
      },
    });

    // Page header caption elements
    if ($("#page-header").hasClass("ph-bg-image")) {
      if ($(".ph-caption").length) {
        if ($("#page-header").hasClass("ph-center")) {
          tlPhParallax.to(
            ".ph-caption",
            { y: 180, opacity: 0, scale: 0.95, transformOrigin: "center" },
            0
          );
        } else {
          tlPhParallax.to(
            ".ph-caption",
            { y: 180, opacity: 0, scale: 0.95, transformOrigin: "left" },
            0
          );
        }
      }
      if ($(".ph-image").length) {
        tlPhParallax.to(".ph-image-inner", { yPercent: 30 }, 0);
      }
    } else {
      if ($(".ph-categories").length) {
        tlPhParallax.to(".ph-categories", { y: -220 }, 0);
      }
      if ($(".ph-caption-subtitle").length) {
        tlPhParallax.to(".ph-caption-subtitle", { y: -230 }, 0);
      }
      if ($(".ph-caption-title").length) {
        tlPhParallax.to(".ph-caption-title", { y: -180 }, 0);
      }
      if ($(".ph-caption-description").length) {
        tlPhParallax.to(".ph-caption-description", { y: -120 }, 0);
      }
      if ($(".ph-meta").length) {
        tlPhParallax.to(".ph-meta", { y: -220 }, 0);
      }
      if ($(".ph-image").length) {
        tlPhParallax.to(".ph-image-inner", { y: -100 }, 0);
      }

      // Page header ghost
      var $phGhost = $(".ph-caption-title-ghost");
      if ($phGhost.length) {
        if (!$("#page-header").hasClass("ph-center")) {
          $phGhost.appendTo("#page-header");
          if ($("#page-header").hasClass("ph-ghost-scroll")) {
            $phGhost
              .find(".ph-appear")
              .wrapInner('<span class="phgh-text"></span>');
            var $phghText = $phGhost.find(".phgh-text");
            for (var i = 0; i < 3; i++) {
              $phghText.clone().insertAfter($phghText);
            }
            tlPhParallax.to($phGhost, { y: -60, xPercent: -8 }, 0);
          } else {
            tlPhParallax.to($phGhost, { y: -30 }, 0);
          }
        } else {
          tlPhParallax.to($phGhost, { y: -60 }, 0);
        }
      }
    }

    // Page header scroll down circle
    if ($(".tt-scroll-down").length) {
      gsap.to(".tt-scroll-down", {
        // y: 100,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#page-header",
          start: "top top",
          end: "30% top",
          scrub: true,
          markers: false,
        },
      });
    }

    // Page header projekt share
    if ($(".ph-share").length) {
      gsap.to(".ph-share-inner", {
        // y: 100,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#page-header",
          start: "top top",
          end: "30% top",
          scrub: true,
          markers: false,
        },
      });
    }
  }

  // If page header is visible
  if ($("#page-header").length) {
    ScrollTrigger.create({
      trigger: "#page-header",
      start: "top bottom",
      end: "bottom 60px",
      scrub: true,
      markers: false,

      onLeave: () => phVisibleLeaveClass(),
      onEnter: () => phVisibleEnterClass(),
      onLeaveBack: () => phVisibleLeaveClass(),
      onEnterBack: () => phVisibleEnterClass(),
    });

    function phVisibleLeaveClass() {
      $("body").removeClass("tt-ph-visible");
    }
    function phVisibleEnterClass() {
      $("body").addClass("tt-ph-visible");
    }
  }

  // If page header background image is light
  if ($("#page-header").is(".ph-bg-image.ph-bg-image-is-light")) {
    ScrollTrigger.create({
      trigger: "#page-header",
      start: "top bottom",
      end: "bottom 30px",
      scrub: true,
      markers: false,

      onLeave: () => phLightLeaveClass(),
      onEnter: () => phLightEnterClass(),
      onLeaveBack: () => phLightLeaveClass(),
      onEnterBack: () => phLightEnterClass(),
    });

    function phLightLeaveClass() {
      $("body").removeClass("tt-light-bg-on");
    }
    function phLightEnterClass() {
      $("body").addClass("tt-light-bg-on");
    }
  }

  // Portfolio grid categories filter show/hide on scroll
  if ($(".tt-grid-categories").length) {
    var $ttgCatTriggerWrap = $(".ttgr-cat-trigger-wrap");

    if ($ttgCatTriggerWrap.hasClass("ttgr-cat-fixed")) {
      $ttgCatTriggerWrap.appendTo("#body-inner");
      $("body").addClass("ttgr-cat-fixed-on");

      // Show/Hide trigger on page scroll
      ScrollTrigger.create({
        trigger: "#portfolio-grid",
        start: "top bottom",
        end: "bottom 75%",
        scrub: true,
        markers: false,

        onEnter: () => ttgCatShow(),
        onLeave: () => ttgCatHide(),
        onEnterBack: () => ttgCatShow(),
        onLeaveBack: () => ttgCatHide(),
      });

      function ttgCatShow() {
        gsap.to($ttgCatTriggerWrap, {
          duration: 0.4,
          autoAlpha: 1,
          scale: 1,
          ease: Power2.easeOut,
        });
      }
      function ttgCatHide() {
        gsap.to($ttgCatTriggerWrap, {
          duration: 0.4,
          autoAlpha: 0,
          scale: 0.9,
          ease: Power2.easeOut,
        });
      }
    } else {
      // Hide trigger before it reaches the top when page scroll
      gsap.to($ttgCatTriggerWrap, {
        yPercent: 70,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: $ttgCatTriggerWrap,
          start: "top 250px",
          end: "100px 250px",
          scrub: true,
          markers: false,
        },
      });
    }
  }

  // Portfolio list item elements scrolling effects
  $(".pli-caption").each(function () {
    var $pliTitle = $(this).find(".pli-title");
    var $pliCategory = $(this).find(".pli-categories-wrap");
    var $pliCounter = $(this)
      .parents(".portfolio-list-item")
      .find(".pli-counter");

    let tl_plIInfo = gsap.timeline({
      scrollTrigger: {
        trigger: this,
        start: "top bottom",
        markers: false,
      },
    });

    ScrollTrigger.matchMedia({
      "(min-width: 768px)": function () {
        if ($($pliTitle).length) {
          tl_plIInfo.fromTo(
            $pliTitle,
            { autoAlpha: 0, x: 60, scaleX: 1.3, transformOrigin: "left" },
            {
              duration: 2,
              autoAlpha: 1,
              x: 0,
              scaleX: 1,
              transformOrigin: "left",
              ease: Expo.easeOut,
              clearProps: "all",
            },
            "+=0.3"
          );
        }
        if ($($pliCategory).length) {
          tl_plIInfo.fromTo(
            $pliCategory,
            { autoAlpha: 0, x: 60, scaleX: 1.3, transformOrigin: "left" },
            {
              duration: 2,
              autoAlpha: 1,
              x: 0,
              scaleX: 1,
              transformOrigin: "left",
              ease: Expo.easeOut,
              clearProps: "all",
            },
            "-=1.7"
          );
        }
        if ($($pliCounter).length) {
          tl_plIInfo.fromTo(
            $pliCounter,
            { autoAlpha: 0, x: 60, scaleX: 1.3, transformOrigin: "left" },
            {
              duration: 2,
              autoAlpha: 1,
              x: 0,
              scaleX: 1,
              transformOrigin: "left",
              ease: Expo.easeOut,
              clearProps: "all",
            },
            "-=1.8"
          );
        }
      },

      "(max-width: 767px)": function () {
        if ($($pliTitle).length) {
          tl_plIInfo.from(
            $pliTitle,
            {
              duration: 2,
              autoAlpha: 0,
              y: 40,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            "+=0.5"
          );
        }
        if ($($pliCategory).length) {
          tl_plIInfo.from(
            $pliCategory,
            {
              duration: 2,
              autoAlpha: 0,
              y: 20,
              ease: Expo.easeOut,
              clearProps: "all",
            },
            "-=1.7"
          );
        }
      },
    });
  });

  $(".anim-image-parallax").each(function () {
    // Add wrap <div>.
    $(this).wrap(
      '<div class="anim-image-parallax-wrap"><div class="anim-image-parallax-inner"></div></div>'
    );

    // Add overflow hidden.
    $(".anim-image-parallax-wrap").css({ overflow: "hidden" });

    var $animImageParallax = $(this);
    var $aipWrap = $animImageParallax.parents(".anim-image-parallax-wrap");
    var $aipInner = $aipWrap.find(".anim-image-parallax-inner");

    let tl_ImageParallax = gsap.timeline({
      scrollTrigger: {
        trigger: $aipWrap,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        markers: false,
        onEnter: () => animImgParallaxRefresh(),
      },
    });
    tl_ImageParallax.to($animImageParallax, { yPercent: 30, ease: "none" });

    function animImgParallaxRefresh() {
      tl_ImageParallax.scrollTrigger.refresh();
    }

    // Zoom in
    let tl_aipZoomIn = gsap.timeline({
      scrollTrigger: {
        trigger: $aipWrap,
        start: "top 90%",
        markers: false,
      },
    });
    tl_aipZoomIn.from($aipInner, {
      duration: 1.5,
      autoAlpha: 0,
      scale: 1.2,
      ease: Power2.easeOut,
      clearProps: "all",
    });
  });

  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
      $(
        ".tt-grid.ttgr-layout-creative-1 .tt-grid-item:nth-of-type(6n+2) .ttgr-item-inner, .tt-grid.ttgr-layout-creative-1 .tt-grid-item:nth-of-type(6n+4) .ttgr-item-inner, .tt-grid.ttgr-layout-creative-2 .tt-grid-item:nth-of-type(4n+2) .ttgr-item-inner, .tt-grid.ttgr-layout-creative-2 .tt-grid-item:not(:last-child):nth-of-type(4n+3) .ttgr-item-inner"
      ).each(function () {
        var $this = $(this);

        gsap.to($this, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: $this,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            markers: false,
            onEnter: () => ttgrItemParalRefresh(),
          },
        });

        // Refresh start/end positions on enter.
        function ttgrItemParalRefresh() {
          ScrollTrigger.refresh(true);
        }
      });
    },
  });

  // Next project parallax
  if ($(".tt-np-image").length) {
    gsap.from(".tt-np-image", {
      yPercent: -30,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".tt-next-project",
        start: "5% bottom",
        end: "bottom bottom",
        scrub: true,
        markers: false,
      },
    });

    if ($(".tt-np-caption").length) {
      gsap.from(".tt-np-caption", {
        yPercent: -70,
        opacity: 0,
        scale: 0.96,
        transformOrigin: "left",
        ease: "none",
        scrollTrigger: {
          trigger: $(".tt-next-project"),
          start: "15% bottom",
          end: "bottom bottom",
          scrub: true,
          markers: false,
        },
      });
    }
  } else {
    if ($(".tt-np-caption").length) {
      gsap.from(".tt-np-caption", {
        yPercent: -10,
        opacity: 0,
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: $(".tt-next-project"),
          start: "40% bottom",
          end: "bottom bottom",
          scrub: true,
          markers: false,
        },
      });
    }
  }

  // If next project is touches the top of the page
  if ($(".tt-next-project").length) {
    ScrollTrigger.create({
      trigger: ".tt-next-project",
      start: "top 90px",
      end: "bottom top",
      scrub: true,
      markers: false,

      onLeave: () => ttNpTopLeaveClass(),
      onEnter: () => ttNpTopEnterClass(),
      onLeaveBack: () => ttNpTopLeaveClass(),
      onEnterBack: () => ttNpTopEnterClass(),
    });

    function ttNpTopLeaveClass() {
      $("body").removeClass("tt-next-project-top");
    }
    function ttNpTopEnterClass() {
      $("body").addClass("tt-next-project-top");
    }
  }

  // If next project background image is light
  if ($(".tt-next-project").hasClass("tt-np-image-is-light")) {
    ScrollTrigger.create({
      trigger: ".tt-next-project",
      start: "top 90px",
      end: "bottom top",
      scrub: true,
      markers: false,

      onLeave: () => ttNpLightLeaveClass(),
      onEnter: () => ttNpLightEnterClass(),
      onLeaveBack: () => ttNpLightLeaveClass(),
      onEnterBack: () => ttNpLightEnterClass(),
    });

    function ttNpLightLeaveClass() {
      $("body").removeClass("tt-light-bg-on");
    }
    function ttNpLightEnterClass() {
      $("body").addClass("tt-light-bg-on");
    }

    // Hover
    $(".tt-next-project")
      .on("mouseenter mouseover", function () {
        $("body").addClass("tt-light-bg-hover");
      })
      .on("mouseleave", function () {
        $("body").removeClass("tt-light-bg-hover");
      });
  }

  if (!isMobile) {
    // Not for mobile devices!

    var skewElement = $(".skew-on-scroll"); // Skew element class.
    var skewMaxAngle = 7; // Max angle.
    var skewVelocity = 500; // Velocity.
    var skewDuration = 0.5; // Duration.

    var proxy = { skew: 0 },
      skewSetter = gsap.quickSetter(skewElement, "skewY", "deg"),
      clamp = gsap.utils.clamp(-skewMaxAngle, skewMaxAngle);

    if (skewElement.length) {
      function skewer() {
        ScrollTrigger.create({
          onUpdate: (self) => {
            var skew = clamp(self.getVelocity() / -skewVelocity);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: skewDuration,
                ease: "power1.easeInOut",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });
      }

      function skewerIfSmoothScroll() {
        var bodyScrollBar = Scrollbar.init(
          document.getElementById("scroll-container")
        );

        ScrollTrigger.scrollerProxy("#scroll-container", {
          scrollTop(value) {
            if (arguments.length) {
              bodyScrollBar.scrollTop = value;
            }
            return bodyScrollBar.scrollTop;
          },
        });

        ScrollTrigger.create({
          scroller: "#scroll-container",
          onUpdate: (self) => {
            var skew = clamp(self.getVelocity() / -skewVelocity);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: skewDuration,
                ease: "power1.easeInOut",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });
      }

      if ($("body").hasClass("tt-smooth-scroll")) {
        if (isMobile) {
          skewer();
        } else {
          skewerIfSmoothScroll();
        }
      } else {
        skewer();
      }

      gsap.set(skewElement, {
        transformOrigin: "center center",
        force3D: true,
      }); // Change transform origin if needed.
    }
  }

  // Scrolling button
  if ($(".tt-scrolling-btn").length) {
    $(".tt-scrolling-btn").each(function () {
      var $this = $(this);
      var $scrBtnSvg = $this.find(".scr-btn-spinner");
      gsap.from($scrBtnSvg, {
        rotate: 240,
        ease: "none",
        scrollTrigger: {
          trigger: $scrBtnSvg,
          start: "-40% bottom",
          end: "120% top",
          scrub: true,
          markers: false,
        },
      });
    });
  }

  // zoom in
  $(".anim-zoomin").each(function () {
    // Add wrap <div>.
    $(this).wrap('<div class="anim-zoomin-wrap"></div>');

    // Add overflow hidden.
    $(".anim-zoomin-wrap").css({ overflow: "hidden" });

    var $this = $(this);
    var $asiWrap = $this.parents(".anim-zoomin-wrap");

    let tl_ZoomIn = gsap.timeline({
      scrollTrigger: {
        trigger: $asiWrap,
        start: "top bottom",
        markers: false,
        onEnter: () => animZoomInRefresh(),
      },
    });
    tl_ZoomIn.from($this, {
      duration: 1.5,
      autoAlpha: 0,
      scale: 1.2,
      ease: Power2.easeOut,
      clearProps: "all",
    });

    // Refresh start/end positions on enter.
    function animZoomInRefresh() {
      ScrollTrigger.refresh();
    }
  });

  // fade in-up
  $(".anim-fadeinup").each(function () {
    let tl_FadeInUp = gsap.timeline({
      scrollTrigger: {
        trigger: this,
        start: "top bottom",
        markers: false,
      },
    });

    tl_FadeInUp.from(
      this,
      {
        duration: 2.5,
        autoAlpha: 0,
        y: 100,
        ease: Expo.easeOut,
        clearProps: "all",
      },
      "+=0.3"
    );
  });

  // skew in-up
  $(".anim-skewinup").each(function () {
    let tl_SkewInUp = gsap.timeline({
      scrollTrigger: {
        trigger: this,
        start: "top bottom",
        markers: false,
      },
    });

    tl_SkewInUp.from(
      this,
      {
        duration: 2,
        skewY: 5,
        transformOrigin: "left top",
        autoAlpha: 0,
        y: 100,
        ease: Expo.easeOut,
        clearProps: "all",
      },
      "+=0.3"
    );
  });

  // Item hover
  $(".ptl-item").each(function () {
    let $ptliImage = $(this).find(".ptli-image");
    $(this).on("mouseenter", function () {
      let tl_ptliWave = gsap.timeline({
        defaults: { duration: 0.2, stagger: 0.1 },
      });
      tl_ptliWave.to($ptliImage, { y: -10 });
      tl_ptliWave.to($ptliImage, { y: 0, clearProps: "all" }, 0.2);
    });
  });

  $(".portfolio-interactive-images, .portfolio-interactive-ghost").appendTo(
    "#body-inner"
  );

  if ($(".portfolio-interactive").hasClass("pi-inline")) {
    $("body").addClass("pi-inline-on");
  }

  if ($(".portfolio-interactive").hasClass("pi-center")) {
    $("body").addClass("pi-center-on");
  }

  if ($(".portfolio-interactive").hasClass("pi-full")) {
    $("body").addClass("pi-full-on");

    // Move "tt-footer" out of "scroll-container"
    if ($("body").hasClass("tt-smooth-scroll")) {
      function moveFooter() {
        if (window.matchMedia("(min-width: 1025px)").matches) {
          $("#tt-footer").appendTo("#body-inner");
        } else {
          $("#tt-footer").appendTo("#content-wrap");
        }
      }
      moveFooter();

      $(window).resize(function () {
        moveFooter();
      });
    }
  }

  // Item link hover
  $(".portfolio-interactive-item").each(function () {
    var $piItem = $(this);
    $piItem
      .find(".pi-item-title-link")
      .on("mouseenter", function () {
        // hover title
        $(this).parents(".portfolio-interactive").addClass("hovered");
        $(this).parent().addClass("pi-item-hover");

      })
      .on("mouseleave", function () {
        // hover title
        $(this).parents(".portfolio-interactive").removeClass("hovered");
        $(this).parent().removeClass("pi-item-hover");
      });
  });

  // If item image is light
  $(".pi-item-image").each(function () {
    if ($(this).hasClass("pi-item-image-is-light")) {
      $(this)
        .parents(".portfolio-interactive-item")
        .addClass("pi-item-light-image-on");
    }
  });

  if ($(".portfolio-split").length) {
    $("body").addClass("portfolio-split-on");

    if ($("body").hasClass("tt-smooth-scroll")) {
      $(".portfolio-split-images, .pspl-ghost").appendTo("#body-inner");

      // Move "tt-footer" out of "scroll-container".
      function moveFooter() {
        if (window.matchMedia("(min-width: 1025px)").matches) {
          $("#tt-footer").appendTo("#body-inner");
        } else {
          $("#tt-footer").appendTo("#content-wrap");
        }
      }
      moveFooter();

      $(window).resize(function () {
        moveFooter();
      });
    }

    // List item link hover
    $(".portfolio-split-item").each(function () {
      var $psplItem = $(this);
      $psplItem
        .find(".pspl-item-title-link")
        .on("mouseenter", function () {
          $(this).parents(".portfolio-split").addClass("hovered");
          if (
            !$(this)
              .parents(".portfolio-split-item")
              .hasClass("pspl-item-hover")
          ) {
            var indexElem = $(this).parents(".portfolio-split-item").index();
            $(this)
              .parents(".portfolio-split-item")
              .addClass("pspl-item-hover")
              .siblings()
              .removeClass("pspl-item-hover");
            $(".portfolio-split-images")
              .find(".pspl-image")
              .removeClass("active")
              .eq(indexElem)
              .addClass("active");
          }

          psplImage();
        })
        .on("mouseleave", function () {
          $(this).parents(".portfolio-split").removeClass("hovered");
        });
    });

    // If image is light and active
    function psplImage() {
      function psplImageLightActive() {
        if ($(".pspl-image.pspl-image-is-light").hasClass("active")) {
          $("body").addClass("pspl-light-image-on");
        } else {
          $("body").removeClass("pspl-light-image-on");
        }
      }
      psplImageLightActive();

      $(window).resize(function () {
        psplImageLightActive();
      });
      $(window).on("orientationchange", function () {
        psplImageLightActive();
      });
    }
    psplImage();

    // Reversed layout
    if ($(".portfolio-split").hasClass("pspl-reverse")) {
      $("body").addClass("pspl-reverse-on");
    }
  }

  // Item image zoom on hover
  $(".portfolio-list-item").each(function () {
    if ($(".portfolio-list").hasClass("pli-hover")) {
      $(this)
        .find(".pli-image img")
        .wrap('<div class="pli-image-hover-zoom"></div>');
    }
  });

  // If "pgi-cap-inside enabled
  if ($("#portfolio-grid").hasClass("pgi-cap-inside")) {
    // Move "pgi-caption" to inside "pgi-image-wrap".
    $(".portfolio-grid-item").each(function () {
      $(this).find(".pgi-caption").appendTo($(this).find(".pgi-image-wrap"));
    });

    // Remove grid item title anchor tag if exist.
    if ($(".pgi-title a").length) {
      $(".pgi-title a").contents().unwrap();
    }
  }
  
  // Portfolio grid categories filter
  $(".ttgr-cat-nav").appendTo("#body-inner");

  // On category trigger click.
  $(".ttgr-cat-trigger").on("click", function () {
    $("body").addClass("ttgr-cat-nav-open");
    if ($("body").hasClass("ttgr-cat-nav-open")) {
      gsap.to(".portfolio-grid-item", { duration: 0.3, scale: 0.9 });
      gsap.to(".pgi-caption, #page-header, .ttgr-cat-trigger", {
        duration: 0.3,
        autoAlpha: 0,
      });

      // Make "ttgr-cat-nav" unclickable.
      $(".ttgr-cat-nav").off("click");

      // Catecories step in animations.
      var tl_ttgrIn = gsap.timeline({
        onComplete: function () {
          ttCatNavClose();
        },
      });
      tl_ttgrIn.to(".ttgr-cat-nav", { duration: 0.3, autoAlpha: 1 });
      tl_ttgrIn.from(".ttgr-cat-list > li", {
        duration: 0.3,
        y: 80,
        autoAlpha: 0,
        stagger: 0.05,
        ease: Power2.easeOut,
        clearProps: "all",
      });

      // On catecory link click
      $(".ttgr-cat-nav a")
        .not('[target="_blank"]')
        .not('[href^="#"]')
        .not('[href^="mailto"]')
        .not('[href^="tel"]')
        .on("click", function () {
          gsap.to(".ttgr-cat-list > li", {
            duration: 0.3,
            y: -80,
            autoAlpha: 0,
            stagger: 0.05,
            ease: Power2.easeIn,
          });
        });
    }
  });

  // On close click function
  function ttCatNavClose() {
    $(".ttgr-cat-nav").on("click", function () {
      $("body").removeClass("ttgr-cat-nav-open");

      // Catecories step out animations
      var tl_ttgrClose = gsap.timeline();
      tl_ttgrClose.to(".ttgr-cat-list > li", {
        duration: 0.3,
        y: -80,
        autoAlpha: 0,
        stagger: 0.05,
        ease: Power2.easeIn,
      });
      tl_ttgrClose.to(
        ".ttgr-cat-nav",
        { duration: 0.3, autoAlpha: 0, clearProps: "all" },
        "+=0.2"
      );
      tl_ttgrClose.to(
        ".portfolio-grid-item",
        { duration: 0.3, scale: 1, clearProps: "all" },
        "-=0.4"
      );
      tl_ttgrClose.to(
        ".pgi-caption, #page-header, .ttgr-cat-trigger",
        { duration: 0.3, autoAlpha: 1, clearProps: "all" },
        "-=0.4"
      );
      tl_ttgrClose.to(".ttgr-cat-list > li", { clearProps: "all" }); // clearProps only
    });
  }

  // Gallery item image zoom on hover
  $(".tt-gallery-item").each(function () {
    if ($(".tt-gallery").hasClass("ttga-hover")) {
      $(this)
        .find(".tt-gallery-image img")
        .wrap('<div class="tt-gallery-image-hover-zoom"></div>');
    }
  });

  $(".tt-accordion").each(function () {
    // If accordion content has class "is-open"
    $(this)
      .find(".tt-accordion-item")
      .each(function () {
        var $this = $(this);

        if ($this.find(".tt-accordion-content").hasClass("is-open")) {
          $this.addClass("active");
        }
      });

    // Accordion item on click
    $(this)
      .find(".tt-accordion-heading")
      .on("click", function () {
        var $this = $(this);

        if ($this.parents(".tt-accordion-item").hasClass("active")) {
          $this.parents(".tt-accordion-item").removeClass("active");
          $this.next(".tt-accordion-content").slideUp(350);
        } else {
          $this
            .parent()
            .parent()
            .find(".tt-accordion-item")
            .removeClass("active");
          $this.parent().parent().find(".tt-accordion-content").slideUp(350);
          $this.parents(".tt-accordion-item").toggleClass("active");
          $this.next(".tt-accordion-content").slideToggle(350);
        }
        return false;
      });
  });

  // If tt-sidebar exist.
  if ($(".tt-sidebar").length) {
    $("body").addClass("tt-sidebar-on");

    // If tt-sidebar has class "sidebar-left" add class "sidebar-left-on" to <pody>.
    if ($(".tt-sidebar").hasClass("sidebar-left")) {
      $("body").addClass("tt-sidebar-left-on");
    }

    // If tt-sidebar has class "sidebar-right" add class "sidebar-right-on" to <pody>.
    if ($(".tt-sidebar").hasClass("sidebar-right")) {
      $("body").addClass("tt-sidebar-right-on");
    }
  }

  // If sliding sidebar exist.
  if ($(".tt-sliding-sidebar-wrap").length) {
    $("body").addClass("tt-sliding-sidebar-on tt-sliding-sidebar-left-on"); // left position is by default.

    // Append sliding sidebar.
    $(".tt-sliding-sidebar-wrap").appendTo("#body-inner");

    // Open/close sliding sidebar.
    $(".tt-sliding-sidebar-trigger").on("click", function () {
      $("body").toggleClass("tt-sliding-sidebar-open");
    });
    $(".tt-sliding-sidebar-close").on("click", function () {
      $("body").removeClass("tt-sliding-sidebar-open");
    });

    // If sliding sidebar has class "tt-ss-right" add class "tt-ss-right-on" to <pody>.
    if ($(".tt-sliding-sidebar-wrap").hasClass("tt-ss-right")) {
      $("body").removeClass("tt-sliding-sidebar-left-on");
      $("body").addClass("tt-sliding-sidebar-right-on");
    }
  }

  // Hover scrolling speed.
  $(".tt-scrolling-text").each(function () {
    var $tt_stSpeed = $(this).data("scroll-speed");
    $(this)
      .find(".tt-scrolling-text-inner")
      .css({
        "animation-duration": $tt_stSpeed + "s",
      });
  });

  $('a[href^="#"]')
    .not('[href$="#"]')
    .not('[href$="#0"]')
    .on("click", function () {
      var target = this.hash;

      // If fixed header position enabled.
      if ($("#tt-header").hasClass("tt-header-fixed")) {
        var $offset = $("#tt-header").height();
      } else {
        var $offset = 0;
      }

      if ($(this).data("offset") != undefined) $offset = $(this).data("offset");

      if (!isMobile) {
        // Not for mobile devices!
        if ($("body").hasClass("tt-smooth-scroll")) {
          var topY =
            $(target).offset().top -
            $("#scroll-container > .scroll-content").offset().top -
            $offset;
          var $scrollbar = Scrollbar.init(
            document.getElementById("scroll-container")
          );
          gsap.to($scrollbar, {
            duration: 1.5,
            scrollTo: { y: topY, autoKill: true },
            ease: Expo.easeInOut,
          });
        } else {
          var topY = $(target).offset().top - $("body").offset().top - $offset;
          $("html,body").animate({ scrollTop: topY }, 800);
        }
      } else {
        var topY = $(target).offset().top - $("body").offset().top - $offset;
        $("html,body").animate({ scrollTop: topY }, 800);
      }
      return false;
    });

  $(".scroll-to-top").on("click", function () {
    if (!isMobile) {
      // Not for mobile devices!
      if ($("body").hasClass("tt-smooth-scroll")) {
        var $scrollbar = Scrollbar.init(
          document.getElementById("scroll-container")
        );
        gsap.to($scrollbar, {
          duration: 1.5,
          scrollTo: { y: 0, autoKill: true },
          ease: Expo.easeInOut,
        });
      } else {
        $("html,body").animate({ scrollTop: 0 }, 800);
      }
    } else {
      $("html,body").animate({ scrollTop: 0 }, 800);
    }
    return false;
  });

  // Remove input placeholder on focus
  $("input,textarea")
    .focus(function () {
      $(this)
        .data("placeholder", $(this).attr("placeholder"))
        .attr("placeholder", "");
    })
    .blur(function () {
      $(this).attr("placeholder", $(this).data("placeholder"));
    });

  // Form "Browse File" button info
  $(document).on("change", ":file", function () {
    var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, "/").replace(/.*\//, "");
    input.trigger("fileselect", [numFiles, label]);
  });
  $(":file").on("fileselect", function (event, numFiles, label) {
    var input = $(this).parents(".tt-form-file").find(".tt-file-info"),
      log = numFiles > 1 ? numFiles + " files selected" : label;

    if (input.length) {
      input.val(log);
    } else {
      if (log) alert(log);
    }
  });

  if ($("body").not(".is-mobile").hasClass("tt-magic-cursor")) {
    if ($(window).width() > 1024) {
      $(".magnetic-item").wrap('<div class="magnetic-wrap"></div>');

      if ($("a.magnetic-item").length) {
        $("a.magnetic-item").addClass("not-hide-cursor");
      }

      var $mouse = { x: 0, y: 0 }; // Cursor position
      var $pos = { x: 0, y: 0 }; // Cursor position
      var $ratio = 0.15; // delay follow cursor
      var $active = false;
      var $ball = $("#ball");

      var $ballWidth = 36; // Ball default width
      var $ballHeight = 36; // Ball default height
      var $ballOpacity = 0.5; // Ball default opacity
      var $ballBorderWidth = 2; // Ball default border width

      gsap.set($ball, {
        // scale from middle and style ball
        xPercent: -50,
        yPercent: -50,
        width: $ballWidth,
        height: $ballHeight,
        borderWidth: $ballBorderWidth,
        opacity: $ballOpacity,
      });

      document.addEventListener("mousemove", mouseMove);

      function mouseMove(e) {
        $mouse.x = e.clientX;
        $mouse.y = e.clientY;
      }

      gsap.ticker.add(updatePosition);

      function updatePosition() {
        if (!$active) {
          $pos.x += ($mouse.x - $pos.x) * $ratio;
          $pos.y += ($mouse.y - $pos.y) * $ratio;

          gsap.set($ball, { x: $pos.x, y: $pos.y });
        }
      }

      $(".magnetic-wrap").mousemove(function (e) {
        parallaxCursor(e, this, 2); // magnetic ball = low number is more attractive
        callParallax(e, this);
      });

      function callParallax(e, parent) {
        parallaxIt(e, parent, parent.querySelector(".magnetic-item"), 25); // magnetic area = higher number is more attractive
      }

      function parallaxIt(e, parent, target, movement) {
        var boundingRect = parent.getBoundingClientRect();
        var relX = e.clientX - boundingRect.left;
        var relY = e.clientY - boundingRect.top;

        gsap.to(target, {
          duration: 0.3,
          x: ((relX - boundingRect.width / 2) / boundingRect.width) * movement,
          y:
            ((relY - boundingRect.height / 2) / boundingRect.height) * movement,
          ease: Power2.easeOut,
        });
      }

      function parallaxCursor(e, parent, movement) {
        var rect = parent.getBoundingClientRect();
        var relX = e.clientX - rect.left;
        var relY = e.clientY - rect.top;
        $pos.x =
          rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
        $pos.y =
          rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;
        gsap.to($ball, { duration: 0.3, x: $pos.x, y: $pos.y });
      }

      // Magic cursor behavior      

      // Magnetic item hover.
      $(".magnetic-wrap")
        .on("mouseenter mouseover", function (e) {
          $ball.addClass("magnetic-active");
          gsap.to($ball, { duration: 0.3, width: 70, height: 70, opacity: 1 });
          $active = true;
        })
        .on("mouseleave", function (e) {
          $ball.removeClass("magnetic-active");
          gsap.to($ball, {
            duration: 0.3,
            width: $ballWidth,
            height: $ballHeight,
            opacity: $ballOpacity,
          });
          gsap.to(this.querySelector(".magnetic-item"), {
            duration: 0.3,
            x: 0,
            y: 0,
            clearProps: "all",
          });
          $active = false;
        });

      // Alternative cursor style on hover.
      $(
        ".cursor-alter, .tt-main-menu-list > li > a, .tt-main-menu-list > li > .tt-submenu-trigger > a"
      )
        .not(".magnetic-item") // omit from selection.
        .on("mouseenter", function () {
          gsap.to($ball, {
            duration: 0.3,
            borderWidth: 0,
            opacity: 0.2,
            backgroundColor: "#CCC",
            width: "100px",
            height: "100px",
          });
        })
        .on("mouseleave", function () {
          gsap.to($ball, {
            duration: 0.3,
            borderWidth: $ballBorderWidth,
            opacity: $ballOpacity,
            backgroundColor: "transparent",
            width: $ballWidth,
            height: $ballHeight,
            clearProps: "backgroundColor",
          });
        });

      // Overlay menu caret hover.
      $(".tt-ol-submenu-caret-wrap .magnetic-wrap")
        .on("mouseenter", function () {
          gsap.to($ball, { duration: 0.3, scale: 0.6, borderWidth: 3 });
        })
        .on("mouseleave", function () {
          gsap.to($ball, {
            duration: 0.3,
            scale: 1,
            borderWidth: $ballBorderWidth,
          });
        });

      // Cursor view on hover (data attribute "data-cursor="...").
      $("[data-cursor]").each(function () {
        $(this)
          .on("mouseenter", function () {
            $ball
              .addClass("ball-view")
              .append('<div class="ball-view-inner"></div>');
            $(".ball-view-inner").append($(this).attr("data-cursor"));
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -75,
              width: 95,
              height: 95,
              opacity: 1,
              borderWidth: 0,
            });
            gsap.to(".ball-view-inner", {
              duration: 0.3,
              scale: 1,
              autoAlpha: 1,
            });
          })
          .on("mouseleave", function () {
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -50,
              width: $ballWidth,
              height: $ballHeight,
              opacity: $ballOpacity,
              borderWidth: $ballBorderWidth,
            });
            $ball.removeClass("ball-view").find(".ball-view-inner").remove();
          });
        $(this).addClass("not-hide-cursor");
      });

      // Cursor drag on hover (class "cursor-drag"). For Swiper sliders.
      $(".swiper").each(function () {
        if ($(this).parent().attr("data-simulate-touch") == "true") {
          if ($(this).parent().hasClass("cursor-drag")) {
            $(this)
              .on("mouseenter", function () {
                $ball.append('<div class="ball-drag"></div>');
                gsap.to($ball, {
                  duration: 0.3,
                  width: 60,
                  height: 60,
                  opacity: 1,
                });
              })
              .on("mouseleave", function () {
                $ball.find(".ball-drag").remove();
                gsap.to($ball, {
                  duration: 0.3,
                  width: $ballWidth,
                  height: $ballHeight,
                  opacity: $ballOpacity,
                });
              });
            $(this).addClass("not-hide-cursor");

            // Ignore "data-cursor" on hover.
            $(this)
              .find("[data-cursor]")
              .on("mouseenter mouseover", function () {
                $ball.find(".ball-drag").remove();
                return false;
              })
              .on("mouseleave", function () {
                $ball.append('<div class="ball-drag"></div>');
                gsap.to($ball, {
                  duration: 0.3,
                  width: 60,
                  height: 60,
                  opacity: 1,
                });
              });
          }
        }
      });

      // Cursor drag on mouse down / click and hold effect (class "cursor-drag-mouse-down"). For Swiper sliders.
      $(".swiper").each(function () {
        if ($(this).parent().attr("data-simulate-touch") == "true") {
          if ($(this).parent().hasClass("cursor-drag-mouse-down")) {
            $(this)
              .on("mousedown pointerdown", function (e) {
                if (e.which === 1) {
                  // Affects the left mouse button only!
                  gsap.to($ball, {
                    duration: 0.2,
                    width: 60,
                    height: 60,
                    opacity: 1,
                  });
                  $ball.append('<div class="ball-drag"></div>');
                }
              })
              .on("mouseup pointerup", function () {
                $ball.find(".ball-drag").remove();
                if ($(this).find("[data-cursor]:hover").length) {
                } else {
                  gsap.to($ball, {
                    duration: 0.2,
                    width: $ballWidth,
                    height: $ballHeight,
                    opacity: $ballOpacity,
                  });
                }
              })
              .on("mouseleave", function () {
                $ball.find(".ball-drag").remove();
                gsap.to($ball, {
                  duration: 0.2,
                  width: $ballWidth,
                  height: $ballHeight,
                  opacity: $ballOpacity,
                });
              });

            // Ignore "data-cursor" on mousedown.
            $(this)
              .find("[data-cursor]")
              .on("mousedown pointerdown", function () {
                return false;
              });

            // Ignore "data-cursor" on hover.
            $(this)
              .find("[data-cursor]")
              .on("mouseenter mouseover", function () {
                $ball.find(".ball-drag").remove();
                return false;
              });
          }
        }
      });

      // Cursor close on hover.
      $(".cursor-close").each(function () {
        $(this).addClass("ball-close-enabled");
        $(this)
          .on("mouseenter", function () {
            $ball.addClass("ball-close-enabled");
            $ball.append('<div class="ball-close">Close</div>');
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -75,
              width: 80,
              height: 80,
              opacity: 1,
            });
            gsap.from(".ball-close", { duration: 0.3, scale: 0, autoAlpha: 0 });
          })
          .on("mouseleave click", function () {
            $ball.removeClass("ball-close-enabled");
            gsap.to($ball, {
              duration: 0.3,
              yPercent: -50,
              width: $ballWidth,
              height: $ballHeight,
              opacity: $ballOpacity,
            });
            $ball.find(".ball-close").remove();
          });

        // Hover on "cursor-close" inner elements.
        $(
          ".cursor-close a, .cursor-close button, .cursor-close .tt-btn, .cursor-close .hide-cursor"
        )
          .not(".not-hide-cursor") // omit from selection (class "not-hide-cursor" is for global use).
          .on("mouseenter", function () {
            $ball.removeClass("ball-close-enabled");
          })
          .on("mouseleave", function () {
            $ball.addClass("ball-close-enabled");
          });
      });

      // Blog interactive title link hover.
      $(".blog-interactive-item").each(function () {
        var $biItem = $(this);
        if ($biItem.find(".bi-item-image").length) {
          $biItem
            .find(".bi-item-title a")
            .on("mouseenter mouseover", function () {
              $("#magic-cursor").addClass("blog-interactive-hover-on");
              $biItem.find(".bi-item-image").appendTo($ball);
              gsap.to($ball, {
                duration: 0.3,
                width: "20vw",
                height: "20vw",
                opacity: 1,
              });
            })
            .on("mouseleave", function () {
              $("#magic-cursor").removeClass("blog-interactive-hover-on");
              $ball.find(".bi-item-image").appendTo($biItem);
              gsap.to($ball, {
                duration: 0.3,
                width: $ballWidth,
                height: $ballHeight,
                opacity: $ballOpacity,
              });
            });
          $biItem.find(".bi-item-title a").addClass("not-hide-cursor");
          $biItem.addClass("bi-item-image-on");
        }
      });      
      // Hide on hover.
      $(
        "a, button, .tt-btn, .tt-form-control, .tt-form-radio, .tt-form-check, .hide-cursor"
      ) 
        .not(".not-hide-cursor")
        .not(".cursor-alter")
        .not(".tt-main-menu-list > li > a")
        .not(".tt-main-menu-list > li > .tt-submenu-trigger > a")
        .on("mouseenter", function () {
          gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 });
        })
        .on("mouseleave", function () {
          gsap.to($ball, { duration: 0.3, scale: 1, opacity: $ballOpacity });
        });

      // Hide on click.
      $("a")
        .not('[target="_blank"]') 
        .not('[href^="#"]') 
        .not('[href^="mailto"]') 
        .not('[href^="tel"]') 
        .not(".lg-trigger") 
        .not(".tt-btn-disabled") 
        .on("click", function () {
          gsap.to($ball, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
        });

      // Show/hide on document leave/enter.
      $(document)
        .on("mouseleave", function () {
          gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 0 });
        })
        .on("mouseenter", function () {
          gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
        });

      // Show as the mouse moves.
      $(document).mousemove(function () {
        gsap.to("#magic-cursor", { duration: 0.3, autoAlpha: 1 });
      });
    }
  }

  // Display style switch button
  $("#body-inner").prepend(
    '<div class="tt-style-switch"><div class="tt-stsw-dark"><i class="far fa-moon"></i></div><div class="tt-stsw-light"><i class="fas fa-sun"></i></div></div>'
  );

  // Hide magic cursor on button hover
  if ($("body").hasClass("tt-smooth-scroll")) {
    $(".tt-style-switch")
      .on("mouseenter", function () {
        gsap.to($ball, { duration: 0.3, scale: 0, opacity: 0 });
      })
      .on("mouseleave", function () {
        gsap.to($ball, { duration: 0.3, scale: 1, opacity: $ballOpacity });
      });
  }

  if ($("#tt-light-style-default").length) {
    // Click on style switch
    $(".tt-style-switch").on("click", function () {
      $("body").toggleClass("tt-light-style-default-on");
      $("body").hasClass("tt-light-style-default-on")
        ? (localStorage.setItem("lightstyle", "true"), $(".tt-style-switch"))
        : localStorage.setItem("lightstyle", "false");

      location.reload();
    });

    // localStorage
    var d = localStorage.getItem("lightstyle");
    d == "true"
      ? ($("body").addClass("tt-light-style-default-on"), $(".tt-style-switch"))
      : $("body").removeClass("tt-light-style-default-on");

    // Toggle light stylesheet
    if ($("body").hasClass("tt-light-style-default-on")) {
      $("#tt-light-style-default").remove();
    }
  } else {
    // Click on style switch
    $(".tt-style-switch").on("click", function () {
      $("body").toggleClass("tt-light-style-on");
      $("body").hasClass("tt-light-style-on")
        ? (localStorage.setItem("lightstyle", "true"), $(".tt-style-switch"))
        : localStorage.setItem("lightstyle", "false");

      location.reload();
    });

    // localStorage
    var d = localStorage.getItem("lightstyle");
    d == "true"
      ? ($("body").addClass("tt-light-style-on"), $(".tt-style-switch"))
      : $("body").removeClass("tt-light-style-on");

    // Toggle light stylesheet
    if ($("body").hasClass("tt-light-style-on")) {
      $("#tt-themecss").after(
        '<link id="tt-light-style" rel="stylesheet" href="assets/css/light-style.css">'
      );
    } else {
      $("#tt-light-style").remove();
    }
  }

  // tt-Button disabled (prevent click)
  $(".tt-btn-disabled").on("click", function () {
    return false;
  });

  // Force page scroll position to top on refresh
  $(window).on("pagehide", function () {
    $(window).scrollTop(0);
  });

  // Hover fix for iOS
  $("*")
    .on("touchstart", function () {
      $(this).trigger("hover");
    })
    .on("touchend", function () {
      $(this).trigger("hover");
    });
})(jQuery);
