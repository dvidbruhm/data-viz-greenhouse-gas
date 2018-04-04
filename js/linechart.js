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

    $(".line").hover(
        function(event) {
            // The mouse has entered the element, can reference the element via 'this'
            $("#line-chart-company").text("hovered");
        },
        function (event) {
            // The mouse has left the element, can reference the element via 'this'
            $(".line-chart-tip").children("text").text("unhovered");
        }
     );
    
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
    drawLineChart(default_year_filter, default_prov_filter);
}

function createLineChartAxes() {
    
    lineChartX.domain(default_year_filter);

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
    lineChartXAxis = d3.svg.axis().scale(lineChartX).orient("bottom").tickFormat(d3.format(""))
                        .tickValues(Array(yearFilter[1] - yearFilter[0] + 1).fill(1).map((x, y) => x + y + yearFilter[0] - 1));;
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
                    .attr("clip-path", "url(#clip)")
                    .on("mouseover", lineChartTip)
                    .on("click", lineChartClick)
                    .on("mouseout", lineChartTipOut);
}

var freezed = false;
var freezed_facility = undefined;

function lineChartClick(d){
    if (freezed) {
        if(freezed_facility === d.facility_id){
            freezed = false;
        }
    } else {
        freezed = true;
        freezed_facility = d.facility_id;
    }
}

function lineChartTipOut (d) {
    if(!freezed){
    lineChartGroup.selectAll(".circle-tip")
                .remove();
    lineChartGroup.selectAll(".circle-tip-text")
                .remove();
    lineChartGroup.selectAll("rect")
                .remove();
    d3.select(this).classed("line-hovered", false);
    }
}

function lineChartPoints(d) {

    lineChartGroup.selectAll("rect")
                .data(d.years)
                .enter()         
                .append("rect")
                .attr("y", function(e) {
                    return lineChartY(e.filtered_total_eq) - 16 - 14;
                })
                .attr("fill", "black");

    lineChartGroup.selectAll(".circle-tip")
                .data(d.years)
                .enter()
                .append("circle")
                .attr("class", "circle-tip")
                .attr("r", 8)
                .attr("cx", function(e){
                    return lineChartX(e.year);
                })
                .attr("cy", function(e){
                    return lineChartY(e.filtered_total_eq);
                })
                
    lineChartGroup.selectAll(".circle-tip-text")
                .data(d.years)
                .enter()
                .append("text")
                .attr("class", "circle-tip-text")
                .attr("id", function(e){
                    return "id" + e.year;
                })
                .text(function(e) {
                    return parseInt(e.filtered_total_eq) + " kT";
                })
                .attr("x", function(e) {
                    return lineChartX(e.year);
                })
                .attr("y", function(e) {
                    return lineChartY(e.filtered_total_eq) - 15;
                })
                .attr("text-anchor", "middle")

    lineChartGroup.selectAll("rect")
                    .attr("width", function(e) {
                        return d3.select("#id" + e.year).node().getComputedTextLength() + 6;
                    })
                    .attr("height", 21)
                    .attr("x", function(e) {
                        return lineChartX(e.year) - d3.select("#id" + e.year).node().getComputedTextLength()/2 - 3;
                    })
                
}

function lineChartTip(d) {
    
    if(!freezed){
    
    d3.select(this).classed("line-hovered", true);
    lineChartPoints(d);

    d3.select("#line-chart-company").text(d.company_legal_name)
                                    .attr("title", d.company_legal_name);
    d3.select("#line-chart-facility").text(d.facility_name)
                                    .attr("title", d.facility_name);
    d3.select("#line-chart-address").text(d.facility_address + ", " + d.facility_city + ", " + d.facility_province)
                                    .attr("title", d.facility_address + ", " + d.facility_city + ", " + d.facility_province);
    d3.select("#line-chart-postal").text(d.facility_postal_code)
                                    .attr("title", d.facility_postal_code);
    d3.select("#line-chart-contact-name").text(d.contact_name)
                                    .attr("title", d.contact_name);
    d3.select("#line-chart-contact-phone").text(d.contact_phone)
                                    .attr("title", d.contact_phone);
    d3.select("#line-chart-contact-email").text(d.contact_email)
                                    .attr("title", d.contact_email);
    }
}