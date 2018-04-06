// 21: Extraction minière, de pétrole et de gaz
// 22: Services publics
// 31-33: Fabrication
// Ça couvre plus de 98%

var naics_codes = {
	"21": "Extraction minière",
	"22": "Services publics",
	"31": "Fabrication 1",
	"32": "Fabrication 2",
	"33": "Fabrication 3",
	"48": "Transport",
	"56": "Services administratifs",
	"61": "Services d'enseignement",
	"91": "Administrations publiques"
}

/***** Configuration *****/
var radarChartMargin = {
    top: 55,
    right: 50,
    bottom: 50,
    left: 50
};

var radarDataSet = []

RadarChart.defaultConfig.radius = 7;

var circle_width = 5;
var circle_width_hovered = 10;

function radar(data) {

	createRadarData(data, default_year_filter);

	var radarChartSvg = d3.select("#svg-radar");
    radarChartSvg.select("g").remove();

    radarChartWidth = parseFloat(radarChartSvg.node().getBoundingClientRect().width) - radarChartMargin.left - radarChartMargin.right;
    radarChartHeight = parseFloat(radarChartSvg.node().getBoundingClientRect().height) - radarChartMargin.top - radarChartMargin.bottom;


    /***** Création des éléments du diagramme à barres *****/
    radarChartSvg.attr("width", radarChartWidth + radarChartMargin.left + radarChartMargin.right)
                .attr("height", radarChartHeight + radarChartMargin.top + radarChartMargin.bottom);
                
    radarChartGroup = radarChartSvg.append("g")
                                    .attr("transform", "translate(" + radarChartMargin.left + "," + radarChartMargin.top + ")");
	

	var radarChart = RadarChart.chart();
								
	//radarChart.config({w: radarChartWidth / 4, h: radarChartHeight / 3, axisText: true, levels: 5, circles: true});
	var cfg = radarChart.config();
	
	cfg.w = radarChartWidth / 4;
	cfg.h = radarChartHeight / 3;
	cfg.radius = circle_width;
	cfg.levels = 3;
	cfg.minValue = -10;
	cfg.axisLine = true;
	cfg.axisText = true;
	cfg.color = function() {};
	cfg.factor = 1;
	cfg.factorLegend = 0.7;

	console.log(radarDataSet);

	radarChartGroup.selectAll('.radar-chart')
					.data(radarDataSet)
					.enter()
					.append('g')
					.classed('radar-chart', true)
					.attr('transform', function(d, i) { 
						return 'translate('+ ((i % 4) * cfg.w) +','+ ((parseInt(i / 4)) % 3 * cfg.h) +')'; 
					})
					.call(radarChart);
	
	radarChartGroup.selectAll(".circle")
					.on("mouseover", function(d){
						radarChartGroup.selectAll(".circle")
										.attr("stroke", function(e) {
											if (d[0].axis === e[0].axis){
												d3.select(this).classed("hovered", true).attr("r", circle_width_hovered);
											}
										});
					})
					.on("mouseout", function(d){
						radarChartGroup.selectAll(".circle")
										.attr("stroke", function(e) {
											if (d[0].axis === e[0].axis){
												d3.select(this).classed("hovered", false).attr("r", circle_width);
											}
										});
					});

}



function createRadarData(data, year_filter) {
	/**
	 * [
	 * 		[
	 * 			{
	 * 				className: "province",
	 * 				axes: [
	 * 					{axis: "industry type", value: percentage},
	 * 					{axis: "industry type", value: percentage},
	 * 					{axis: "industry type", value: percentage} ...
	 * 				]
	 * 			}
	 * 		], ...
	 * ]
	 */

	radarDataSet = []

	d3.keys(default_prov_filter).forEach(element => {

		var prov_data = data.filter(function(d){
			return d.facility_province === element;
		});

		var prov_sum = d3.sum(prov_data, function(d){
			return d3.sum(d.years, function(e){
				if (e.year >= year_filter[0] && e.year <= year_filter[1])
				{
					return e.filtered_total_eq;
				}
				return 0;
			});
		});

		var axesTemp = []

		d3.keys(naics_codes).forEach(code => {

			var code_sum_temp = d3.sum(prov_data, function(d){
				if (d.facility_code === code) {
					return d3.sum(d.years, function(e){
						if (e.year >= year_filter[0] && e.year <= year_filter[1])
						{
							return e.filtered_total_eq;
						}
						return 0;
					});
				}
				return 0;
			});

			axesTemp.push(
				{
				axis: naics_codes[code],
				value: (code_sum_temp / prov_sum) * 100
				}
			)
		});



		radarDataSet.push([
			{
				className: element,
				axes: axesTemp
			}
		]
		)
	});

}