//TODO
var lineChartWidth = undefined;
var lineChartHeight = undefined;
var lineChartSvg = undefined;
var lineChartGroup = undefined;
var lineChartX = undefined;
var lineChartY = undefined;
var lineChartXAxis = undefined;
var lineChartYAxis = undefined;
var lineChartLine = undefined;
var lineChartData = undefined;

var currentYearFilter = undefined;

/***** Configuration *****/
var lineChartMargin = {
    top: 55,
    right: 50,
    bottom: 80,
    left: 150
};

function linechart(data) {
    
    lineChartData = data;

    var lineChartSvg = d3.select("#line-chart-svg");
    lineChartSvg.select("g").remove();
    
    lineChartWidth = lineChartSvg.node().getBoundingClientRect().width - lineChartMargin.left - lineChartMargin.right;
    lineChartHeight = lineChartSvg.node().getBoundingClientRect().height - lineChartMargin.top - lineChartMargin.bottom;

    /***** Création des éléments du diagramme à barres *****/
    lineChartSvg.attr("width", lineChartWidth + lineChartMargin.left + lineChartMargin.right)
                .attr("height", lineChartHeight + lineChartMargin.top + lineChartMargin.bottom);

    lineChartGroup = lineChartSvg.append("g")
                                    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");
    
    /***** Échelles *****/
    lineChartX = d3.scale.linear().range([0, lineChartWidth]);
    lineChartY = d3.scale.linear().range([lineChartHeight, 0]);


    lineChartXAxis = d3.svg.axis().scale(lineChartX).orient("bottom").tickFormat(d3.format(""));
    lineChartYAxis = d3.svg.axis().scale(lineChartY).orient("left");

    lineChartLine = d3.svg.line()
                            .defined(function(d) {
                                var legit = d.year >= currentYearFilter[0] && d.year <= currentYearFilter[1];
                                return !isNaN(d.filtered_total_eq) && legit;
                            })
                            .x(function(d) {
                                return lineChartX(d.year);
                            })
                            .y(function(d) {
                                return lineChartY(d.filtered_total_eq);
                            });

    createLineChartAxes();
    drawLineChart([2004,2015], {
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

function createLineChartAxes() {
    
    lineChartX.domain([2004,2015]);

    var maxCount = d3.max(lineChartData, function(d){
        return d3.max(d.years, function(e){
            return e.filtered_total_eq;
        });
    });

    lineChartY.domain([0, maxCount]);

    // Axe x
    lineChartGroup.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + lineChartHeight + ")")
                    .call(lineChartXAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");

    // Axe y
    lineChartGroup.append("g")
                    .attr("class", "y axis")
                    .call(lineChartYAxis)
                        .selectAll("text")
                        .style("font-size", "5mm");

    // Titre de l'axe y
    lineChartGroup.append("text")
                    .attr("class", "y label")
                    .attr("x", -38)
                    .attr("y", -10)
                    .style("font-size", "6mm")
                    .text("CO2 équivalent")

}

function drawLineChart(yearFilter, provinceFilter) {

    currentYearFilter = yearFilter;

    var currentdata = lineChartData.slice();

    currentdata = currentdata.filter(function(d){
                                        return provinceFilter[d.facility_province];
                                    });
    
    lineChartX.domain(yearFilter);

    var maxCount = d3.max(currentdata, function(d){
        return d3.max(d.years, function(e){
            return e.filtered_total_eq;
        });
    });

    lineChartY.domain([0, maxCount]);
    
    /* Axis update */
    lineChartXAxis = d3.svg.axis().scale(lineChartX).orient("bottom").tickFormat(d3.format(""));
    lineChartYAxis = d3.svg.axis().scale(lineChartY).orient("left");
    
    lineChartGroup.select(".x")
                    .transition(1000)
                    .call(lineChartXAxis);
    
                    
    lineChartGroup.select(".x")
                    .selectAll("text")
                    .style("font-size", "5mm");
    
    lineChartGroup.select(".y")
                    .transition(1000)
                    .call(lineChartYAxis);
    
    lineChartGroup.select(".y")
                    .selectAll("text")
                    .style("font-size", "5mm");

    lineChartGroup.selectAll(".line").remove();

    lineChartGroup.append("g")
                    .attr("class", "lines")
                    .selectAll("path")
                    .data(currentdata)
                    .enter()
                    .append("path")
                    .attr("class", "line")
                    .attr("d", function(d) {
                        return lineChartLine(d.years);
                    })
                    .attr("fill", "none")
                    .attr("clip-path", "url(#clip)");
}