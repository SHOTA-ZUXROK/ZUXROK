var userAgentInfo = {};
userAgentInfo.name = window.navigator.userAgent.toLowerCase();

userAgentInfo.isiPhone = userAgentInfo.name.indexOf('iphone') >= 0;
userAgentInfo.isiPod = userAgentInfo.name.indexOf('ipod') >= 0;
userAgentInfo.isiPad = userAgentInfo.name.indexOf('ipad') >= 0;
userAgentInfo.isiOS = (userAgentInfo.isiPhone || userAgentInfo.isiPod || userAgentInfo.isiPad);
userAgentInfo.isAndroid = userAgentInfo.name.indexOf('android') >= 0;
userAgentInfo.isTablet = (userAgentInfo.isiPad || (userAgentInfo.isAndroid && userAgentInfo.name.indexOf('mobile') < 0));
userAgentInfo.isTouch = ('ontouchstart' in window);

$(function () {
    $(window).on('load resize', function () {
        windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
        windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
    });
    if (userAgentInfo.isTouch) {
        windowWidth = screen.width;
        windowHeight = screen.height;
    } else {
        windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
        windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
    }
});

var currentPagePath = location.pathname;
var currentLanguage = currentPagePath.split('/')[1];
var currentHash = location.hash;
var breakpointWidth = 768;

$(function () {
    if (userAgentInfo.isiOS) {
        $('#pageContent').addClass('iOS');
    }

    $(window).on('load resize', function () {
        if (windowWidth < breakpointWidth) {
            $('#siteHeader .mainNavigation').appendTo('#mobileMenuOverlay');
        } else {
            $('#mobileMenuOverlay .mainNavigation').prependTo('#siteHeader .mainMenuWrapper');
        }
    });
    $('.mobileMenuToggle').on('click', function () {
        $('#mobileMenuOverlay, .mobileMenuToggle').toggleClass('active');
    });
    $(document).on('click', '#mobileMenuOverlay .mainNavigation a', function () {
        $('#mobileMenuOverlay, .mobileMenuToggle').removeClass('active');
    });

    var headerHeight = $('#siteHeader').height();
    $(document).on('click', 'a[href^="#"]:not(a[href="#"])', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        if ($(href).length) {
            $('html,body').animate({ scrollTop: $(href).offset().top - headerHeight }, 'slow', 'swing');
            return false;
        }
    });

    $('#galleryNavSlider').slick({
        infinite: true,
        autoplay: false,
        arrows: true,
        slidesToShow: 3,
        prevArrow: '<div class="prev"></div>',
        nextArrow: '<div class="next"></div>',
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    dots: true,
                }
            },
        ]
    }).on('setPosition', function (event, slick) {
        var count = slick.slideCount;
        if (windowWidth < breakpointWidth) {
            if (count <= 2) {
                $(this).slick('unslick');
            }
        } else {
            if (count <= 3) {
                $(this).slick('unslick');
            }
        }
    });


    $('#dreamMainSlider').slick({
        infinite: true,
        autoplay: false,
        arrows: false,
        asNavFor: '#dreamNavSlider',
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: true,
                    prevArrow: '<div class="prev"></div>',
                    nextArrow: '<div class="next"></div>',
                }
            },
        ]
    }).on('afterChange', function (event, slick, currentSlide) {
        var num = currentSlide + 1;
        $('#dreamSection').attr('data-bg', 'chara' + num);
    });

    $('.imageModalTrigger').modaal({
        type: 'image',
        overlay_close: true,
        before_open: function (obj) {
            $('body').addClass('modaal-open-image');
        },
        after_close: function (obj) {
            $('body').removeClass('modaal-open-image');
        }
    });

    $('.productTabNavigation[data-href="' + currentLanguage + '"]').addClass('active');
    $('.editionTabItem.active').each(function () {
        var activeTab = $(this).data('href');
        var tabName = $(this).parent().data('tab');
        $('.editionContentWrapper[data-tab="' + tabName + '"] > .editionContentPane[data-id="' + activeTab + '"]').css('display', 'block');
    });

    $('.editionTabItem').on('click', function () {
        var tabName = $(this).parent().data('tab');
        var target = $(this).data('href');
        $('.editionContentWrapper[data-tab="' + tabName + '"] > .editionContentPane').hide();
        $('.editionContentWrapper[data-tab="' + tabName + '"] > .editionContentPane[data-id="' + target + '"]').fadeIn();
        $('.productEditionTabs[data-tab="' + tabName + '"] .editionTabItem').removeClass('active');
        $(this).addClass('active');
    });

    if ($('#downloadSection').length) {
        var sectionPositions = new Array();
        var targetSections = ['#gallerySection', '#aboutSection', '#dreamSection', '#downloadSection'];
        for (var i = 0; i < targetSections.length; i++) {
            var targetTop = $(targetSections[i]).offset().top;
            var targetBottom = targetTop + $(targetSections[i]).outerHeight();
            sectionPositions[i] = [Math.round(targetTop), Math.round(targetBottom)];
        }
    }


    $(window).on('load scroll', function () {
        if ($('#downloadSection').length) {
            var scroll = $(window).scrollTop();
            var mainSectionHeight = $('#heroSection').outerHeight();
            if (scroll > mainSectionHeight - windowHeight) {
                $('#heroSection .heroBackground').addClass('scroll');
            } else {
                $('#heroSection .heroBackground').removeClass('scroll');
            }
            if (scroll > 100) {
                $('#siteHeader').addClass('scroll');
            } else {
                $('#siteHeader').removeClass('scroll');
            }
            if (userAgentInfo.isiOS) {
                var timer = setTimeout(checkCurrentSection(sectionPositions, targetSections), 200);
            }
        }
    });

    objectFitImages('.fit img, .fit video');
    objectFitImages('img.fit');

    AOS.init();
    $(window).on('load', function () {
        AOS.refresh();
    });
});


function checkCurrentSection(sectionPositions, targetSections) {
    var scroll = $(window).scrollTop();
    for (var i = 0; i < sectionPositions.length; i++) {
        if (sectionPositions[i][0] <= scroll && sectionPositions[i][1] >= scroll) {
            $('section.contentBlock').removeClass('current');
            $(targetSections[i]).addClass('current');
            i == sectionPositions.length;
        }
    };
}

var isTouchDevice = 'ontouchstart' in document.documentElement
    || navigator.maxTouchPoints > 0
    || navigator.msMaxTouchPoints > 0;

if (isTouchDevice) {
    try {
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    } catch (ex) { }
}
