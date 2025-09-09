"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record",  "N/log","/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/LoDash.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (search, record, log, GENERALTOOLS, _) {

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

            log.debug("context",contextjson);
            var option= contextjson.option;
            log.debug("option",option);

            if (option == "1") {
                idsearch = "customsearch_dispatchplan";
                }
                else if (option == "2") {
                    idsearch = "customsearch_dispatchplan_2";
                }
                else if (option == "U") {
                    idsearch = "customsearch_dispatchplan_upd";
                }
                
            

            var fsearch =search.load({
               id: idsearch
           });
                

             var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            var i=0;
            var dataf=[];
            var salesOrderData = []; 
            pagedData.pageRanges.forEach(function (pageRange) {
                log.audit(pageRange.index);
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {

                     if (isNaN(fresult1.getValue({name: "vendor",join: "item"})) || fresult1.getValue({name: "vendor",join: "item"}) == null || fresult1.getValue({name: "vendor",join: "item"}) == "") 
                        {
                            vendor_id = 0;
                            vendor_name = "";
                        }
                        else {
                            vendor_id = fresult1.getValue({name: "vendor",join: "item"})
                            vendor_name = fresult1.getText({name: "vendor",join: "item"});
                        }

                        invoicedate=fresult1.getValue({name: "custbody_invoicedate",join: "CUSTBODY_QUOTE_SC"});
                        if (invoicedate) {
                            var dateParts = invoicedate.split('/');
                            var month = parseInt(dateParts[0], 10) - 1; // Month is 0-indexed in Date object
                            var day = parseInt(dateParts[1], 10);
                            var year = parseInt(dateParts[2], 10);
                            invoicedate = new Date(year, month, day);
                        }
                        dateformula=fresult1.getValue({name: "formuladate"});
                        if (dateformula.length == 0) {
                            dateformula = '01/01/2020';
                        }
                     
                        

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
                        "quantitycommitted": Number(fresult1.getValue({name: "quantitycommitted"})),
                        "quantitytransfered": Number(fresult1.getValue(fresult1.columns[10])),
                        "itemsleft": Number(fresult1.getValue(fresult1.columns[11])),
                        "quantitybo": Number(fresult1.getValue(fresult1.columns[12])),
                        "totalitemsbo": Number(fresult1.getValue(fresult1.columns[13])),
                        "memo": fresult1.getValue({name: "memo"}),
                        "item_id": fresult1.getValue({name: "internalid",join: "item"}),
                        "item": fresult1.getText({name: "item"}),
                        "dateformula": dateformula,
                        "invoicedate": fresult1.getValue({name: "custbody_invoicedate",join: "CUSTBODY_QUOTE_SC"}),
                        "invoicedate1": invoicedate,
                        "wo_id": Number(fresult1.getValue({name: "internalid"})),
                        "so_id": Number(fresult1.getValue({name: "internalid",join: "CUSTBODY_QUOTE_SC"})),
                        "ECD_Model": fresult1.getText({name: "custbody_appf_veh_model",join: "CUSTBODY_QUOTE_SC"}),
                        "vendor_id": vendor_id,
                        "vendor_name": vendor_name,
                        "quantity": Number(fresult1.getValue({name: "quantity"})),
                        "line_id": fresult1.getValue({name: "line"}),
                        "whonhand": Number(fresult1.getValue(fresult1.columns[27])),
                    }
                    i++;

                })
                salesOrderData = _.sortBy(dataf, ["item_id", "invoicedate1"]);
            })

            return salesOrderData;
        }


        return {
            get: get,
            post: post

        };
    });