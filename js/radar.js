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

var circle_width = 5;
var circle_width_hovered = 10;

var radarDataSet = [];
var radarChartGroup = undefined;
var radarChart = undefined;
var radarConfig = undefined;


function radar(data) {


	var radarChartSvg = d3.select("#svg-radar");
    radarChartSvg.select("g").remove();

    radarChartWidth = parseFloat(radarChartSvg.node().getBoundingClientRect().width) - radarChartMargin.left - radarChartMargin.right;
    radarChartHeight = parseFloat(radarChartSvg.node().getBoundingClientRect().height) - radarChartMargin.top - radarChartMargin.bottom;


    /***** Création des éléments du diagramme à barres *****/
    radarChartSvg.attr("width", radarChartWidth + radarChartMargin.left + radarChartMargin.right)
                .attr("height", radarChartHeight + radarChartMargin.top + radarChartMargin.bottom);
                
    radarChartGroup = radarChartSvg.append("g")
                                    .attr("transform", "translate(" + radarChartMargin.left + "," + radarChartMargin.top + ")");
	

	radarChart = RadarChart.chart();
								
	//radarChart.config({w: radarChartWidth / 4, h: radarChartHeight / 3, axisText: true, levels: 5, circles: true});
	radarConfig = radarChart.config();
	
	radarConfig.w = radarChartWidth / 4;
	radarConfig.h = radarChartHeight / 3;
	radarConfig.radius = circle_width;
	radarConfig.levels = 3;
	radarConfig.minValue = -10;
	radarConfig.maxValue = 100;
	radarConfig.axisLine = true;
	radarConfig.axisText = true;
	radarConfig.color = function() {};
	radarConfig.factor = 0.8;
	radarConfig.factorLegend = 0.9;
	radarConfig.transitionDuration = 2000;

	var provinces = d3.keys(default_prov_filter);

	for(var i = 0; i < 12; i++) {
		var prov = provinces[i];
		console.log("allo")
		radarChartGroup.append("text")
						.attr("x", function(){
							return ((i % 4) * radarConfig.w) + 20;
						})
						.attr("y", function(){
							return ((parseInt(i / 4)) % 3 * radarConfig.h) + 20;
						})
						.text(function(){
							return prov;
						})
						.classed("radar-prov-label", true);

	}
  

	createRadarData(data, default_year_filter);
	drawRadarChart();
}

var olddata = []
function drawRadarChart(){

	console.log(radarDataSet);
	radarChartGroup.selectAll('g.radar-chart').remove();

	radarChartGroup.selectAll('g.radar-chart')
					.data(radarDataSet)
					.enter()
					.append('g')
					.classed('radar-chart', true)
					.attr('transform', function(d, i) { 
						return 'translate('+ ((i % 4) * radarConfig.w) +','+ ((parseInt(i / 4)) % 3 * radarConfig.h) +')'; 
					})
					.call(radarChart);



	radarChartGroup.selectAll(".circle")
		.on("mouseover", function(d){
			radarChartGroup.selectAll(".circle")
							.attr("stroke", function(e) {
								if (d[0].axis === e[0].axis){
									var x = d3.select(this).attr("cx");
									var y = d3.select(this).attr("cy");
									var elem = d3.select(this).node();
									var pos = convertCoordsToAbsolute(elem,x,y);

									var value = e[0].value;

									var y_offset = 25;
									var x_offset = 8;
									var border = 2;

									d3.select(this)
										.classed("hovered", true)
										.attr("r", circle_width_hovered);

									radarChartGroup.append("rect")
												.attr("class", "radar-tip-bg2")
												.attr("id", "radar-tip-bg2" + parseInt(pos.x + pos.y))
												.attr("y", function() {
													var y_offset2 = 0;
													if(e[0].axis === "Extraction minière")
														y_offset2 += 0;
													return pos.y - y_offset - border - y_offset2;
												})
												.attr("fill", "orange");

									radarChartGroup.append("rect")
												.attr("class", "radar-tip-bg")
												.attr("id", "radar-tip-bg" + parseInt(pos.x + pos.y))
												.attr("y", function() {
													var y_offset2 = 0;
													if(e[0].axis === "Extraction minière")
														y_offset2 += 0;
													return pos.y - y_offset - y_offset2;
												})
												.attr("fill", "black");

									radarChartGroup.append("text")
												.attr("class", "radar-tip-text")
												.text(function() {
													return value.toFixed(2) + " %";
												})
												.attr("id", "radar-text-id" + parseInt(pos.x + pos.y))
												.attr("text-anchor", "middle")
												.attr("x", function() {
													return pos.x + circle_width_hovered/2 + x_offset;
												})
												.attr("y", function() {
													var y_offset2 = 0;
													if(e[0].axis === "Extraction minière")
														y_offset2 += 0;
													return pos.y - y_offset + 15 - y_offset2;
												});
									
									d3.select("#radar-tip-bg2" + parseInt(pos.x + pos.y))
												.attr("width", function() {
													return d3.select("#radar-text-id" + parseInt(pos.x + pos.y)).node().getComputedTextLength() + 15 + border + border;
												})
												.attr("height", 21 + border + border)
												.attr("x", function() {
													return pos.x - d3.select("#radar-text-id" + parseInt(pos.x + pos.y)).node().getComputedTextLength()/2 - 3 - border + x_offset;
												});
								
									d3.select("#radar-tip-bg" + parseInt(pos.x + pos.y))
												.attr("width", function() {
													return d3.select("#radar-text-id" + parseInt(pos.x + pos.y)).node().getComputedTextLength() + 15;
												})
												.attr("height", 21)
												.attr("x", function() {
													return pos.x - d3.select("#radar-text-id" + parseInt(pos.x + pos.y)).node().getComputedTextLength()/2 - 3 + x_offset;
												});
								}
							});
		})
		.on("mouseout", function(d){
			radarChartGroup.selectAll(".circle")
							.attr("stroke", function(e) {
								if (d[0].axis === e[0].axis){
									radarChartGroup.selectAll(".radar-tip-text").remove();
									radarChartGroup.selectAll(".radar-tip-bg").remove();
									radarChartGroup.selectAll(".radar-tip-bg2").remove();
									d3.select(this).classed("hovered", false).attr("r", circle_width);
								}
							});
		});

}

function convertCoordsToAbsolute(elem,x,y) {

	var offset = radarChartGroup.node().getBoundingClientRect();
  
	var matrix = elem.getScreenCTM();
  
	return {
	  x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
	  y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
	};
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
				value: (prov_sum > 0.00001 ? (code_sum_temp / prov_sum) * 100 : 0)
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