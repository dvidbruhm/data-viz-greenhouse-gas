/* TODO
Mettre des belles couleurs
Enlever le mouseover
Ajouter le text pour chaque gaz
*/
var listGaz = [
{name: "text1", ratio: 1, color: "#C3AD6F"},
{name: "CO2", ratio: 1, color: "#C3AD6F"},
{name: "CH4", ratio: 25, color: "#C2AA67"},
{name: "HFC-152a", ratio: 124, color: "#C1A860"},
{name: "N2O", ratio: 298, color: "#C0A659"},
{name: "HFC-32", ratio: 675, color: "#BFA452"},
{name: "HFC-134", ratio: 1100, color: "#BEA24B"},
{name: "HFC-134a", ratio: 1430, color: "#BDA044"},
{name: "HFC-227ea", ratio: 3220, color: "#BC9E3D"},
{name: "HFC-125", ratio: 3500, color: "#BB9C36"},
{name: "HFC-143a", ratio: 4470, color: "#BA9A2F"},
{name: "CF4", ratio: 7390, color: "#B99827"},
{name: "C4F8", ratio: 10300, color: "#B89620"},
{name: "C2F6", ratio: 12200, color: "#B79419"},
{name: "HFC-23", ratio: 14800, color: "#B69212"},
{name: "SF6", ratio: 22800, color: "#B5900B"}
];

listGaz = listGaz.reverse();

var gaz_svg = d3.select("#viz-gaz");
var svg_width = 0;
var svg_height = 0;

var zoom = 500;

var color = d3.scale.ordinal()
		.domain([...new Set(listGaz.map(item => item.name))])
		.range([...new Set(listGaz.map(item => item.color))]);
	
//var gaz_rect = gaz_svg.selectAll("rect");
//var gaz_text = gaz_svg.selectAll("text");

function main_vizgaz() {
	svg_height = gaz_svg.node().getBoundingClientRect().height;
	svg_width = gaz_svg.node().getBoundingClientRect().width;
	zoom = svg_height;
	$( "#slider-gaz" ).slider({
       min: (100*Math.log(svg_height/(500*Math.sqrt(1)))/Math.log(0.4)),
       max: (100*Math.log(svg_height/(500*Math.sqrt(22800)))/Math.log(0.4)),
       value: (100*Math.log(svg_height/(500*Math.sqrt(1)))/Math.log(0.4)),
       slide: function(event, ui) {
          zoom = 500*Math.pow(0.4,(ui.value/100));
		  redraw_gaz();
       }
    });
	draw_gaz();	
}

function draw_gaz() {

	gaz_svg.selectAll("rect")
		.data(listGaz)
		.enter()
		.append("rect")
		.attr("width", function(d) {
			return Math.sqrt(d.ratio)*zoom;
		})
		.attr("height", function(d) {
			return Math.sqrt(d.ratio)*zoom;
		})
		.attr("x", 0)
		.attr("y", 0)
		.attr("fill", function(d) {
			return color(d.name);
		})
		.attr("stroke", "black")
		.style("opacity", function(d) {
			if (d.name.substring(0,4) == "text") {
				return 0;
			} else {
				return 1;
			}});
		
	gaz_svg.selectAll("text.NomGaz")
		.data(listGaz)
		.enter()
		.append("text")
		.attr("class", "NomGaz")
		.attr("fill", "black")
		.attr("stroke", "black")
		.attr("text-anchor", "middle")
		.text(function(d) {
			if (d.name == "text1") {
				return ("Le CO2 est utilisé comme référence pour comparer l'effet de serre des gaz.");
			} else if (d.name == "CO2") {
				return ("Ce carré représente l'impact d'une tonne de CO2.");
			} else {
				return ("1 tonne de " + d.name + "  a le même effet que " + d.ratio + " tonnes de CO2.");
			} 
		})
		.attr("x", function(d) {
			return (Math.sqrt(d.ratio)*zoom/2);
		})
		.attr("y", function(d) {	
			if (d.name == "text1") {
				return Math.sqrt(d.ratio)*zoom*0.5;
			} else {
				return Math.sqrt(d.ratio)*zoom*0.99;
			} 
		})
		.attr("font-size", function(d) {
			if (d.name == "text1") {
				return Math.sqrt(d.ratio*0.8)*zoom/30;
			} else {
				return Math.sqrt(d.ratio)*zoom/30;
			} 
		});
}

function redraw_gaz() {
	gaz_svg.selectAll("rect")
		.data(listGaz)
		.transition()
		.duration(5)
		.attr("width", function(d) {
			return Math.sqrt(d.ratio)*zoom;
		})
		.attr("height", function(d) {
			return Math.sqrt(d.ratio)*zoom;
		})
		.attr("x", function(d) {
			if (d.name == "text1") {
				return (1-Math.sqrt(d.ratio))*zoom/2;
			} else {
				return 0;
			}
		})
		.attr("y", function(d) {
			if (d.name == "text1") {
				return (1-Math.sqrt(d.ratio))*zoom/2;
			} else {
				return 0;
			}
		});
	
	gaz_svg.selectAll("text.NomGaz")
		.data(listGaz)
		.transition()
		.duration(5)
		.attr("x", function(d) {
			return (Math.sqrt(d.ratio)*zoom/2);
		})
		.attr("y", function(d) {	
			if (d.name == "text1") {
				return Math.sqrt(d.ratio)*zoom*0.5;
			} else {
				return Math.sqrt(d.ratio)*zoom*0.99;
			} 
		})
		.attr("font-size", function(d) {
			if (d.name == "text1") {
				return Math.sqrt(d.ratio*0.8)*zoom/30;
			} else {
				return Math.sqrt(d.ratio)*zoom/30;
			} 
		});
}