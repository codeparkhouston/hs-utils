window._ = require('lodash');
window._.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var codes;
if(typeof Prism === 'object'){
  codes = document.querySelectorAll('pre code:not([data-manual-highlight])');
  _.each(codes, function(code){
    Prism.highlightElement(code);
  });
}
