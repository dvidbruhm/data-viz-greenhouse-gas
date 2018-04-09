
var globalData = undefined;


(function (L, d3, topojson, searchBar, localization) {

	init_filter_panel();

    /***** Échelles utilisées *****/
    //TODO


    /***** Chargement des données *****/

    d3.queue()
        .defer(d3.tsv, "./data/datat.csv")
        .awaitAll(function (error, results) {
            if (error || results.length !== 1) {
                throw error;
            }
            var rawdata = results[0];

            /***** Prétraitement des données *****/
            var data = cleandata(rawdata);
            globalData = data;
			
			var sumCO2 = 0;
			var i;
			var j;
			
			for (i=0; i<data.length; i++) {
				for (j=0; j<data[i].years.length; j++) {
					sumCO2 = sumCO2 + data[i].years[j].total_eq;
				}
			}
			sumCO2 = sumCO2 / 1000000;
			sumCO2.toFixed(2);
			document.getElementById("listitem1").innerHTML = "Plus de " + sumCO2.toFixed(1) + " mégatonnes de CO<sub class=\"sub-c\">2 eq</sub> ont été émises.";
			document.getElementById("listitem2").innerHTML = data.length + " compagnies ont émis plus de 50 kilotonnes de CO<sub class=\"sub-c\">2 eq</sub> par année.";
			
            main_vizgaz();
            main_barchart(data, localization);
            linechart(data);
            radar(data);
            radarChartLegend();
			
        });

	

})(L, d3, topojson, searchBar, localization);