
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

            main_barchart(data, localization);
            main_vizgaz();
        });




})(L, d3, topojson, searchBar, localization);