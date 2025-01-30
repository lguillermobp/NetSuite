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
               id: "customsearch_ppddashboard"
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
                        "custrecord_ppdid": fresult1.getText({name: "custrecord_ppdid", summary: "GROUP"}),
                        "name": fresult1.getValue({name: "name", summary: "GROUP"}),
                        "custrecord_ppd_productionline": fresult1.getText({name: "custrecord_ppd_productionline", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custrecord_ppd_task": fresult1.getText({name: "custrecord_ppd_taskid", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custrecord_ppd_vendor": fresult1.getText({name: "custrecord_ppd_vendor", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custrecord_ppd_date": fresult1.getValue({name: "custrecord_ppd_date", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custrecord_ppd_customer": fresult1.getText({name: "custrecord_ppd_customer", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custrecord_ppd_currency": fresult1.getText({name: "custrecord_ppd_currency", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custrecord_ppd_amountdollar": fresult1.getValue({name: "custrecord_ppd_amountdollar", join: "CUSTRECORD_PPD_CODE", summary: "SUM"}),
                        "custrecord_ppd_amount": fresult1.getValue({name: "custrecord_ppd_amount", join: "CUSTRECORD_PPD_CODE", summary: "SUM"}),
                        "tranid": fresult1.getValue({name: "tranid", join: "CUSTRECORD_POID", summary: "GROUP"}),
                        "custbody_typepo": fresult1.getText({name: "custbody_typepo", join: "CUSTRECORD_POID", summary: "GROUP"}),
                        "amount": fresult1.getValue({name: "amount", join: "CUSTRECORD_POID", summary: "GROUP"}),
                        "statusref": fresult1.getText({name: "statusref", join: "CUSTRECORD_POID", summary: "GROUP"}),
                        "trandate": fresult1.getValue({name: "trandate", join: "CUSTRECORD_POID", summary: "GROUP"}),
                        "trackingnumbers": fresult1.getValue({name: "trackingnumbers", join: "CUSTRECORD_POID", summary: "GROUP"}),
                        "custbody_addtracking": fresult1.getValue({name: "custbody_addtracking", join: "CUSTRECORD_POID", summary: "GROUP"})
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