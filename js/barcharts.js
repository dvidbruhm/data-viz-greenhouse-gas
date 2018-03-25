//TODO

function main_barchart(data, localization){
    /***** Onglets *****/
    var tabs = d3.selectAll(".tabs li");
    tabs.on("click", function (d, i) {
        var self = this;
        var index = i;
        tabs.classed("active", function () {
        return self === this;
        });
        d3.selectAll(".tabs .tab")
        .classed("visible", function (d, i) {
            return index === i;
        });
    });

    /*** Premier bar chart ***/
    init_barchart1(data, localization);
}





function init_barchart1(data, localization) {

    /***** Configuration *****/
    var barChartMargin = {
        top: 55,
        right: 50,
        bottom: 80,
        left: 150
    };


    var barChart1Svg = d3.select("#bar-chart1-svg");

    var barChartWidth = barChart1Svg.node().getBoundingClientRect().width - barChartMargin.left - barChartMargin.right;
    var barChartHeight = barChart1Svg.node().getBoundingClientRect().height - barChartMargin.top - barChartMargin.bottom;

    /***** Création des éléments du diagramme à barres *****/
    barChart1Svg.attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
                .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom);

    var barChart1Group = barChart1Svg.append("g")
                                    .attr("transform", "translate(" + barChartMargin.left + "," + barChartMargin.top + ")");
    
    /***** Échelles *****/
    var x = d3.scale.ordinal().rangeRoundBands([0, barChartWidth], 0.05);
    var y = d3.scale.linear().range([barChartHeight, 0]);

    // domaines
    x.domain(Array(12).fill(1).map((x, y) => x + y + 2003));
    var maxCount = d3.max(data, function(d) {
        return d3.max(d.years, function(e){

            return e.total_eq;
        });
    });
    y.domain([0, maxCount]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(localization.getFormattedNumber);

    /***** Création du graphique à barres *****/
    createAxes(barChart1Group, xAxis, yAxis, barChartHeight);
    //createBarChart(barChartGroup, data, x, y, color, tip, barChartHeight);
}

function createAxes(g, xAxis, yAxis, height) {
    // TODO: Dessiner les axes X et Y du graphique. Assurez-vous d'indiquer un titre pour l'axe Y.
    // Axe x
    g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
        .selectAll("text")
        .style("font-size", "5mm");
  
    // Axe y
    g.append("g")
    .attr("class", "y axis")
    .call(yAxis)
        .selectAll("text")
        .style("font-size", "5mm");
  
    // Titre de l'axe y
    g.append("text")
    .attr("class", "y label")
    .attr("x", -38)
    .attr("y", -10)
    .style("font-size", "6mm")
    .text("CO2 équivalent")
  }