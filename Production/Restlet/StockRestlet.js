"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record",  "N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (search, record, log, GENERALTOOLS) {

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

            
            var option= contextjson.option;
            log.debug("option",option); 

           
            idsearch = "customsearch_ecd_inventorydetail";


             try {
                var fsearch =search.load({
                            id: idsearch
                    });
                log.debug({ title: 'Search loaded successfully', details: fsearch });

                } catch (error) {
                log.error({ title: 'Error loading saved search', details: error });
                }
                
             var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            var i=0;
            var dataf=[];
            pagedData.pageRanges.forEach(function (pageRange) {
                log.audit(pageRange.index);
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {
                    
                    dataf[i] = {
                        "bin_id": Number(fresult1.getValue({name: "internalid",     join: "binNumber",  summary: "GROUP"})),
                        "item_id": Number(fresult1.getValue({name: "item", summary: "GROUP"})),
                        "item_name": fresult1.getText({name: "item", summary: "GROUP"}),
                        "location_id": Number(fresult1.getValue({name: "location", summary: "GROUP"})),
                        "location_name": fresult1.getText({name: "location", summary: "GROUP"}),
                        "onhand": Number(fresult1.getValue({name: "binnumberquantity", summary: "SUM"})),
                        "available": Number(fresult1.getValue({name: "binnumberquantity", summary: "SUM"})),
                        "stock_unit": fresult1.getText({name: "stockunit",      join: "item",    summary: "GROUP"})
                    }
                    i++;

                })
            })

            return dataf;
        }


        return {
            get: get,
            post: post

        };
    });