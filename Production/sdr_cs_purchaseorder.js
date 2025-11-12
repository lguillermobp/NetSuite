/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(["N/log","N/record","N/search", 'N/ui/dialog',"N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js","N/email"], function(log, record, search, nDialog,runtime, GENERALTOOLS, email) {
    
    var sendemailok = false;
    var linestoupdate=[];

    function pageInit(context) {
        // Code to execute when the page loads
        var currentRecord = context.currentRecord;
        var subsidiaryId = currentRecord.getValue({ fieldId: "subsidiary" });

        // Load the subsidiary record
        var subsidiaryRecord = record.load({
            type: record.Type.SUBSIDIARY,
            id: subsidiaryId,
            isDynamic: false
        });

        var shippingAddress = currentRecord.getValue({ fieldId: "shippingaddress_text" });
        

        if (!shippingAddress) {
           
            currentRecord.setValue({ fieldId: "shippingaddress_text", value: subsidiaryRecord.getValue({ fieldId: "shippingaddress_text" }) });
            log.debug("shippingAddress", currentRecord.getValue({ fieldId: "shippingaddress_text" }));
        }
    }
    function printrn(url) {
        console.log(url);
        window.open(url, "_blank");
      }
    function fieldChanged(context) {
        // Code to execute when a field value changes
        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId;
        var fieldId = context.fieldId;
        var line = context.line;

        var entityname= currentRecord.getValue({ fieldId: 'entityname'});

        if (fieldId === 'custbody_vendorshipmethod') {


            var idcarrier= currentRecord.getValue({ fieldId: 'custbody_vendorshipmethod'});
            var entityname= currentRecord.getValue({ fieldId: 'entity'});
            
            var vendorShipMethodRecord = record.load({
                type: 'customrecord_vendorshipmethod',
                id: idcarrier,  
                isDynamic: false
            });

            var carrierValue = vendorShipMethodRecord.getValue({
                fieldId: 'custrecord_vendorshippcarrier'
            });
            currentRecord.setValue({ fieldId: 'custbody_vendorcurriership', value: carrierValue});
            
        }

        if (fieldId === 'approvalstatus') {


            var statusRef= currentRecord.getValue({ fieldId: 'approvalstatus'});
            log.debug("statusRef", statusRef);
            if (statusRef=="2") {
                sendemailok=true;
            }
               
        }
        if (sublistId === "item") 
            {
            
  
            if (fieldId==="custcol_tracking" || fieldId==="custcol_backorder"  )
                {
                    var custcol_requestid = currentRecord.getCurrentSublistValue({
                        sublistId: sublistId,
                        fieldId: "custcol_requestid"
                    });
                    var custcol_tracking = currentRecord.getCurrentSublistValue({
                        sublistId: sublistId,
                        fieldId: "custcol_tracking"
                    });
                    var custcol_backorder = currentRecord.getCurrentSublistValue({
                        sublistId: sublistId,
                        fieldId: "custcol_backorder"
                    });
                  
                    var lineuniquekey = currentRecord.getCurrentSublistValue({ sublistId: sublistId, fieldId: "lineuniquekey"}); 
  

                    var indexx = linestoupdate.map(function (img) { return img.lineuniquekey; }).indexOf(lineuniquekey);
                    
                    if (indexx==-1) 
                        {
                            linestoupdate.push({"custcol_requestid":custcol_requestid, "lineuniquekey":lineuniquekey,"mode":"edt", "custcol_tracking":custcol_tracking, "custcol_backorder":custcol_backorder});
                        }
                    else
                        {   
                            linestoupdate[indexx].custcol_requestid=custcol_requestid;
                            linestoupdate[indexx].custcol_tracking=custcol_tracking;
                            linestoupdate[indexx].custcol_backorder=custcol_backorder;
                        }
                    
                }
 
            }
            

}
    function sublistChanged(context) {

        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId;
        var fieldId = context.fieldId;
        
      
        

    }

    function validateLine(context) {
        // Code to execute when a line is being validated
        
        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId;
        var fieldId = context.fieldId;
        var fieldId = context.fieldId;
       
      
        return true;
    }

    function validateDelete(context) {
        // Code to execute when a line is being deleted
        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId;
        var fieldId = context.fieldId;

        var custcol_requestid = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: "custcol_requestid"
                });
                log.debug("custcol_requestid", custcol_requestid);

        if (custcol_requestid)
            {
                var custcol_tracking = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: "custcol_tracking"
                });
                var custcol_backorder = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: "custcol_backorder"
                });

                var lineuniquekey = currentRecord.getCurrentSublistValue({ sublistId: sublistId, fieldId: "lineuniquekey"}); 

                linestoupdate.push({"custcol_requestid":custcol_requestid, "lineuniquekey":lineuniquekey,"mode":"del", "custcol_tracking":custcol_tracking, "custcol_backorder":custcol_backorder});
            }
            
 

        return true;

    }

    function saveRecord(context) 
    {

        // Code to execute when the record is saved
        var currentRecord = context.currentRecord;
        var vendorid = currentRecord.getValue({ fieldId: "entity" });
        var internalid = currentRecord.getValue({ fieldId: "id" });
        var recordTypeId = currentRecord.getValue({ fieldId: "recordType" });

        var vendorRecord = record.load({ type: 'vendor', id: vendorid, isDynamic: false });
        var emailvendor = vendorRecord.getValue({ fieldId: 'email' });
        var sendEmail = vendorRecord.getValue({ fieldId: 'custentity_sendemail' });

        var userObj = currentRecord.getValue({ fieldId: 'employee' });
        log.debug('createdFrom', userObj);

        var paramemp = GENERALTOOLS.get_employee_value(userObj);
        var VIEWECDUSERID=paramemp.data.getValue({fieldId: "custentity_viewecduserid"});
        

        if (sendEmail && sendemailok) 
            {
        
            // Send email to vendor
            var subject = "Purchase Order";
            var body = "Here is our Purchase Order";
            var userObj = runtime.getCurrentUser();
            var userID = userObj.id;

            email.send({
                author: userID, // ID of the user sending the email
                recipients: vendorid, // ID of the vendor
                subject: subject,
                body: body,
                relatedRecords : {
                    transactionId : internalid
                }
            });

            }
        log.debug("linestoupdate", linestoupdate);
       
        if (linestoupdate && linestoupdate.length) 
            {

                for (var i = 0; i < linestoupdate.length; i++) {
                    try {
                        chanageviewecd(linestoupdate[i], VIEWECDUSERID);
                    } catch (e) {
                        log.error({
                            title: 'chanageviewecd error index ' + i,
                            details: e.toString()
                        });
                    }
                }

            }


        return true;
    }
    function chanageviewecd(linestoupdate,VIEWECDUSERID) 
    {
        var custcol_backorder= linestoupdate.custcol_backorder;
        var custcol_requestid= linestoupdate.custcol_requestid;
        var custcol_tracking= linestoupdate.custcol_tracking;
        var mode= linestoupdate.mode;

        

        if (custcol_requestid!=null && custcol_requestid!="")
        {

            try {
                var lookupResult = search.lookupFields({
                    type: "customrecord_requestrecords",
                    id: custcol_requestid,
                    columns: ['custrecord_sts_preview', 'custrecord_requeststscod', 'custrecord_viewecdid', 'custrecord_rq_pickable','custrecord_requeststs'] // Example with a joined field
                });

                var custrecord_sts_preview = lookupResult.custrecord_sts_preview;
                var custrecord_requeststscod = lookupResult.custrecord_requeststscod;
                var custrecord_requeststs = lookupResult.custrecord_requeststs;
                var oldsts= custrecord_sts_preview[0].value;

                var datanewstscod= GENERALTOOLS.get_request_sts(oldsts);
                var oldstscod= datanewstscod.data.getValue({fieldId: "custrecord_rqsts_code"});
                var oldstsdesc= datanewstscod.data.getValue({fieldId: "custrecord_rqsts_description"});

                var newsts=custrecord_requeststscod[0].value;
                var datanewstscod= GENERALTOOLS.get_request_sts(newsts);

                var newstscod= datanewstscod.data.getValue({fieldId: "custrecord_rqsts_code"});
                var newstsdesc= custrecord_requeststs;

                var viewecdid = lookupResult.custrecord_viewecdid;
                var custrecord_rq_pickable = lookupResult.custrecord_rq_pickable;

            } catch (e) {
                log.error('Error in lookupFields', e.toString());
                return null;
            }

            if (mode=="del" )
            {
                var temporvar=newsts;
                newsts=oldsts;
                oldsts=temporvar;

                temporvar=newstscod;
                newstscod=oldstscod;
                oldstscod=temporvar;

                newstsdesc=oldstsdesc;

            }

            record.submitFields({
                type: "customrecord_requestrecords",
                id: custcol_requestid,
                values: {
                    "custrecord_po_tracking": custcol_tracking,
                    "custrecord_bo_vendor": custcol_backorder,
                    "custrecord_requeststscod": newsts,
                    "custrecord_sts_preview": oldsts,
                    "custrecord_requeststs": newstsdesc
                }
            })
            var opt="SET";
            datasending= {
                    "po": 0,
                    "po_tracking": custcol_tracking + ' ',
                    "bo_vendor": custcol_backorder,
                    "pickable": custrecord_rq_pickable,
                    "viewecduserid": VIEWECDUSERID,
                    "status": newstscod,
                    "notes": newstsdesc,
                    "oldstatus": oldstscod,
                    "request_id" : viewecdid
                }
                const jsonString = JSON.stringify(datasending);
                log.debug("jsonString",jsonString);
                dataall= GENERALTOOLS.postViewECD_request_api(viewecdid, opt, jsonString)

        }
    }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        sublistChanged: sublistChanged,
        //validateLine: validateLine,
        validateDelete: validateDelete,
        printrn: printrn,
        saveRecord: saveRecord,
        chanageviewecd: chanageviewecd
    };
});
