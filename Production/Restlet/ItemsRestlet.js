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

           
            idsearch = "customsearch_ecd_items";


             try {
                var fsearch =search.load({
                            id: idsearch
                    });
                log.debug({ title: 'Search loaded successfully', details: fsearch });

                } catch (error) {
                log.error({ title: 'Error loading saved search', details: error });
                }

                   if (option == "U") {

                var defaultFilters = fsearch.filters;
                var customFilters = [];
                
                customFilters = {
                    name: "lastmodifieddate",
                    operator: "within",
                    values: "today",
                    isor: false,
                    isnot: false,
                    leftparens: 0,
                    rightparens: 0

                };

                defaultFilters.push(customFilters);
                fsearch.filters = defaultFilters;           
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
                        "bin_id": 0,
                        "item_id": Number(fresult1.getValue({name: "internalid"})),
                        "item_name": fresult1.getValue({name: "itemid"}),
                        "item_description": fresult1.getValue({name: "purchasedescription"}),
                        "item_unit": fresult1.getText({name: "unitstype"}),
                        "exclude_projections": fresult1.getValue({name: "custitem_exclude_viewecd"}),
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