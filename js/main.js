
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

            main_vizgaz();
            main_barchart(data, localization);
            linechart(data);

            //TODO
            $(window).resize(function(){
                setTimeout(function() {
                    //barchart1(data, localization);
                }, 100);
            });
        });




})(L, d3, topojson, searchBar, localization);