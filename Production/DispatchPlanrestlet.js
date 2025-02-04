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

         function post (_ref) {

            var fsearch =search.load({
               id: "customsearch_dispatchplan"
           });
                

             var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            var i=0;
            var dataf=[];
            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {

                   

                    dataf[i] = {
                        "productionline": fresult1.getText({name: "custbody_productionline"}),
                        "section": fresult1.getText({name: "custbody_ecdsection"}),
                        "task_sc_id": fresult1.getValue({name: "custrecord_so_sc_task", join: "CUSTBODY_TASKSC"}),
                        "task_sc": fresult1.getText({name: "custrecord_so_sc_task", join: "CUSTBODY_TASKSC"}),
                        "task_sc_enddata": fresult1.getValue({name: "custrecord_so_sc_enddate", join: "CUSTBODY_TASKSC"}),

                        "tranid": fresult1.getValue({name: "tranid"}),
                        "trandate": fresult1.getValue({name: "trandate"}),
                        "altname": fresult1.getValue({name: "altname", join: "customerMain"}),
                        "memo": fresult1.getValue({name: "memo"}),
                        "itemid": fresult1.getValue({name: "internalid",join: "item"}),
                        "item": fresult1.getText({name: "item"}),
                     
                        "quantitycommitted": fresult1.getValue({name: "quantitycommitted"}),
                        "quantitytransfered": fresult1.getValue({name: "formulanumeric"}),
                        "itemsleft":fresult1.getValue(fresult1.columns[11]),
                        "quantitybo": fresult1.getValue(fresult1.columns[12]),
                        "totalitemsbo": fresult1.getValue({name: "custbody_totalitemsbo"}),
                        "invoicedate": fresult1.getValue({name: "custbody_invoicedate"}),
                        "dateformula": fresult1.getValue({name: "formuladate"}),
                        "wo_id": fresult1.getValue({name: "internalid"})
                    }
                    log.audit("i", i);
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