"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(["N/query", "N/record",  "N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (query, record, log, GENERALTOOLS) {

         function get (_ref) {

            return _ref;
        }

         function post (context) {

            log.debug("context",context);
            try {
            contextjson = JSON.parse(context);
            }
            catch (e) {
                log.debug("error",e);
                contextjson = context;
            }

            var dataf = [];
            var i = 0;
            var option= contextjson.option;
            log.debug("option",option); 

            const sql = " select * from InventoryBalance where location in(1 , 5) and TRIM(TO_CHAR (lastmodifieddate, 'DS' ))  = TRIM(TO_CHAR (CURRENT_DATE, 'DS' ));   ";

            var results = query.runSuiteQL({ query: sql }).asMappedResults();
            
             results.forEach(function (fresult1) {
                    
                    dataf[i] = {
                        "bin_id": Number(fresult1.binnumber),
                        "item_id": Number(fresult1.item),
                        "item_name": " ",
                        "location_id": Number(fresult1.location),
                        "location_name": " ",
                        "onhand": Number(fresult1.quantityonhand),
                        "available": Number(fresult1.quantityavailable),
                        "stock_unit": " "
                    }
                    i++;

                })


            return dataf;
        }


        return {
            get: get,
            post: post

        };
    });