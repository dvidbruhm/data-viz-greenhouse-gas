// First bar chart
var barChart3Group = undefined;
var barChart3x = undefined;
var barChart3y = undefined;
var barChart3xAxis = undefined;
var barChart3yAxis = undefined;
var barChart3Data = undefined;
var barChart3Svg = undefined;
var barChart3BarWidth = undefined;
var barChart3tip = undefined;

function barchart3(data, localization) {

    barChart3tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-25, 0])
      .html(function(d) {
        return "<span class='d3-tip-text'>Émission:</span> <span class='d3-tip-text-emphasize'>" + d.total + "</span> <strong>kT</strong>";
      });

    barChart3Svg = d3.select("#bar-chart3-svg");

    /***** Création des éléments du diagramme à barres *****/
    barChart3Svg.attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
                .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom);

    barChart3Group = barChart3Svg.append("g")
                                    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");
    
    /***** Échelles *****/
    barChart3x = d3.scale.ordinal().rangeRoundBands([0, barChartWidth], 0.05);
    barChart3y = d3.scale.linear().range([barChartHeight, 0]);

    barChart3x.domain(d3.keys(default_gas_filter));
    barChart3BarWidth = barChart3x.rangeBand();

    barChart3xAxis = d3.svg.axis().scale(barChart3x).orient("bottom");
    barChart3yAxis = d3.svg.axis().scale(barChart3y).orient("left").tickFormat(localization.getFormattedNumber);


    /***** Création du bar chart *****/
    createAxes3();
    drawBarChart3(default_gas_filter, default_year_filter, default_prov_filter);

    barChart3Svg.call(barChart3tip);
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
                        .attr("transform", "rotate(30)")
                        .style("text-anchor", "start")
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
                    .attr("transform", "rotate(30)")
                    .style("text-anchor", "start")
                    .style("font-size", "4mm");

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
                    .on("mouseover", barChart3tip.show)
                    .on("mouseout", barChart3tip.hide)
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) {
                        return barChart3x(d.gas) + (barChart3x.rangeBand() - barChart3BarWidth) / 2;
                    })
                    .attr("y", function(d) {
                        return barChart3y(d.total);
                    })
                    .attr("width", barChart3BarWidth)
                    .attr("height", function(d) {
                        return barChartHeight - barChart3y(d.total);
                    });
}