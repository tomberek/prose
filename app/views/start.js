var $ = require('jquery-browserify');
var _ = require('underscore');
var Backbone = require('backbone');
var templates = require('../../dist/templates');
var auth = require('../config');
var cookie = require('../cookie');

// Set scope
auth.scope = cookie.get('scope') || 'repo';

module.exports = Backbone.View.extend({
  id: 'start',

  initialize: function () {
    this.persistScope(auth.scope);
  },

  events: {
    'click a[href="#scopes"]': 'toggleScope',
    'click a[href="#logins"]': 'toggleLogin',
    'change .toggle-hide select': 'setScope',
    'click #login-button': 'setCreds',
    'submit #login-form' : 'setCreds'
  },

  template: templates.start,

  render: function() {
    this.$el.html(_.template(this.template, auth, { variable: 'auth' }));
    return this;
  },

  toggleScope: function(e) {
    e.preventDefault();
    this.$('#scope').toggleClass('show');
  },

  toggleLogin: function(e) {
    e.preventDefault();
    this.$('#opt-input').toggleClass('show');
  },

  setScope: function(e) {
    var scope = $(e.currentTarget).val();
    this.persistScope(scope);
    this.render();
    router.app.nav.render();
  },

  setCreds: function(e){
      var login = $('#login').val();
      var headers = {headers : {
          'Authorization':
            'Basic ' + window.btoa(window.unescape(window.encodeURIComponent(login + ':' + $("#password").val())))
        }};
      if (otp=$('#otp').val()) {
          headers.headers["X-GitHub-OTP"]=otp;
      }
      $.ajaxSetup(headers);
	  var ajax = $.ajax({
          type: 'POST',
          url: auth.api + '/authorizations',
          data: '{"scopes":["repo"],"note":"Used for Prose:' + Date.now() + '"}',
          success: function(data) {
            cookie.set('oauth-token', data.token);
            cookie.set('auth', "oauth");

            var regex = new RegExp(/^(.*\/)(.*?)$/gi);
            window.location.href = window.location.href.replace(regex, '$1#' + login);

            // if (_.isFunction(options.success)) options.success();
          },
          error: function(data) {
              alert(data.responseText);
              console.log(data.responseText);
              $("#login-button").val(null);
              $("#login-button").prop("disabled",null);
          }
        });
      $("#login-button").prop("disabled",true);
      $("#login-button").val('false');
  },

  persistScope: function(scope) {
    var expire = new Date((new Date()).setYear((new Date()).getFullYear() + 20));
    auth.scope = scope;
    cookie.set('scope', scope, expire);
  }
});
