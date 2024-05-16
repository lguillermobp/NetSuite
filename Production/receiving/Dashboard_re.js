/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/runtime",'N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log', "/SuiteScripts/Modules/LoDash.js", "/SuiteScripts/Modules/generaltoolsv1.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
    
	function (runtime, redirect, runtime,serverWidget,record, search, file, error,log,  _, GENERALTOOLS) {
		/**
		 *
		 * @param context
		 */
        var pagedatasbo=[];
        var pagedatascm=[];
        var transferred=[];
        function onRequest(context) {
            var userObj = runtime.getCurrentUser();
            var userID = userObj.id;
            var userPermission = userObj.getPermission({	name : 'TRAN_BUILD'	});
            autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

            POID = context.request.parameters.idpo;
            paramPO = GENERALTOOLS.get_PO_value(POID);
            
            entityname= paramPO.data.getValue({fieldId: "entityname"});
            
            PONo= paramPO.data.getValue({fieldId: "tranid"});
            POsts= paramPO.data.getValue({fieldId: "status"});

            log.audit("Posts", POsts);
           
            locationso = paramPO.data.getText({fieldId: "location"});
            locationsoid = paramPO.data.getValue({fieldId: "location"});




            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Item Receipt Dashboard`
                });
                form.clientScriptModulePath = '/SuiteScripts/receiving/DashboardClient_re.js';

             
                const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1788&deploy=1&id=${POID}`
               
                form.addButton({
                    id: 'custpage_buttonback', //always prefix with 'custpage_'
                    label: 'Dashboard', //label of the button
                    functionName: 'godashboard'
                });
                form.addButton({
                    id: 'custpage_buttonhelp', //always prefix with 'custpage_'
                    label: 'HELP', //label of the button
                    functionName: 'gohelp'
                });
                form.addButton({
                    id: "custpage_print", 
                    label: "Print Reception Note",
                    functionName: `printrn('${printSuitelet}');`
                })

                form.addSubmitButton({
                    id: 'custpage_buttonreceiving', //always prefix with 'custpage_'
                    label: 'Receiving' //label of the button
                });
        
                var fieldgroup1 = form.addFieldGroup({
                    id : 'fieldgroupid1',
                    label : 'Main'
                });
                var fieldgroup2 = form.addFieldGroup({
                    id : 'fieldgroupid2',
                    label : 'Vendor'
                });

                // Purchase Order Field

                let purcharseorderno = form.addField({
                    id: "custpage_prchaseorderno",
                    type: serverWidget.FieldType.TEXT,
                    label: "Purchase Order",
                    container : 'fieldgroupid1'
                });
                purcharseorderno.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.MIDROW
                });
                purcharseorderno.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                purcharseorderno.defaultValue = PONo;



                let purcharseorderid = form.addField({
                    id: "custpage_prchaseorderid",
                    type: serverWidget.FieldType.TEXT,
                    label: "Purchase Order",
                    container : 'fieldgroupid1'
                });

                purcharseorderid.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.MIDROW
                });
                purcharseorderid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                purcharseorderid.defaultValue = POID;

               
                // Work order status Field
                
                let purchaseordersts = form.addField({
                    id: "custpage_purchaseordersts",
                    type: serverWidget.FieldType.TEXT,
                    label: "Purchase Order STS",
                    container : 'fieldgroupid1'
                });
                purchaseordersts.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                
                purchaseordersts.defaultValue = POsts;

           
              

                // wipbin Field
                
                let totsel = form.addField({
                    id: "custpage_totsel",
                    type: serverWidget.FieldType.TEXT,
                    label: "total selected",
                    container : 'fieldgroupid1'
                });
                
                totsel.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

   
                
                // location Field
                
                let locationid = form.addField({
                    id: "custpage_locationid",
                    type: serverWidget.FieldType.TEXT,
                    label: "location ID",
                    container : 'fieldgroupid1'
                });
                
                locationid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });


                
                locationid.defaultValue = locationsoid;
                let location = form.addField({
                    id: "custpage_location",
                    type: serverWidget.FieldType.TEXT,
                    label: "location",
                    container : 'fieldgroupid1'
                });
                
                location.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                location.defaultValue = locationso;

                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type : serverWidget.SublistType.INLINEEDITOR,
                    label: 'Items',
        
                });
                sublistpm.addButton({
                    id: 'custpage_markmark',
                    label: 'Mark all',
                    functionName: "markall()"
                });
                sublistpm.addButton({
                    id: 'custpage_unmarkmark',
                    label: 'Unmark all',
                    functionName: "unmarkall()"
                });

               
                let itemidf =sublistpm.addField({
                    id: "custrecordml_itemid",
                    type: serverWidget.FieldType.TEXT,
                    label:'item ID'
                });
                itemidf.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                let sl_item = sublistpm.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'item'
                });
                sl_item.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                
                let sl_itemdesc = sublistpm.addField({
                    id: "custrecordml_itemdesc",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description'
                });
                sl_itemdesc.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty'
                });
                
               
                let binidf = sublistpm.addField({
                    id: "custrecordml_binlocationid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location ID'
                });
                binidf.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                let lineid = sublistpm.addField({
                    id: "custrecordml_lineid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Line ID'
                });
                lineid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                let sl_bin =sublistpm.addField({
                    id: "custrecordml_bin",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location'
                });
                sl_bin.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                
                
                
                sublistpm.addField({
                    id: 'custrecordml_selected',
                    label: 'Selected',
                    type: serverWidget.FieldType.CHECKBOX
                });
                
                var resultspt= findCases1(POID);
                var counter = 0;
                resultspt.forEach(function(result1) {


                    sublistpm.setSublistValue({
                        id: 'custrecordml_item',
                        line: counter,
                        value: result1.item,
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemid',
                        line: counter,
                        value: result1.itemid,
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_lineid',
                        line: counter,
                        value: result1.lineid,
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemdesc',
                        line: counter,
                        value: result1.memo+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: result1.qty 
                    });
                    
                    log.audit("wresult1.item " , result1.item);
                    
                    sublistpm.setSublistValue({
                        id: 'custrecordml_binlocationid',
                        line: counter,
                        value: "result1.binlocationid"
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_bin',
                        line: counter,
                        value: result1.binlocation
                    });
                    

                    sublistpm.setSublistValue({
                        id: 'custrecordml_selected',
                        line: counter,
                        value: result1.selected 
                        
                    });
                    
                   
                    counter++;
                
				})

                
           


                context.response.writePage(form);
            } else {
              
            
            }
    }
	function findCases1(POID) {
        var pagedatas=[];
		
        var purchaseOrder = record.load({
            type: record.Type.PURCHASE_ORDER,
            id: POID,
            isDynamic: true
        });

        var itemReceipt = record.transform({
            fromType: record.Type.PURCHASE_ORDER,
            fromId: POID,
            toType: record.Type.ITEM_RECEIPT,
            isDynamic: true
        });

        var _loop = function _loop(i) {

            var requiredQuantity = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            var item = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });
            var itemid = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            var lineid = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'line',
                line: i
            });
            var locitem = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: i
            });
            var binitem = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'binitem',
                line: i
            });
            var itemText = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'description',
                line: i
            });
            var binloc = "No use Bin";
            var selected = "T";
            var binlocid = " ";
            if (binitem) 
                {
                    rec = record.load({
                        type: "inventoryitem",
                        id: itemid,
                        isDynamic: true
                    })
                
                        var lineNumber = rec.findSublistLineWithValue({
                        sublistId: 'binnumber',
                        fieldId: 'preferredbin',
                        value: true
                    });
                
                    if (lineNumber!=-1) {
                        
                        var binloc = rec.getSublistText({sublistId: "binnumber", fieldId: "binnumber", line: lineNumber});
                        var binlocid = rec.getSublistValue({sublistId: "binnumber", fieldId: "binnumber", line: lineNumber});
                        var selected = "T";
                    
                    }
                    else {
                        var binloc = "No Bin";
                        var binlocid = " ";
                        var selected = "F";
                    }
                }
               

            pagedatas[i] = {
                "item": item,
                "lineid": lineid,
                "itemid": itemid,
                "qty": Math.ceil(requiredQuantity),
                "locitem": locitem,
                "memo": itemText,
                "inventoryDetailAvail": inventoryDetailAvail,
                "binlocationid": binlocid,
                "binlocation": binloc,
                "selected": selected
                }

        }
        var itemReceiptLineCount = itemReceipt.getLineCount('item');

        for (var i = 0; i < itemReceiptLineCount; i += 1) {
            _loop(i);
        }

        // Set any necessary fields on the item receipt record
        // For example, you can set the location, quantity, and bin location for each line item

        // Save the item receipt record

        //var itemReceiptId = itemReceipt.save();

        // Redirect to the newly created item receipt record

        // redirect.toRecord({
        //     type: record.Type.ITEM_RECEIPT,
        //     id: itemReceiptId
        // });
        
       
        return pagedatas;
	}
   
    
    return {
        onRequest: onRequest
    };
});