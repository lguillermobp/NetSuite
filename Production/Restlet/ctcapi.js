"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/task', "N/search", "N/record",  "N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (_nTask, search, record, log, GENERALTOOLS) {

         function get (_ref) {

            return _ref;
        }

         function post (context) {
            log.debug("context", context);

                try {
                    data = JSON.parse(context);
                    }
                    catch (e) {
                        log.debug("error",e);
                        data = context;
                    }
                

            var dataheader = data.data.dataheader;
            var option = data.option;
            log.debug("option", option);

            if  (option=="transformformquote")
            {

                var resultid=transformfromquote(dataheader);
                log.debug("resultid", resultid);

            }
            if  (option=="C")
            {
                var resultid=createQuote(data);
                log.debug("resultid", resultid);
            }
            if  (option=="E")
            {
                var resultid=editQuote(data);
                log.debug("resultid", resultid);
            }
            if  (option=="D")
            {
                var resultid=deleteQuote(dataheader);
                log.debug("resultid", resultid);
            }
            if  (option=="createsalescontract")
            {
                var resultid=createSalesContract(data);
                log.debug("resultid", resultid);
            }


            return resultid;
        }

        function createQuote(data)
        {
                
            var dataheader = data.data.dataheader;
            var customer_id = dataheader.customer_id;

                         // Create a new Quote record
                var newQuote = record.create({
                    type: record.Type.ESTIMATE, // Use record.Type.ESTIMATE for Quote records
                    isDynamic: true // Set to true for dynamic mode, allowing field changes to trigger related field updates
                });

                // Set a value for a standard field (e.g., entity/customer)
                // Replace 'YOUR_CUSTOMER_ID' with the actual internal ID of a customer
                newQuote.setValue({
                    fieldId: 'entity',
                    value: customer_id
                });

                newQuote.setValue({
                    fieldId: 'custbody_vecd_user',
                    value: dataheader.username
                });
                newQuote.setValue({
                    fieldId: 'custbody_vecd_ctc_id',
                    value: dataheader.ctc_id
                });
                newQuote.setValue({
                    fieldId: 'custbody_viewwcd_user',
                    value: dataheader.first_name + ", " + dataheader.last_name
                });
                newQuote.setValue({
                    fieldId: 'location',
                    value: 6
                });
                newQuote.setValue({
                    fieldId: 'custbody_viewwcd_user_email',
                    value: dataheader.email
                });

                var ctcMakeMatrix = [];
                if (dataheader.ctc_make && typeof dataheader.ctc_make === 'string') {
                    ctcMakeMatrix = dataheader.ctc_make.split(':').map(function(item) {
                        return item.trim();
                    });
                }
                if (ctcMakeMatrix.length > 0) {
                    newQuote.setValue({
                        fieldId: 'custbody_appf_make_ecd',
                        value: ctcMakeMatrix[0]
                    });
                }
                if (dataheader.ctc_model.length > 0) {
                    newQuote.setValue({
                        fieldId: 'custbody_viewecd_model',
                        value: dataheader.ctc_model
                    });
                }
                if (dataheader.ctc_ownerdonor.length > 0) {
                    if (dataheader.ctc_ownerdonor=="on" ) {
                        var wowner=true
                    }
                    else
                    {
                        var wowner=false
                    }
                        newQuote.setValue({
                            fieldId: 'custbody_ctc_ownerdonor',
                            value: wowner
                        });
                    }


            var datadetail = data.data.datadetail;
            var item_description = "";
            var item_price = 0;
            var consolidated_item_description = "0";

            for (var i = 0; i < datadetail.length; i++) {
                var item = datadetail[i];

                // Add a line item to the quote
                newQuote.selectNewLine({
                    sublistId: 'item'
                });

                witem_description = item.item_description;
                witem_price = Number(item.item_price *  item.ctc_item_qty);

                if (item.item_step_id<6)
                {
                    if (item.item_step_id==1)
                    {
                        if (dataheader.ctc_ownerdonor=="on")
                        {
                            witem_description = item.item_description + " (Owner Donor)";
                            witem_price = 0;
                        }
                    }
                        item_description += witem_description + "\n";
                        item_price += witem_price;
                        continue;
                } 
          
                    if (consolidated_item_description=="0")
                        {
                                consolidated_item_description = "1";
                                newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: 25146 
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: item.ctc_item_qty
                            });
                            
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'description',
                                value: item_description
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: Number(item_price)  // Replace with the actual price
                            });
                            newQuote.commitLine({
                                sublistId: 'item'
                            });

                        }

 
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: item.item_id // Replace 'YOUR_ITEM_ID' with the actual internal ID of an item
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: 1
                            });
                            if (item.ctc_item_description=="")
                            {
                                var ctc_item_description = item.item_description;
                            }
                            else
                            {
                                var ctc_item_description = item.ctc_item_description;
                            }
                            if (item.ctc_item_price==0)
                            {
                                var ctc_item_price = item.item_price;
                            }
                            else
                            {
                                var ctc_item_price = item.ctc_item_price;
                            }
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'description',
                                value: ctc_item_description
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: Number(ctc_item_price)  // Replace with the actual price
                            });
                            newQuote.commitLine({
                                sublistId: 'item'
                            });

                
                

                log.debug("Item " + i, item);
            }
             if (consolidated_item_description=="0")
                        {
                            consolidated_item_description = "1";
                            newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            value: 25146 
                        });
                        newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            value: 1
                        });
                       
                        newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'description',
                            value: item_description
                        });
                        newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            value: Number(item_price)  // Replace with the actual price
                        });
                        newQuote.commitLine({
                            sublistId: 'item'
                        });

                        }

            if (dataheader.item_additional_amount > 0) {

                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: 25146 
                });
                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: 1
                });
                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'description',
                    value: dataheader.item_additional
                });
                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: Number(dataheader.item_additional_amount)  // Replace with the actual price
                });
                newQuote.commitLine({
                    sublistId: 'item'
                });
            }

            var quoteId = newQuote.save();



            return quoteId;

        }


            function editQuote(data)
        {
                
            var dataheader = data.data.dataheader;
            var quoteId=dataheader.quote_id; 

                var newQuote = record.load({
                    type: record.Type.ESTIMATE, // Use record.Type.ESTIMATE for Quote records
                    id: quoteId,
                    isDynamic: true // Set to true for dynamic mode, allowing field changes to trigger related field updates
                });

                // Set a value for a standard field (e.g., entity/customer)
                // Replace 'YOUR_CUSTOMER_ID' with the actual internal ID of a customer

                newQuote.setValue({
                    fieldId: 'custbody_vecd_user',
                    value: dataheader.username
                });
                newQuote.setValue({
                    fieldId: 'custbody_vecd_ctc_id',
                    value: dataheader.ctc_id
                });
                newQuote.setValue({
                    fieldId: 'custbody_viewwcd_user',
                    value: dataheader.first_name + ", " + dataheader.last_name
                });
                
                newQuote.setValue({
                    fieldId: 'custbody_viewwcd_user_email',
                    value: dataheader.email
                });

                var ctcMakeMatrix = [];
                if (dataheader.ctc_make && typeof dataheader.ctc_make === 'string') {
                    ctcMakeMatrix = dataheader.ctc_make.split(':').map(function(item) {
                        return item.trim();
                    });
                }
                if (ctcMakeMatrix.length > 0) {
                    newQuote.setValue({
                        fieldId: 'custbody_appf_make_ecd',
                        value: ctcMakeMatrix[0]
                    });
                }
                if (dataheader.ctc_model.length > 0) {
                    newQuote.setValue({
                        fieldId: 'custbody_viewecd_model',
                        value: dataheader.ctc_model
                    });
                }
                if (dataheader.ctc_ownerdonor.length > 0) {
                    if (dataheader.ctc_ownerdonor=="on" ) {
                        var wowner=true
                    }
                    else
                    {
                        var wowner=false
                    }
                        newQuote.setValue({
                            fieldId: 'custbody_ctc_ownerdonor',
                            value: wowner
                        });
                    }


            var lineCount = newQuote.getLineCount({ sublistId: 'item' });
            for (var i = lineCount - 1; i >= 0; i--) {
                newQuote.removeLine({
                    sublistId: 'item',
                    line: i
                });
            }


            var datadetail = data.data.datadetail;
            var item_description = "";
            var item_price = 0;
            var consolidated_item_description = "0";

            for (var i = 0; i < datadetail.length; i++) {
                var item = datadetail[i];

                // Add a line item to the quote
                newQuote.selectNewLine({
                    sublistId: 'item'
                });

                witem_description = item.item_description;
                witem_price = Number(item.item_price *  item.ctc_item_qty);

                if (item.item_step_id<6)
                {
                    if (item.item_step_id==1)
                    {
                        if (dataheader.ctc_ownerdonor=="on")
                        {
                            witem_description = item.item_description + " (Owner Donor)";
                            witem_price = 0;
                        }
                    }
                        item_description += witem_description + "\n";
                        item_price += witem_price;
                        continue;
                } 
          
                    if (consolidated_item_description=="0")
                        {
                                consolidated_item_description = "1";
                                newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: 25146 
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: item.ctc_item_qty
                            });
                            
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'description',
                                value: item_description
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: Number(item_price)  // Replace with the actual price
                            });
                            newQuote.commitLine({
                                sublistId: 'item'
                            });

                        }

 
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: item.item_id // Replace 'YOUR_ITEM_ID' with the actual internal ID of an item
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: 1
                            });
                            if (item.ctc_item_description=="")
                            {
                                var ctc_item_description = item.item_description;
                            }
                            else
                            {
                                var ctc_item_description = item.ctc_item_description;
                            }
                            if (item.ctc_item_price==0)
                            {
                                var ctc_item_price = item.item_price;
                            }
                            else
                            {
                                var ctc_item_price = item.ctc_item_price;
                            }
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'description',
                                value: ctc_item_description
                            });
                            newQuote.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: Number(ctc_item_price)  // Replace with the actual price
                            });
                            newQuote.commitLine({
                                sublistId: 'item'
                            });

                
                

                log.debug("Item " + i, item);
            }
             if (consolidated_item_description=="0")
                        {
                            consolidated_item_description = "1";
                            newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            value: 25146 
                        });
                        newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            value: 1
                        });
                       
                        newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'description',
                            value: item_description
                        });
                        newQuote.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            value: Number(item_price)  // Replace with the actual price
                        });
                        newQuote.commitLine({
                            sublistId: 'item'
                        });

                        }

            if (dataheader.item_additional_amount > 0) {

                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: 25146 
                });
                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: 1
                });
                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'description',
                    value: dataheader.item_additional
                });
                newQuote.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: Number(dataheader.item_additional_amount)  // Replace with the actual price
                });
                newQuote.commitLine({
                    sublistId: 'item'
                });
            }

            var quoteId = newQuote.save();



            return quoteId;

        }
        function createSalesContractold(data)
        {
                
            var dataheader = data.data.dataheader;
            var customer_id = dataheader.customer_id;

                         // Create a new Quote record
                var newSalesContract = record.create({
                    type: record.Type.SALES_ORDER, // Use record.Type.ESTIMATE for Quote records
                    isDynamic: true // Set to true for dynamic mode, allowing field changes to trigger related field updates
                });

                // Set a value for a standard field (e.g., entity/customer)
                // Replace 'YOUR_CUSTOMER_ID' with the actual internal ID of a customer
                newSalesContract.setValue({
                    fieldId: 'entity',
                    value: customer_id
                });
                newSalesContract.setValue({
                    fieldId: 'trandate', // Transaction date
                    value: new Date()
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_vecd_user',
                    value: dataheader.username
                });
                newSalesContract.setValue({
                    fieldId: 'orderstatus', // Sales Order status (e.g., 'B' for Pending Fulfillment)
                    value: 'A'
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_vecd_ctc_id',
                    value: dataheader.ctc_id
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_viewwcd_user',
                    value: dataheader.first_name + ", " + dataheader.last_name
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_viewwcd_user_email',
                    value: dataheader.email
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_productionline',
                    value: dataheader.ctc_productionline
                });
                var ctcMakeMatrix = [];
                if (dataheader.ctc_make && typeof dataheader.ctc_make === 'string') {
                    ctcMakeMatrix = dataheader.ctc_make.split(':').map(function(item) {
                        return item.trim();
                    });
                }
                if (ctcMakeMatrix.length > 0) {
                    newSalesContract.setValue({
                        fieldId: 'custbody_appf_make_ecd',
                        value: ctcMakeMatrix[0]
                    });
                }
                if (dataheader.ctc_model.length > 0) {
                    newSalesContract.setValue({
                        fieldId: 'custbody_viewecd_model',
                        value: dataheader.ctc_model
                    });
                }

                if (dataheader.ctc_ownerdonor.length > 0) {
                    if (dataheader.ctc_ownerdonor=="on" ) {
                        var wowner=true
                    }
                    else
                    {
                        var wowner=false
                    }
                        newSalesContract.setValue({
                            fieldId: 'custbody_ctc_ownerdonor',
                            value: wowner
                        });
                }
            

            var datadetail = data.data.datadetail;

            for (var i = 0; i < datadetail.length; i++) {

                if (wowner && datadetail[i].item_step_id == 1) continue;
                var item = datadetail[i];

                // Add a line item to the quote
                newSalesContract.selectNewLine({
                    sublistId: 'item'
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: item.item_id // Replace 'YOUR_ITEM_ID' with the actual internal ID of an item
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: 1
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'price',
                    value: -1 // Use -1 for custom pricing, then set 'rate'
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: Number(item.item_price)
                });
                
                newSalesContract.commitLine({
                    sublistId: 'item'
                });

                log.debug("Item " + i, item);
            }

            var salescontractID = newSalesContract.save();



            return salescontractID;

        }

        function createSalesContract(data)
        {
                
            var dataheader = data.data.dataheader;
            var customer_id = dataheader.customer_id;

                         // Create a new Quote record
                var newSalesContract = record.create({
                    type: record.Type.SALES_ORDER, // Use record.Type.ESTIMATE for Quote records
                    isDynamic: true // Set to true for dynamic mode, allowing field changes to trigger related field updates
                });

                // Set a value for a standard field (e.g., entity/customer)
                // Replace 'YOUR_CUSTOMER_ID' with the actual internal ID of a customer
                newSalesContract.setValue({
                    fieldId: 'entity',
                    value: customer_id
                });
                newSalesContract.setValue({
                    fieldId: 'trandate', // Transaction date
                    value: new Date()
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_vecd_user',
                    value: dataheader.username
                });
                newSalesContract.setValue({
                    fieldId: 'statusRef', // Sales Order status (e.g., 'B' for Pending Fulfillment)
                    value: 'pendingFulfillment'
                });
                newSalesContract.setValue({
                    fieldId: 'status', // Sales Order status (e.g., 'B' for Pending Fulfillment)
                    value: 'Pending Fulfillment'
                });
                newSalesContract.setValue({
                    fieldId: 'orderstatus', // Sales Order status (e.g., 'B' for Pending Fulfillment)
                    value: 'A'
                });
                newSalesContract.setValue({
                    fieldId: 'location',
                    value: 6
                });

                newSalesContract.setValue({
                    fieldId: 'custbody_vecd_ctc_id',
                    value: dataheader.ctc_id
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_viewwcd_user',
                    value: dataheader.first_name + ", " + dataheader.last_name
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_viewwcd_user_email',
                    value: dataheader.email
                });
                newSalesContract.setValue({
                    fieldId: 'custbody_productionline',
                    value: dataheader.ctc_productionline
                });
                var ctcMakeMatrix = [];
                if (dataheader.ctc_make && typeof dataheader.ctc_make === 'string') {
                    ctcMakeMatrix = dataheader.ctc_make.split(':').map(function(item) {
                        return item.trim();
                    });
                }
                if (ctcMakeMatrix.length > 0) {
                    newSalesContract.setValue({
                        fieldId: 'custbody_appf_make_ecd',
                        value: ctcMakeMatrix[0]
                    });
                }
                if (dataheader.ctc_model.length > 0) {
                    newSalesContract.setValue({
                        fieldId: 'custbody_viewecd_model',
                        value: dataheader.ctc_model
                    });
                }

                if (dataheader.ctc_ownerdonor.length > 0) {
                    if (dataheader.ctc_ownerdonor=="on" ) {
                        var wowner=true
                    }
                    else
                    {
                        var wowner=false
                    }
                        newSalesContract.setValue({
                            fieldId: 'custbody_ctc_ownerdonor',
                            value: wowner
                        });
                }
                item_description = "";
                item_price = 0;
                var datadetail = data.data.datadetail;

                  for (var i = 0; i < datadetail.length; i++) 
                    {
                        var item = datadetail[i];
                        witem_description = item.item_description;
                        witem_price = Number(item.item_price * item.ctc_item_qty);

                        
                            if (item.item_step_id==1)
                            {
                                if (dataheader.ctc_ownerdonor=="on")
                                {
                                    witem_description = item.item_description + " (Owner Donor)";
                                    witem_price = 0;
                                }
                            }
                                item_description += witem_description + "\n";
                                item_price += witem_price;
                    }
            
                 // Add a line item to the quote
                newSalesContract.selectNewLine({
                    sublistId: 'item'
                });

                if (ctcMakeMatrix[0]!=7) {
                    witem=24946
                }
                if (ctcMakeMatrix[0]==7) {
                    witem=24945
                }
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: witem // Replace 'YOUR_ITEM_ID' with the actual internal ID of an item
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: 1
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'price',
                    value: -1 // Use -1 for custom pricing, then set 'rate'
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'description',
                    value: item_description
                });
                newSalesContract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: item_price
                });
                
                newSalesContract.commitLine({
                    sublistId: 'item'
                });

                var salescontractID = newSalesContract.save();

                const ORDER_STATUS = {
                    PENDING_FULFILLMENT: 'B',
                    APPROVED: 'A'
                };
                record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: salescontractID,
                    values: {
                        orderstatus: ORDER_STATUS.PENDING_FULFILLMENT
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
                try {
                   
                    const scriptTask = _nTask.create({
                    taskType: _nTask.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_cpqm_mr_woc',
                    params: {
                        custscript_cpqm_tranid: salescontractID,
                        custscript_cpqm_force: true,
                    }
                  }); 
                   const taskId = scriptTask.submit();

                    log.debug({ title: 'WO creation scheduled', details: 'Task ID: ' + taskId });
                } catch (e) {
                    log.error({ title: 'Error scheduling WO creation', details: e.message });
                }

                   // workorderID = createWorkOrderFromSalesOrder(salescontractID, 0,data);
                   workorderID = "0";

                var ids = {         "salesorder": salescontractID,  "workorder": workorderID                };
                


            return ids;

        }
        function transformfromquote(dataheader)
        {
            var quoteId=dataheader.quoteid;  
            log.debug("quoteId",quoteId);
           

            try {
                var newRecord = record.transform({
                    fromType: record.Type.ESTIMATE,
                    fromId: quoteId,
                    toType: record.Type.SALES_ORDER,
                    isDynamic: true
                });
                log.debug({ title: 'Record transformed successfully', details: newRecord });

                } catch (error) {
                log.error({ title: 'Error transforming record', details: error });
                }

                if (newRecord) {

                    try {
                        var recordId = newRecord.save();
                        log.debug({ title: 'Record saved successfully', details: recordId });
                        return recordId;

                    } catch (error) {
                        log.error({ title: 'Error saving record', details: error });
                        return "0";
                    }
                }

        }
        function deleteQuote(dataheader)
        {
            var quoteId=dataheader.quote_id;  

            try {
                record.delete({
                    type: record.Type.ESTIMATE,
                    id: quoteId
                });
                log.debug({ title: 'Record deleted successfully', details: quoteId });
                return "OK";

            } catch (error) {
                log.error({ title: 'Error deleting record', details: error });
                return "0";
            }    
        }
        function createWorkOrderFromSalesOrder(salesOrderId, salesOrderLineIndex,data) {
            var dataheader = data.data.dataheader;
                try {
                // Load the sales order
                var salesOrder = record.load({
                type: record.Type.SALES_ORDER,
                id: salesOrderId
                });
                // Get item details from the specified line
                var assemblyItemId = salesOrder.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: salesOrderLineIndex
                });
                var quantity = salesOrder.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: salesOrderLineIndex
                });
                log.debug("salesOrder", salesOrder);
                log.debug("assemblyItemId", assemblyItemId);
                log.debug("quantity", quantity);
                // Create new work order record
                var workOrder = record.create({
                type: record.Type.WORK_ORDER,
                isDynamic: true
                });
                // Set required fields and link to sales order
                workOrder.setValue({ fieldId: 'assemblyitem', value: assemblyItemId });
                workOrder.setValue({ fieldId: 'quantity', value: quantity });
                workOrder.setValue({ fieldId: 'specialOrder', value: true });
                workOrder.setValue({ fieldId: 'sourcetransactionid', value: salesOrderId });
                workOrder.setValue({ fieldId: 'sourcetransactionline', value: salesOrderLineIndex });
                workOrder.setValue({ fieldId: 'specialorder', value: true });
                workOrder.setValue({ fieldId: 'custbody_quote_sc', value: salesOrderId });
                // Add other necessary fields (e.g., location, dates)
                // workOrder.setValue({ fieldId: 'location', value: someLocationId });
                var datadetail = data.data.datadetail;

                if (dataheader.ctc_ownerdonor.length > 0) {
                    if (dataheader.ctc_ownerdonor=="on" ) {
                        var wowner=true
                    }
                    else
                    {
                        var wowner=false
                    }
                }

                for (var i = 0; i < datadetail.length; i++) {

                    if (wowner && datadetail[i].item_step_id == 1) continue;
                    var item = datadetail[i];

                    // Add a line item to the quote
                    workOrder.selectNewLine({
                        sublistId: 'item'
                    });
                    workOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item.item_id // Replace 'YOUR_ITEM_ID' with the actual internal ID of an item
                    });
                    workOrder.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: 1
                    });
                    
                    workOrder.commitLine({
                        sublistId: 'item'
                    });

                    log.debug("Item " + i, item);
                }


                var workOrderId = workOrder.save();

                log.debug('Work Order Created', 'Work Order ID: ' + workOrderId);
                return workOrderId;
                } catch (e) {
                log.error('Error Creating Work Order', e.toString());
                return null;
                }
          

        }
        return {
            get: get,
            post: post,
            transformfromquote: transformfromquote,
            createQuote: createQuote,
            createSalesContract: createSalesContract,
            createWorkOrderFromSalesOrder: createWorkOrderFromSalesOrder
        };
    });