/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record",'N/log', "N/search", "N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, log, search, runtime, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        log.debug("context",context);
        
    }

    function beforeSubmit(context) {
        
       
    }

    function afterSubmit(context) {

        log.debug("context",context);
        log.debug("context.type",context.type);
        const currentRecord = context.newRecord;
        const itemLineCount = currentRecord.getLineCount({ sublistId: "inventory" });
        log.debug("itemLineCount", itemLineCount);

        var inventoryTransferRecord = context.newRecord;
        var userObj = inventoryTransferRecord.getValue({
            fieldId: 'createdby'
        });

        log.debug('createdFrom', userObj);

        var paramemp = GENERALTOOLS.get_employee_value(3997);
        var VIEWECDUSERID=paramemp.data.getValue({fieldId: "custentity_viewecduserid"});

        // If you need to inspect each line:
        for (var i = 0; i < itemLineCount; i++) 
            {
                const itemId = currentRecord.getSublistValue({
                    sublistId: "inventory",
                    fieldId: "item",
                    line: i
                });
                log.debug("item line " + i, itemId);
                const custcol_requestid = currentRecord.getSublistValue({
                    sublistId: "inventory",
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
                                columns: ['custrecord_sts_preview', 'custrecord_requeststscod', 'custrecord_viewecdid', 'custrecord_rq_pickable','custrecord_po'] // Example with a joined field
                            });

                            var custrecord_sts_preview = lookupResult.custrecord_sts_preview;
                            var requeststscod = lookupResult.custrecord_requeststscod;
                            var custrecord_requeststscod = requeststscod[0].value;
                            var sts_preview = custrecord_sts_preview[0].value;
                            var viewecdid = lookupResult.custrecord_viewecdid;
                            var custrecord_rq_pickable = lookupResult.custrecord_rq_pickable;
                            var custrecord_po = lookupResult.custrecord_po;
                            var idpo = Number(custrecord_po[0].value);
                            log.debug('lookupResult', lookupResult);


                            log.debug('Transaction ID', custrecord_sts_preview);

                        } catch (e) {
                            log.error('Error in lookupFields', e.toString());
                            return null;
                        }

                        if (context.type=="create" )
                        {
                            if (custrecord_rq_pickable=='Y') {pickable='D';} else {pickable=custrecord_rq_pickable;}

                            if (sts_preview=="4" ) {newsts="11"; newstscod="60"; newstsedsc="PO Received Item Picked to Vehicle";}
                            else {
                                if (idpo==0) {newsts="12"; newstscod="61"; newstsedsc="Item Picked to Vehicle";}
                                else {newsts="11"; newstscod="60"; newstsedsc="PO Received Item Picked to Vehicle";}
                            }
                        }
                        if (context.type=="delete" )
                        {
                            if (custrecord_rq_pickable=='D') {pickable='Y';} else {pickable=custrecord_rq_pickable;}

                            if (sts_preview=="12" ) {newsts="7"; newstscod="41"; newstsedsc="PO Generated/Pending to pick";}
                            else {
                                if (idpo==0) {newsts="4"; newstscod="30"; newstsedsc="Approved by Purchase Department - In Stock (:Do Not Order)";}
                                else {newsts="9"; newstscod="50"; newstsedsc="Item Received";}
                            }
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

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
       // beforeSubmit: beforeSubmit
    }
})

