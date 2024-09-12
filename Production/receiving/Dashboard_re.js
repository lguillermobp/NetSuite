/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define([ 'N/url',"N/runtime",'N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log', "/SuiteScripts/Modules/LoDash.js", "/SuiteScripts/Modules/generaltoolsv1.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
    
	function (url, runtime, redirect, runtime,serverWidget,record, search, file, error,log,  _, GENERALTOOLS) {
		/**
		 *
		 * @param context
		 */
        let itembinloc = [];
        var typetransaction;
        function onRequest(context) {
            var userObj = runtime.getCurrentUser();
            var userID = userObj.id;
            var userPermission = userObj.getPermission({	name : 'TRAN_BUILD'	});
            autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

            POID = context.request.parameters.idpo;

            if (!POID) {
                    
                    
                var script = 'customscript_maindashboard_re';
                var deployment = 'customdeploy1';
                var parameters = "";
    
                
                redirect.toSuitelet({
                    scriptId:script,
                    deploymentId: deployment,
                    parameters: {
                       
                    } 
                   
                });
    
              return;
    
            
        }
           


            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Item Receipt Dashboard`
                });
                form.clientScriptModulePath = '/SuiteScripts/receiving/DashboardClient_re.js';

               
                try {typetransaction = "purchaseorder";
                paramPO = GENERALTOOLS.get_PO_value(POID);
                } catch (e) {
                    typetransaction = "transferorder";
                    paramPO = GENERALTOOLS.get_TO_value(POID);
                }
            
                entityname= paramPO.data.getValue({fieldId: "entityname"});
                
                PONo= paramPO.data.getValue({fieldId: "tranid"});
                POsts= paramPO.data.getValue({fieldId: "status"});
                POmemo= paramPO.data.getValue({fieldId: "memo"});
    
                log.audit("Posts", POsts);
               
                locationso = paramPO.data.getText({fieldId: "location"});
                locationsoid = paramPO.data.getValue({fieldId: "location"});
                customerpo = paramPO.data.getText({fieldId: "custbody_customer"});

             
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
                    label: 'Received' //label of the button
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
                    label: "Purchase Order/Transfer Order",
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

               
                purcharseorderid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                purcharseorderid.defaultValue = POID;

                let typetrans = form.addField({
                    id: "custpage_typetransaction",
                    type: serverWidget.FieldType.TEXT,
                    label: "Type Transaction",
                    container : 'fieldgroupid1'
                });

               
                typetrans.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                typetrans.defaultValue = typetransaction;

               
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

           
                let memof = form.addField({
                    id: "custpage_memo",
                    label: "MEMO",
                    type: serverWidget.FieldType.TEXT,
                });

                memof.defaultValue = POmemo;
                
                
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

                location.updateBreakType({
                    breakType : serverWidget.FieldBreakType.STARTCOL
                });
                location.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                location.defaultValue = locationso;

                let vendor = form.addField({
                    id: "custpage_vendor",
                    type: serverWidget.FieldType.TEXT,
                    label: "Vendor",
                    container : 'fieldgroupid1'
                });
                
                vendor.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                vendor.defaultValue = entityname;


                let customer = form.addField({
                    id: "custpage_customer",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer",
                    container : 'fieldgroupid1'
                });
                
                customer.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                customer.defaultValue = customerpo;


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
                
                let sl_itemv = sublistpm.addField({
                    id: "custrecordml_itemv",
                    type: serverWidget.FieldType.TEXT,
                    label:'Vendor Item'
                });
                sl_itemv.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                let sl_project = sublistpm.addField({
                    id: "custrecordml_project",
                    type: serverWidget.FieldType.TEXT,
                    label:'Project'
                });
                sl_project.updateDisplayType({
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

                let sl_qtyo =sublistpm.addField({
                    id: "custrecordml_qtyo",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Qty Original'
                });
                sl_qtyo.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });

                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.FLOAT,
                    label:'Qty'
                });
                

                let lineid = sublistpm.addField({
                    id: "custrecordml_lineid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Line ID'
                });
                lineid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                let listinventoryDetailAvail = sublistpm.addField({
                    id: "custrecordml_inventorydetailavail",
                    type: serverWidget.FieldType.TEXT,
                    label:'Avail Inventory Detail'
                });
                listinventoryDetailAvail.updateDisplayType({
                     displayType: serverWidget.FieldDisplayType.HIDDEN
                 });

               
                let sl_bint =sublistpm.addField({
                    id: "custrecordml_bin",
                    type: serverWidget.FieldType.SELECT,
                    label:'Bin Location',
                    source: "bin"
                });
                   
                sublistpm.addField({
                    id: 'custrecordml_selected',
                    label: 'Selected',
                    type: serverWidget.FieldType.CHECKBOX
                });
                
                var resultspt= findCases1(POID);
                var counter = 0;
                resultspt.forEach(function(result1) {


                    if (!itembinloc[result1.itemid] && result1.binloc!="No use Bin") {binloc="ERROR";selected="F"}
                    else {binloc=itembinloc[result1.itemid].binloc;binlocid=itembinloc[result1.itemid].binlocid;selected="T"}

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
                        value: result1.memo.substring(0, 298)+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: result1.qty 
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qtyo',
                        line: counter,
                        value: result1.qtyo
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemv',
                        line: counter,
                        value: result1.itemv+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_project',
                        line: counter,
                        value: result1.project.substring(0, 298)+" "
                    });
                                      

                     if (binloc!="ERROR" && binloc!="No use Bin") {
                        
                     sublistpm.setSublistValue({
                         id: 'custrecordml_bin',
                         line: counter,
                         value: binlocid
                     });
                     }

                    sublistpm.setSublistValue({
                        id: 'custrecordml_selected',
                        line: counter,
                        value: "F" 
                        
                    });

                    sublistpm.setSublistValue({
                        id: 'custrecordml_inventorydetailavail',
                        line: counter,
                        value: result1.inventoryDetailAvail 
                        
                    });
                    
                    counter++;
                
				})

                context.response.writePage(form);
            } else {
              
            
            }
    }
	function findCases1(POID) {
        var pagedatas=[];
        let lineItemIds = [];
		
       
        var itemReceipt = record.transform({
            fromType: typetransaction,
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
            var QuantityO = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            
            var vendorcode = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_vendorcode',
                line: i
            });
            var vendorcode = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_vendorcode',
                line: i
            });
            var project = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_notes',
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
            var vendorname = itemReceipt.getSublistValue({
                sublistId: 'item',
                fieldId: 'vendorname',
                line: i
            });
            lineItemIds.push(itemid);
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
            var binloc = "Error";
            var selected = "T";
            var binlocid = " ";
            
            if (!binitem) {
                var binloc = "No use Bin";
            }


            pagedatas[i] = {
                "item": item,
                "itemv": vendorcode,
                "project": project,
                "lineid": lineid,
                "itemid": itemid,
                "qty": Math.ceil(requiredQuantity),
                "qtyo": Math.ceil(QuantityO),
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
        
        
        pagedatas1 = pagedatas.sort((a, b) => {
            if (a.item > b.item) return 1
            return -1
            });
        
        
        lineItemIds = _.uniq(lineItemIds);

        //============================================================
        log.audit("lineItemIds",lineItemIds);
        
        const searchInventoryBalance = search.create({
            type: "item",
            filters:
            [
               ["internalid","anyof",lineItemIds], 
               "AND", 
               ["binnumber","isnotempty",""]
            ],
            columns:
            [
               "internalid",
               "itemid",
               "displayname",
               "salesdescription",
               "type",
               "binnumber",
               search.createColumn({
                  name: "internalid",
                  join: "binNumber"
                })
            ]
        })
        var pagedData = searchInventoryBalance.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});

			page.data.forEach(function (result) {
            
            
            itembinloc[result.getValue({name: "internalid"})] = {
                "binloc":result.getValue({name: "binnumber"}),
                "binlocid":result.getValue({name: "internalid",join: "binNumber"})
            }

            })
                   
        })

        //============================================================

       
        return pagedatas1;
	}
   
    
    return {
        onRequest: onRequest
    };
});