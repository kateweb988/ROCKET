document.addEventListener("DOMContentLoaded", () => {
  class ItcTabs {
    constructor(target, config) {
      const defaultConfig = {};
      this._config = Object.assign(defaultConfig, config);
      this._elTabs = typeof target === "string" ? document.querySelector(target) : target;
      this._elButtons = this._elTabs.querySelectorAll(".tabs__btn");
      this._elPanes = this._elTabs.querySelectorAll(".tabs__pane");
      this._eventShow = new Event("tab.itc.change");
      this._init();
      this._events();
      this._checkResponsive();
      window.addEventListener("resize", () => this._checkResponsive());
    }

    _init() {
      this._elTabs.setAttribute("role", "tablist");
      this._elButtons.forEach((el, index) => {
        el.dataset.index = index;
        el.setAttribute("role", "tab");
        this._elPanes[index].setAttribute("role", "tabpanel");
      });
    }

    show(elLinkTarget) {
      const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector(".tabs__btn_active");
      const elPaneShow = this._elTabs.querySelector(".tabs__pane_show");
      if (elLinkTarget === elLinkActive) {
        return;
      }
      if (elLinkActive) elLinkActive.classList.remove("tabs__btn_active");
      if (elPaneShow) elPaneShow.classList.remove("tabs__pane_show");
      elLinkTarget.classList.add("tabs__btn_active");
      elPaneTarget.classList.add("tabs__pane_show");
      this._elTabs.dispatchEvent(this._eventShow);
      elLinkTarget.focus();

      if (window.innerWidth <= 576 && this._elDropdown) {
        this._elDropdown.querySelector(".tabs__dropdown-selected").textContent = elLinkTarget.textContent;
      }
    }

    showByIndex(index) {
      const elLinkTarget = this._elButtons[index];
      if (elLinkTarget) this.show(elLinkTarget);
    }

    _events() {
      this._elTabs.addEventListener("click", (e) => {
        const target = e.target.closest(".tabs__btn");
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }

    _checkResponsive() {
      if (window.innerWidth <= 576) {
        if (!this._elDropdown) {
          this._createDropdown();
        }
      } else {
        if (this._elDropdown) {
          this._elDropdown.remove();
          this._elDropdown = null;
          this._elButtons.forEach((btn) => btn.style.display = "");
        }
      }
    }

    _createDropdown() {
      this._elDropdown = document.createElement("div");
      this._elDropdown.classList.add("tabs__dropdown");

      const selected = document.createElement("div");
      selected.classList.add("tabs__dropdown-selected");
      const activeButton = this._elTabs.querySelector(".tabs__btn_active");
      selected.textContent = activeButton ? activeButton.textContent : this._elButtons[0].textContent;
      this._elDropdown.appendChild(selected);

      const optionsList = document.createElement("div");
      optionsList.classList.add("tabs__dropdown-options");
      this._elButtons.forEach((btn, index) => {
        const option = document.createElement("div");
        option.classList.add("tabs__dropdown-option");
        option.dataset.index = index;
        option.textContent = btn.textContent;
        option.addEventListener("click", () => {
          this.showByIndex(index);
          optionsList.classList.remove("show");
        });
        optionsList.appendChild(option);
        btn.style.display = "none";
      });

      selected.addEventListener("click", () => {
        optionsList.classList.toggle("show");
      });

      this._elDropdown.appendChild(optionsList);
      this._elTabs.insertBefore(this._elDropdown, this._elTabs.firstChild);
    }
  }

  new ItcTabs(".tabs");
});
document.addEventListener("DOMContentLoaded", () => {
  const mobileThreshold = 32;
  const desktopThreshold = 48;

  // Определяем текущий порог в зависимости от ширины экрана
  const getThreshold = () => window.innerWidth <= 768 ? mobileThreshold : desktopThreshold;

  // Для всех блоков .local__wrap на странице
  document.querySelectorAll('.local__wrap').forEach(wrapper => {
    const items = wrapper.querySelectorAll('.local__item');
    const toggleBtn = wrapper.querySelector('.toggle-button');
    let threshold = getThreshold();

    if (items.length <= threshold || !toggleBtn) return; // если нечего скрывать — выходим

    // Изначально скрыть все элементы после threshold
    items.forEach((item, index) => {
      if (index >= threshold) {
        item.style.display = 'none';
      }
    });

    let expanded = false;

    toggleBtn.addEventListener('click', () => {
      expanded = !expanded;

      items.forEach((item, index) => {
        if (index >= threshold) {
          item.style.display = expanded ? 'flex' : 'none';
        }
      });

      toggleBtn.textContent = expanded ? 'Скрыть' : 'Раскрыть все';
      toggleBtn.classList.toggle('active', expanded);
    });

    // Обновлять threshold при ресайзе окна (опционально)
    window.addEventListener('resize', () => {
      const newThreshold = getThreshold();

      if (newThreshold !== threshold) {
        threshold = newThreshold;
        if (!expanded) {
          items.forEach((item, index) => {
            item.style.display = index >= threshold ? 'none' : 'flex';
          });
        }
      }
    });
  });
});

window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});
document.addEventListener("DOMContentLoaded", () => {
  (function ($) {
    var elActive = '';
    $.fn.selectCF = function (options) {

      // option
      var settings = $.extend({
        color: "#888888", // color
        backgroundColor: "#FFFFFF", // background
        change: function () { }, // event change
      }, options);

      return this.each(function () {

        var selectParent = $(this);
        list = [],
          html = '';

        //parameter CSS
        var width = $(selectParent).width();

        $(selectParent).hide();
        if ($(selectParent).children('option').length == 0) { return; }
        $(selectParent).children('option').each(function () {
          if ($(this).is(':selected')) { s = 1; title = $(this).text(); } else { s = 0; }
          list.push({
            value: $(this).attr('value'),
            text: $(this).text(),
            selected: s,
          })
        })

        // style
        var style = " background: " + settings.backgroundColor + "; color: " + settings.color + " ";

        html += "<ul class='selectCF'>";
        html += "<li>";
        html += "<span class='arrowCF ion-chevron-right' style='" + style + "'></span>";
        html += "<span class='titleCF' style='" + style + "; width:" + width + "px'>" + title + "</span>";
        html += "<span class='searchCF' style='" + style + "; width:" + width + "px'><input style='color:" + settings.color + "' /></span>";
        html += "<ul>";
        $.each(list, function (k, v) {
          s = (v.selected == 1) ? "selected" : "";
          html += "<li value=" + v.value + " class='" + s + "'>" + v.text + "</li>";
        })
        html += "</ul>";
        html += "</li>";
        html += "</ul>";
        $(selectParent).after(html);
        var customSelect = $(this).next('ul.selectCF'); // add Html
        var seachEl = $(this).next('ul.selectCF').children('li').children('.searchCF');
        var seachElOption = $(this).next('ul.selectCF').children('li').children('ul').children('li');
        var seachElInput = $(this).next('ul.selectCF').children('li').children('.searchCF').children('input');

        // handle active select
        $(customSelect).unbind('click').bind('click', function (e) {
          e.stopPropagation();
          if ($(this).hasClass('onCF')) {
            elActive = '';
            $(this).removeClass('onCF');
            $(this).removeClass('searchActive'); $(seachElInput).val('');
            $(seachElOption).show();
          } else {
            if (elActive != '') {
              $(elActive).removeClass('onCF');
              $(elActive).removeClass('searchActive'); $(seachElInput).val('');
              $(seachElOption).show();
            }
            elActive = $(this);
            $(this).addClass('onCF');
            $(seachEl).children('input').focus();
          }
        })

        // handle choose option
        var optionSelect = $(customSelect).children('li').children('ul').children('li');
        $(optionSelect).bind('click', function (e) {
          var value = $(this).attr('value');
          if ($(this).hasClass('selected')) {
            //
          } else {
            $(optionSelect).removeClass('selected');
            $(this).addClass('selected');
            $(customSelect).children('li').children('.titleCF').html($(this).html());
            $(selectParent).val(value);
            settings.change.call(selectParent); // call event change
          }
        })

        // handle search 
        $(seachEl).children('input').bind('keyup', function (e) {
          var value = $(this).val();
          if (value) {
            $(customSelect).addClass('searchActive');
            $(seachElOption).each(function () {
              if ($(this).text().search(new RegExp(value, "i")) < 0) {
                // not item
                $(this).fadeOut();
              } else {
                // have item
                $(this).fadeIn();
              }
            })
          } else {
            $(customSelect).removeClass('searchActive');
            $(seachElOption).fadeIn();
          }
        })

      });
    };
    $(document).click(function () {
      if (elActive != '') {
        $(elActive).removeClass('onCF');
        $(elActive).removeClass('searchActive');
      }
    })
  }(jQuery));

  $(function () {
    var event_change = $('#event-change');
    $(".select").selectCF({
      change: function () {
        var value = $(this).val();
        var text = $(this).children('option:selected').html();
        console.log(value + ' : ' + text);
        event_change.html(value + ' : ' + text);
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons = document.getElementsByClassName("accordeon__button");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons.length; i++) {
    var accordeonButton = accordeonButtons[i];

    accordeonButton.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons.length; i++) {
      accordeonButtons[i].className = "accordeon__button closed";
    }

    // закрываем все открытые панели с текстом
    var pannels = document.getElementsByClassName("accordeon__panel");
    for (var z = 0; z < pannels.length; z++) {
      pannels[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass == "accordeon__button closed") {
      this.className = "accordeon__button active";
      var panel = this.nextElementSibling;
      panel.style.maxHeight = panel.scrollHeight + "1px";
    }

  }
});

function filterCities() {
  let input = document.querySelector('.search-box').value.toLowerCase();
  let cities = document.querySelectorAll('.city');
  let groups = document.querySelectorAll('.city-group');

  cities.forEach(city => {
    if (city.textContent.toLowerCase().includes(input)) {
      city.style.display = "block";
    } else {
      city.style.display = "none";
    }
  });

  groups.forEach(group => {
    let visibleCities = group.querySelectorAll('.city[style="display: block;"]');
    if (visibleCities.length > 0) {
      group.style.display = "block";
    } else {
      group.style.display = "none";
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  $('.articmodal-close').click(function (e) {
    $.arcticmodal('close');

  });
  $('.a1').click(function (e) {
    e.preventDefault();
    $('#popup-call').arcticmodal({
    });
  });
  $('.a2').click(function (e) {
    e.preventDefault();
    $('#popup-call2').arcticmodal({
    });
  });
  $('.a3, .nav__city').click(function (e) {
    e.preventDefault();
    $('#popup-call3').arcticmodal({
    });
  });
  $('.calc__order').click(function (e) {
    e.preventDefault();
    $('#popup-call4').arcticmodal({
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 1199) {
    let menuItems = document.querySelectorAll(".menu a");

    menuItems.forEach(item => {
      item.addEventListener("click", function (event) {
        let submenu = this.nextElementSibling;

        if (submenu && (submenu.tagName === "UL" || submenu.classList.contains("menu__wrap"))) {
          event.preventDefault();

          if (!submenu.classList.contains("submenu-active")) {
            submenu.classList.add("submenu-active");
            this.classList.add("active");

            let parentMenu = this.closest("ul") || this.closest(".menu__wrap");
            parentMenu.classList.add("submenu-active");
            parentMenu.querySelectorAll(":scope > li > a").forEach(link => {
              if (link !== this) {
                link.classList.add("hidden");
              }
            });

            submenu.querySelectorAll(".back").forEach(btn => btn.remove());
            let backButton = document.createElement("div");
            backButton.classList.add("back");
            backButton.textContent = "Назад";
            submenu.prepend(backButton);

            backButton.addEventListener("click", function (event) {
              event.stopPropagation();
              submenu.classList.remove("submenu-active");
              submenu.querySelectorAll(".submenu-active").forEach(sub => sub.classList.remove("submenu-active"));
              submenu.querySelectorAll(".active").forEach(activeItem => activeItem.classList.remove("active"));
              item.classList.remove("active");

              if (parentMenu.classList.contains("menu__wrap")) {
                parentMenu.classList.remove("submenu-active");
              }
              parentMenu.querySelectorAll(":scope > li > a").forEach(link => {
                link.classList.remove("hidden");
              });
              backButton.remove();
            });
          }
        }
      });
    });
  }

  document.querySelectorAll(".menu ul ul, .menu__wrap").forEach(submenu => {
    submenu.classList.add("nested-menu");
  });
});
$(document).ready(function () {
  // Наведение на меню первого уровня
  $('.menuu li').on('mouseenter', function () {
    const myvar = this.id;

    // Скрыть все вторые уровни
    $('.mydiv').removeClass('flex').addClass('hidden');

    // Показать нужный второй уровень
    $('#div' + myvar).removeClass('hidden').addClass('flex');

    // Активировать пункт первого уровня
    $('.menuu li').removeClass('active');
    $(this).addClass('active');

    // Добавляем shadow и скрываем nav__bottom, если это не последний li и не .more__block
    if (!$('.more__block:hover').length && !$(this).is(':last-child')) {
      $('.nav__center').addClass('shadow');
      $('.nav__bottom').addClass('hidden');
    }
  });
  $('.mydiv li[class^="content"]').on('mouseenter', function () {
    const current = $(this);
    const contentClass = this.className.match(/content\d+/)[0];
    const currentWrap = $('#' + contentClass);
    const currentThird = $('#content' + contentClass.substring(7));

    // Убираем active со всех пунктов второго уровня и скрываем все меню третьего уровня
    $('.mydiv li[class^="content"]').each(function () {
      if (this !== current[0]) {
        $(this).removeClass('active');
        const otherClass = this.className.match(/content\d+/)[0];
        $('#' + otherClass).removeClass('flex').addClass('hidden');
        $('#content' + otherClass.substring(7)).removeClass('flex').addClass('hidden');
      }
    });

    // Активируем текущий
    current.addClass('active');
    currentWrap.removeClass('hidden').addClass('flex');
    currentThird.removeClass('hidden').addClass('flex');
  });


  // Сброс активных при уходе мыши с блока nav__center
  $('.nav__center').on('mouseleave', function () {
    $('.menuu li').removeClass('active');
    $('.mydiv').removeClass('flex').addClass('hidden');
    $('.menu__wrap').removeClass('flex').addClass('hidden');
    $('.nav__center').removeClass('shadow');
    $('.nav__bottom').removeClass('hidden');
    $('.mydiv li').removeClass('active');
  });

  // Поддержка состояния shadow при уходе мыши с первого уровня
  $('.menuu').on('mouseleave', function () {
    if ($('.menuu li.active').length === 0 && !$('.more__block:hover').length) {
      $('.nav__center').removeClass('shadow');
      $('.nav__bottom').removeClass('hidden');
    }
  });

  // Исключаем появление shadow при наведении на .more__block
  $('.more__block').on('mouseenter', function () {
    $('.nav__center').removeClass('shadow');
    $('.nav__bottom').removeClass('hidden');
  });

  // Восстановление shadow, если мышь покидает .more__block и есть активные пункты
  $('.more__block').on('mouseleave', function () {
    if ($('.menuu li.active').length > 0) {
      $('.nav__center').addClass('shadow');
      $('.nav__bottom').addClass('hidden');
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  let menuBtn5 = document.querySelector('.menu-btn5');
  let menu5 = document.querySelector('.menu5');
  menuBtn5.addEventListener('click', function () {
    menuBtn5.classList.toggle('active');
    menu5.classList.toggle('active');
  });
});
document.addEventListener('DOMContentLoaded', function () {
  // Кнопки "вперед"
  $('.calc__btn_one').click(function () {
    $('.calc__one').hide();
    $('.calc__two').fadeIn();
    return false;
  });

  $('.calc__btn_two').click(function () {
    $('.calc__two').hide();
    $('.calc__three').fadeIn();
    return false;
  });

  $('.calc__btn_one2').click(function () {
    $('.calc__one').hide();
    $('.calc__two2').fadeIn();
    return false;
  });

  $('.calc__btn_two2').click(function () {
    $('.calc__two2').hide();
    $('.calc__three2').fadeIn();
    return false;
  });

  $('.calc__btn_one3').click(function () {
    $('.calc__one').hide();
    $('.calc__two3').fadeIn();
    return false;
  });

  $('.calc__btn_two3').click(function () {
    $('.calc__two3').hide();
    $('.calc__three3').fadeIn();
    return false;
  });

  $('.calc__btn_one4').click(function () {
    $('.calc__one').hide();
    $('.calc__two4').fadeIn();
    return false;
  });

  $('.calc__btn_two4').click(function () {
    $('.calc__two4').hide();
    $('.calc__three4').fadeIn();
    return false;
  });

  $('.calc__btn_one5').click(function () {
    $('.calc__one').hide();
    $('.calc__two5').fadeIn();
    return false;
  });

  $('.calc__btn_two5').click(function () {
    $('.calc__two5').hide();
    $('.calc__three5').fadeIn();
    return false;
  });

  // Кнопки "назад"
  $('.calc__two .calc__prev').click(function () {
    $('.calc__two').hide();
    $('.calc__one').fadeIn();
    return false;
  });

  $('.calc__three .calc__prev').click(function () {
    $('.calc__three').hide();
    $('.calc__two').fadeIn();
    return false;
  });

  $('.calc__two2 .calc__prev').click(function () {
    $('.calc__two2').hide();
    $('.calc__one').fadeIn();
    return false;
  });

  $('.calc__three2 .calc__prev').click(function () {
    $('.calc__three2').hide();
    $('.calc__two2').fadeIn();
    return false;
  });

  $('.calc__two3 .calc__prev').click(function () {
    $('.calc__two3').hide();
    $('.calc__one').fadeIn();
    return false;
  });

  $('.calc__three3 .calc__prev').click(function () {
    $('.calc__three3').hide();
    $('.calc__two3').fadeIn();
    return false;
  });

  $('.calc__two4 .calc__prev').click(function () {
    $('.calc__two4').hide();
    $('.calc__one').fadeIn();
    return false;
  });

  $('.calc__three4 .calc__prev').click(function () {
    $('.calc__three4').hide();
    $('.calc__two4').fadeIn();
    return false;
  });

  $('.calc__two5 .calc__prev').click(function () {
    $('.calc__two5').hide();
    $('.calc__one').fadeIn();
    return false;
  });

  $('.calc__three5 .calc__prev').click(function () {
    $('.calc__three5').hide();
    $('.calc__two5').fadeIn();
    return false;
  });
});
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".calc__area").forEach(area => {
    const checkbox = area.querySelector(".form-check-input");
    const inputBlock = area.querySelector(".calc__input");

    // Проверяем, существуют ли элементы перед обработкой
    if (!checkbox || !inputBlock) return;

    // Начальное состояние
    inputBlock.style.display = checkbox.checked ? "block" : "none";

    // Обработчик клика
    checkbox.addEventListener("change", function () {
      inputBlock.style.display = this.checked ? "block" : "none";
    });
  });
});




document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".calc__one .calc__buttons p").forEach(function (elem) {
    elem.addEventListener("click", function () {
      document.querySelector(".menu5__scroll").style.overflowY = "hidden";
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".back").forEach(function (elem) {
    elem.addEventListener("click", function () {
      document.querySelector(".menu5__scroll").style.overflowY = "auto";
    });
  });
});
$(document).ready(function () {
  $('.footer__item p').click(function () {
    var $this = $(this);
    var $ul = $this.next('ul');

    $ul.slideToggle();
    $this.toggleClass('active');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $('[data-submit]').on('click', function (e) {
      e.preventDefault();
      $(this).parents('form').submit();
    })
    $.validator.addMethod(
      "regex",
      function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "Please check your input."
    );
    function valEl(el) {

      el.validate({
        rules: {
          tel: {
            required: true,
            regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$'
          },
          name: {
            required: true
          },
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          tel: {
            required: 'Заполните поле',
            regex: 'Телефон может содержать символы + - ()'
          },
          name: {
            required: 'Заполните поле',
          },
          text: {
            required: 'Заполните поле',
          },
          email: {
            required: 'Заполните поле',
            email: 'Неверный формат E-mail'
          }
        },
        submitHandler: function (form) {
          $('#loader').fadeIn();
          var $form = $(form);
          var $formId = $(form).attr('id');
          switch ($formId) {
            case 'popupResult':
              $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
              })
                .always(function (response) {
                  setTimeout(function () {
                    $('#loader').fadeOut();
                  }, 800);
                  setTimeout(function () {
                    $.arcticmodal('close');
                    $('#popup-thank').arcticmodal({});
                    $form.trigger('reset');
                    //строки для остлеживания целей в Я.Метрике и Google Analytics
                  }, 1100);

                });
              break;
          }
          return false;
        }
      })
    }

    $('.js-form').each(function () {
      valEl($(this));
    });
    $('[data-scroll]').on('click', function () {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'data-scroll')).offset().top
      }, 2000);
      event.preventDefault();
    })
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const swiper1 = new Swiper('.swiper1', {
    slidesPerView: 3,
    spaceBetween: 8,
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 8,
        slidesPerView: 3
      }
    }
  });
  const swiper2 = new Swiper('.swiper2', {
    slidesPerView: 4,
    spaceBetween: 8,
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 8,
        slidesPerView: 4
      }
    }
  });
  const swiper3 = new Swiper('.swiper3', {
    slidesPerView: 2,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next3',
      prevEl: '.swiper-button-prev3',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 10,
        slidesPerView: 2
      }
    }
  });
  const swiper4 = new Swiper('.swiper_item1', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item1',
      prevEl: '.swiper-button-prev_item1',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper5 = new Swiper('.swiper_item2', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item2',
      prevEl: '.swiper-button-prev_item2',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper6 = new Swiper('.swiper_item3', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item3',
      prevEl: '.swiper-button-prev_item3',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper7 = new Swiper('.swiper_item4', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item4',
      prevEl: '.swiper-button-prev_item4',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper = new Swiper(".swiper_rev", {
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    speed: 600,
    pagination: {
      el: ".swiper-pagination_rev",
      clickable: true,
      bulletClass: "swiper-pagination-bullet-custom",
      bulletActiveClass: "swiper-pagination-bullet-custom--active",
      renderBullet: function (index, className) {
        return `
                   <span class="${className}">
                       ${index + 1}
                       <span class="bullet-progress">
                           <svg viewBox="0 0 50 50">
                               <rect x="2" y="2" width="44" height="44" rx="8" ry="8"/>
                           </svg>
                       </span>
                   </span>`;
      },
      clickable: true
    },
    on: {
      init: function () {
        setTimeout(() => {
          const firstBullet = document.querySelector(".swiper-pagination-bullet-custom--active .bullet-progress rect");
          if (firstBullet) {
            firstBullet.style.transition = "stroke-dashoffset 6s linear";
            firstBullet.style.strokeDashoffset = "0";
          }
        }, 50);
      },
      slideChangeTransitionStart: function () {
        document.querySelectorAll(".bullet-progress rect").forEach(rect => {
          rect.style.transition = "none";
          rect.style.strokeDashoffset = "184";
        });

        setTimeout(() => {
          const activeBullet = document.querySelector(".swiper-pagination-bullet-custom--active .bullet-progress rect");
          if (activeBullet) {
            activeBullet.style.transition = "stroke-dashoffset 6s linear";
            activeBullet.style.strokeDashoffset = "0";
          }
        }, 50);
      }
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.serv__block').forEach(block => {
    const toggleButton = block.querySelector('.toggle-button');
    const content = block.querySelector('.serv__info');
    // const contentWrapper = block.querySelector('.content-wrapper');

    toggleButton.addEventListener('click', function () {
      content.classList.toggle('expanded');
      // contentWrapper.classList.toggle('expanded');
      toggleButton.textContent = content.classList.contains('expanded') ? 'Свернуть' : 'Раскрыть все';
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const sliderContainer = document.querySelector('.slider-container');
  const sliderTrack = document.querySelector('.slider-track');
  const sliderThumb = document.querySelector('.slider-thumb');
  const sliderFill = document.querySelector('.slider-fill');
  const sliderValue = document.querySelector('.slider-value');
  const maxValue = 100;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = sliderTrack.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let percent = Math.max(0, Math.min(offsetX / rect.width, 1));
    let value = Math.round(percent * maxValue);

    sliderThumb.style.left = `${percent * 100}%`;
    sliderFill.style.width = `${percent * 100}%`;
    sliderValue.textContent = value;
  }

  sliderThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      updateSlider(e.clientX);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // svg
  $(function () {
    jQuery('img.svg').each(function () {
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, else we gonna set it if we can.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

      }, 'xml');

    });
  });
});
