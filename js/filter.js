
function init_filter_panel(){

    $( "#slider-3" ).slider({
       range:true,
       min: 2004,
       max: 2015,
       values: [ 2004, 2015 ],
       slide: function(event, ui) {
          $("#slider-years").text(ui.values[ 0 ] + " - " + ui.values[ 1 ]);
       },
       change: function(event, ui) {
          updateFilters();
       }
    });
       
     $("#slider-years").text($( "#slider-3" ).slider( "values", 0 ) + " - " + $( "#slider-3" ).slider( "values", 1 ));
}


function updateFilters() {

    var provinceFilter = {
        "QC": $('#checkbox-QC').is(":checked"),
        "BC": $('#checkbox-BC').is(":checked"),
        "ON": $('#checkbox-ON').is(":checked"),
        "NS": $('#checkbox-NS').is(":checked"),
        "NB": $('#checkbox-NB').is(":checked"),
        "MB": $('#checkbox-MB').is(":checked"),
        "PE": $('#checkbox-PE').is(":checked"),
        "SK": $('#checkbox-SK').is(":checked"),
        "AB": $('#checkbox-AB').is(":checked"),
        "NL": $('#checkbox-NL').is(":checked"),
        "NT": $('#checkbox-NT').is(":checked"),
        "NU": $('#checkbox-NU').is(":checked")
    }

    var yearFilter = [$("#slider-3").slider("values", 0), $("#slider-3").slider("values", 1)];

    // TODO
    var filteredData = globalData;

    drawBarChart1(yearFilter, provinceFilter);

    console.log("Filters updated");
}