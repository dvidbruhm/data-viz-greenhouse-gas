// First bar chart
var barChart2Group = undefined;
var barChart2x = undefined;
var barChart2y = undefined;
var barChart2xAxis = undefined;
var barChart2yAxis = undefined;
var barChart2Data = undefined;
var barChart2Svg = undefined;
var barChart2BarWidth = undefined;
var barChart2tip = undefined;


function barchart2(data, localization) {

    barChart2tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-25, 0])
      .html(function(d) {
        return "<span class='d3-tip-text'>Émission:</span> <span class='d3-tip-text-emphasize'>" + d.total.toFixed(0) + "</span> <strong>kT</strong>";
      });


    barChart2Svg = d3.select("#bar-chart2-svg");

    /***** Création des éléments du diagramme à barres *****/
    barChart2Svg.attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
                .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom);

    barChart2Group = barChart2Svg.append("g")
                                    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");
    
    /***** Échelles *****/
    barChart2x = d3.scale.ordinal().rangeRoundBands([0, barChartWidth], 0.05);
    barChart2y = d3.scale.linear().range([barChartHeight, 0]);

    barChart2x.domain(d3.keys(default_prov_filter));
    barChart2BarWidth = barChart2x.rangeBand();

    barChart2xAxis = d3.svg.axis().scale(barChart2x).orient("bottom");
    barChart2yAxis = d3.svg.axis().scale(barChart2y).orient("left").tickFormat(localization.getFormattedNumber);

    /***** Création du bar chart *****/
    createAxes2();
    drawBarChart2(default_year_filter, default_prov_filter);

    barChart2Svg.call(barChart2tip);
}


function createBar2Data(yearFilter) {
    
    barChart2Data = [];

    var provinces = d3.keys(default_prov_filter);

    provinces.forEach(prov => {

        var sum = d3.sum(rawdata, function(d) {
            if (d.facility_province === prov) {
                return d3.sum(Array(yearFilter[1] - yearFilter[0] + 1).fill(1).map((x, y) => x + y + yearFilter[0] - 1), function(elem) {
                    var a = d.years.find(x => x.year === elem);
                    if (a) {
                        return a.filtered_total_eq;
                    }
                    return 0;
                });
            }
            return 0;
        });

        barChart2Data.push(
            {
                province: prov,
                total: sum
            }
        )
    });

    barChart2Data.sort(function(a, b){return b.total - a.total});

}


function createAxes2() {
    // TODO: Dessiner les axes X et Y du graphique. Assurez-vous d'indiquer un titre pour l'axe Y.
    // Axe x
    barChart2Group.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + barChartHeight + ")")
                    .call(barChart2xAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");
  
    // Axe y
    barChart2Group.append("g")
                    .attr("class", "y axis")
                    .call(barChart2yAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");
  
    // Titre de l'axe y
    barChart2Group.append("text")
                    .attr("class", "y label")
                    .attr("x", 0)
                    .attr("y", -10)
                    .style("font-size", "6mm")
                    .text("CO2 équivalent [kT]")
                    .attr("text-anchor", "middle");
}


function drawBarChart2(yearFilter, provinceFilter) {

    createBar2Data(yearFilter);

    /* Filter data */
    var filteredData = barChart2Data.filter(function(d){
        return provinceFilter[d.province.toString()];
    });

    provDomain = [];
    
    filteredData.forEach(elem => {
        provDomain.push(elem.province);
    });

    barChart2x.domain(provDomain);

    var maxCount = d3.max(filteredData, function(d) {
        return d.total;
    });

    barChart2y.domain([0, maxCount]);

    /* Axis update */
    barChart2xAxis = d3.svg.axis().scale(barChart2x).orient("bottom");
    barChart2yAxis = d3.svg.axis().scale(barChart2y).orient("left").tickFormat(localization.getFormattedNumber);

    barChart2Group.select(".x")
                    .transition(1000)
                    .call(barChart2xAxis);
    
    barChart2Group.select(".x")
                    .selectAll("text")
                    .style("font-size", "5mm");

    barChart2Group.select(".y")
                    .transition(1000)
                    .call(barChart2yAxis);
    
    barChart2Group.select(".y")
                    .selectAll("text")
                    .style("font-size", "5mm");

    /* redraw bar chart */
    barChart2Group.selectAll(".bar")
                    .remove();
    
    barChart2Group.selectAll(".bar")
                    .data(filteredData)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .on("mouseover", barChart2tip.show)
                    .on("mouseout", barChart2tip.hide)
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) {
                        return barChart2x(d.province) + (barChart2x.rangeBand() - barChart2BarWidth) / 2;
                    })
                    .attr("y", function(d) {
                        return barChart2y(d.total);
                    })
                    .attr("width", barChart2BarWidth)
                    .attr("height", function(d) {
                        return barChartHeight - barChart2y(d.total);
                    });
}