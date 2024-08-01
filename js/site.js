'use strict';

/* global variables: */

var site_vars = {
  /* control container elements: */
  'el_content_control': document.getElementById('content_control'),
  'el_content_control_close': document.getElementById('content_control_close_click'),
  'el_content_control_menu_img': document.getElementById('content_control_menu_img'),
  /* content container element: */
  'el_content_container': document.getElementById('content_container'),
};

/* functions */

/* functions to set and retrieve cookis. borrowed from 23 schools: */
function set_cookie(cookie_name, cookie_value, expire_days) {
  const d = new Date();
  d.setTime(d.getTime() + (expire_days * 24 * 60 * 60 * 1000));
  let expires = 'expires='+ d.toUTCString();
  document.cookie = cookie_name + '=' + cookie_value + ';' + expires +
                    ';path=/';
}
function get_cookie(cookie_name) {
  let name = cookie_name + '=';
  let decoded_cookie = decodeURIComponent(document.cookie);
  let ca = decoded_cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/* function to toggle control element visibility: */
function content_control_toggle() {
  /* control container elements: */
  var content_control = site_vars['el_content_control'];
  var content_control_close = site_vars['el_content_control_close'];
  var content_control_menu_img = site_vars['el_content_control_menu_img'];
  /* plot container element: */
  var content_container = site_vars['el_content_container'];
  /* get control flex basis and display values: */
  var control_basis = content_control.style.flexBasis;
  var control_display = content_control.style.display;
  /* get stored controls_hidden value: */
  var controls_hidden = parseInt(get_cookie('controls_hidden'));
  /* if controls are not visible: */
  if ((control_basis == '0%') ||
      ((control_basis == '0%') && (controls_hidden == 10)) ||
      ((control_display == '') && (controls_hidden == 10))) {
    /* show the controls: */
    content_control_menu_img.style.width = '0em';
    content_control.style.marginRight = '0.5em';
    content_control.style.minWidth = '13em';
    content_container.style.flexBasis = '80%';
    content_control.style.flexBasis = '20%';
    content_control_close.style.color = '';
    content_control.style.display = 'inline';
    set_cookie('controls_hidden', 0, 1 / 24);
  } else if (controls_hidden != 10) {
    /* hide the controls: */
    content_control_close.style.color = 'rgba(255, 255, 255, 0)';
    content_control.style.flexBasis = '0%';
    content_container.style.flexBasis = '100%';
    content_control.style.minWidth = '0em';
    content_control.style.marginRight = '0em';
    content_control_menu_img.style.width = '1.5em';
    content_control.style.display = 'none';
    set_cookie('controls_hidden', 1, 1 / 24);
  };
  /* reset stored value, if required: */
  if ((controls_hidden == 10) || (controls_hidden == 11)) {
    controls_hidden -= 10;
    set_cookie('controls_hidden', controls_hidden, 1 / 24);
  };
};

/* page loading / set up function: */
function load_page() {
  /* show / hide menu ... get stored value: */
  var controls_hidden = parseInt(get_cookie('controls_hidden'));
  controls_hidden += 10;
  /* if no stored setting: */
  if ((controls_hidden != 10) && (controls_hidden != 11)) {
    /* if window is less than 800px, initially hide controls: */
    if (document.body.clientWidth < 800) {
      controls_hidden = 11;
    /* else, show the controls: */
    } else {
      controls_hidden = 10;
    };
  };
  /* update stored value and toggle: */
  set_cookie('controls_hidden', controls_hidden, 1 / 24);
  content_control_toggle();
};

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* set up the page ... : */
  load_page();
});
