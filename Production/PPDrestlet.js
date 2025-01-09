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

            var fsearch = search.create({
                type: "customrecord_ppd_po",
                filters:
                [
                   ["custrecord_poid.mainline","is","T"], 
                   "OR", 
                   ["custrecord_poid","anyof","@NONE@"]
                ],
                columns:
                [
                   search.createColumn({
                      name: "custrecord_ppdid",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "name",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_productionline",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_task",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custbody_task",
                      join: "CUSTRECORD_POID",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_vendor",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_date",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_customer",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_currency",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_amountdollar",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "SUM"
                   }),
                   search.createColumn({
                      name: "custrecord_ppd_amount",
                      join: "CUSTRECORD_PPD_CODE",
                      summary: "SUM"
                   }),
                   search.createColumn({
                      name: "tranid",
                      join: "CUSTRECORD_POID",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "custbody_typepo",
                      join: "CUSTRECORD_POID",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "amount",
                      join: "CUSTRECORD_POID",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "statusref",
                      join: "CUSTRECORD_POID",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "trandate",
                      join: "CUSTRECORD_POID",
                      summary: "GROUP"
                   })
                ]
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
                        "custrecord_ppdid": fresult1.getValue({name: "custrecord_ppdid", summary: "GROUP"}),
                        "name": fresult1.getValue({name: "name", summary: "GROUP"}),
                        "custrecord_ppd_productionline": fresult1.getText({name: "custrecord_ppd_productionline", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custrecord_ppd_task": fresult1.getText({name: "custrecord_ppd_task", join: "CUSTRECORD_PPD_CODE", summary: "GROUP"}),
                        "custbody_task": fresult1.getText({name: "custbody_task", join: "CUSTRECORD_POID", summary: "GROUP"}),
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
                        "trandate": fresult1.getValue({name: "trandate", join: "CUSTRECORD_POID", summary: "GROUP"})
                    }
                    log.audit("dataf", dataf[i]);
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