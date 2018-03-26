

function barchart1(data, localization) {

    rawdata = data;

    /***** Configuration *****/
    var barChartMargin = {
        top: 55,
        right: 50,
        bottom: 80,
        left: 150
    };

    var barChart1Svg = d3.select("#bar-chart1-svg");

    var barChartWidth = barChart1Svg.node().getBoundingClientRect().width - barChartMargin.left - barChartMargin.right;
    barChart1Height = barChart1Svg.node().getBoundingClientRect().height - barChartMargin.top - barChartMargin.bottom;

    /***** Création des éléments du diagramme à barres *****/
    barChart1Svg.attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
                .attr("height", barChart1Height + barChartMargin.top + barChartMargin.bottom);

    barChart1Group = barChart1Svg.append("g")
                                    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");
    
    /***** Échelles *****/
    barChart1x = d3.scale.ordinal().rangeRoundBands([0, barChartWidth], 0.05);
    barChart1y = d3.scale.linear().range([barChart1Height, 0]);

    barChart1xAxis = d3.svg.axis().scale(barChart1x).orient("bottom");
    barChart1yAxis = d3.svg.axis().scale(barChart1y).orient("left").tickFormat(localization.getFormattedNumber);

    /***** Création du bar chart *****/
    createAxes1();
    drawBarChart1([2004,2015], {
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

function createBar1Data(provinceFilter) {
    barChart1Data = []

    Array(12).fill(1).map((x, y) => x + y + 2003).forEach(element => {

        var sum = d3.sum(rawdata, function(e) {
            if(provinceFilter[e.facility_province.toString()])
            {
                var a = e.years.find(x => x.year === element);
                if (a) {
                return a.filtered_total_eq;
                }
            }
            return 0;
        });

        barChart1Data.push(
            {
                year: element,
                total: sum
            }
        )
    });

}

function createAxes1() {
    // TODO: Dessiner les axes X et Y du graphique. Assurez-vous d'indiquer un titre pour l'axe Y.
    // Axe x
    barChart1Group.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + barChart1Height + ")")
                    .call(barChart1xAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");
  
    // Axe y
    barChart1Group.append("g")
                    .attr("class", "y axis")
                    .call(barChart1yAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");
  
    // Titre de l'axe y
    barChart1Group.append("text")
                    .attr("class", "y label")
                    .attr("x", -38)
                    .attr("y", -10)
                    .style("font-size", "6mm")
                    .text("CO2 équivalent")
}

function drawBarChart1(yearFilter, provinceFilter) {

    createBar1Data(provinceFilter);

    /* Filter data */
    var filteredData = barChart1Data.filter(function(d){
        return d.year >= yearFilter[0] && d.year <= yearFilter[1];
    });

    barChart1x.domain(Array(yearFilter[1] - yearFilter[0] + 1).fill(1).map((x, y) => x + y + yearFilter[0] - 1));

    var maxCount = d3.max(filteredData, function(d) {
        return d.total;
    });

    barChart1y.domain([0, maxCount]);


    /* Axis update */
    barChart1xAxis = d3.svg.axis().scale(barChart1x).orient("bottom");
    barChart1yAxis = d3.svg.axis().scale(barChart1y).orient("left").tickFormat(localization.getFormattedNumber);

    barChart1Group.select(".x")
                    .transition(1000)
                    .call(barChart1xAxis);
    
    barChart1Group.select(".x")
                    .selectAll("text")
                    .style("font-size", "5mm");

    barChart1Group.select(".y")
                    .transition(1000)
                    .call(barChart1yAxis);
    
    barChart1Group.select(".y")
                    .selectAll("text")
                    .style("font-size", "5mm");


    /* redraw bar chart */
    barChart1Group.selectAll(".bar")
                    .remove();
    
    barChart1Group.selectAll(".bar")
                    .data(filteredData)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("fill", "blue")
                    .transition()
                    .duration(1000)
                    .attr("x", function(d) {
                        return barChart1x(d.year);
                    })
                    .attr("y", function(d) {
                        return barChart1y(d.total);
                    })
                    .attr("width", barChart1x.rangeBand())
                    .attr("height", function(d) {
                        return barChart1Height - barChart1y(d.total);
                    });
}