/* TODO
Mettre des belles couleurs
Enlever le mouseover
Ajouter le text pour chaque gaz
*/
var listGaz = [
{name: "text1", ratio: 1},
{name: "text2", ratio: 1},
{name: "text3", ratio: 25},
{name: "CO2", ratio: 1},
{name: "CH4", ratio: 25},
{name: "HFC-152a", ratio: 124},
{name: "N2O", ratio: 298},
{name: "HFC-32", ratio: 675},
{name: "HFC-134", ratio: 1100},
{name: "HFC-134a", ratio: 1430},
{name: "HFC-227ea", ratio: 3220},
{name: "HFC-125", ratio: 3500},
{name: "HFC-143a", ratio: 4470},
{name: "CF4", ratio: 7390},
{name: "C4F8", ratio: 10300},
{name: "C2F6", ratio: 12200},
{name: "HFC-23", ratio: 14800},
{name: "SF6", ratio: 22800}
];

listGaz = listGaz.reverse();

var listNom = [
"text1",
"text2",
"text3",
"CO2",
"CH4",
"HFC-152a",
"N2O",
"HFC-32",
"HFC-134",
"HFC-134a",
"HFC-227ea",
"HFC-125",
"HFC-143a",
"CF4",
"C4F8",
"C2F6",
"HFC-23",
"SF6"
];

var listColor = [
"#C3AD6F",
"#C3AD6F",
"#C3AD6F",
"#C3AD6F",
"#C2AA67",
"#C1A860",
"#C0A659",
"#BFA452",
"#BEA24B",
"#BDA044",
"#BC9E3D",
"#BB9C36",
"#BA9A2F",
"#B99827",
"#B89620",
"#B79419",
"#B69212",
"#B5900B"
];

var gaz_svg = d3.select("#viz-gaz");
var svg_width = 0;
var svg_height = 0;

var zoom = 500;

var color = d3.scale.ordinal()
		.domain(listNom)
		.range(listColor);
	
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
		  console.log(zoom);
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
		
	gaz_svg.selectAll("text")
		.data(listGaz)
		.enter()
		.append("text")
		.attr("fill", "black")
		.attr("stroke", "black")
		.attr("text-anchor", function(d) {
			if (d.name.substring(0,4) == "text") {
				return "middle";
			} else {
				return "end";
			} 
		})
		.text(function(d) {
			if (d.name == "text1") {
				return ("Le CO2 est utilisé comme référence pour comparer l'effet de serre des gaz.");
			} else if (d.name == "text2") {
				return ("Ce carré représente l'impact d'une tonne de CO2.");
			} else if (d.name == "text3") {
				return("Une tonne de CH4 a le même effet que 25 tonnes de CO2.");
			} else {
				return d.name;
			} 
		})
		.attr("x", function(d) {
			if (d.name.substring(0,4) == "text") {
				return (Math.sqrt(d.ratio)*zoom/2);
			} else {
				return (Math.sqrt(d.ratio)*zoom*0.99);
			}
		})
		.attr("y", function(d) {	
			if (d.name == "text1") {
				return Math.sqrt(d.ratio)*zoom*29/60;
			} else if (d.name == "text2") {
				return Math.sqrt(d.ratio)*zoom*32/60;
			} else if (d.name == "text3") {
				return Math.sqrt(d.ratio)*zoom*0.5;
			} else {
				return Math.sqrt(d.ratio)*zoom*0.99;
			} 
		})
		.attr("font-size", function(d) {
			if (d.name.substring(0,4) == "text") {
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
	
	gaz_svg.selectAll("text")
		.data(listGaz)
		.transition()
		.duration(5)
		.attr("x", function(d) {
			if (d.name.substring(0,4) == "text") {
				return (Math.sqrt(d.ratio)*zoom/2);
			} else {
				return (Math.sqrt(d.ratio)*zoom*0.99);
			}
		})
		.attr("y", function(d) {	
			if (d.name == "text1") {
				return Math.sqrt(d.ratio)*zoom*29/60;
			} else if (d.name == "text2") {
				return Math.sqrt(d.ratio)*zoom*32/60;
			} else if (d.name == "text3") {
				return Math.sqrt(d.ratio)*zoom*0.5;
			} else {
				return Math.sqrt(d.ratio)*zoom*0.99;
			} 
		})
		.attr("font-size", function(d) {
			if (d.name.substring(0,4) == "text") {
				return Math.sqrt(d.ratio*0.8)*zoom/30;
			} else {
				return Math.sqrt(d.ratio)*zoom/30;
			} 
		});
}