(function ($) {
  var _sul = function (data) {
    this._api_ = '/api/v1/url2short/';
    this._form_ = '#sul';
    this._errormsg_ = 'An error occurred shortening that link';
  };

  _sul.prototype.init = function () {
    this._input_ = $(this._form_).find('input');

    if (!this.check(this._input_.val())) {
      return this.alert(this._errormsg_, true);
    }

    this.request(this._input_.val());
  };

  _sul.prototype.check = function (s) {
    var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
  };

  _sul.prototype.alert = function (message, error) {
    var t = error === true ? 'alert-danger' : 'alert-success';

    $('.alert').alert('close');
    $('<div class="alert ' + t + ' alert-dismissible" role=alert>'
      + '<button type=button class=close data-dismiss=alert aria-label=Close><span aria-hidden=true>&times;</span></button>'
      + message
      + '</div>').insertBefore(this._form_);
  };

  _sul.prototype.request = function (url) {
    var self = this;
    $.ajax({
      type: 'POST',
      url: self._api_,
      data: { long_url: url },
      success: function(data) {
        if (data.hasOwnProperty('status_code') && data.hasOwnProperty('status_txt')) {
          if (parseInt(data.status_code) == 200) {
            self._input_.val(data.short_url).select();
            return self.alert('Copy your shortened url');
          } else {
            self._errormsg_ = data.status_txt;
          }
        }
        return self.alert(self._errormsg_, true);
      },
      error:function(error){
        return self.alert(self._errormsg_, true);
      },
      dataType: 'json',
    })
  };

  $(function () {
    var n = new _sul();
    var clipboard = new Clipboard('.btn');

    $(n._form_).on('submit', function (e) {
      e && e.preventDefault();
      n.init();

      clipboard.on('success', function(e) {
        n.alert('Copied to clipboard!');
      });

      clipboard.on('error', function(e) {
        n.alert('Error copying to clipboard', true);
      });
    });
  });

})(window.jQuery);
