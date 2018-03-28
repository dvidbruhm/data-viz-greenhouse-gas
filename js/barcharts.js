
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

    rawdata = data;

    /*** Premier bar chart ***/
    barchart1(data, localization);
    barchart2(data, localization);
    barchart3(data, localization);
}
