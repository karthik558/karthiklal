(function ($) {
  "use strict";

  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  $(window).on("load", function () {
    $(window).trigger("scroll");
    $(window).trigger("resize");
    preloaderSetup();
  });

  $(document).on("ready", function () {
    $(window).trigger("resize");
    dynamicBackground();
    formValidation();
    progressBarInit();
    stickyHeader();
    onePageNavigation();
    mainMenu();
    lightGallery();
    socialBtnHover();
    slickInit();
    particles();
    parallaxEffect();
    rippleInit();
    new WOW().init();
  });

  $(window).on("scroll", function () {
    stickyHeader();
    parallaxEffect();
  });

  /*--------------------------------------------------------------
    1. Placeholder
  --------------------------------------------------------------*/
  function preloaderSetup() {
    $(".st-perloader").fadeOut();
    $("st-perloader-in").delay(150).fadeOut("slow");
  }

  /*--------------------------------------------------------------
    2. Dynamic Background
  --------------------------------------------------------------*/
  function dynamicBackground() {
    // Background images
    $(".st-dynamic-bg").each(function () {
      var src = $(this).attr("data-src");
      $(this).css({
        "background-image": "url(" + src + ")",
      });
    });
  }

  /*--------------------------------------------------------------
    3. Menu
  --------------------------------------------------------------*/
  function mainMenu() {
    $(".st-nav").append('<span class="st-munu-toggle"><span></span></span>');
    $(".menu-item-has-children").append(
      '<span class="st-munu-dropdown-toggle"></span>'
    );
    $(".st-munu-toggle").on("click", function () {
      $(this)
        .toggleClass("st-toggle-active")
        .siblings(".st-nav-list")
        .slideToggle();
    });
    $(".st-munu-dropdown-toggle").on("click", function () {
      $(this).toggleClass("active").siblings("ul").slideToggle();
    });
  }

  /*--------------------------------------------------------------
    4. Sticky Header
  --------------------------------------------------------------*/
  function stickyHeader() {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
      $(".st-sticky-header").addClass("st-sticky-active");
    } else {
      $(".st-sticky-header").removeClass("st-sticky-active");
    }
  }

  /*--------------------------------------------------------------
    5. One Page Navigation
  --------------------------------------------------------------*/
  function onePageNavigation() {
    // Click To Go Top
    $(".st-smooth-move").on("click", function () {
      var thisAttr = $(this).attr("href");
      if ($(thisAttr).length) {
        var scrollPoint = $(thisAttr).offset().top - 10;
        $("body,html").animate(
          {
            scrollTop: scrollPoint,
          },
          800
        );
      }
      return false;
    });

    // One Page Active Class
    var topLimit = 300,
      ultimateOffset = 200;

    $(".st-onepage-nav").each(function () {
      var $this = $(this),
        $parent = $this.parent(),
        current = null,
        $findLinks = $this.find("a");

      function getHeader(top) {
        var last = $findLinks.first();
        if (top < topLimit) {
          return last;
        }
        for (var i = 0; i < $findLinks.length; i++) {
          var $link = $findLinks.eq(i),
            href = $link.attr("href");

          if (href.charAt(0) === "#" && href.length > 1) {
            var $anchor = $(href).first();
            if ($anchor.length > 0) {
              var offset = $anchor.offset();
              if (top < offset.top - ultimateOffset) {
                return last;
              }
              last = $link;
            }
          }
        }
        return last;
      }

      $(window).on("scroll", function () {
        var top = window.scrollY,
          height = $this.outerHeight(),
          max_bottom = $parent.offset().top + $parent.outerHeight(),
          bottom = top + height + ultimateOffset;

        var $current = getHeader(top);

        if (current !== $current) {
          $this.find(".active").removeClass("active");
          $current.addClass("active");
          current = $current;
        }
      });
    });
  }

  /*--------------------------------------------------------------
    6. Progress Bar
  --------------------------------------------------------------*/
  function progressBarInit() {
    $(".st-progressbar").each(function () {
      var progressPercentage = $(this).data("progress") + "%";
      $(this).find(".st-progressbar-in").css("width", progressPercentage);
    });
  }

  /*--------------------------------------------------------------
    7. Ajax Contact Form And Appointment
  --------------------------------------------------------------*/
  // Contact Form
  function formValidation() {
    if ($.exists("#contact-form #submit")) {
      $("#st-alert").hide();
      $("#contact-form #submit").on("click", function () {
        var name = $("#name").val();
        var subject = $("#subject").val();
        var phone = $("#phone").val();
        var email = $("#email").val();
        var msg = $("#msg").val();
        var regex =
          /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!regex.test(email)) {
          $("#st-alert")
            .fadeIn()
            .html(
              '<div class="alert alert-danger"><strong>Warning!</strong> Please Enter Valid Email.</div>'
            );
          return false;
        }

        name = $.trim(name);
        subject = $.trim(subject);
        phone = $.trim(phone);
        email = $.trim(email);
        msg = $.trim(msg);

        if (name != "" && email != "" && msg != "") {
          var values =
            "name=" +
            name +
            "&subject=" +
            subject +
            "&phone=" +
            phone +
            "&email=" +
            email +
            "&msg=" +
            msg;
          $.ajax({
            type: "POST",
            url: "assets/php/mail.php",
            data: values,
            success: function () {
              $("#name").val("");
              $("#subject").val("");
              $("#phone").val("");
              $("#email").val("");
              $("#msg").val("");

              $("#st-alert")
                .fadeIn()
                .html(
                  '<div class="alert alert-success"><strong>Success!</strong> Email has been sent successfully.</div>'
                );
              setTimeout(function () {
                $("#st-alert").fadeOut("slow");
              }, 4000);
            },
          });
        } else {
          $("#st-alert")
            .fadeIn()
            .html(
              '<div class="alert alert-danger"><strong>Warning!</strong> All fields are required.</div>'
            );
        }
        return false;
      });
    }
  }

  /*--------------------------------------------------------------
    8. Light Gallery
  --------------------------------------------------------------*/
  function lightGallery() {
    $(".st-lightgallery").each(function () {
      $(this).lightGallery({
        selector: ".st-lightbox-item",
        subHtmlSelectorRelative: false,
        thumbnail: false,
        mousewheel: true,
      });
    });
  }

  /*--------------------------------------------------------------
    9. Social Button Hover
  --------------------------------------------------------------*/
  function socialBtnHover() {
    $(".st-social-btn").hover(function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
  }

  /*--------------------------------------------------------------
    10. Slick Slider
  --------------------------------------------------------------*/
  function slickInit() {
    $(".st-slider").each(function () {
      // Slick Variable
      var $ts = $(this).find(".slick-container");
      var $slickActive = $(this).find(".slick-wrapper");
      var $sliderNumber = $(this).siblings(".slider-number");

      // Auto Play
      var autoPlayVar = parseInt($ts.attr("data-autoplay"), 10);
      // Auto Play Time Out
      var autoplaySpdVar = 3000;
      if (autoPlayVar > 1) {
        autoplaySpdVar = autoPlayVar;
        autoPlayVar = 1;
      }
      // Slide Change Speed
      var speedVar = parseInt($ts.attr("data-speed"), 10);
      // Slider Loop
      var loopVar = Boolean(parseInt($ts.attr("data-loop"), 10));
      // Slider Center
      var centerVar = Boolean(parseInt($ts.attr("data-center"), 10));
      // Pagination
      var paginaiton = $(this).children().hasClass("pagination");
      // Slide Per View
      var slidesPerView = $ts.attr("data-slides-per-view");
      if (slidesPerView == 1) {
        slidesPerView = 1;
      }
      if (slidesPerView == "responsive") {
        var slidesPerView = parseInt($ts.attr("data-add-slides"), 10);
        var lgPoint = parseInt($ts.attr("data-lg-slides"), 10);
        var mdPoint = parseInt($ts.attr("data-md-slides"), 10);
        var smPoint = parseInt($ts.attr("data-sm-slides"), 10);
        var xsPoing = parseInt($ts.attr("data-xs-slides"), 10);
      }
      // Fade Slider
      var fadeVar = parseInt($($ts).attr("data-fade-slide"));
      fadeVar === 1 ? (fadeVar = true) : (fadeVar = false);

      // Slick Active Code
      $slickActive.slick({
        infinite: true,
        autoplay: autoPlayVar,
        dots: paginaiton,
        centerPadding: "0",
        speed: speedVar,
        infinite: loopVar,
        autoplaySpeed: autoplaySpdVar,
        centerMode: centerVar,
        fade: fadeVar,
        prevArrow: $(this).find(".slick-arrow-left"),
        nextArrow: $(this).find(".slick-arrow-right"),
        appendDots: $(this).find(".pagination"),
        slidesToShow: slidesPerView,
        responsive: [
          {
            breakpoint: 1600,
            settings: {
              slidesToShow: lgPoint,
            },
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: mdPoint,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: smPoint,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: xsPoing,
            },
          },
        ],
      });
    });
  }
  /*--------------------------------------------------------------
    11. particles
  --------------------------------------------------------------*/
  function particles() {
    if ($.exists("#particles-js")) {
      particlesJS("particles-js", {
        particles: {
          number: {
            value: 355,
            density: {
              enable: true,
              value_area: 789.1476416322727,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
            polygon: {
              nb_sides: 5,
            },
            image: {
              src: "img/github.svg",
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 0.48927153781200905,
            random: false,
            anim: {
              enable: true,
              speed: 0.6,
              opacity_min: 0,
              sync: false,
            },
          },
          size: {
            value: 2,
            random: true,
            anim: {
              enable: true,
              speed: 5,
              size_min: 0,
              sync: false,
            },
          },
          line_linked: {
            enable: false,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 83.91608391608392,
              size: 1,
              duration: 3,
              opacity: 1,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      });
    }
  }
  /*--------------------------------------------------------------
    12. Ripple
  --------------------------------------------------------------*/
  function rippleInit() {
    if ($.exists(".st-ripple-version")) {
      $(".st-ripple-version").each(function () {
        $(".st-ripple-version").ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04,
        });
      });
    }
  }

  /*--------------------------------------------------------------
    13. Preloader
  --------------------------------------------------------------*/
  setTimeout(function () {
    $(".loader_bg").fadeToggle();
  }, 900);

  /*--------------------------------------------------------------
    14. New Year Eve Alert
  --------------------------------------------------------------*/
  setTimeout(function () {
    alert("Happy New Year");
  }, 2500);
  
  /*--------------------------------------------------------------
    14. Parallax Effect
  --------------------------------------------------------------*/
  function parallaxEffect() {
    $(".st-parallax").each(function () {
      var windowScroll = $(document).scrollTop(),
        windowHeight = $(window).height(),
        barOffset = $(this).offset().top,
        barHeight = $(this).height(),
        barScrollAtZero = windowScroll - barOffset + windowHeight,
        barHeightWindowHeight = windowScroll + windowHeight,
        barScrollUp = barOffset <= windowScroll + windowHeight,
        barSctollDown = barOffset + barHeight >= windowScroll;

      if (barSctollDown && barScrollUp) {
        var calculadedHeight = barHeightWindowHeight - barOffset;
        var largeEffectPixel = calculadedHeight / 5;
        var mediumEffectPixel = calculadedHeight / 20;
        var miniEffectPixel = calculadedHeight / 10;

        $(this)
          .find(".st-to-left")
          .css("transform", `translateX(-${miniEffectPixel}px)`);
        $(this)
          .find(".st-to-right")
          .css("transform", `translateX(${miniEffectPixel}px)`);
        $(this).css("background-position", `center -${largeEffectPixel}px`);
      }
    });
  }
})(jQuery);
