/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */
 var totreg;
 define(["N/runtime",'N/log',  'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function (runtime,log,  record,email, GENERALTOOLS) {


        var getInputData = function getInputData(context) {

            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_rl_datepo'
            });
            var VIEWECDUSERID = runtime.getCurrentScript().getParameter({
                name: 'custscript_rl_viewecduserid'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_rl_memo'
            });
            var DATAPPD = runtime.getCurrentScript().getParameter({
                name: 'custscript_rl_data'
            });
            log.audit("DATE_PO", DATE_PO);
            log.audit("MEMO", MEMO);
            log.audit("DATAPPD", DATAPPD);
            log.audit("VIEWECDUSERID", VIEWECDUSERID);
            var fsearch = JSON.parse(DATAPPD); 

            totreg = fsearch.length;
           
            return fsearch;
        };
        var totpo=0;
        var isfirst= true;
        var omit = false;
        var savingpo = false;
        var purchaseOrder;
        var ppdpot;
        var newpotdatedue;
        var vinternalIds = [];

        var map = function map(context) {

            var fsearchId = context.key;
            var fresult = JSON.parse(context.value);
            log.debug("fresult",fresult);

            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_rl_datepo'
            });
            var VIEWECDUSERID = runtime.getCurrentScript().getParameter({
                name: 'custscript_rl_viewecduserid'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_rl_memo'
            });
            var custpageDate = new Date(DATE_PO);          

            if (fresult.custrecordml_preferredvendorid=="last")

                {
                if (savingpo) {
                    var idpo=purchaseOrder.save();

                    for (const internalId of vinternalIds) 
                    {
                        
                        if (internalId.oldsts=="5") {newsts="7"; newstscod="41", newstsedsc="PO Generated/Pending to pick";}
                                        else {newsts="8"; newstscod="42", newstsedsc="PO Generated";}
                        record.submitFields({
                            type: "customrecord_requestrecords",
                            id: internalId.internalId,
                            values: {
                                "custrecord_po": idpo,
                                "custrecord_requeststscod": newsts,
                                "custrecord_sts_preview": internalId.oldsts,
                                "custrecord_requeststs": newstsedsc
                            }
                        })
                        var opt="SET";
                        datasending= {
                            "po": idpo,
                            "viewecduserid": VIEWECDUSERID,
                            "status": newstscod,
                            "notes": newstsedsc,
                            "oldstatus": internalId.oldsts,
                            "request_id" : internalId.viewecdid
                        }
                        const jsonString = JSON.stringify(datasending);
                        log.debug("jsonString",jsonString);
                        dataall= GENERALTOOLS.postViewECD_request_api(internalId.viewecdid, opt, jsonString)
                    }

                    savingpo=false;

                }
                omit=true;
                }

                try {
                    if (!omit)  

                        {

                    if (isfirst) {
                       
                        ppdpot = fresult.custrecordml_preferredvendorid;

                        var customerid = fresult.custrecordml_customerid;
                        var vendorid = fresult.custrecordml_preferredvendorid;

                        var podate = fresult.custrecordml_podate;
                        var leadtime = fresult.custrecordml_leadtime;
                        var newpotdate=new Date(podate);
                        
                        newpotdatedue=new Date(podate);

                        newpotdate= addDays(newpotdate, -leadtime);
                       
                        trndate=new Date(DATE_PO);
        
                              purchaseOrder = record.create({
                                type: record.Type.PURCHASE_ORDER,
                                isDynamic: true
                            });
 
                            // Set field values
                           
                            purchaseOrder.setValue({
                                fieldId: 'entity',
                                value: vendorid // Replace with the internal ID of the vendor
                            });
                            
                            purchaseOrder.setValue({
                                fieldId: 'trandate',
                                value: new Date(trndate) // Set the transaction date
                            });
                            
                            purchaseOrder.setValue({
                                fieldId: 'memo',
                                value: MEMO // Set the transaction memo
                            });
                            purchaseOrder.setValue({
                                fieldId: 'custbody_typepo',
                                value: "1" // Set the transaction memo
                            });
                           
                            savingpo = true;
                            isfirst = false;
                        
                        }
                        
                        var ppdpo = fresult.custrecordml_preferredvendorid;

        
                        if (ppdpot!=ppdpo)
                            {
            
                            if (savingpo) {
                                var idpo = purchaseOrder.save();

                                for (const internalId of vinternalIds) 
                                    {
                                     
                                        if (internalId.oldsts=="5") {newsts="7"; newstscod="41", newstsedsc="PO Generated/Pending to pick";}
                                        else {newsts="8"; newstscod="42", newstsedsc="PO Generated";}
                                        record.submitFields({
                                            type: "customrecord_requestrecords",
                                            id: internalId.internalId,
                                            values: {
                                                "custrecord_po": idpo,
                                                "custrecord_requeststscod": newsts,
                                                "custrecord_sts_preview": internalId.oldsts,
                                                "custrecord_requeststs": newstsedsc
                                            }
                                        })
                                        var opt="SET";
                                       datasending= {
                                                "po": idpo,
                                                "viewecduserid": VIEWECDUSERID,
                                                "status": newstscod,
                                                "notes": newstsedsc,
                                                "oldstatus": internalId.oldsts,
                                                "request_id" : internalId.viewecdid
                                            }
                                            const jsonString = JSON.stringify(datasending);
                                            log.debug("jsonString",jsonString);
                                            dataall= GENERALTOOLS.postViewECD_request_api(internalId.viewecdid, opt, jsonString)
                                    }

                                savingpo=false;
                                vinternalIds = [];
                                totpo++;
                            }
                            ppdpot = ppdpo;
        
                            purchaseOrder = record.create({
                                type: record.Type.PURCHASE_ORDER,
                                isDynamic: true
                            });


                            var vendorid = fresult.custrecordml_preferredvendorid;
                            var podate = fresult.custrecordml_podate;
                            var leadtime = fresult.custrecordml_leadtime; 
                            var newpotdate=new Date(podate);
                            
                            trndate=new Date(DATE_PO);
                            
        
                            // Set field values
                            purchaseOrder.setValue({
                                fieldId: 'entity',
                                value: vendorid // Replace with the internal ID of the vendor
                            });
                            
                            purchaseOrder.setValue({
                                fieldId: 'trandate',
                                value: new Date(trndate) // Set the transaction date
                            });
                            purchaseOrder.setValue({
                                fieldId: 'memo',
                                value: MEMO // Set the transaction memo
                            });
                            purchaseOrder.setValue({
                                fieldId: 'custbody_typepo',
                                value: "1" // Set the transaction memo
                            });
                            
                            savingpo = true;
                        }
    
    
                        //=================================================
        
                        var item = fresult.custrecordml_item;
                        var itemid = fresult.custrecordml_itemid;
                        var qty = fresult.custrecordml_qty;
                        var unitrate = fresult.custrecordml_unitrate;
                        var price = fresult.custrecordml_price;
                        var memo = fresult.custrecordml_customer;
                        var oldsts= fresult.custrecordml_requeststscodid;
                        var viewecdid = fresult.custrecordml_sviewecd;
                        var requeststscod = fresult.custrecordml_requeststscod;
        

                            // Add line items
                        purchaseOrder.selectNewLine({
                            sublistId: 'item'
                        });
                        
                        purchaseOrder.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            value: itemid // Replace with the internal ID of the item
                        });
        
                        if (unitrate==0) {unitrate=1;}
                        
                        qty=Math.ceil(qty/unitrate);
        
                        purchaseOrder.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            value: qty // Set the quantity
                        });
        
                        purchaseOrder.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            value: price 
                        });
        
                        purchaseOrder.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_notes',
                            value: memo 
                        });
                        purchaseOrder.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_requestid',
                            value: fresult.internalid 
                        });
        
                        purchaseOrder.commitLine({
                            sublistId: 'item'
                        });
                        const jinternalid = {"internalId": fresult.internalid, "requeststscod": requeststscod, "viewecdid": viewecdid, "oldsts": oldsts};
                        vinternalIds.push(jinternalid);

                }



                
            } catch (e) {
                log.error("error",e);
            }



            function addDays  (date, days)  {
                newDate = new Date(date);
                newDate.setDate(newDate.getDate() + days);
                return newDate;
                };

           

           
            context.write(fsearchId, fresult);

        };
        
        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);

            context.write(context.key, fresult);
        };

        var summarize = function summarize(context) {

            try { 

            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The generation of PPD (hhhh) is done";

            email.send({
                author : userObj.id,
                recipients : emaildest,
                subject : subject,
                body : subject
            });
        } catch (e) {
            log.error("error",e);
        }

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });