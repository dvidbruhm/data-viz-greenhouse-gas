// 21: Extraction minière, de pétrole et de gaz
// 22: Services publics
// 31-33: Fabrication
// Ça couvre plus de 98%

var naics_codes = {
	"21": "Extraction minière",
	"3": "Fabrication",
	"22": "Services publics",
	"48": "Transport",
	"99": "Autre"
}

var provFull = {
	"QC": "Québec",
	"BC": "Colombie-Britannique",
	"NB": "Nouveau-Brunswick",
	"AB": "Alberta",
	"PE": "Ile-du-Prince-Edouard",
	"MB": "Manitoba",
	"SK": "Saskatchewan",
	"NS": "Nouvelle-Écosse",
	"NL": "Terreneuve",
	"ON": "Ontario",
	"NT": "Territoire du Nord-Ouest",
	"NU": "Nunavut"
}

/***** Configuration *****/
var radarChartMargin = {
    top: 30,
    right: 0,
    bottom: 0,
    left: 0
};

var circle_width = 3;
var circle_width_hovered = 6;

var radarDataSet = [];
var radarChartGroup = undefined;
var radarChart = undefined;
var radarConfig = undefined;


function radar(data) {


	var radarChartSvg = d3.select("#svg-radar");
    radarChartSvg.select("g").remove();

    radarChartWidth = parseFloat(radarChartSvg.node().getBoundingClientRect().width) - radarChartMargin.left - radarChartMargin.right;
    radarChartHeight = parseFloat(radarChartSvg.node().getBoundingClientRect().height) - radarChartMargin.top - radarChartMargin.bottom;

    radarChartSvg.attr("width", radarChartWidth + radarChartMargin.left + radarChartMargin.right)
                .attr("height", radarChartHeight + radarChartMargin.top + radarChartMargin.bottom);
                
    radarChartGroup = radarChartSvg.append("g")
                                    .attr("transform", "translate(" + radarChartMargin.left + "," + radarChartMargin.top + ")");
	

	radarChart = RadarChart.chart();
								
	radarConfig = radarChart.config();
	
	radarConfig.w = radarChartWidth / 4;
	radarConfig.h = radarChartHeight / 3;
	radarConfig.radius = circle_width;
	radarConfig.levels = 1;
	radarConfig.minValue = -6;
	radarConfig.maxValue = 100;
	radarConfig.axisLine = true;
	radarConfig.axisText = false;
	radarConfig.color = function() {};
	radarConfig.factor = 0.8;
	radarConfig.transitionDuration = 2000;

	var provinces = d3.keys(default_prov_filter);

	for(var i = 0; i < 12; i++) {
		var prov = provinces[i];
		radarChartGroup.append("text")
						.attr("x", function(){
							return ((i % 4) * radarConfig.w) + radarChartWidth/8;
						})
						.attr("y", function(){
							return ((parseInt(i / 4)) % 3 * radarConfig.h) + 10;
						})
						.text(function(){
							return provFull[prov];
						})
						.attr("text-anchor", "middle")
						.classed("radar-prov-label", true);

	}
  

	createRadarData(data, default_year_filter);
	drawRadarChart();
	
}

function drawRadarChart(){

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
									var pos = {x : elem.getBoundingClientRect().x - $(".filter-space").width(), 
											y: elem.getBoundingClientRect().y - $(window).height()*0.08 - 30}

									var value = e[0].value;

									var y_offset = 30;
									var x_offset = 0;
									var border = 2;

									d3.select(this)
										.classed("hovered", true)
										.attr("r", circle_width_hovered);

									radarChartGroup.append("rect")
												.attr("class", "radar-tip-bg2")
												.attr("id", "radar-tip-bg2" + parseInt(pos.x + pos.y))
												.attr("y", function() {
													return pos.y - y_offset - border;
												})
												.attr("fill", "orange");

									radarChartGroup.append("rect")
												.attr("class", "radar-tip-bg")
												.attr("id", "radar-tip-bg" + parseInt(pos.x + pos.y))
												.attr("y", function() {
													return pos.y - y_offset;
												})
												.attr("fill", "black");

									radarChartGroup.append("text")
												.attr("class", "radar-tip-text")
												.text(function() {
													return e[0].axis + " : " + value.toFixed(2) + " %";
												})
												.attr("id", "radar-text-id" + parseInt(pos.x + pos.y))
												.attr("text-anchor", "middle")
												.attr("x", function() {
													return pos.x + circle_width_hovered/2 + x_offset;
												})
												.attr("y", function() {
													return pos.y - y_offset + 15;
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


function radarChartLegend() {

	var axes = [];

	d3.keys(naics_codes).forEach(code => {
		axes.push(
			{
				axis: naics_codes[code],
				value: 0
			}
		);
	});

	var legendData = [{
		className: "legend",
		axes: axes
	}];

	var legendChartWidth = parseFloat(d3.select(".filter-space").node().getBoundingClientRect().width) - 30;
	var legendChartHeight = parseFloat(d3.select(".filter-space").node().getBoundingClientRect().height);

	var legendCfg = {
		w: legendChartWidth,
		h: legendChartWidth,
		minValue: 0,
		maxValue: 100,
		levels: 1,
		factor: 0.5,
		factorLegend: 0.7,
		radius: 0,
		color: function() {},
	}

	  
	var legendChartSvg = d3.select("#svg-radar-legend");	
	legendChartSvg.attr("width", legendChartWidth)
					.attr("height", legendChartWidth);


	RadarChart.draw("#svg-radar-legend", legendData, legendCfg);

	d3.select("#svg-radar-legend.polygon").attr("stroke", "rgba(0,0,0,0)");

	legendChartSvg.selectAll(".legend.left")
					.text(function(d){
						var y = d3.select(this).attr("y");
						var x = d3.select(this).attr("x");
						var name = d3.select(this).text().split(" ")[0];
						
						legendChartSvg.append("text")
										.classed("axis", true)
										.text(function(){
											if (name === "Extraction") {
												return "Minière";
											}
											return "publics";
										})
										.attr("text-anchor", "middle")
										.attr("dy", function(){
											if (name === "Extraction") {
												return "1.5em";
											}
											return "1.0em";
										})
										.style("color", "white")
										.attr("y", function(){
											return y;
										})
										.attr("x", function(){
											return x;
										});

						return name;
					});


}