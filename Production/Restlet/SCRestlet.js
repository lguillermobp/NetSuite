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

           
            idsearch = "customsearch_ecdsalescontract_2";

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

                    if (!fresult1.getValue({name: "custbody_lpr_startdate"})) {
                        startdatelpr='01/01/0001';
                    }
                    else {
                        startdatelpr = fresult1.getValue({name: "custbody_lpr_startdate"});
                    }
                    if (!fresult1.getValue({name: "custbody_lpr_enddate"})) {
                        enddatelpr='01/01/0001';
                    }
                    else {
                        enddatelpr = fresult1.getValue({name: "custbody_lpr_enddate"});
                    }
                    if (!fresult1.getValue({name: "custbody_lpr_enddatawaterfall"})) {
                        enddatebasedwaterfall='01/01/0001';
                    }
                    else {
                        enddatebasedwaterfall = fresult1.getValue({name: "custbody_lpr_enddatawaterfall"});
                    }
                    if (!fresult1.getValue({name: "custbody_invoicedate"})) {
                        invoicedate='01/01/0001';
                    }
                    else {
                        invoicedate = fresult1.getValue({name: "custbody_invoicedate"});
                    }


                    dataf[i] = {
                        "internalid": fresult1.getValue({name: "internalid"}),
                        "salescontract_name": fresult1.getValue({name: "transactionnumber"}),
                        "customer_id": fresult1.getValue({name: "entity"}),
                        "amount": fresult1.getValue({name: "amount"}),
                        "productionline": fresult1.getText({name: "custbody_productionline"}),
                        "productionlineid": fresult1.getValue({name: "custbody_productionline"}),
                        "clientOnHold": fresult1.getValue({name: "custbody_clientinhold"}),
                        "sc_date": fresult1.getValue({name: "trandate"}),
                        "sc_date_invoice": invoicedate,
                        "make": fresult1.getText({name: "custbody_appf_make_ecd"}),
                        "model": fresult1.getText({name: "custbody_appf_veh_model"}),
                        "vin_id": fresult1.getValue({name: "custbody_vin"}),
                        "sc_startdateLPR": startdatelpr,
                        "sc_enddateLPR": enddatelpr,
                        "memo": fresult1.getValue({name: "memo"}),
                        "sc_balance": Number(fresult1.getValue({name: "custbody_ecd_balance"})),
                        "sc_paid": Number(fresult1.getValue({name: "custbody_ecd_amountpaid"})),
                        "sc_enddatebasedwaterfall": enddatebasedwaterfall,
                        "status_lpr": fresult1.getValue(fresult1.columns[27])
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