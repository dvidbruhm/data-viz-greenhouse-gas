
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

    $('#checkbox-QC').prop('checked', true);
    $('#checkbox-BC').prop('checked', true);
    $('#checkbox-ON').prop('checked', true);
    $('#checkbox-NS').prop('checked', true);
    $('#checkbox-NB').prop('checked', true);
    $('#checkbox-MB').prop('checked', true);
    $('#checkbox-PE').prop('checked', true);
    $('#checkbox-SK').prop('checked', true);
    $('#checkbox-AB').prop('checked', true);
    $('#checkbox-NL').prop('checked', true);
    $('#checkbox-NT').prop('checked', true);
    $('#checkbox-NU').prop('checked', true);

    $('#checkbox-co2').prop('checked', true);
    $('#checkbox-ch4').prop('checked', true);
    $('#checkbox-hfc-152a').prop('checked', true);
    $('#checkbox-n2o').prop('checked', true);
    $('#checkbox-hfc-32').prop('checked', true);
    $('#checkbox-hfc-134').prop('checked', true);
    $('#checkbox-hfc-134a').prop('checked', true);
    $('#checkbox-hfc-227ea').prop('checked', true);
    $('#checkbox-hfc-125').prop('checked', true);
    $('#checkbox-hfc-143a').prop('checked', true);
    $('#checkbox-cf4').prop('checked', true);
    $('#checkbox-c4f8').prop('checked', true);
    $('#checkbox-c2f6').prop('checked', true);
    $('#checkbox-hfc-23').prop('checked', true);
    $('#checkbox-sf6').prop('checked', true);
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
    };

    var yearFilter = [$("#slider-3").slider("values", 0), $("#slider-3").slider("values", 1)];

    var gasFilter = {
        "co2": $('#checkbox-co2').is(":checked"),
        "ch4": $('#checkbox-ch4').is(":checked"),
        "hfc152a": $('#checkbox-hfc-152a').is(":checked"),
        "n2o": $('#checkbox-n2o').is(":checked"),
        "hfc32": $('#checkbox-hfc-32').is(":checked"),
        "hfc134": $('#checkbox-hfc-134').is(":checked"),
        "hfc134a": $('#checkbox-hfc-134a').is(":checked"),
        "hfc227ea": $('#checkbox-hfc-227ea').is(":checked"),
        "hfc125": $('#checkbox-hfc-125').is(":checked"),
        "hfc143a": $('#checkbox-hfc-143a').is(":checked"),
        "cf4": $('#checkbox-cf4').is(":checked"),
        "c4f8": $('#checkbox-c4f8').is(":checked"),
        "c2f6": $('#checkbox-c2f6').is(":checked"),
        "hfc23": $('#checkbox-hfc-23').is(":checked"),
        "sf6": $('#checkbox-sf6').is(":checked")
    };

    var filteredData = [];

    globalData.forEach(company => {
        mod_data = company;
        mod_data.years.forEach(year => {
            year.filtered_total_eq = (gasFilter.co2 ? year.co2_eq : 0)
                                   + (gasFilter.ch4 ? year.ch4_eq : 0)
                                   + (gasFilter.hfc152a ? year.hfc152a_eq : 0)
                                   + (gasFilter.n2o ? year.n2o_eq : 0)
                                   + (gasFilter.hfc32 ? year.hfc32_eq : 0)
                                   + (gasFilter.hfc134 ? year.hfc134_eq : 0)
                                   + (gasFilter.hfc134a ? year.hfc134a_eq : 0)
                                   + (gasFilter.hfc227ea ? year.hfc227ea_eq : 0) 
                                   + (gasFilter.hfc125 ? year.hfc125_eq : 0)
                                   + (gasFilter.hfc143a ? year.hfc143a_eq : 0)
                                   + (gasFilter.cf4 ? year.cf4_eq : 0)
                                   + (gasFilter.c4f8 ? year.c4f8_eq : 0)
                                   + (gasFilter.c2f6 ? year.c2f6_eq : 0)
                                   + (gasFilter.hfc23 ? year.hfc23_eq : 0)
                                   + (gasFilter.sf6 ? year.sf6_eq : 0);
        });
        filteredData.push(mod_data);
    });
    
    drawBarChart1(yearFilter, provinceFilter);
    drawBarChart2(yearFilter, provinceFilter);
    drawBarChart3(gasFilter, yearFilter, provinceFilter);

    console.log("Filters updated");
}