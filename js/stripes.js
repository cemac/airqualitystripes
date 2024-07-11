'use strict';

/* global variables: */

var site_vars = {
  /* base page title: */
  'page_title': 'AQ stripes',
  /* control container elements: */
  'el_content_control': document.getElementById('content_control'),
  'el_content_control_close': document.getElementById('content_control_close_click'),
  'el_content_control_menu_img': document.getElementById('content_control_menu_img'),
  /* select elements: */
  'country_sel': document.getElementById('plot_control_country'),
  'city_sel': document.getElementById('plot_control_city'),
  /* plot selection element: */
  'el_content_plot_select': document.getElementById('content_plot_select'),
  /* plot selection images: */
  'img_plot_select': 'img/control/select.png',
  'img_plot_selected': 'img/control/selected.png',
  'img_bar_select': 'img/control/bar_select.png',
  'img_bar_selected': 'img/control/bar_selected.png',
  'img_info_select': 'img/control/info_select.png',
  'img_info_selected': 'img/control/info_selected.png',
  'img_line_select': 'img/control/line_select.png',
  'img_line_selected': 'img/control/line_selected.png',
  'img_stripes_select': 'img/control/stripes_select.png',
  'img_stripes_selected': 'img/control/stripes_selected.png',
  /* plot container element: */
  'el_content_plot': document.getElementById('content_plot'),
  /* plot image element: */
  'el_content_plot_img': document.getElementById('content_plot_img'),
  /* data file to load: */
  'data_dir': 'data/',
  'data_file': 'aq_data.json',
  /* plots directory: */
  'plots_dir': 'https://gws-access.jasmin.ac.uk/public/aq_stripes',
  /* countries and cities data: */
  'countries': null,
  'cities': null,
  'city_data': null,
  /* selected country and city: */
  'country': null,
  'city': null,
  /* selected plot: */
  'plot_index': null
};

/* functions */

/*
 * function to get GET variables
 * see: https://stackoverflow.com/a/12049737
 */
function get_get_vars() {
 /* init _GET variable: */
 var get_vars = {};
 /* check for any URL parameters: */
 if (document.location.toString().indexOf('?') !== -1) {
   /* extract URL parameters: */
   var doc_url = document.location.toString()
   var url_pars = doc_url.replace(/^.*?\?/, '').replace(/#.*$/, '').split('&');
   /* loop through parameters, and add to _GET: */
   for(var i = 0; i < url_pars.length; i++) {
     var url_par = decodeURIComponent(url_pars[i]).split('=');
     get_vars[url_par[0]] = url_par[1];
   };
 };
 /* return the GET variables: */
 return get_vars;
};

/* update plot selection icons: */
function update_plot_selects() {
  /* get plot information for selected city: */
  var city_data = site_vars['city_data'];
  var plots = city_data['plots'];
  var plots_count = plots.length;
  /* get selected plot index: */
  var plot_index = site_vars['plot_index'];
  /* plot selection element: */
  var content_plot_select = site_vars['el_content_plot_select'];
  /* clear out html: */
  var content_plot_select_html = '';
  /* for each available plot, add icon img: */
  var img_plot_select = site_vars['img_plot_select'];
  var img_plot_selected = site_vars['img_plot_selected'];
  var img_bar_select = site_vars['img_bar_select'];
  var img_bar_selected = site_vars['img_bar_selected'];
  var img_info_select = site_vars['img_info_select'];
  var img_info_selected = site_vars['img_info_selected'];
  var img_line_select = site_vars['img_line_select'];
  var img_line_selected = site_vars['img_line_selected'];
  var img_stripes_select = site_vars['img_stripes_select'];
  var img_stripes_selected = site_vars['img_stripes_selected'];
  for (var i = 0 ; i < plots_count ; i++) {
    /* get plot name: */
    var this_plot = plots[i];
    /* default plot icons: */
    var img_select = img_plot_select;
    var img_selected = img_plot_selected;
    var img_title = '';
    /* check for type and select appropriate icon: */
    if (this_plot.indexOf('summary_statistics') > -1) {
      var img_select = img_info_select;
      var img_selected = img_info_selected;
      var  img_title = 'Info';
    } else if (this_plot.indexOf('absolute_bar') > -1) {
      var img_select = img_bar_select;
      var img_selected = img_bar_selected;
      var  img_title = 'Bars';
    } else if (this_plot.indexOf('aq_stripes_withline') > -1) {
      var img_select = img_line_select;
      var img_selected = img_line_selected;
      var  img_title = 'Stripes with colour bar';
    } else if (this_plot.indexOf('aq_stripes') > -1) {
      var img_select = img_stripes_select;
      var img_selected = img_stripes_selected;
      var  img_title = 'Air pollution stripes';
    };
    /* check if this is selected plot: */
    if (i == plot_index) {
      content_plot_select_html += '<img src="' + img_selected +
                                  '" class="img_plot_selected" ' +
                                  'title="' + img_title + '">';
    } else {
      content_plot_select_html += '<img src="' + img_select +
                                  '" class="img_plot_select" ' +
                                  'onclick="update_plot(' + i + ')" ' +
                                  'title="' + img_title + '">';
    };
  };
  /* update html: */
  content_plot_select.innerHTML = content_plot_select_html;
};

/* update city information: */
function update_city() {
  /* get country and city from site variables: */
  var country = site_vars['country'];
  var city = site_vars['city'];
  /* get cities for this country: */
  var cities = [];
  for (var i in site_vars['cities'][country]) {
    cities.push(i);
  };
  /* get select element: */
  var city_sel = site_vars['city_sel'];
  /* get selected city, if possible: */
  if (city_sel.selectedIndex < 0) {
    var city_selected = undefined;
  } else {
    var city_selected = city_sel.options[city_sel.selectedIndex].value;
  };
  /* check for city in get variables: */
  var get_city = site_vars['get_vars']['city'];
  if ((get_city != undefined) && (get_city != null) &&
      (cities.indexOf(get_city) > -1)) {
    city = get_city;
    get_city = true;
  };
  /* wipe out get vars: */
  site_vars['get_vars']['country'] = undefined;
  site_vars['get_vars']['city'] = undefined;
  /* if stored city is defined the same as selected, return: */
  if ((city != null) && (city != undefined) &&
      (city == city_selected)) {
    return;
  } else if (get_city != true) {
    city = city_selected;
  };
  /* if city is not recognised or defined ... : */
  if ((cities.indexOf(city) < 0) || (city == null) ||
      (city == undefined)) {
    /* invalid city, pick one at random: */
    var city_index = Math.floor(Math.random() * cities.length);
    city = cities[city_index];
  };
  /* add city select html: */
  var my_html = '';
  for (var i = 0; i < cities.length; i++) {
    var my_city = cities[i];
    my_html += '<option value="' + my_city + '"';
    if (my_city == city) {
      my_html += ' selected';
    };
    my_html += '>' + my_city + '</option>';
  };
  city_sel.innerHTML = my_html;
  /* store selected city and data: */
  site_vars['city'] = city;
  site_vars['city_data'] = site_vars['cities'][country][city];
  /* check for stored plot index, else set to 0: */
  var plot_index = site_vars['plot_index'];
  if ((plot_index == null) || (plot_index == undefined)) {
    plot_index = 0;
    site_vars['plot_index'] = plot_index;
  };
  /* update plot select icons: */
  update_plot_selects();
  /* update plots: */
  display_plots();
};

/* update country information: */
function update_country() {
  /* get country value from site variables: */
  var country = site_vars['country'];
  /* get country data: */
  var countries = site_vars['countries'];
  countries.sort();
  /* get select elements: */
  var country_sel = site_vars['country_sel'];
  /* get selected country, if possible: */
  if (country_sel.selectedIndex < 0) {
    var country_selected = undefined;
  } else {
    var country_selected = country_sel.options[country_sel.selectedIndex].value;
  };
  /* check for country in get variables: */
  var get_country = site_vars['get_vars']['country'];
  if ((get_country != undefined) && (get_country != null) &&
      (countries.indexOf(get_country) > -1)) {
    country = get_country;
    get_country = true;
  };
  /* if stored country is defined and the same as selected, return: */
  if ((country != null) && (country != undefined) &&
      (country == country_selected)) {
    return;
  /* else, use selected value, unless we have a valid country from get: */
  } else if (get_country != true) {
    country = country_selected;
  };
  /* if country is not recognised or defined ... : */
  if ((countries.indexOf(country) < 0) || (country == null) ||
      (country == undefined)) {
    /* invalid country, pick one at random: */
    var country_index = Math.floor(Math.random() * countries.length);
    country = countries[country_index];
  };
  /* add country select html: */
  var my_html = '';
  for (var i = 0; i < countries.length; i++) {
    var my_country = countries[i];
    my_html += '<option value="' + my_country + '"';
    if (my_country == country) {
      my_html += ' selected';
    };
    my_html += '>' + my_country + '</option>';
  };
  country_sel.innerHTML = my_html;
  /* store selected country: */
  site_vars['country'] = country;
  /* update city information: */
  site_vars['city'] = undefined;
  update_city();
};

/* function to display plots */
function display_plots() {
  /* get country and city from site variables: */
  var country = site_vars['country'];
  var city = site_vars['city'];
  /* if country is not defined, update: */
  if ((country == null) || (country == undefined)) {
     update_country();
  };
  /* if city is not defined, update: */
  if ((city == null) || (city == undefined)) {
     update_city();
  };
  /* re-get country and city from site variables: */
  country = site_vars['country'];
  city = site_vars['city'];
  /* log message: */
  console.log('selected country: ' + country + ', selected city: ' + city);
  /* get plot data for this city: */
  var city_data = site_vars['city_data'];
  var plots_dir = site_vars['plots_dir'] + '/' +  city_data['plots_dir'];
  var plots = city_data['plots'];
  var plots_count = plots.length;
  /* display selected plot index: */
  var plot_index = site_vars['plot_index'];
  var plot_el = site_vars['el_content_plot_img'];
  plot_el.src = plots_dir + '/' + plots[plot_index];
  /* update page title: */
  var page_title = site_vars['page_title'];
  document.title = page_title + ' - ' + city + ', ' + country;
};

/* function to update plot by index: */
function update_plot(plot_index) {
  /* if no plot index, return: */
  if ((plot_index == null) || (plot_index == undefined)) {
    return;
  };
  /* check plot index is valid: */
  var city_data = site_vars['city_data'];
  var plots = city_data['plots'];
  var plots_count = plots.length;
  if ((plot_index < 0) || (plots_count <= plot_index)) {
    return;
  };
  /* store plot index: */
  site_vars['plot_index'] = plot_index;
  /* update plots: */
  display_plots();
  /* update plot selection icons: */
  update_plot_selects();
};

/* function to load site data: */
async function load_data() {
  /* data file to load: */
  var data_dir = site_vars['data_dir'];
  var data_file = site_vars['data_file'];
  var data_url = data_dir + '/' + data_file;
  /* get data using fetch: */
  await fetch(data_url, {'cache': 'no-cache'}).then(async function(data_req) {
    /* if successful: */
    if (data_req.status == 200) {
      /* store json information from request: */
      var aq_data = await data_req.json();
      site_vars['countries'] = aq_data['countries'];
      site_vars['cities'] = aq_data['cities'];
      /* display plots: */
      display_plots();
    } else {
      /* log error: */
      console.log('* failed to load data from file: ' + data_file);
    };
  });
};

/* function to toggle control element visibility: */
function content_control_toggle() {
  /* control container elements: */
  var content_control = site_vars['el_content_control'];
  var content_control_close = site_vars['el_content_control_close'];
  var content_control_menu_img = site_vars['el_content_control_menu_img'];
  /* plot container element: */
  var content_plot = site_vars['el_content_plot'];
  /* get control flex basis value: */
  var control_basis = content_control.style.flexBasis;
  /* if controls are not visible: */
  if (control_basis == '0%') {
    /* show the controls: */
    content_control_menu_img.style.width = '0em';
    content_control.style.marginRight = '0.5em';
    content_control.style.minWidth = '13em';
    content_plot.style.flexBasis = '80%';
    content_control.style.flexBasis = '20%';
    content_control_close.style.color = '';
  } else {
    /* hide the controls: */
    content_control_close.style.color = 'rgba(255, 255, 255, 0)';
    content_control.style.flexBasis = '0%';
    content_plot.style.flexBasis = '100%';
    content_control.style.minWidth = '0em';
    content_control.style.marginRight = '0em';
    content_control_menu_img.style.width = '1.5em';
  };
};

/* page loading / set up function: */
function load_page() {
  /* get get vars: */
  site_vars['get_vars'] = get_get_vars();
  /* load data: */
  load_data();
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

/* select listeners: */
site_vars['country_sel'].addEventListener('change', update_country);
site_vars['city_sel'].addEventListener('change', update_city);
