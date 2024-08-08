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
  'continent_sel': document.getElementById('plot_control_continent'),
  'country_sel': document.getElementById('plot_control_country'),
  'city_sel': document.getElementById('plot_control_city'),
  /* plot selection element: */
  'el_content_plot_select': document.getElementById('content_plot_select'),
  /* plot selection images: */
  'img_plot_select': '../img/control/select.png',
  'img_plot_selected': '../img/control/selected.png',
  'img_bar_select': '../img/control/bar_select.png',
  'img_bar_selected': '../img/control/bar_selected.png',
  'img_info_select': '../img/control/info_select.png',
  'img_info_selected': '../img/control/info_selected.png',
  'img_line_select': '../img/control/line_select.png',
  'img_line_selected': '../img/control/line_selected.png',
  'img_stripes_select': '../img/control/stripes_select.png',
  'img_stripes_selected': '../img/control/stripes_selected.png',
  /* plot container element: */
  'el_content_plot': document.getElementById('content_plot'),
  /* plot image element: */
  'el_content_plot_img': document.getElementById('content_plot_img'),
  /* data file to load: */
  'data_dir': '../data/',
  'data_file': 'aq_data.json',
  /* plots directory: */
  'plots_dir': 'https://cemac.github.io/airqualitystripes-plots',
  /* plot names: */
  'plot_names': ['stripes', 'line', 'bar', 'info'],
  /* continents, countries and cities data: */
  'continents': null,
  'countries': null,
  'all_countries': null,
  'cities': null,
  'all_cities': null,
  'city_data': null,
  /* get variables: */
  'get_vars': null
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
  set_cookie('plot_index', plot_index, 1 / 24);
  /* update plots: */
  update_location();
};

/* update plot selection icons: */
function update_plot_selects() {
  /* get plot information for selected city: */
  var city_data = site_vars['city_data'];
  var plots = city_data['plots'];
  var plots_count = plots.length;
  /* get selected plot index: */
  var plot_index = parseInt(get_cookie('plot_index'));
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

function update_location() {
  /* get values from get variables: */
  var get_continent = site_vars['get_vars']['continent'];
  var get_country = site_vars['get_vars']['country'];
  var get_city = site_vars['get_vars']['city'];
  var get_plot = site_vars['get_vars']['plot']
  if (get_plot != undefined) {
    get_plot = get_plot.toLowerCase();
  };
  /* wipe out get variables: */
  site_vars['get_vars'] = {};
  /* get select elements: */
  var continent_sel = site_vars['continent_sel'];
  var country_sel = site_vars['country_sel'];
  var city_sel = site_vars['city_sel'];
  /* init selected locations as null: */
  var sel_continent = null;
  var sel_country = null;
  var sel_city = null;
  /* init location values as null: */
  var continent = null;
  var city = null;
  var country = null;
  var city = null;
  /* check get vars for valid city: */
  if (site_vars['all_cities'][get_city] != undefined) {
    /* get all location values from city: */
    continent = site_vars['all_cities'][get_city]['continent'];
    country = site_vars['all_cities'][get_city]['country'];
    city = get_city;
  /* else check for valid country: */
  } else if (site_vars['all_countries'][get_country] != undefined) {
    /* get continent and country location values from country: */
    continent = site_vars['all_countries'][get_country]['continent'];
    country = get_country;
  /* else check for valid continent: */
  } else if (site_vars['continents'].indexOf(get_continent) > -1) {
    /* get continent location value from continent: */
    continent = get_continent;
  };
  /* check select elements, if required ... continents: */
  var continents = site_vars['continents'];
  if (continent == null) {
    /* use selected continent, if available, else pick random: */
    if (continent_sel.selectedIndex > -1) {
      sel_continent = continent_sel.options[continent_sel.selectedIndex].value;
      continent = sel_continent;
    } else {
      var continent_index = Math.floor(Math.random() * continents.length);
      continent = continents[continent_index];
    };
  };
  /* countries: */
  var countries = site_vars['countries'][continent];
  if ((country == null) || (countries.indexOf(country) < 0)) {
    /* use selected country, if available, else pick random: */
    if ((country_sel.selectedIndex > -1) &&
        (countries.indexOf(
           country_sel.options[country_sel.selectedIndex].value
         ) > -1)) {
      sel_country = country_sel.options[country_sel.selectedIndex].value;
      continent = site_vars['all_countries'][sel_country]['continent'];
      country = sel_country;
    } else {
      var country_index = Math.floor(Math.random() * countries.length);
      country = countries[country_index];
    };
  };
  /* cities: */
  var cities = [];
  for (var i in site_vars['cities'][country]) {
    cities.push(i);
  };
  if ((city == null) || (cities.indexOf(city) < 0)) {
    /* use selected city, if available, else pick random: */
    if ((city_sel.selectedIndex > -1) &&
        (cities.indexOf(
           city_sel.options[city_sel.selectedIndex].value
         ) > -1)) {
      sel_city = city_sel.options[city_sel.selectedIndex].value;
      continent = site_vars['all_cities'][sel_city]['continent'];
      country = site_vars['all_cities'][sel_city]['country'];
      city = sel_city;
    } else {
      var city_index = Math.floor(Math.random() * cities.length);
      city = cities[city_index];
    };
  };
  /* update select elements ... add continent select html: */
  var my_html = '';
  for (var i = 0; i < continents.length; i++) {
    var my_continent = continents[i];
    my_html += '<option value="' + my_continent + '"';
    if (my_continent == continent) {
      my_html += ' selected';
    };
    my_html += '>' + my_continent + '</option>';
  };
  continent_sel.innerHTML = my_html;
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
  /* get plot data for this city: */
  site_vars['city_data'] = site_vars['cities'][country][city];
  var city_data = site_vars['city_data'];
  var plots_dir = site_vars['plots_dir'] + '/' +  city_data['plots_dir'];
  var plots = city_data['plots'];
  /* check for get plot index ... default to 0: */
  var plot_index = 0;
  /* map plot names to indexes: */
  var plot_get_index = site_vars['plot_names'].indexOf(get_plot);
  if (plot_get_index > -1) {
    plot_index = plot_get_index;
  } else if (plots[parseInt(get_cookie('plot_index'))] != undefined) {
    plot_index = parseInt(get_cookie('plot_index'));
  };
  var plot = site_vars['plot_names'][plot_index];
  /* store plot index: */
  set_cookie('plot_index', plot_index, 1 / 24);
  /* make sure url contains all parameters: */
  if ((get_continent != continent) ||
      (get_country != country) ||
      (get_city != city) ||
      (get_plot != plot)) {
    window.location.replace('/stripes/?continent=' + continent +
                            '&country=' +country +
                            '&city=' + city + '&plot=' + plot);
  };
  /* update select elements: */
  update_plot_selects();
  /* display selected plot index: */
  var plot_el = site_vars['el_content_plot_img'];
  plot_el.src = plots_dir + '/' + plots[plot_index];
  /* update page title: */
  var page_title = site_vars['page_title'];
  document.title = page_title + ' - ' + city + ', ' + country + ', ' +
                   continent;
  /* add twitter cards: */
  var twit_title = document.createElement('meta');
  twit_title.name = 'twitter:card';
  twit_title.content = 'Air Quality Stripes, ' + city;
  var twit_desc = document.createElement('meta');
  twit_title.name = 'twitter:description';
  twit_desc.content = 'Air quality ' + plot + ' plot for ' + city + ', ' + country;
  var twit_img = document.createElement('meta');
  twit_img.name = 'twitter:image';
  twit_img.content = encodeURI(plots_dir + '/' + plots[plot_index]);
  var twit_url = document.createElement('meta');
  twit_url.name = 'twitter:url';
  twit_url.content = encodeURI(location.href);
  var page_head = document.getElementsByTagName("HEAD")[0];
  page_head.appendChild(twit_title);
  page_head.appendChild(twit_desc);
  page_head.appendChild(twit_img);
  page_head.appendChild(twit_url);
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
      site_vars['continents'] = aq_data['continents'];
      site_vars['countries'] = aq_data['countries'];
      site_vars['all_countries'] = aq_data['all_countries'];
      site_vars['cities'] = aq_data['cities'];
      site_vars['all_cities'] = aq_data['all_cities'];
      /* update location: */
      update_location();
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
    content_plot.style.flexBasis = '80%';
    content_control.style.flexBasis = '20%';
    content_control_close.style.color = '';
    content_control.style.display = 'inline';
    set_cookie('controls_hidden', 0, 1 / 24);
  } else if (controls_hidden != 10) {
    /* hide the controls: */
    content_control_close.style.color = 'rgba(255, 255, 255, 0)';
    content_control.style.flexBasis = '0%';
    content_plot.style.flexBasis = '100%';
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
  /* get get vars: */
  site_vars['get_vars'] = get_get_vars();
  /* load data: */
  load_data();
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
  /* add select listeners: */
  site_vars['continent_sel'].addEventListener('change', update_location);
  site_vars['country_sel'].addEventListener('change', update_location);
  site_vars['city_sel'].addEventListener('change', update_location);
});

