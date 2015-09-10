var Reveal = require('reveal');
window.jQuery = window.$ =  require('jquery');
require('bootstrap');
window.showTooltips = true;


// Full list of configuration options available here: 
// https://github.com/hakimel/reveal.js#configuration 
Reveal.initialize({
  width: '100%',
  controls: true,
  progress: true,
  history: true,
  center: true,
  // default/cube/page/concave/zoom/linear/fade/none 
  transition: 'none'
});


var codes = document.querySelectorAll('pre code:not([data-manual-highlight])');
_.each(codes, function(code){
  Prism.highlightElement(code);
});

Reveal.addEventListener( 'slidechanged', function( slideChangeEvent ) {
  funkyToolTipBusiness( slideChangeEvent );
});

function funkyToolTipBusiness(slideChangeEvent){

  if(window.showTooltips && slideChangeEvent.currentSlide.dataset.assignPopovers){
    if(slideChangeEvent.currentSlide.querySelectorAll('.tipped').length){
      return;
    }

    if(slideChangeEvent.currentSlide.querySelectorAll('.tip').length){
      $(slideChangeEvent.currentSlide.querySelectorAll('.tip')).each(function(iter, element){
        addToolTip(element, element.getAttribute('title'), slideChangeEvent.currentSlide.dataset.assignPopovers)
        $(element).tooltip();
      });
    }

  }
}


function addToolTip(element, label, popoverName){

  element.dataset.toggle = 'tooltip';
  element.dataset.container = '.present[data-assign-popovers='+popoverName+']';
  element.title = element.title || label;
  element.dataset.placement = element.dataset.placement || 'top';
  element.dataset.trigger = element.dataset.trigger || 'hover click';
  element.className += ' tipped';
}