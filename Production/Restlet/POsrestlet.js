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

                idsearch = "customsearch_ecdpo";

                var option= contextjson.option;
                log.debug("option",option);
   
                
             
                  
                var fsearch =search.load({
                id: idsearch
                });


                if (option == "U") {

                    var defaultFilters = fsearch.filters;
                    var customFilters = [];
                    
                    customFilters = {
                        name: "lastmodifieddate",
                        operator: "within",
                        values: "today",
                        isor: false,
                        isnot: false,
                        leftparens: 0,
                        rightparens: 0

                    };

                    defaultFilters.push(customFilters);
                    fsearch.filters = defaultFilters;           
                }

                var pagedData = fsearch.runPaged({
                    "pageSize" : 1000
                });
                var i=0;
                var dataf=[];
                pagedData.pageRanges.forEach(function (pageRange) {
                    log.debug("pageRange", pageRange);
                    var page = pagedData.fetch({index: pageRange.index});
                    page.data.forEach(function (fresult1) {

                        if (fresult1.getValue({name: "custbody_vendorcurriership"})) {
                            url = fresult1.getValue({name: "custrecord_url_tracking", join: "CUSTBODY_VENDORCURRIERSHIP"});
                            po_tracking = fresult1.getValue({name: "trackingnumbers"}) + " " + fresult1.getValue({name: "custbody_addtracking"}).replace(/[\r\n]+/gm, " ");
                            url = url.replace('{0}', po_tracking);
                        }
                        else {
                            url = ""; 
                            po_tracking = "";
                        }

                        if (!fresult1.getValue({name: "duedate"})) {
                            po_exp_receiptdate='01/01/0001';
                            }
                        else {
                            po_exp_receiptdate = fresult1.getValue({name: "duedate"});
                        }

                        dataf[i] = {
                            "po_id": fresult1.getValue({name: "internalid"}),
                            "po_name": fresult1.getValue({name: "tranid"}),
                            "po_date": fresult1.getValue({name: "trandate"}),
                            "po_sts": fresult1.getText({name: "statusref"}),
                            "vendor_id": fresult1.getValue({name: "internalid", join: "vendor"}),
                            "po_carrier": fresult1.getText({name: "custbody_vendorcurriership"}), 
                            "po_carrier_url": url, 
                            "po_tracking": po_tracking,
                            "po_memo": fresult1.getValue({name: "memo"}),
                            "location_id": fresult1.getValue({name: "location"}),
                            "po_type": fresult1.getText({name: "custbody_typepo"}),
                            "po_exp_receiptdate": po_exp_receiptdate,
                            "po_running_late": fresult1.getValue({name: "custbody_runninglate"})
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