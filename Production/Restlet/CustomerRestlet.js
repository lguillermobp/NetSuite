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

            contextjson = JSON.parse(context);
            log.debug("context",contextjson);
            var option= contextjson.option;
            log.debug("option",option);

           
            idsearch = "customsearch_ecdcustomer";

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
                        "internalid": Number(fresult1.getValue({name: "internalid"})),
                        "altname": fresult1.getValue({name: "altname"}),
                        "phone": fresult1.getValue({name: "phone"}),
                        "email": fresult1.getValue({name: "email"}),
                        "address": fresult1.getText({name: "address"}),
                        "ecd_balance": Number(fresult1.getValue({name: "custentity_ecd_balance"})),
                        "ecd_amountpaid": Number(fresult1.getValue({name: "custentity_ecd_amountpaid"}))
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