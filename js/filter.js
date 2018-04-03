


province_checkboxes = ['#checkbox-QC', '#checkbox-BC', '#checkbox-ON', '#checkbox-NS', '#checkbox-NB', '#checkbox-MB', 
                        '#checkbox-PE', '#checkbox-SK', '#checkbox-NU', '#checkbox-AB', '#checkbox-NL', '#checkbox-NT']

gaz_checkboxes = ['#checkbox-co2', '#checkbox-ch4', '#checkbox-hfc-152a', '#checkbox-n2o', '#checkbox-hfc-32',
                    '#checkbox-hfc-134', '#checkbox-hfc-134a', '#checkbox-hfc-227ea', '#checkbox-hfc-125', '#checkbox-hfc-143a', 
                    '#checkbox-cf4', '#checkbox-c4f8', '#checkbox-c2f6', '#checkbox-hfc-23', '#checkbox-sf6']

function init_filter_panel(){

    $(".slider")
        .slider({
            range: true,
            min: 2004,
            max: 2015,
            step: 1,
            values: [2004, 2015],
            change: function(event, ui) {
                updateFilters();
             }
        })
        .slider("pips", {
            first: "label",
            last: "label",
            rest: "pip"
        })
        .slider("float", {
            rest: "label"
        });


    province_checkboxes.forEach(element => {
        $(element).prop('checked', true);
    });


    gaz_checkboxes.forEach(element => {
        $(element).prop('checked', true);
    });
}


function updateFilters() {

    var provinceFilter = {};

    province_checkboxes.forEach(element => {
        provinceFilter[element.substr(element.length - 2)] = $(element).is(":checked");
    });

    var yearFilter = [$(".slider").slider("values", 0), $(".slider").slider("values", 1)];

    var gasFilter = {};

    gaz_checkboxes.forEach(element => {
        gasFilter[element.substr(10).replace("-", "")] = $(element).is(":checked");
    });

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

    drawLineChart(yearFilter, provinceFilter);

    console.log("Filters updated");
}