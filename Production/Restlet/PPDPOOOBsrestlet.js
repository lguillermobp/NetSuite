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
                var customers_db = getcustomers();
                var tasks_db = gattaskid();
                
                carriers= getcarrier();
                log.debug("carriers",carriers);

               
                idsearch = "customsearch_ecdppdpooob";
                

                var fsearch =search.load({
                id: idsearch
                });

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
                            url = carriers[fresult1.getValue({name: "custbody_vendorcurriership"})].url;
                        }
                        else {
                            url = ""; 
                        }

                        customers= fresult1.getValue({name: "custcol_notes"}).split(";");
                        many_customers=customers.length;
                        customers_ids=[];
                        for (j=0;j<many_customers;j++)
                        {
                            var index1 = Number(customers_db.map(function (img) { return img.entitytitle; }).indexOf(customers[j].trim()));
                            if (index1==-1) {continue;}
                            customers_ids.push(customers_db[index1].internalid);
                        }
                        many_customer_ids=customers_ids.length;


                        for (k=0;k<many_customer_ids;k++)
                        {
                            var indexx = tasks_db.map(function (img) { return img.key; }).indexOf(customers_ids[k]+'_'+fresult1.getValue({name: "item"}));
                    
                            if (indexx==-1) 
                                {taskid="666";}
                            else
                                {   
                                taskid=tasks_db[indexx].taskid;
                                }
                           
                            dataf[i] = {
                                "ppd_id": -100 - i,
                                "ppd_code": 'Out Of Budget',
                                "po_id": fresult1.getValue({name: "internalid"}),
                                "po_name": fresult1.getValue({name: "tranid"}),
                                "customer_id": customers_ids[k],
                                "vendor_id": fresult1.getValue({name: "internalid", join: "vendor"}),
                                "vendor_name": fresult1.getValue({name: "entityid", join: "vendor"}),
                                "item_id": fresult1.getValue({name: "item"}),
                                "item_name": fresult1.getText({name: "item"}),
                                "ppd_qty": fresult1.getValue({name: "quantity"}),
                                "po_qty": fresult1.getValue({name: "quantity"}),
                                "po_carrier": fresult1.getText({name: "custbody_vendorcurriership"}), 
                                "po_carrier_url": url,
                                "po_tracking": fresult1.getValue({name: "trackingnumbers"}) + " " + fresult1.getValue({name: "custbody_addtracking"}).replace(/[\r\n]+/gm, " "),
                                "po_exp_receiptdate": fresult1.getValue({name: "expectedreceiptdate"}),
                                "po_status": fresult1.getValue({name: "statusref"}),
                                "item_rate": fresult1.getValue({name: "rate"}),
                                "po_currency": fresult1.getText({name: "currency"}),
                                "po_currencyrate": fresult1.getValue({name: "exchangerate"}),
                                "po_date": fresult1.getValue({name: "trandate"}),
                                "po_datecreated": fresult1.getValue({name: "datecreated"}),
                                "po_location": fresult1.getText({name: "location"}),
                                "po_qty_received": Number(fresult1.getValue({name: "quantityshiprecv"})),
                                "po_ppd_task_id": taskid
                            }
                            i++;
                        }
                    })
                })


                function getcustomers () {
                
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
                                "entityid": fresult1.getValue({name: "entityid"}),
                                "entitytitle": fresult1.getValue({name: "entityid"}) + " " + fresult1.getValue({name: "altname"}),
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
                function gattaskid () {
                
                    idsearch = "customsearch_lookingfortaskid";

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
                                "key": fresult1.getValue({name: "internalid",  join: "customer"}) + "_" + fresult1.getValue({name: "item"}),
                                "internalid": Number(fresult1.getValue({name: "internalid"})),
                                "item": fresult1.getValue({name: "item"}),
                                "entityid": fresult1.getValue({name: "entityid"}),
                                "customerid": fresult1.getValue({name: "internalid",  join: "customer"}),
                                "taskid": fresult1.getValue({name: "custbody_scheduletaskid"}),
                            }
                            i++;

                        })
                    })

                return dataf;
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