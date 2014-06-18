Flatdoc.highlighters.clojure = function(code) {
  return hljs.highlight('clojure', code, true).value;
};

$(document).on('flatdoc:ready', function() {
  $('.menu a.level-2').click(function() {
    var $this = $(this);
    $this.next('ul.level-3').show();
  });
});
