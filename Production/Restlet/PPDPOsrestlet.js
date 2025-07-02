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
                var dataf = [];

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
                var vendorids = getvendors();
                log.debug("vendorids",vendorids);
                operatorw = "noneof";

                carriers= getcarrier();
                log.debug("carriers",carriers);

                if (option == "1") {
                    idsearch = "customsearch_ppdforecdview";
                    }
                    else if (option == "2") {
                        idsearch = "customsearch_ppdforecdview_3";
                    }
                    else if (option == "3") {
                        idsearch = "customsearch_ppdforecdview_4";
                    }
                    else if (option == "4") {
                        idsearch = "customsearch_ppdforecdview_5";
                        operatorw = "anyof";
                    }
                    else if (option == "5") {
                        idsearch = "customsearch_ppdforecdview_6";
                    }

                var fsearch =search.load({
                id: idsearch
                });

                var defaultFilters = fsearch.filters;

            
                var customFilters = [];
                
                customFilters = {
                    name: "custrecord_ppd_vendor",
                    join: "CUSTRECORD_PPD_CODE",
                    operator: operatorw,
                    values: vendorids,
                    isor: false,
                    isnot: false,
                    leftparens: 0,
                    rightparens: 0

                };

                defaultFilters.push(customFilters);
            
                fsearch.filters = defaultFilters;

                var pagedData = fsearch.runPaged({
                    "pageSize" : 1000
                });
                var i=0;
                var dataf=[];
                pagedData.pageRanges.forEach(function (pageRange) {
                    log.debug("pageRange", pageRange);
                    var page = pagedData.fetch({index: pageRange.index});
                    page.data.forEach(function (fresult1) {

                        
                        if (fresult1.getValue({name: "custbody_vendorcurriership", join: "CUSTRECORD_POID"})) {
                            url = carriers[fresult1.getValue({name: "custbody_vendorcurriership", join: "CUSTRECORD_POID"})].url;
                        }
                        else {
                            url = ""; 
                        }


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
                            "po_carrier": fresult1.getText({name: "custbody_vendorcurriership", join: "CUSTRECORD_POID"}), 
                            "po_carrier_url": url,
                            "po_tracking": fresult1.getValue({name: "trackingnumbers", join: "CUSTRECORD_POID"}) + " " + fresult1.getValue({name: "custbody_addtracking", join: "CUSTRECORD_POID"}).replace(/[\r\n]+/gm, " "),
                            "po_exp_receiptdate": fresult1.getValue({name: "expectedreceiptdate", join: "CUSTRECORD_POID"}),
                            "po_status": fresult1.getValue({name: "statusref", join: "CUSTRECORD_POID"}),
                            "item_rate": fresult1.getValue({name: "rate", join: "CUSTRECORD_POID"}),
                            "po_currency": fresult1.getText({name: "currency", join: "CUSTRECORD_POID"}),
                            "po_currencyrate": fresult1.getValue({name: "exchangerate", join: "CUSTRECORD_POID"}),
                            "po_date": fresult1.getValue({name: "trandate", join: "CUSTRECORD_POID"}),
                            "po_datecreated": fresult1.getValue({name: "datecreated", join: "CUSTRECORD_POID"}),
                            "po_location": fresult1.getText({name: "location", join: "CUSTRECORD_POID"}),
                            "po_qty_received": Number(fresult1.getValue({name: "quantityshiprecv", join: "CUSTRECORD_POID"}))
                        }
                        i++;

                    })
                })


                function getvendors () {

                    var lineItemIds = [];
                    var idsearch = "customsearch_vecdvendors";

                    var fsearch = search.load({
                        id: idsearch
                    });

                fsearch.filters.push(search.createFilter({
                
                        name: "custentity_showinprojection",
                        operator: "is",
                        values: "T",
                        isor: false,
                        isnot: false,
                        leftparens: 0,
                        rightparens: 0
                }));

                    var pagedData = fsearch.runPaged({
                        "pageSize": 1000
                    });
                    
                    pagedData.pageRanges.forEach(function (pageRange) {
                        var page = pagedData.fetch({ index: pageRange.index });
                        page.data.forEach(function (fresult1) {

                            lineItemIds.push(fresult1.getValue({
                                name: "internalid"
                            }));

                        })
                    })

                    return lineItemIds;
                }

                function getcarrier () {

                    var linecarrier = [];

                    var fsearch = search.create({
                        type: "customrecord_vendorcurriership",
                        filters:
                        [
                        ],
                        columns:
                        [
                            "internalid",
                            "name",
                            "custrecord_url_tracking"
                        ]
                        });

                    var pagedData = fsearch.runPaged({
                        "pageSize": 1000
                    });
                    
                    pagedData.pageRanges.forEach(function (pageRange) {
                        var page = pagedData.fetch({ index: pageRange.index });
                        page.data.forEach(function (fresult1) {
                            internalid= fresult1.getValue({
                                name: "internalid"
                            });
                            log.debug("internalid", internalid);
                            namec= fresult1.getValue({
                                name: "name"
                            });
                            url= fresult1.getValue({
                                name: "custrecord_url_tracking"
                            });

                            linecarrier[internalid] = {
                                "name": namec,
                                "url": url
                            };
                             
                        })
                    })

                    return linecarrier;
                }


                return dataf;


            }


            return {
                get: get,
                post: post

            };
        });