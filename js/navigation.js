$(function() {
  $.scrollify({
		section:".panel",
    scrollbars:false,
    before:function(i,panels) {

      var ref = panels[i].attr("data-section-name");

      $( "#filter-panel" ).show(0);

      if(ref === "home" || ref === "second" || ref === "third") {
        $( "#filter-year-section" ).hide(500);
        $( "#filter-province-section" ).hide(500);
        $( "#filter-gaz-section" ).hide(500);
        $( "#filter-radar-legend" ).hide(500);
      } else {
        $( "#filter-year-section" ).show(500);
        $( "#filter-province-section" ).show(500);
        $( "#filter-gaz-section" ).show(500);
        $( "#filter-radar-legend" ).hide(500);
      }

      if(ref === "sixth") {
        $( "#filter-province-section" ).hide(500);
        $( "#filter-gaz-section" ).hide(500);
        $( "#filter-radar-legend" ).show(500);
      }

      $(".pagination .active").removeClass("active");

      $(".pagination").find("a[href=\"#" + ref + "\"]").addClass("active");
    },
    afterRender:function() {
      var pagination = "<ul class=\"pagination\">";
      var activeClass = "";
      $(".panel").each(function(i) {
        activeClass = "";
        if(i===0) {
          activeClass = "active";
        }
        pagination += "<li><a class=\"" + activeClass + "\" href=\"#" + $(this).attr("data-section-name") + "\"><span class=\"hover-text\">" + $(this).attr("data-section-name").charAt(0).toUpperCase() + $(this).attr("data-section-name").slice(1) + "</span></a></li>";
      });

      pagination += "</ul>";

      $(".home").append(pagination);
      $(".pagination a").on("click",$.scrollify.move);

      
    }
  });
});
