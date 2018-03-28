/* TODO
Mettre des belles couleurs
Enlever le mouseover
Ajouter le text pour chaque gaz
*/
var listGaz = [
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
var gaz_svg = d3.select("#viz-gaz");
var svg_width = 0;
var svg_height = 0;

var zoom = 180;

function main_vizgaz() {
	svg_height = gaz_svg.node().getBoundingClientRect().height;
	svg_width = gaz_svg.node().getBoundingClientRect().width;
	console.log(svg_height);
	$( "#slider-gaz" ).slider({
       min: 1,
       max: 200,
       value: zoom,
       slide: function(event, ui) {
          zoom = ui.value;
		  redraw_gaz();
       }
    });
	
	draw_gaz();	
}

function draw_gaz() {
	var color = d3.scale.category20();
	color.domain(listNom);
	
	var gaz_rect = gaz_svg.selectAll("rect");
		
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
		.attr("x", function(d) {
			return svg_width/2-Math.sqrt(d.ratio)*zoom/2;
		})
		.attr("y", function(d) {
			return svg_height/2-Math.sqrt(d.ratio)*zoom/2;
		})
		.attr("fill", function(d) {
				return color(d.name);
			}
		)
		.style("opacity", 1);
}

function redraw_gaz() {
	gaz_svg.selectAll("rect")
		.data(listGaz)
		.transition()
		.duration(100)
		.attr("width", function(d) {
			return Math.sqrt(d.ratio)*zoom;
		})
		.attr("height", function(d) {
			return Math.sqrt(d.ratio)*zoom;
		})
		.attr("x", function(d) {
			return svg_width/2-Math.sqrt(d.ratio)*zoom/2;
		})
		.attr("y", function(d) {
			return svg_height/2-Math.sqrt(d.ratio)*zoom/2;
		});
	
}