// First bar chart
var barChart3Group = undefined;
var barChart3x = undefined;
var barChart3y = undefined;
var barChart3xAxis = undefined;
var barChart3yAxis = undefined;
var barChart3Data = undefined;
var barChart3Svg = undefined;


function barchart3(data, localization) {

    barChart3Svg = d3.select("#bar-chart3-svg");

    /***** Création des éléments du diagramme à barres *****/
    barChart3Svg.attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
                .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom);

    barChart3Group = barChart3Svg.append("g")
                                    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");
    
    /***** Échelles *****/
    barChart3x = d3.scale.ordinal().rangeRoundBands([0, barChartWidth], 0.05);
    barChart3y = d3.scale.linear().range([barChartHeight, 0]);

    barChart3xAxis = d3.svg.axis().scale(barChart3x).orient("bottom");
    barChart3yAxis = d3.svg.axis().scale(barChart3y).orient("left").tickFormat(localization.getFormattedNumber);

    createBar3Data({
        "co2": true,
        "ch4": true,
        "hfc152a": true,
        "n2o": true,
        "hfc32": true,
        "hfc134": true,
        "hfc134a": true,
        "hfc227ea": true,
        "hfc125": true,
        "hfc143a": true,
        "cf4": true,
        "c4f8": true,
        "c2f6": true,
        "hfc23": true,
        "sf6": true
    },
        [2004,2015], 
    {
        "QC": true,
        "BC": true,
        "ON": true,
        "NS": true,
        "NB": true,
        "MB": true,
        "PE": true,
        "SK": true,
        "AB": true,
        "NL": true,
        "NT": true,
        "NU": true
    });

    /***** Création du bar chart *****/
    createAxes3();
    drawBarChart3({
        "co2": true,
        "ch4": true,
        "hfc152a": true,
        "n2o": true,
        "hfc32": true,
        "hfc134": true,
        "hfc134a": true,
        "hfc227ea": true,
        "hfc125": true,
        "hfc143a": true,
        "cf4": true,
        "c4f8": true,
        "c2f6": true,
        "hfc23": true,
        "sf6": true
    },
        [2004,2015], 
    {
        "QC": true,
        "BC": true,
        "ON": true,
        "NS": true,
        "NB": true,
        "MB": true,
        "PE": true,
        "SK": true,
        "AB": true,
        "NL": true,
        "NT": true,
        "NU": true
    });
}


function createBar3Data(gasFilter, yearFilter, provinceFilter) {
    
    barChart3Data = [];


    d3.keys(gasFilter).forEach(gas => {
        var sum = d3.sum(rawdata, function(d){
            if(provinceFilter[d.facility_province]) {
                return d3.sum(d.years, function(e){
                    if (e.year >= yearFilter[0] && e.year <= yearFilter[1])
                    {
                        return e[gas.replace("-", "") + "_eq"];
                    }
                    return 0;
                });
            }
            return 0;
        });

        barChart3Data.push(
            {
                gas: gas.replace("-", ""),
                total: sum
            }
        )
    });


    barChart3Data.sort(function(a, b){return b.total - a.total});
}


function createAxes3() {
    // TODO: Dessiner les axes X et Y du graphique. Assurez-vous d'indiquer un titre pour l'axe Y.
    // Axe x
    barChart3Group.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + barChartHeight + ")")
                    .call(barChart3xAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");
  
    // Axe y
    barChart3Group.append("g")
                    .attr("class", "y axis")
                    .call(barChart3yAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");
  
    // Titre de l'axe y
    barChart3Group.append("text")
                    .attr("class", "y label")
                    .attr("x", -38)
                    .attr("y", -10)
                    .style("font-size", "6mm")
                    .text("CO2 équivalent")
}


function drawBarChart3(gasFilter, yearFilter, provinceFilter) {

    createBar3Data(gasFilter, yearFilter, provinceFilter);

    /* Filter data */
    var filteredData = barChart3Data.filter(function(d){
        return gasFilter[d.gas];
    });

    gasDomain = [];
    
    filteredData.forEach(elem => {
        gasDomain.push(elem.gas);
    });

    barChart3x.domain(gasDomain);

    var maxCount = d3.max(filteredData, function(d) {
        return d.total;
    });

    barChart3y.domain([0, maxCount]);

    /* Axis update */
    barChart3xAxis = d3.svg.axis().scale(barChart3x).orient("bottom");
    barChart3yAxis = d3.svg.axis().scale(barChart3y).orient("left").tickFormat(localization.getFormattedNumber);

    barChart3Group.select(".x")
                    .transition(1000)
                    .call(barChart3xAxis);
    
    barChart3Group.select(".x")
                    .selectAll("text")
                    .style("font-size", "5mm");

    barChart3Group.select(".y")
                    .transition(1000)
                    .call(barChart3yAxis);
    
    barChart3Group.select(".y")
                    .selectAll("text")
                    .style("font-size", "5mm");

    /* redraw bar chart */
    barChart3Group.selectAll(".bar")
                    .remove();

    barChart3Group.selectAll(".bar")
                    .data(filteredData)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) {
                        return barChart3x(d.gas);
                    })
                    .attr("y", function(d) {
                        return barChart3y(d.total);
                    })
                    .attr("width", barChart3x.rangeBand())
                    .attr("height", function(d) {
                        return barChartHeight - barChart3y(d.total);
                    });
}