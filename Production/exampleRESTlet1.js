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

                var lineNumber = ReturningRecord.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'item_display',
                    value: resultado.sku
                });

                ReturningRecord.selectLine({
                    sublistId: 'item',
                    line: lineNumber
                });

                if (resultado.return_reason)
                {

                    reasonb=resultado.return_reason.description;

                    if (resultado.return_reason.additional_notes) {reasonb+= " , " + resultado.return_reason.additional_notes;}


                    ReturningRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_atlas_hb_mm_return_reason',
                        value: "3",
                        ignoreFieldChange: true
                    });

                    ReturningRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_reasonreturn',
                        value: reasonb,
                        ignoreFieldChange: true
                    });
                }
                    ReturningRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_aftershipexternalid',
                        value: resultado.external_id,
                        ignoreFieldChange: true
                    });
                    ReturningRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: resultado.return_quantity,
                        ignoreFieldChange: true
                    });
                    ReturningRecord.commitLine({
                        sublistId: 'item'
                    });
                   

                var lineNumberd = ReturningRecord.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'custcol_discountappliedsku',
                    value: resultado.sku
                });

                if (lineNumberd!=-1) {
                    ReturningRecord.selectLine({
                        sublistId: 'item',
                        line: lineNumberd
                    });

                    ReturningRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_aftershipexternalid',
                        value: resultado.external_id,
                        ignoreFieldChange: true
                    });

                    
                    ReturningRecord.commitLine({
                        sublistId: 'item'
                    });

                }
               

        })
            deletelinera(ReturningRecord);
            var ReturningRecordId = ReturningRecord.save();
            try {


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
            var returnamount=context.data.return_method.cost_of_return.amount;
            shopifyord=shopifyord.replace("#", "");
            


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

            if (!internalidRA) {log.error("Shopify RMA not found in NetSuite ",  shopifyord);
                return;}

            var RA = record.load({
                type: "returnauthorization",
                id: internalidRA,
                isDynamic: true,
                defaultValues: null
            });

            RA.setValue('custbody_bkm_ra_trx_num', trackingRMA);
            RA.setValue({
                fieldId: "orderstatus",
                value: "B"
            });

            var indexso = RA.findSublistLineWithValue({"sublistId": "item", "fieldId": "item", "value": 13871});
            if (returnamount>0 && indexso==-1) {

                RA.selectNewLine({sublistId: "item"});
                RA.setCurrentSublistValue({sublistId: "item", fieldId: "item", value: "13871"});
                RA.setCurrentSublistValue({sublistId: "item", fieldId: "quantity", value: 1});
                //RA.setCurrentSublistValue({sublistId: "item", fieldId: "location", value: location});
                RA.setCurrentSublistValue({sublistId: "item", fieldId: "amount", value: -returnamount});
                RA.commitLine({sublistId: "item"});
            }
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



        function deletelinera(rec)
        {
            var lineCount = rec.getLineCount('item');

            for(var i = (lineCount-1); i > -1; i--) {

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

                itemid=rec.getSublistValue({sublistId: "item", fieldId: "item", line: i})
                discountappliedsku=rec.getSublistValue({sublistId: "item", fieldId: "custcol_discountappliedsku", line: i})
                amount=rec.getSublistValue({sublistId: "item", fieldId: "amount", line: i})


                if (aftershipid==0 && itemid)
                {
                
                    try {
                        rec.removeLine({
                            sublistId: 'item',
                            line: i
                        });

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
                isDynamic: true,
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

