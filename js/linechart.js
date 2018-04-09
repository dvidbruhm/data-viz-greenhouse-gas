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
var lineChartBrush = undefined;

var currentYearFilter = undefined;
var currentProvFilter = undefined;
var lineChartCurrentData = undefined;


/***** Configuration *****/
var lineChartMargin = {
    top: 55,
    right: 50,
    bottom: 50,
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

    lineChartWidth = parseFloat(lineChartSvg.node().getBoundingClientRect().width) - lineChartMargin.left - lineChartMargin.right;
    lineChartHeight = parseFloat(lineChartSvg.node().getBoundingClientRect().height) - lineChartMargin.top - lineChartMargin.bottom;


    /***** Création des éléments du diagramme à barres *****/
    lineChartSvg.attr("width", lineChartWidth + lineChartMargin.left + lineChartMargin.right)
                .attr("height", lineChartHeight + lineChartMargin.top + lineChartMargin.bottom);
                
    lineChartGroup = lineChartSvg.append("g")
                                    .attr("transform", "translate(" + lineChartMargin.left + "," + lineChartMargin.top + ")");
    
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


    
    
    lineChartBrush = d3.svg.brush()
        .y(lineChartY)
        .on("brushend", brushEnd);
    
    lineChartGroup.append("g")
        .attr("class", "brush")
        .attr("id", "brush")
        .call(lineChartBrush)
        .selectAll("rect")
            .attr("width", lineChartWidth);


    createLineChartAxes();
    updateLineChartData(default_year_filter, default_prov_filter);
    updateXAxis();
    updateYAxisOriginal();
    drawLineChart();

    
}

function resetBrushButton() {
    lineChartUnfreeze();
    updateYAxisOriginal();
    updateXAxis();
    drawLineChart();
}

function brushEnd(){
    lineChartUnfreeze();

    if((lineChartBrush.extent()[1] - lineChartBrush.extent()[0]) / 
        (lineChartY.domain()[1] - lineChartY.domain()[0]) < 0.05) {
            d3.select(".brush").call(lineChartBrush.clear());
            return
        }

    lineChartY.domain(lineChartBrush.extent());
    updateYAxis();

    drawLineChart();
    
    d3.select(".brush").call(lineChartBrush.clear());

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
                    .attr("x", 0)
                    .attr("y", -10)
                    .style("font-size", "6mm")
                    .text("CO\u2082 équivalent [kT]")
                    .attr("text-anchor", "middle");

}

function updateYAxisOriginal() {
    var maxCount = d3.max(lineChartCurrentData, function(d){
        return d3.max(d.years, function(e){
            return e.filtered_total_eq;
        });
    });
    lineChartY.domain([0, maxCount]);
    updateYAxis();
}

function updateYAxis() {

    lineChartYAxis = d3.svg.axis().scale(lineChartY).orient("left");
    
    lineChartGroup.select(".y")
                    .transition(1000)
                    .call(lineChartYAxis);
    
                    
    lineChartGroup.select(".y")
                    .selectAll("text")
                    .style("font-size", "5mm");
    
    lineChartGroup.append("g").select(".y")
                    .transition(1000)
                    .call(lineChartYAxis);
    
    lineChartGroup.append("g").select(".y")
                    .selectAll("text")
                    .style("font-size", "5mm");
}

function updateXAxis() {
    
    lineChartX.domain(currentYearFilter);

    lineChartXAxis = d3.svg.axis().scale(lineChartX).orient("bottom").tickFormat(d3.format(""))
                        .tickValues(Array(currentYearFilter[1] - currentYearFilter[0] + 1).fill(1).map((x, y) => x + y + currentYearFilter[0] - 1));;
    
    lineChartGroup.select(".x")
                    .transition(1000)
                    .call(lineChartXAxis);
        
                        
    lineChartGroup.select(".x")
                    .selectAll("text")
                    .style("font-size", "5mm");
    
}

function updateLineChartData(yearFilter, provinceFilter) {

    lineChartCurrentData = lineChartData.slice();
    lineChartCurrentData = lineChartCurrentData.filter(function(d){
        return provinceFilter[d.facility_province];
    });
    currentYearFilter = yearFilter;
    currentProvFilter = provinceFilter;
}


function drawLineChart() {

    lineChartGroup.selectAll(".line").remove();

    lineChartGroup.append("g")
                    .attr("class", "lines")
                    .selectAll("path")
                    .data(lineChartCurrentData)
                    .enter()
                    .append("path")
                    .attr("class", function(d, i){
                        var min_total = d3.min(d.years, function(e){
                            return e.filtered_total_eq;
                        });
                        var max_total = d3.max(d.years, function(e){
                            return e.filtered_total_eq;
                        });
                        if (min_total < lineChartY.domain()[0] || 
                            max_total > lineChartY.domain()[1]) {
                            return "line-none";
                        }
                        return "line";
                    })
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

function lineChartUnfreeze() {
    freezed = false;
    lineChartTipOut();
    d3.select("#brush").classed("brush-disabled", false);
}

function lineChartClick(d){
    if (freezed) {
        if(freezed_facility === d.facility_id){
            freezed = false;
            d3.select("#brush").classed("brush-disabled", false);
        }
    } else {
        freezed = true;
        freezed_facility = d.facility_id;
        d3.select("#brush").classed("brush-disabled", true);
    }
}

function lineChartTipOut () {
    if(!freezed){
        lineChartGroup.selectAll(".circle-tip")
                    .remove();
        lineChartGroup.selectAll(".circle-tip-text")
                    .remove();
        lineChartGroup.selectAll(".circle-tip-bg")
                    .remove();
        lineChartGroup.selectAll(".circle-tip-bg2")
                    .remove();
        lineChartGroup.select(".line-hovered").classed("line-hovered", false);
    }
}

function lineChartPoints(d) {

    var border = 2;
    var y_offset = 35;

    lineChartGroup.selectAll(".circle-tip-bg2")
                .data(d.years)
                .enter()     
                .append("rect")
                .attr("class", "circle-tip-bg2")
                .attr("y", function(e) {
                    return lineChartY(e.filtered_total_eq) - y_offset - border;
                })
                .attr("fill", "orange");

    lineChartGroup.selectAll(".circle-tip-bg")
                .data(d.years)
                .enter()         
                .append("rect")
                .attr("class", "circle-tip-bg")
                .attr("y", function(e) {
                    return lineChartY(e.filtered_total_eq) - y_offset;
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
                    return lineChartY(e.filtered_total_eq) - y_offset + 15;
                })
                .attr("text-anchor", "middle")

    lineChartGroup.selectAll(".circle-tip-bg2")
                    .attr("width", function(e) {
                        return d3.select("#id" + e.year).node().getComputedTextLength() + 6 + border + border;
                    })
                    .attr("height", 21 + border + border)
                    .attr("x", function(e) {
                        return lineChartX(e.year) - d3.select("#id" + e.year).node().getComputedTextLength()/2 - 3 - border;
                    })
    
    lineChartGroup.selectAll(".circle-tip-bg")
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