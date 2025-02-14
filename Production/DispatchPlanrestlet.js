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
                        "productionlineid": fresult1.getValue({name: "custbody_productionline"}),
                        "section": fresult1.getText({name: "custbody_ecdsection"}),
                        "task_sc_id": fresult1.getValue({name: "custrecord_so_sc_task", join: "CUSTBODY_TASKSC"}),
                        "task_sc": fresult1.getText({name: "custrecord_so_sc_task", join: "CUSTBODY_TASKSC"}),
                        "task_sc_enddate": fresult1.getValue({name: "custrecord_so_sc_enddate", join: "CUSTBODY_TASKSC"}),

                        "tranid": fresult1.getValue({name: "tranid"}),
                        "trandate": fresult1.getValue({name: "trandate"}),
                        "customer_id": fresult1.getText({name: "internalid", join: "customerMain"}),
                        "altname": fresult1.getValue({name: "altname", join: "customerMain"}),
                        
                     
                        "quantitycommitted": fresult1.getValue({name: "quantitycommitted"}),
                        "quantitytransfered": fresult1.getValue(fresult1.columns[10]),
                        "itemsleft":fresult1.getValue(fresult1.columns[11]),
                        "quantitybo": fresult1.getValue(fresult1.columns[12]),
                        "totalitemsbo": fresult1.getValue({name: "custbody_totalitemsbo"}),
                        "invoicedate": fresult1.getValue({name: "custbody_invoicedate",join: "CUSTBODY_QUOTE_SC"}),
                        "memo": fresult1.getValue({name: "memo"}),
                        "item_id": fresult1.getValue({name: "internalid",join: "item"}),
                        "item": fresult1.getText({name: "item"}),
                        "dateformula": fresult1.getValue({name: "formuladate"}),
                        "wo_id": fresult1.getValue({name: "internalid"}),
                        "so_id": fresult1.getValue({name: "internalid",join: "CUSTBODY_QUOTE_SC"}),
                        "ECD_Model": fresult1.getText({name: "custbody_appf_veh_model",join: "CUSTBODY_QUOTE_SC"}),
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