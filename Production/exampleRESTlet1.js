/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search",'N/record', 'N/error',"N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    function(search,record, error, log, GENERALTOOLS) {
        function doValidation(args, argNames, methodName) {
            for (var i = 0; i < args.length; i++)
                if (!args[i] && args[i] !== 0)
                    throw error.create({
                        name: 'MISSING_REQ_ARG',
                        message: 'Missing a required argument: [' + argNames[i] + '] for method: ' + methodName
                    });
        }
        // Get a standard NetSuite record
        function _get(context) {

            return;
        }
        // Delete a standard NetSuite record
        function _delete(context) {

            return ;
        }
        // Create a NetSuite record from request params
        function post(context) {
            var shopifyord=context.data.order.order_number;
            var items= context.data.return_items;
            var status=context.data.status;
            var event=context.event;
            shopifyord=shopifyord.replace("#", "");
            log.debug("items",  items);
            log.debug("event",  event);
            log.debug("Shopify Order",  shopifyord);
            log.debug("status", status);

            if (event=="return.created")
            {
                return createreturn(context);
            }

            if (event=="return.updated")
            {
                if (status=="rejected")
                {
                    return rejectreturn(context);
                }
                if (status=="approved")
                {
                    return approvedreturn(context);
                }
                if (status=="done")
                {
                    //   return receiverefund(context);
                }
            }


            return context;
        }


        // Upsert a NetSuite record from request param
        function put(context) {
            doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'PUT');
            var rec = record.load({
                type: context.recordtype,
                id: context.id
            });
            for (var fldName in context)
                if (context.hasOwnProperty(fldName))
                    if (fldName !== 'recordtype' && fldName !== 'id')
                        rec.setValue(fldName, context[fldName]);
            rec.save();
            return JSON.stringify(rec);
        }

        function createreturn(context) {

            var shopifyord=context.data.order.order_number;
            var items= context.data.return_items;
            var status=context.data.status;
            var event=context.event;
            var RMA=context.data.rma_number;
            var trackingRMA=context.data.tracking_number;
            var memo="RMA: " + RMA;

            shopifyord=shopifyord.replace("#", "");
            log.debug("items",  items);
            log.debug("event",  event);
            log.debug("Shopify Order",  shopifyord);
            log.debug("status", status);


            var fsearch = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type","anyof","SalesOrd"],
                        "AND",
                        ["otherrefnum","equalto",shopifyord],
                        "AND",
                        ["cseg_saleschann_new","anyof","2"],
                        "AND",
                        ["applyingtransaction.type","anyof","CashSale"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "tranid",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "applyingTransaction",
                            summary: "GROUP"
                        })
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });

            var internalidCS;
            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult1) {

                    internalidCS = fresult1.getValue({
                        name: "internalid",
                        join: "applyingTransaction",
                        summary: "GROUP"
                    })

                })
            });
            log.debug("internalidCS",  internalidCS);

            try {
                var ReturningRecord = transformCSToRARecord(internalidCS,"cashsale","returnauthorization");
            } catch (e) {
                log.audit("error: " + String(e.message))

                return("error: " + String(e.message));
            }


            ReturningRecord.setValue('memo', memo);
            ReturningRecord.setValue('custbody_bkm_ra_trx_num', trackingRMA);

            items.forEach(function(resultado) {
                log.debug("items.sku",  resultado.sku);
                var lineNumber = ReturningRecord.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'item_display',
                    value: resultado.sku
                });
                log.debug("resultado.return_reason",  resultado.return_reason);
                if (resultado.return_reason)
                {

                    reasonb=resultado.return_reason.description;
                    
                    if (resultado.return_reason.additional_notes) {reasonb+= " , " + resultado.return_reason.additional_notes;}
                    
                    ReturningRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_atlas_hb_mm_return_reason',
                        value: "3",
                        line: lineNumber
                    });
                    ReturningRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_reasonreturn',
                        value: reasonb,
                        line: lineNumber
                    });
                    ReturningRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_aftershipexternalid',
                        value: resultado.external_id,
                        line: lineNumber
                    });
                    ReturningRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: resultado.return_quantity,
                        line: lineNumber
                    });
                }
                log.debug("lineNumber",lineNumber);




            })


            deletelinera(ReturningRecord);

            try {

                var ReturningRecordId = ReturningRecord.save();
                log.debug("ReturningRecordId",ReturningRecordId);

            } catch (e) {

                return("ERROR when try to do Return Authorization: " + String(e.message));

            }


            return ReturningRecordId;
        }


        function approvedreturn(context) {

            var shopifyord=context.data.order.order_number;
            var items= context.data.return_items;
            var status=context.data.status;
            var event=context.event;
            var trackingRMA=context.data.tracking_number;
            shopifyord=shopifyord.replace("#", "");
            log.debug("items",  items);
            log.debug("event",  event);
            log.debug("Shopify Order",  shopifyord);
            log.debug("status", status);


            var fsearch = search.create({
                type: "returnauthorization",
                filters:
                    [
                        ["type","anyof","RtnAuth"],
                        "AND",
                        ["otherrefnum","equalto",shopifyord],
                        "AND",
                        ["mainline","is","T"],
                        "AND",
                        ["status","anyof","RtnAuth:A","RtnAuth:B","RtnAuth:E"]
                    ],
                columns:
                    [
                        "internalid",
                        "trandate",
                        "type",
                        "tranid",
                        "entity",
                        "memo",
                        "amount",
                        "cseg_saleschann_new"
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });

            var internalidRA;
            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult1) {

                    internalidRA = fresult1.getValue({
                        name: "internalid"
                    })

                })
            });
            log.debug("internalidRA",  internalidRA);

            var RA = record.load({
                type: "returnauthorization",
                id: internalidRA,
                isDynamic: false,
                defaultValues: null
            });

            RA.setValue('custbody_bkm_ra_trx_num', trackingRMA);
            RA.setValue({
                fieldId: "orderstatus",
                value: "B"
            });
            /*
            RA.setValue({
                fieldId: "status",
                value: "Pending Receipt"
            });
            RA.setValue({
                fieldId: "statusRef",
                value: "pendingReceipt"
            });

             */
            RA.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });

            return internalidRA;
        }

        function rejectreturn(context) {

            var shopifyord=context.data.order.order_number;
            var items= context.data.return_items;
            var status=context.data.status;
            var event=context.event;
            shopifyord=shopifyord.replace("#", "");
            log.debug("items",  items);
            log.debug("event",  event);
            log.debug("Shopify Order",  shopifyord);
            log.debug("status", status);


            var fsearch = search.create({
                type: "returnauthorization",
                filters:
                    [
                        ["type","anyof","RtnAuth"],
                        "AND",
                        ["otherrefnum","equalto",shopifyord],
                        "AND",
                        ["mainline","is","T"]
                    ],
                columns:
                    [
                        "internalid",
                        "trandate",
                        "type",
                        "tranid",
                        "entity",
                        "memo",
                        "amount",
                        "cseg_saleschann_new"
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });

            var internalidRA;
            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult1) {

                    internalidRA = fresult1.getValue({
                        name: "internalid"
                    })

                })
            });
            log.debug("internalidRA",  internalidRA);

            var RA = record.load({
                type: "returnauthorization",
                id: internalidRA,
                isDynamic: false,
                defaultValues: null
            });

            // Change Record in MasterLabel.

            /*
                        RA.setValue({
                            fieldId: "orderstatus",
                            value: "H"
                        });



                        RA.setValue({
                            fieldId: "status",
                            value: "Cancelled"
                        });
                        RA.setValue({
                            fieldId: "statusRef",
                            value: "cancelled"
                        });


             */
            var RAitems = RA.getLineCount('item');

            for (var i = 0; i < RAitems; i += 1) {
                RA.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'isclosed',
                    line: i,
                    value: true
                });
            }

            RA.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });

            return internalidRA;
        }


        function receiverefund(context) {

            var shopifyord=context.data.order.order_number;
            var items= context.data.return_items;
            var status=context.data.status;
            var event=context.event;
            shopifyord=shopifyord.replace("#", "");
            log.debug("items",  items);
            log.debug("event",  event);
            log.debug("Shopify Order",  shopifyord);
            log.debug("status", status);


            var fsearch = search.create({
                type: "returnauthorization",
                filters:
                    [
                        ["type","anyof","RtnAuth"],
                        "AND",
                        ["otherrefnum","equalto",shopifyord],
                        "AND",
                        ["mainline","is","T"]
                    ],
                columns:
                    [
                        "internalid",
                        "trandate",
                        "type",
                        "tranid",
                        "entity",
                        "memo",
                        "amount",
                        "cseg_saleschann_new"
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });

            var internalidRA;
            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult1) {

                    internalidRA = fresult1.getValue({
                        name: "internalid"
                    })

                })
            });
            log.debug("internalidRA",  internalidRA);

            // Create Receive Item for RA
            try {
                var ReturningRecord = transformCSToRARecord(internalidRA,"returnauthorization","itemreceipt");
            } catch (e) {
                log.audit("error: " + String(e.message))

                return("error: " + String(e.message));
            }
            const qty = ReturningRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: 1
            });

            ReturningRecord.setSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: 1,
                value: qty
            });
            var ReturningRecordId = ReturningRecord.save();
            try {


                log.debug("ReturningRecordId",ReturningRecordId);

            } catch (e) {

                return("ERROR when try to do Receive RA: " + String(e.message));

            }

            // Create Refund for RA
            try {
                var ReturningRecord = transformCSToRARecord(internalidRA,"returnauthorization","cashrefund");
            } catch (e) {
                log.audit("error: " + String(e.message))

                return("error: " + String(e.message));
            }


            try {

                var ReturningRecordId = ReturningRecord.save();
                log.debug("ReturningRecordId",ReturningRecordId);

            } catch (e) {

                return("ERROR when try to do Receive RA: " + String(e.message));

            }


            return ReturningRecordId;
        }


        function deletelinera(rec)
        {
            var lineCount = rec.getLineCount('item');
            log.debug("lineCount",lineCount);
            for(var i = 0; i < lineCount; i++) {
                log.debug("i",i);
                if (!rec.getSublistValue({sublistId: "item", fieldId: "custcol_aftershipexternalid", line: i}))
                {
                    var aftershipid=0;
                }
                else {
                    var aftershipid = rec.getSublistValue({
                        sublistId: "item",
                        fieldId: "custcol_aftershipexternalid",
                        line: i
                    });
                }
                log.debug("aftershipid",aftershipid.length);
                if (aftershipid==0)
                {


                    try {
                        rec.removeLine({
                            sublistId: 'item',
                            line: i,
                            ignoreRecalc: true
                        });
                        log.debug("sku",rec.getSublistValue({sublistId: "item", fieldId: "item", line: i}));
                    } catch (e) {
                        log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

                    }
                }

            }
        }

        var transformCSToRARecord = function transformCSToRARecord(csId,fromtype,totype) {

            return record.transform({
                fromType: fromtype,
                fromId: parseInt(csId, 10),
                toType: totype,
                isDynamic: false,
                defaultValues: {
                },

            });
        };
        return {
            get: _get,
            delete: _delete,
            post: post,
            put: put
        };
    });

     