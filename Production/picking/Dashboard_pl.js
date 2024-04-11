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
        function onRequest(context) {
            var userObj = runtime.getCurrentUser();
            var userID = userObj.id;
            var userPermission = userObj.getPermission({	name : 'TRAN_BUILD'	});
            autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

            WOID = context.request.parameters.idwo;
            paramWO = GENERALTOOLS.get_WO_value(WOID);
            
            entityname= paramWO.data.getValue({fieldId: "entityname"});
            finishedgoodsso= paramWO.data.getText({fieldId: "assemblyitem"});
            WONo= paramWO.data.getValue({fieldId: "tranid"});
            WOsts= paramWO.data.getValue({fieldId: "status"});

            log.audit("Wosts", WOsts);
            

            finishedqtyso= paramWO.data.getValue({fieldId: "quantity"});

            var SOID= paramWO.data.getValue({fieldId: "createdfrom"});

            paramSO = GENERALTOOLS.get_SO_value(SOID);
            customerso = paramSO.data.getText({fieldId: "entity"});
            SONo = paramSO.data.getValue({fieldId: "tranid"});
            departmentso = paramWO.data.getText({fieldId: "department"});
            departmentid = paramWO.data.getValue({fieldId: "department"});
            locationso = paramWO.data.getText({fieldId: "location"});
            locationsoid = paramWO.data.getValue({fieldId: "location"});
            customerPOso = paramSO.data.getValue({fieldId: "otherrefnum"});
            paramdpt = GENERALTOOLS.get_department_value(departmentid);
            wipbinso = paramdpt.data.getText({fieldId: "custrecord_wipbin"});
            wipbinsoid = paramdpt.data.getValue({fieldId: "custrecord_wipbin"});



            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Picking Dashboard`
                });
                form.clientScriptModulePath = '/SuiteScripts/picking/DashboardClient_pl.js';


                if (WOsts!="999Released") 
                {
                    form.addButton({
                        id: 'custpage_process',
                        label: 'Submit',
                        functionName: "process"
                    });

                }


               
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
        
                var fieldgroup1 = form.addFieldGroup({
                    id : 'fieldgroupid1',
                    label : 'Main'
                });
                var fieldgroup2 = form.addFieldGroup({
                    id : 'fieldgroupid2',
                    label : 'BOM'
                });

                // Sales Contract Field

                let saleorderno = form.addField({
                    id: "custpage_saleorderno",
                    type: serverWidget.FieldType.TEXT,
                    label: "sale Order",
                    container : 'fieldgroupid1'
                });
                saleorderno.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.MIDROW
                });
                saleorderno.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                saleorderno.defaultValue = SONo;

                 // Work Order Field
                
                 let workorderno = form.addField({
                    id: "custpage_workorderno",
                    type: serverWidget.FieldType.TEXT,
                    label: "Work Order",
                    container : 'fieldgroupid1'
                });
                workorderno.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.MIDROW
                });
                workorderno.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                workorderno.defaultValue = WONo;

                // Customer Field
                
                let customer = form.addField({
                    id: "custpage_customer",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer",
                    container : 'fieldgroupid1'
                });
                
                customer.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                customer.defaultValue = customerso;

                // CustomerPO Field
                
                let customerPO = form.addField({
                    id: "custpage_customerpo",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer PO",
                    container : 'fieldgroupid1'
                });
                customerPO.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                customerPO.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                customerPO.defaultValue = customerPOso;
                
                // Work order status Field
                
                let workordersts = form.addField({
                    id: "custpage_customerwosts",
                    type: serverWidget.FieldType.TEXT,
                    label: "Work ORder STS",
                    container : 'fieldgroupid1'
                });
                workordersts.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                
                workordersts.defaultValue = WOsts;

                // department Field
                
                let department = form.addField({
                    id: "custpage_department",
                    type: serverWidget.FieldType.TEXT,
                    label: "Department",
                    container : 'fieldgroupid1'
                });
                department.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.STARTROW
                });
                department.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                department.defaultValue = departmentso;

                // wipbin Field
                
                let wipbinid = form.addField({
                    id: "custpage_wipbinid",
                    type: serverWidget.FieldType.TEXT,
                    label: "wip binlocation id",
                    container : 'fieldgroupid1'
                });
                
                wipbinid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                wipbinid.defaultValue = wipbinsoid;

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

                let wipbin = form.addField({
                    id: "custpage_wipbin",
                    type: serverWidget.FieldType.TEXT,
                    label: "wip binlocation",
                    container : 'fieldgroupid1'
                });
                wipbin.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.MIDROW
                });
                wipbin.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                wipbin.defaultValue = wipbinso;
                
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
                // Ship Date Field
                /*
                let shipdate = form.addField({
                    id: "custpage_shipdate",
                    type: serverWidget.FieldType.TEXT,
                    label: "shipdate",
                    container : 'fieldgroupid1'
                });
                
                shipdate.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                shipdate.defaultValue = shipdateso;

                */
                // Finished Goods Field
                
                let finishedgoods = form.addField({
                    id: "custpage_finishedgoods",
                    type: serverWidget.FieldType.TEXT,
                    label: "Finished Goods",
                    container : 'fieldgroupid1'
                });
                
                finishedgoods.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                finishedgoods.defaultValue = finishedgoodsso;

                // Finished Goods Field
                
                let finishedqty = form.addField({
                    id: "custpage_finishedqty",
                    type: serverWidget.FieldType.TEXT,
                    label: "Finished Quantity",
                    container : 'fieldgroupid1'
                });
                
                finishedqty.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                finishedqty.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                finishedqty.defaultValue = finishedqtyso;
    
                let htmlField1 = form.addField({
                    id: "custpage_html1",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                htmlField1.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.STARTROW
                });

                htmlField1.defaultValue = '<div id="MyPalletId" style="width: 100%;background-color: #757575;text-align: center;line-height: 30px; font-size: 20px;	color: white;">Available Items </div>';
                let htmlFieldt1 = form.addField({
                    id: "custpage_htmlt1",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });

                htmlFieldt1.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.STARTROW
                });
                htmlFieldt1.defaultValue = '<div id="MyPalletId1" style="width: 100%;background-color: #757575;text-align: center;line-height: 30px; font-size: 20px;	color: white;">Total ... </div>';
    

                let htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                htmlField.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.STARTROW
                });
                htmlField.defaultValue = '<div id="myProgress" style="width: 100%;background-color: #757575;"><div id="myBar" style="width: 0%;	height: 30px;background-color: #9e5d20;	text-align: center;	line-height: 30px; font-size: 20px;	color: white;">0%</div>	  </div>';
   

                let htmlFieldt = form.addField({
                    id: "custpage_htmlt",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                htmlFieldt.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.MIDROW
                });
                htmlFieldt.defaultValue = '<div id="myProgress1" style="width: 100%;background-color: #757575;"><div id="myBar1" style="width: 0%;	height: 30px;background-color: #9e5d20;	text-align: center;	line-height: 30px; font-size: 20px;	color: white;">0%</div>	  </div>';


                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'Available Items',
        
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

                sublistpm.addButton({
                id: "custpage_print", 
                label: "Print BOM ECD",
                functionName: "printpl("+WOID+")"
                })

                let itemidf =sublistpm.addField({
                    id: "custrecordml_itemid",
                    type: serverWidget.FieldType.TEXT,
                    label:'item ID'
                });
                itemidf.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });




                sublistpm.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'item'
                });
                
                sublistpm.addField({
                    id: "custrecordml_itemdesc",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description'
                });
                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty'
                });
                sublistpm.addField({
                    id: "custrecordml_commitedqty",
                    type: serverWidget.FieldType.TEXT,
                    label: "Commited Qty"
                });
                sublistpm.addField({
                    id: "custrecordml_qtyneeded",
                    type: serverWidget.FieldType.TEXT,
                    label: "Qty Needed"
                });
                let binidf = sublistpm.addField({
                    id: "custrecordml_binlocationid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location ID'
                });
                binidf.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                sublistpm.addField({
                    id: "custrecordml_binlocation",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location'
                });
                
                sublistpm.addField({
                    id: "custrecordml_qtyb",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty Bin Location'
                });
                
                sublistpm.addField({
                    id: 'custrecordml_selected',
                    label: 'Selected',
                    type: serverWidget.FieldType.CHECKBOX
                });
    
                // loop through each line, skipping the header
                var resultspt= findCases1(WOID,locationsoid);
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
                        id: 'custrecordml_itemdesc',
                        line: counter,
                        value: result1.itemdesc+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: result1.qty 
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_commitedqty',
                        line: counter,
                        value: result1.qtycommited
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qtyneeded',
                        line: counter,
                        value: result1.qtyneeded
                    });
                    log.audit("wresult1.item " , result1.item);
                    sublistpm.setSublistValue({
                        id: 'custrecordml_binlocationid',
                        line: counter,
                        value: result1.binlocationid
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_binlocation',
                        line: counter,
                        value: result1.binlocation
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qtyb',
                        line: counter,
                        value: result1.qtyb 
                    });

                    sublistpm.setSublistValue({
                        id: 'custrecordml_selected',
                        line: counter,
                        value: "T" 
                        
                    });
                    
                   
                    counter++;
                
				})

                
                // New Subtag or SubList

                var sublistbo = form.addSublist({
                    id: 'custpage_recordsbo',
                    type : serverWidget.SublistType.LIST,
                    label: 'Back Order',
        
                });
				

                sublistbo.addField({
                    id: "custrecordbo_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'item'
                });
                sublistbo.addField({
                    id: "custrecordbo_itemdesc",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description'
                });


                sublistbo.addField({
                    id: "custrecordbo_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty'
                });
               
               
    
                // loop through each line, skipping the header
                
                var counter = 0;
                pagedatasbo.forEach(function(result1) {


                    sublistbo.setSublistValue({
                        id: 'custrecordbo_item',
                        line: counter,
                        value: result1.item
                        
                    });
                    sublistbo.setSublistValue({
                        id: 'custrecordbo_itemdesc',
                        line: counter,
                        value: result1.itemdesc+" "
                        
                    });
                   
                    sublistbo.setSublistValue({
                        id: 'custrecordbo_qty',
                        line: counter,
                        value: result1.qty 
                    });

                   
                    counter++;
                
				})


                /*


                var sublistcm = form.addSublist({
                    id: 'custpage_recordscm',
                    type : serverWidget.SublistType.LIST,
                    label: 'Commitment',
        
                });
				
                let itemidcf = sublistcm.addField({
                    id: "custrecordcm_itemid",
                    type: serverWidget.FieldType.TEXT,
                    label:'item ID'
                });
                itemidcf.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistcm.addField({
                    id: "custrecordcm_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'item'
                });
                
                sublistcm.addField({
                    id: "custrecordcm_itemdesc",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description'
                });
                sublistcm.addField({
                    id: "custrecordcm_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty'
                });
                sublistcm.addField({
                    id: "custrecordcm_commitedqty",
                    type: serverWidget.FieldType.TEXT,
                    label: "Commited Qty"
                });
                sublistcm.addField({
                    id: "custrecordcm_qtyneeded",
                    type: serverWidget.FieldType.TEXT,
                    label: "Qty Needed"
                });
                let binidcf = sublistcm.addField({
                    id: "custrecordcm_binlocationid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location ID'
                });
                binidcf.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                sublistcm.addField({
                    id: "custrecordcm_binlocation",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location'
                });
                
                sublistcm.addField({
                    id: "custrecordcm_qtyb",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty Bin Location'
                });
                
                
    
                // loop through each line, skipping the header
                
                var counter = 0;
                pagedatascm.forEach(function(result1) {

                    sublistcm.setSublistValue({
                        id: 'custrecordcm_item',
                        line: counter,
                        value: result1.item,
                    });
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_itemid',
                        line: counter,
                        value: result1.itemid,
                    });
                   
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_itemdesc',
                        line: counter,
                        value: result1.itemdesc+" "
                    });
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_qty',
                        line: counter,
                        value: result1.qty 
                    });
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_commitedqty',
                        line: counter,
                        value: result1.qtycommited
                    });
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_qtyneeded',
                        line: counter,
                        value: result1.qtyneeded
                    });
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_binlocationid',
                        line: counter,
                        value: result1.binlocationid
                    });
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_binlocation',
                        line: counter,
                        value: result1.binlocation
                    });
                    sublistcm.setSublistValue({
                        id: 'custrecordcm_qtyb',
                        line: counter,
                        value: result1.qtyb 
                    });

                      
                    counter++;
                
				})

                */

                // New Subtag or SubList

                var sublisttr = form.addSublist({
                    id: 'custpage_recordstr',
                    type : serverWidget.SublistType.LIST,
                    label: 'Transfered Items',

                });


                sublisttr.addField({
                    id: "custrecordtr_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'item'
                });
                sublisttr.addField({
                    id: "custrecordtr_itemdesc",
                    type: serverWidget.FieldType.TEXT,
                    label:'Description'
                });
                sublisttr.addField({
                    id: "custrecordtr_qty",
                    type: serverWidget.FieldType.INTEGER,
                    label:'Qty'
                });
                sublisttr.addField({
                    id: "custrecordtr_type",
                    type: serverWidget.FieldType.TEXT,
                    label:'Type'
                });
                sublisttr.addField({
                    id: "custrecordtr_dco",
                    type: serverWidget.FieldType.TEXT,
                    label:'Document'
                });
                sublisttr.addField({
                    id: "custrecordtr_bin",
                    type: serverWidget.FieldType.TEXT,
                    label:'BinLocation'
                });
                sublisttr.addField({
                    id: "custrecordtr_user",
                    type: serverWidget.FieldType.TEXT,
                    label:'User'
                });
                sublisttr.addField({
                    id: "custrecordtr_date",
                    type: serverWidget.FieldType.DATE,
                    label:'Date'
                });



                // loop through each line, skipping the header

                var resultstr= findCases5(WONo,locationsoid);
                var counter = 0;
                resultstr.forEach(function(result1) {


                    sublisttr.setSublistValue({
                        id: 'custrecordtr_item',
                        line: counter,
                        value: result1.item
                        
                    });
                    sublisttr.setSublistValue({
                        id: 'custrecordtr_itemdesc',
                        line: counter,
                        value: result1.itemdesc+" "
                        
                    });
                
                    sublisttr.setSublistValue({
                        id: 'custrecordtr_qty',
                        line: counter,
                        value: result1.qty 
                    });
                    sublisttr.setSublistValue({
                        id: 'custrecordtr_user',
                        line: counter,
                        value: result1.user 
                    });
                    sublisttr.setSublistValue({
                        id: 'custrecordtr_type',
                        line: counter,
                        value: result1.type 
                    });
                    sublisttr.setSublistValue({
                        id: 'custrecordtr_dco',
                        line: counter,
                        value: result1.dco 
                    });
                    sublisttr.setSublistValue({
                        id: 'custrecordtr_date',
                        line: counter,
                        value: result1.date 
                    });
                    sublisttr.setSublistValue({
                        id: 'custrecordtr_bin',
                        line: counter,
                        value: result1.bin 
                    });

                
                    counter++;

                })



                context.response.writePage(form);
            } else {
              
            
            }
    }
	function findCases1(WO_INTERNAL_ID,workOrderLocation) {
		var pagedatas=[];

        let workOrderLines = "";
        let line = 1;
        let lineItemIds = [];
        let lineNumbers = {};
        var j=0;
        var b=0;
        const searchWorkOrderLines = search.create({
            "type": "transaction",
            "filters": [
                ["type","anyof","WorkOrd"], 
                "AND", 
                ["internalid","anyof",[WO_INTERNAL_ID]], 
                "AND", 
                ["mainline","is","F"]
             ],
            
            "columns": [
                {
                    "name": "internalid",
                    "join": "item",
                    "label": "Internal ID",
                    "type": "select",
                    "sortdir": "NONE"
                },
                {
                    "name": "item",
                    "label": "Item",
                    "type": "select",
                    "sortdir": "NONE"
                },
                {
                    "name": "purchasedescription",
                    "join": "item",
                    "label": "Description",
                    "type": "text",
                    "sortdir": "NONE"
                },
                {
                    "name": "quantity",
                    "label": "Quantity",
                    "type": "float",
                    "sortdir": "NONE"
                },
                {
                    "name": "quantitycommitted",
                    "label": "quantitycommitted",
                    "type": "float",
                    "sortdir": "NONE"
                },
                search.createColumn({
                   name: "formulanumeric",
                   formula: "CASE WHEN ({item.quantityavailable} is null AND {quantitycommitted} is null) THEN {quantity} ELSE CASE WHEN {item.quantityavailable}<{quantity}-{quantitycommitted} THEN ABS({item.quantityavailable}-{quantity}+{quantitycommitted})  ELSE 0 END END",
                   label: "BackOrder"
                })
            ]
        }).run().each(function (result) {
            lineItemIds.push(result.getValue({
                name: "internalid",
                join: "item"
            }));

            lineNumbers[result.getText({name: "item"})] = {
                "line":line,
                "qty":result.getValue({name: "quantity"}),
                "qtyc":result.getValue({name: "quantitycommitted"}),
                //"qtyc": 0 ,
                "qtybo":result.getValue({name: "formulanumeric"}),
                "itemdesc":result.getValue({name: "purchasedescription", join: "item"})
            };
            if (result.getValue({name: "formulanumeric"})>0) 
            {
            pagedatasbo[j] = {
                "lineNumber": line,
                "item": result.getText({name: "item"}),
                "itemdesc": result.getValue({name: "purchasedescription", join: "item"}),
                "binlocation": " ",
                "qty": result.getValue({name: "formulanumeric"}),
                "binlocationqty": 0,
                "qtyneeded": result.getValue({name: "quantity"})-result.getValue({name: "quantitycommitted"}),
                "onhand": 0,
                "memo": "memo"
                }
                j++;
            }

            i++;

            line += 1;

            return true;
        })

        lineItemIds = _.uniq(lineItemIds);
        log.audit("workOrderLocation " , workOrderLocation);
        log.audit("lineItemIds " , lineItemIds);
        let balanceitem=0;
        let itembef;
        let inventoryBalanceLines = "";
        let inventoryBalanceData = [];
        const searchInventoryBalance = search.create({
            "type": "InventoryBalance",
            "filters": [{
                "name": "internalid",
                "join": "item",
                "operator": "anyof",
                "values": lineItemIds,
                "isor": false,
                "isnot": false,
                "leftparens": 0,
                "rightparens": 0
            }, {
                "name": "location",
                "operator": "noneof",
                "values": [
                    workOrderLocation
                ],
                "isor": false,
                "isnot": false,
                "leftparens": 0,
                "rightparens": 0
            },
            {
                "name": "binnumber",
                "operator": "noneof",
                "values": [
                    "10892","15207","10462"
                ],
                "isor": false,
                "isnot": false,
                "leftparens": 0,
                "rightparens": 0
            }
            ],
            "columns": [
                search.createColumn({
                    name: "item",
                    sort: search.Sort.ASC
                }),
                search.createColumn({
                    name: "datecreated",
                    join: "inventoryNumber",
                    sort: search.Sort.ASC
                }),
                "binnumber",
                "location",
                "inventorynumber",
                "status",
                search.createColumn({
                    name: "onhand",
                    sort: search.Sort.ASC
                }),
                "available",
                search.createColumn({
                    name: "expirationdate",
                    join: "inventoryNumber"
                })
            ]
        }).run().each(function (result) {
            let inventoryBalanceLocation = result.getText({name: "location"})
            const inventoryBalanceLocationPriority = inventoryBalanceLocation === workOrderLocation ? 1 : 2;
            inventoryBalanceLocation = inventoryBalanceLocation === "Kissimmee-WIP" ? "WIP" : "Warehouse";

            if (itembef!=result.getText({name: "item"})) {
                itembef=result.getText({name: "item"});
                balanceitem=parseInt(lineNumbers[result.getText({name: "item"})].qty);
            }
            var qtyr=0;
            if (balanceitem>result.getValue({name: "available"})) {
                qtyr=parseInt(result.getValue({name: "available"}));
            }
            else {
                qtyr=balanceitem;
            }
            if (balanceitem>0) {
                inventoryBalanceData.push({
                    "lineNumber": lineNumbers[result.getText({name: "item"})].line,
                    "qty": qtyr,
                    "itemid": result.getValue({name: "item"}),
                    "item": result.getText({name: "item"}),
                    "locationPriority": inventoryBalanceLocationPriority,
                    "location": inventoryBalanceLocation,
                    "binnumber": result.getText({name: "binnumber"}),
                    "binnumberid": result.getValue({name: "binnumber"}),
                    "inventorynumber": result.getText({name: "inventorynumber"}),
                    "expirationdate": result.getValue({name: "expirationDate", join: "inventoryNumber"}),
                    //"expirationdate": balanceitem + "-" + Number(result.getValue({name: "available"})),
                    "datecreated": result.getValue({name: "datecreated", join: "inventoryNumber"}),
                    "onhand": Number(result.getValue({name: "onhand"})),
                    "available": Number(result.getValue({name: "available"}))
                });
            }
            balanceitem=balanceitem-Number(result.getValue({name: "available"}));
            //balanceitem=balanceitem-0;

            return true;
        });

        inventoryBalanceData = _.orderBy(inventoryBalanceData, ["lineNumber", "available","locationPriority"], ["asc", "asc", "asc"]);
        var scripjs="";
        for (const result of inventoryBalanceData) {

            result.binlocationqty=0;

            if (result.binlocationqty>result.qty) {result.qtyneeded=0;}
            else {result.qtyneeded=result.qty-result.binlocationqty;}


            if ((lineNumbers[result.item].qty - lineNumbers[result.item].qtyc)>0) {

            pagedatas[i] = {
                "lineNumber": result.lineNumber,
                "item": result.item,
                "itemid": result.itemid,
                "itemdesc": lineNumbers[result.item].itemdesc,
                "binlocation": result.binnumber,
                "binlocationid": result.binnumberid,
                "qty": lineNumbers[result.item].qty,
                "qtyb": result.qty,
                "qtycommited": Number(lineNumbers[result.item].qtyc) + 0,
                "binlocationqty": result.binlocationqty,
                "qtyneeded": lineNumbers[result.item].qty - lineNumbers[result.item].qtyc,
                "onhand": result.onhand,
                "memo": "memo"
                }

            i++;
            }
            else {

            pagedatascm[b] = {
                "lineNumber": result.lineNumber,
                "item": result.item,
                "itemid": result.itemid,
                "itemdesc": lineNumbers[result.item].itemdesc,
                "binlocation": result.binnumber,
                "binlocationid": result.binnumberid,
                "qty": lineNumbers[result.item].qty,
                "qtyb": result.qty,
                "qtycommited": Number(lineNumbers[result.item].qtyc) + 0,
                "binlocationqty": result.binlocationqty,
                "qtyneeded": lineNumbers[result.item].qty - lineNumbers[result.item].qtyc,
                "onhand": result.onhand,
                "memo": "memo"
                }

            b++;
            }
        }
       
        return pagedatas;
	}
    var pagedatastr=[];
    function findCases5(WO,workOrderLocation) {
        log.audit("WO " , WO);
        log.audit("workOrderLocation " , workOrderLocation);
            
        var j=0;
        const searchWorkOrderLines = search.create({
            type: "inventorytransfer",
            settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
            filters:
            [
                ["type","anyof","InvTrnfr"], 
                "AND", 
                ["memo","startswith",WO], 
                "AND", 
                ["location","anyof",workOrderLocation]
            ],
            columns:
            [
                "trandate",
                "type",
                "tranid",
                "entity",
                "memo",
                "amount",
                "item",
                "quantity",
                "location",
                search.createColumn({
                    name: "binnumber",
                    join: "inventoryDetail"
                }),
                "createdby",
                search.createColumn({
                   name: "purchasedescription",
                   join: "item"
                })
            ]
        });
        var pagedData = searchWorkOrderLines.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});

			page.data.forEach(function (result) {
           
            
            pagedatastr[j] = {
                "item": result.getText({name: "item"}),
                "itemdesc": result.getValue({name: "purchasedescription", join: "item"}),
                "bin": result.getText({name: "binnumber", join: "inventoryDetail"}),
                "qty": result.getValue({name: "quantity"}),
                "type": result.getValue({name: "type"}),
                "date": result.getValue({name: "trandate"}),
                "dco": result.getValue({name: "tranid"}),
                "user": result.getText({name: "createdby"})
                }
                j++;
           
        })
    })
        
        return pagedatastr;
    }

    return {
        onRequest: onRequest
    };
});