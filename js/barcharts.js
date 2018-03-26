// First bar chart
var barChart1Group = undefined;
var barChart1x = undefined;
var barChart1y = undefined;
var barChart1xAxis = undefined;
var barChart1yAxis = undefined;
var barChart1Height = undefined;
var barChart1Data = undefined;

var rawdata = undefined;

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
    barchart1(data, localization);
}
