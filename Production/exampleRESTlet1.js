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
         doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'GET');
         try {
             var ReturningRecord = transformCSToRARecord(context.id);
         } catch (e) {
             log.audit("error: " + String(e.message))

             return("error: " + String(e.message));
         }

         try {

             var ReturningRecordId = ReturningRecord.save();
             log.debug("ReturningRecordId",ReturningRecordId);

         } catch (e) {

             return("ERROR when try to do Return Authorization: " + String(e.message));

         }
         return JSON.stringify(ReturningRecord);
     }
     // Delete a standard NetSuite record
     function _delete(context) {
         doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'DELETE');
         record.delete({
             type: context.recordtype,
             id: context.id
         });
         return String(context.id);
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
             var ReturningRecord = transformCSToRARecord(internalidCS);
         } catch (e) {
             log.audit("error: " + String(e.message))

             return("error: " + String(e.message));
         }
         ReturningRecord.setValue('memo', memo);


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

                 reasonb=resultado.return_reason.description + " , " + resultado.return_reason.additional_notes;
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
             }
             log.debug("lineNumber",lineNumber);




         })

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





     var transformCSToRARecord = function transformCSToRARecord(csId) {

         return record.transform({
             fromType: "cashsale",
             fromId: parseInt(csId, 10),
             toType: "returnauthorization",
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

  