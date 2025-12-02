/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record",'N/log', "N/search", "N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, log, search, runtime, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("context",context);
        const currentRecord = context.newRecord;
        log.debug("currentRecord",currentRecord.getValue({fieldId: "createdfrom"}) );
        idpo= currentRecord.getValue({fieldId: "createdfrom"});
        const currentRecordId = idpo;
        log.debug("currentRecordId",currentRecordId);

        
        const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1788&deploy=1&id=${currentRecordId}`

        context.form.addButton({
            id: "custpage_print", 
            label: "Print Reception Note",
            functionName: `printrn('${printSuitelet}');`
        })


            context.form.addButton({
                id: "custpage_printrn", 
                label: "Show Bin Locations",
                functionName: `showbin("${currentRecord}")`
            })
            context.form.clientScriptModulePath = "./sdr_cs_itemreceipt.js";


            
        
    }

    function beforeSubmit(context) {
        
       
    }

    function afterSubmit(context) {

        log.debug("context",context);
        log.debug("context.type",context.type);

        if (context.type=="create" || context.type=="delete" )
        {
            if (context.type=="create" )
                {
                    var currentRecord = context.newRecord;
                }
                else
                {
                    var currentRecord = context.oldRecord;
                }
                
            const itemLineCount = currentRecord.getLineCount({ sublistId: "item" });
            log.debug("itemLineCount", itemLineCount);

            var userObj = currentRecord.getValue({ fieldId: 'nluser' });
            log.debug('createdFrom', userObj);
            if (userObj == null || userObj == '' || userObj == undefined) {
                userObj = 839;
            }
            var paramemp = GENERALTOOLS.get_employee_value(userObj);
            var VIEWECDUSERID=paramemp.data.getValue({fieldId: "custentity_viewecduserid"});

            // If you need to inspect each line:
            for (var i = 0; i < itemLineCount; i++) 
                {
                    const itemId = currentRecord.getSublistValue({
                        sublistId: "item",
                        fieldId: "item",
                        line: i
                    });
                    const itemreceive = currentRecord.getSublistValue({
                        sublistId: "item",
                        fieldId: "itemreceive",
                        line: i
                    })
                    const quantity = currentRecord.getSublistValue({
                        sublistId: "item",
                        fieldId: "quantity",
                        line: i
                    });
                    log.debug("quantity " + i, quantity);
                    log.debug("itemreceive " + i, itemreceive);

                    if (itemreceive>0)
                    {
                        log.debug("item line " + i, itemId);
                        log.debug("item line " + i, itemId);

                        const custcol_requestid = currentRecord.getSublistValue({
                            sublistId: "item",
                            fieldId: "custcol_requestid",
                            line: i
                        });
                        log.debug("item line " + i + " custcol_requestid", custcol_requestid);

                        if (custcol_requestid!=null && custcol_requestid!="")
                            {

                                try {
                                    var lookupResult = search.lookupFields({
                                        type: "customrecord_requestrecords",
                                        id: custcol_requestid,
                                        columns: ['custrecord_sts_preview', 'custrecord_requeststscod', 'custrecord_viewecdid', 'custrecord_rq_pickable'] // Example with a joined field
                                    });

                                    var custrecord_sts_preview = lookupResult.custrecord_sts_preview;
                                    var requeststscod = lookupResult.custrecord_requeststscod;
                                    var custrecord_requeststscod = requeststscod[0].value;
                                    var viewecdid = lookupResult.custrecord_viewecdid;
                                    var custrecord_rq_pickable = lookupResult.custrecord_rq_pickable;
                                    log.debug('lookupResult', lookupResult);


                                    log.debug('Transaction ID', custrecord_sts_preview);

                                } catch (e) {
                                    log.error('Error in lookupFields', e.toString());
                                    return null;
                                }

                                if (context.type=="create" )
                                {
                                    var paramitem = GENERALTOOLS.get_Item_basic(itemId);
                                    var recordType= paramitem.data.getValue({fieldId: "recordType"});
                                    if (recordType=='inventoryitem' )   {
                                        if (custrecord_rq_pickable=='N') {pickable='Y';} else {pickable=custrecord_rq_pickable;}
                                        }
                                        else {pickable='N';}

                                    log.debug('itemtype', itemtype);
                                    
                                    if (custrecord_requeststscod=="7") {newsts="10"; newstscod="51", newstsedsc="Item Received/Return to WH Stock";}
                                    else {newsts="9"; newstscod="50", newstsedsc="Item Received";}
                                }
                                if (context.type=="delete" )
                                {
                                    if (custrecord_rq_pickable=='Y') {pickable='N';} else {pickable=custrecord_rq_pickable;}
                                    if (custrecord_requeststscod=="10") {newsts="7"; newstscod="41", newstsedsc="PO Generated/Pending to pick";}
                                    else {newsts="8"; newstscod="42", newstsedsc="PO Generated";}
                                }

                                record.submitFields({
                                    type: "customrecord_requestrecords",
                                    id: custcol_requestid,
                                    values: {
                                        "custrecord_rq_pickable": pickable,
                                        "custrecord_requeststscod": newsts,
                                        "custrecord_sts_preview": custrecord_requeststscod,
                                        "custrecord_requeststs": newstsedsc
                                    }
                                })
                                var opt="SET";
                                datasending= {
                                        "po": 0,
                                        "po_tracking": "",
                                        "bo_vendor": "",
                                        "pickable": pickable,
                                        "viewecduserid": VIEWECDUSERID,
                                        "status": newstscod,
                                        "notes": newstsedsc,
                                        "oldstatus": custrecord_requeststscod,
                                        "request_id" : viewecdid
                                    }
                                    const jsonString = JSON.stringify(datasending);
                                    log.debug("jsonString",jsonString);
                                    dataall= GENERALTOOLS.postViewECD_request_api(viewecdid, opt, jsonString)

                            }
                    }
            }
        }
       
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
       // beforeSubmit: beforeSubmit
    }
})

