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
               id: "customsearch_ppdforecdview"
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
                        "ppd_id": fresult1.getValue({name: "internalid", join: "CUSTRECORD_PPD_CODE"}),
                        "ppd_code": fresult1.getValue({name: "name"}),
                        "po_id": fresult1.getValue({name: "custrecord_poid"}),
                        "po_name": fresult1.getText({name: "custrecord_poid"}),
                        "customer_id": fresult1.getValue({name: "custrecord_ppd_customer", join: "CUSTRECORD_PPD_CODE"}),
                        "vendor_id": fresult1.getValue({name: "custrecord_ppd_vendor", join: "CUSTRECORD_PPD_CODE"}),
                        "vendor_name": fresult1.getText({name: "custrecord_ppd_vendor", join: "CUSTRECORD_PPD_CODE"}),
                        "item_id": fresult1.getValue({name: "custrecord_ppd_item", join: "CUSTRECORD_PPD_CODE"}),
                        "item_name": fresult1.getText({name: "custrecord_ppd_item", join: "CUSTRECORD_PPD_CODE"}),
                        "ppd_qty": fresult1.getValue({name: "custrecord_ppd_quantity", join: "CUSTRECORD_PPD_CODE"}),
                        "po_qty": fresult1.getValue({name: "quantity", join: "CUSTRECORD_POID"}),
                        "po_tracking": fresult1.getValue({name: "trackingnumbers", join: "CUSTRECORD_POID"}) + " " + fresult1.getValue({name: "custbody_addtracking", join: "CUSTRECORD_POID"}),
                        "po_exp_receiptdate": fresult1.getValue({name: "expectedreceiptdate", join: "CUSTRECORD_POID"}),
                        "po_status": fresult1.getValue({name: "statusref", join: "CUSTRECORD_POID"}),
                        "item_rate": fresult1.getValue({name: "rate", join: "CUSTRECORD_POID"}),
                        "po_currency": fresult1.getText({name: "currency", join: "CUSTRECORD_POID"}),
                        "po_currencyrate": fresult1.getValue({name: "exchangerate", join: "CUSTRECORD_POID"}),
                        "po_date": fresult1.getValue({name: "trandate", join: "CUSTRECORD_POID"}),
                        "po_datecreated": fresult1.getValue({name: "datecreated", join: "CUSTRECORD_POID"}),
                        "po_location": fresult1.getText({name: "location", join: "CUSTRECORD_POID"})
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