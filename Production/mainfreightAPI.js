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


     //======================================================================================================================

     var transformSOToItemFulfillmentRecord = function transformSOToItemFulfillmentRecord(soId) {
        var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        log.debug({  title: "isDynamic: ", details: isDynamic});
        return record.transform({
            fromType: record.Type.SALES_ORDER,
            fromId: parseInt(soId, 10),
            toType: record.Type.ITEM_FULFILLMENT,
            isDynamic: isDynamic
        });
    };

    var createItemFulfillmentnew = function createItemFulfillmentnew(customFulfillOrdersRecord) {


        var datetran = new Date();

        const soId = customFulfillOrdersRecord["internalid"];
        const soNo = customFulfillOrdersRecord["GROUP(tranid)"];
        var saleschannel = customFulfillOrdersRecord["cseg_saleschann_new"];
        var binn = customFulfillOrdersRecord["custrecordbin"];
        var binn1 = customFulfillOrdersRecord["custbody_binlocation"];
        if (binn1) {binn=binn1;}

        log.debug({  title: "binn1: ", details: binn1});
        var fulfillsts = customFulfillOrdersRecord["custrecordfulfillment_status"];
        var shipmethod = customFulfillOrdersRecord["shipmethod"];
        var fulfillLocation = customFulfillOrdersRecord["internalidlocation"];

        log.debug({  title: "soId: ", details: soId});
        log.debug({  title: "customFulfillOrdersRecord: ", details: customFulfillOrdersRecord});

        var values = {};


        try {
            var itemFulfillmentRecord = transformSOToItemFulfillmentRecord(soId);
        } catch (e) {
            log.debug({  title: String(e.name), details:String(e.message)});
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " | " + saleschannel + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;
        }
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }
        itemFulfillmentRecord.setValue('shipmethod', shipmethod);
        itemFulfillmentRecord.setValue('trandate', datetran);
        itemFulfillmentRecord.setValue('shipstatus', endsts);
        itemFulfillmentRecord.setValue('sonum', soNo);

        var _loop = function _loop(i) {

            var requiredQuantity = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            var item = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            var locitem = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: i
            });

            var itemText = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });




            if (locitem != 272)
            {
                itemFulfillmentRecord.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: requiredQuantity,
                    line: i
                });

                if (inventoryDetailAvail === 'T') {
                    var isSerialItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isserial',
                        line: i
                    }) === 'T';
                    var isLotItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isnumbered',
                        line: i
                    }) === 'T';
                    var useBins = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'binitem',
                        line: i
                    }) === 'T';

                    if (!itemFulfillmentRecord.hasSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    }) && (isSerialItem || isLotItem || useBins)) {
                        var inventoryDetailSubRecord = itemFulfillmentRecord.getSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail',
                            line: i
                        });
                        var join = 'inventorynumberbinonhand';

                        if (useBins && !(isSerialItem || isLotItem)) {
                            join = 'binOnHand';
                        } else if (!useBins && (isSerialItem || isLotItem)) {
                            join = 'inventorynumber';
                        }


                        var itemInventoryDetails = searchInventoryDetailsForItem(item, locitem, join, saleschannel, binn);

                        var itemSearchResultCount = itemInventoryDetails.runPaged().count;


                        if (!itemSearchResultCount) {
                            log.error({title: itemText, details: "No Inventory Detail"})
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- is not in binlocacion";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("No Inventory Detail for item: ".concat(itemText, " at location ").concat(fulfillLocation));
                        }

                        var inventoryNumberFieldName = useBins ? 'inventorynumber' : 'internalid';
                        var inventoryDetailSubRecordLine = 0;


                        var pagedData = itemInventoryDetails.runPaged({
                            "pageSize" : 1000
                        });

                        pagedData.pageRanges.forEach(function (pageRange) {

                            var page = pagedData.fetch({index: pageRange.index});

                            page.data.forEach(function (result) {

                                log.debug("item",item);

                            var availableQuantity = result.getValue({
                                name: 'quantityavailable',
                                join: join
                            });

                                var invAssignmentLineCount = inventoryDetailSubRecord.getLineCount('inventoryassignment');
                                log.debug({  title: "invAssignmentLineCount: ", details: invAssignmentLineCount});
                                if (invAssignmentLineCount && inventoryDetailSubRecordLine==0) {
                                    requiredQuantity = 0;
                                    return false;
                                }
                                if (requiredQuantity==0) {
                                    log.debug({  title: "true: ", details: true});
                                    return true; }
                                log.debug({  title: "result: ", details: result});


                            inventoryDetailSubRecord = inventoryDetailSubRecord.insertLine({
                                sublistId: 'inventoryassignment',
                                line: inventoryDetailSubRecordLine,
                                ignoreRecalc: true
                            });

                            if (isSerialItem || isLotItem) {

                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'issueinventorynumber',
                                    value: result.getValue({
                                        name: inventoryNumberFieldName,
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });

                            }

                            if (useBins) {
                                log.debug({  title: "useBins: ", details: useBins});
                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'binnumber',
                                    value: result.getValue({
                                        name: 'binnumber',
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });

                            }
                                qtypro=availableQuantity < requiredQuantity ? availableQuantity : requiredQuantity;
                                requiredQuantity -= qtypro
                                log.debug("4-qtypro",qtypro);
                            inventoryDetailSubRecord.setSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: qtypro,
                                line: inventoryDetailSubRecordLine
                            });

                                inventoryDetailSubRecordLine += 1;
                        });
                            log.debug({  title: "aftertrue: ", details: true});
                    });

                        if (requiredQuantity) {
                            log.error({title: itemText, details: "Not Enough Quantity"});
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- Not Enough Quantity";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("Required quantity for item: ".concat(itemText, " cannot be fulfilled"));
                        }

                    }
                }

            }

        };

        var itemFulfillmentLineCount = itemFulfillmentRecord.getLineCount('item');

        for (var i = 0; i < itemFulfillmentLineCount; i += 1) {
            _loop(i);
        }



        try {
            var itemFulfillmentRecordId = itemFulfillmentRecord.save();



        } catch (e) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            return;
        }

        irec++;
        log.debug({  title: "itemFulfillmentRecordId: ", details: itemFulfillmentRecordId + " record: " + irec});



        /*
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }

        record.submitFields({
            type: record.Type.ITEM_FULFILLMENT,
            id: itemFulfillmentRecordId,
            values: {
                shipstatus: endsts,
                trandate: getNSDate(datetran)
            }
        });
         */

        var values = {};
        values["custbody_ffstatus"] = 3;
        values["custbody_fferror"] = "Done";
        values["custbody_fferrorqty"] = 0;

        submitCustomFulfillOrdersRecordFields({
            type: "salesorder",
            id: soId,
            values: values
        });

        log.audit("Processed " + String(soId) + " record: " + irec)
        if (irec>19) {
            log.audit("Ending "  + irec)

            return true;}
    };


//======================================================================================================================



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


     return {
         get: _get,
         delete: _delete,
         post: post,
         put: put
     };
 });

