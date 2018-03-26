//TODO
$(function() {

    $( "#slider-3" ).slider({
       range:true,
       min: 2004,
       max: 2015,
       values: [ 2004, 2015 ],
       slide: function( event, ui ) {
          $("#slider-years").text(ui.values[ 0 ] + " - " + ui.values[ 1 ]);
       }
    });
       
     $("#slider-years").text($( "#slider-3" ).slider( "values", 0 ) + " - " + $( "#slider-3" ).slider( "values", 1 ));
 });