$(function() {
  $.scrollify({
		section:".panel",
    scrollbars:false,
    before:function(i,panels) {

      var ref = panels[i].attr("data-section-name");
      if(ref === "home" || ref === "second" || ref === "third") {
        $( "#filter-province-section" ).show(1000);
        $("#filter-panel").css("pointer-events", "none");
        $( "#filter-panel" ).animate({
          opacity: 0
        }, 1000, function() {
          
        });
      } else {
        $( "#filter-province-section" ).show(1000);
        $( "#filter-panel" ).animate({
          opacity: 1
        }, 1000, function() {
          $("#filter-panel").css("pointer-events", "auto");
        });
      }

      if(ref === "sixth") {
        $( "#filter-province-section" ).hide(1000);
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
