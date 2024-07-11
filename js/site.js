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

/* function to toggle control element visibility: */
function content_control_toggle() {
  /* control container elements: */
  var content_control = site_vars['el_content_control'];
  var content_control_close = site_vars['el_content_control_close'];
  var content_control_menu_img = site_vars['el_content_control_menu_img'];
  /* content container element: */
  var content_container = site_vars['el_content_container'];
  /* get control flex basis value: */
  var control_basis = content_control.style.flexBasis;
  /* if controls are not visible: */
  if (control_basis == '0%') {
    /* show the controls: */
    content_control_menu_img.style.width = '0em';
    content_control.style.marginRight = '0.5em';
    content_control.style.minWidth = '13em';
    content_container.style.flexBasis = '80%';
    content_control.style.flexBasis = '20%';
    content_control_close.style.color = '';
  } else {
    /* hide the controls: */
    content_control_close.style.color = 'rgba(255, 255, 255, 0)';
    content_control.style.flexBasis = '0%';
    content_container.style.flexBasis = '100%';
    content_control.style.minWidth = '0em';
    content_control.style.marginRight = '0em';
    content_control_menu_img.style.width = '1.5em';
  };
};

/* page loading / set up function: */
function load_page() {
  /* if window is less than 800px, initially hide controls: */
  if (document.body.clientWidth < 800) {
    content_control_toggle();
  };
};

/** add listeners: **/

/* on page load: */
window.addEventListener('load', function() {
  /* set up the page ... : */
  load_page();
});
