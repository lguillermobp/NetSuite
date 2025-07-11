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

            try {
                    contextjson = JSON.parse(context);
                    }
                    catch (e) {
                        log.debug("error",e);
                        contextjson = context;
                    }
            var option= contextjson.option;
           
            idsearch = "customsearch_ecdworkorder";

            var fsearch =search.load({
               id: idsearch
           });

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
                        "wo_id": Number(fresult1.getValue({name: "internalid"})),
                        "wo_section": fresult1.getValue({name: "custbody_section"}),
                        "wo_name": fresult1.getValue({name: "transactionnumber"}),
                        "customer_id": fresult1.getValue({name: "internalid",join: "customerMain"}),  
                        "wo_memo": fresult1.getValue({name: "memo"}), 
                        "productionline_id": fresult1.getValue({name: "custbody_productionline"}),
                        "wo_sts": fresult1.getText({name: "statusref"}),
                        "task_id": Number(fresult1.getValue({name: "custbody_scheduletaskid"})),
                        "task_name": fresult1.getText({name: "custbody_scheduletaskid"}),
                        "tasksc_id": Number(fresult1.getValue({name: "custbody_tasksc"})),
                        "wo_date": fresult1.getValue({name: "trandate"}),
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