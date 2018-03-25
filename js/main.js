(function (L, d3, topojson, searchBar, localization) {

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
            console.log(data);
            init_barchart1(data, localization);
            
        });




})(L, d3, topojson, searchBar, localization);