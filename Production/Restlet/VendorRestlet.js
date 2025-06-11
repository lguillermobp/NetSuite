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

           
            idsearch = "customsearch_vecdvendors";

            var fsearch =search.load({
               id: idsearch
           });
                
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
                        "vendor_id": Number(fresult1.getValue({name: "internalid"})),
                        "vendor_name": fresult1.getValue({name: "entityid"}),
                        "predicteddays": fresult1.getValue({name: "predicteddays"}),
                        "phone": fresult1.getValue({name: "phone"}),
                        "email": fresult1.getValue({name: "email"}),
                        "address": fresult1.getValue({name: "address"}),
                        "currency": fresult1.getText({name: "currency"}),
                        "nobatching": fresult1.getValue({name: "custentity_noppdbatching"}),
                        "showinprojection": fresult1.getValue({name: "custentity_showinprojection"}),
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