
$(document).ready(function () {
  // create sidebar and attach to menu open
  $('.ui.sidebar').sidebar('attach events', '.toc');

  // initial tabs in 'Get started' section
  $('#start .menu .item').tab();

  $('.scrollLink').click(function(event) {
    //event.preventDefault();
    var fromSidebar = $(this).parents(".sidebar").length > 0;
    if (fromSidebar) {
      $('.ui.sidebar').sidebar('toggle');
    }
    var tgt = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(tgt).offset().top
    }, 500);
  });
});