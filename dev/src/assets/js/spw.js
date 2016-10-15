var SPW = {};

SPW.Init = function( parameter ) {
  new SPW.Controller( parameter );
};

SPW.Controller = function( parameter ) {
  this.templatePath = parameter.templatePath;
  this.index = parameter.index;
  this.loader = parameter.loader;
  this.init();
};
SPW.Controller.prototype = {
  init: function() {
    this.setParameters();
    this.bindEvents();
    this.updateTemplate();
  },
  setParameters: function() {
    this.$loader = $( this.loader );
    this.$content = $('.js-spw-content');
  },
  bindEvents: function() {
    var _this = this;
    $('body').on('click', '.js-spw-trigger', function(e) {
      e.preventDefault();
      _this.onClickTrigger( $(this) );
    });
    $(window).on('popstate', function(event) {
      _this.onPopState();
    });
  },
  onClickTrigger: function( $target ) {
    var href = $target.attr('href');
    this.updateTemplate( href ).then(function() {
      window.history.pushState(null, null, href);
    });
  },
  onPopState: function() {
    this.updateTemplate( location.pathname );
  },
  updateTemplate: function(href) {
    var d = new $.Deferred;
    var _this = this;

    this.showLoader();

    if( !href || href === '/' ) {
      href = this.index;
    }
    var $cacheTemplate = SPW.Model.getView(href);

    if( $cacheTemplate ) {
      this.setTemplate( $cacheTemplate );
      this.hideLoader();
      d.resolve();
    }else {
      this.getTemplate( href ).then(function($template) {
        SPW.Model.setView( href,$template );
        _this.setTemplate( $template );
        _this.hideLoader();
        d.resolve();
      });
    }
    return d.promise();
  },
  showLoader: function() {
    if( this.$loader.length === 0 ) {
      return;
    }
    this.$loader.stop().fadeIn();
  },
  hideLoader: function() {
    if( this.$loader.length === 0 ) {
      return;
    }
    this.$loader.stop().fadeOut();
  },
  resetTemplate: function() {
    this.$content.empty();
  },
  getTemplate: function(href) {
    if( !href ) {
      console.log('Doesn\'t definition href property of anchor.');
      return;
    }

    var d = new $.Deferred;

    $.ajax({
      url: this.templatePath + href,
      type: 'GET',
      dataType: 'html'
    }).then(function(data) {
      var $data = $(data);
      var $template = $data.filter(function(index) {
        return $($data[index]).hasClass('js-spw-template');
      });
      d.resolve( $template );
    }, function() {
      d.reject();
    });
    return d.promise();
  },
  setTemplate: function( $template ) {
    this.resetTemplate();
    this.$content.append( $template.hide() );
    $template.fadeIn();
  }
};

SPW.Model = {
  setView: function(path, data) {
    if(!this.dataList) {
      this.dataList = {};
    }
    this.dataList[path] = data;
  },
  getView: function(path) {
    if( this.dataList === undefined ) {
      return;
    }
    return this.dataList[path];
  }
};