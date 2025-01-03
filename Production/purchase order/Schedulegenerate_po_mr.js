/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (runtime,log, search, record,email, GENERALTOOLS) {

        var getInputData = function getInputData(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_memo'
            });
            var DATAPPD = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_data'
            });
            var fsearch = JSON.parse(DATAPPD);

        
           
            return fsearch;
        };
        var PPDCodeID=0;
        var tppdpo="";
        var totpo=0;
        var map = function map(context) {

            var fsearchId = context.key;
            var fresult = JSON.parse(context.value);

 
            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_memo'
            });
            var custpageDate = new Date(DATE_PO);

            var custrecord_ppd_id = fresult.custrecord_ppd_id;
            var custrecord_ppd_code = fresult.custrecord_ppd_code;
            var custrecord_ppd_duedate = fresult.custrecord_ppd_duedate;
            var custrecord_ppd_date = fresult.custrecord_ppd_date;
            var custrecord_ppd_vendor = fresult.custrecord_ppd_vendor;
            var custrecord_ppd_customer = fresult.custrecord_ppd_customer;
            var custrecord_ppd_productionline = fresult.custrecord_ppd_productionline;
            var custrecord_ppd_task = fresult.custrecord_ppd_task;
            var custrecord_ppd_currency = fresult.custrecord_ppd_currency;
            var custrecord_ppd_currencyrate = fresult.custrecord_ppd_currencyrate;
            var custrecord_ppd_leadtime = fresult.custrecord_ppd_leadtime;
            var custrecord_ppd_amount = fresult.custrecord_ppd_amount;
            var custrecord_ppd_amountdollar = fresult.custrecord_ppd_amountdollar;
            var custrecord_ppd_status = fresult.custrecord_ppd_status;
            var custrecord_ppd_item = fresult.custrecord_ppd_item;
            var custrecord_ppd_quantity = fresult.custrecord_ppd_quantity;
            var custrecord_ppd_price = fresult.custrecord_ppd_price;
            var custrecord_purchaseunit = fresult.custrecord_purchaseunit;
            var custrecord_unitbase = fresult.custrecord_unitbase;
            var custrecord_unitrate = fresult.custrecord_unitrate;
            var custrecord_ppdinternalid= fresult.custrecord_ppdinternalid;
 
            var ppdid = custrecord_ppd_id;
            var ppdpo = custrecord_ppd_code;
            var podate = custrecord_ppd_date;
        
            if (ppdpo!=tppdpo) 
            {
                tppdpo=ppdpo;

                try {

                if (custrecord_ppdinternalid!=0) 
                    {

                    var PPDCode = record.load({
                        type: "customrecord_ppd_po",
                        id: custrecord_ppdinternalid
                    });

                    ppddate=PPDCode.getValue({
                        fieldId: 'custrecord_podate'
                    });
                    
                    podate1=new Date(ppddate);
                    taskdate1=new Date(podate);
                    if (podate1>taskdate1) {

                        PPDCode.setValue({
                            fieldId: 'custrecord_podate',
                            value: taskdate1 // Replace with the internal ID of the vendor
                        });

                    }
                    else {podate=summarypos[index].podate;}

                    PPDCode.save();
                    PPDCodeID=custrecord_ppdinternalid;
                }
                else 
                {

                    var PPDCodeR = record.create({
                        type: "customrecord_ppd_po",
                        isDynamic: false
                    });

                    PPDCodeR.setValue({
                        fieldId: 'name',
                        value: ppdpo // Replace with the internal ID of the vendor
                    });
                    PPDCodeR.setValue({
                        fieldId: 'custrecord_ppdid',
                        value: ppdid // Replace with the internal ID of the vendor
                    });
                    PPDCodeR.setValue({
                        fieldId: 'custrecord_podate',
                        value: new Date(podate) // Replace with the internal ID of the vendor
                    });
                
                    PPDCodeID=PPDCodeR.save();
                }
            }
            catch (e) {
                log.error("error",e);
            }
            }

            var PPD = record.create({
                type: "customrecord_ppd",
                isDynamic: false
            });

            var currency = custrecord_ppd_currency;
            var amountdol = custrecord_ppd_amountdollar;
            var amount = custrecord_ppd_amount;
            var task = custrecord_ppd_task;
            var productionline = custrecord_ppd_productionline;
            var customerid = custrecord_ppd_customer;
            var vendorid = custrecord_ppd_vendor;
            var taskds = custrecord_ppd_date;
            var leadtime = custrecord_ppd_leadtime;
            var newpotdate=new Date(taskds);
            var newpotdatedue=new Date(taskds);
            newpotdate.setDate(newpotdate.getDate()-leadtime);

            if (new Date(newpotdate)<new Date(custpageDate)) 
                {newpotdate=new Date(custpageDate);}
            
            newpotdatedue.setDate(newpotdate.getDate()+leadtime);
                
         

            // Set field values
            PPD.setValue({
                fieldId: 'custrecord_ppd_code',
                value: PPDCodeID // Replace with the internal ID of the vendor
            });
            PPD.setValue({
                fieldId: 'custrecord_ppdcodetask',
                value: 'V'+vendorid+'T'+task // Replace with the internal ID of the vendor
            });
            PPD.setValue({
                fieldId: 'custrecord_ppd_vendor',
                value: vendorid // Replace with the internal ID of the vendor
            });
            PPD.setValue({
                fieldId: 'custrecord_ppd_task',
                value: task // Replace with the internal ID of the vendor
            });
            PPD.setText({
                fieldId: 'custrecord_ppd_productionline',
                text: productionline // Replace with the internal ID of the vendor
            });
            
            PPD.setValue({
                fieldId: 'custrecord_ppd_date',
                value: new Date(newpotdate) // Set the transaction date
            });
            PPD.setValue({
                fieldId: 'custrecord_ppd_duedate',
                value: new Date(newpotdatedue) // Set the transaction date
            });
            PPD.setValue({
                fieldId: 'custrecord_ppd_id',
                value: ppdid // Set the transaction memo
            });
            PPD.setValue({
                fieldId: 'custrecord_ppd_leadtime',
                value: leadtime // Set the transaction memo
            });
            PPD.setValue({
                fieldId: 'custbody_typepo',
                value: "4" // Set the transaction memo
            });
            PPD.setValue({
                fieldId: 'custrecord_ppd_customer',
                value: customerid // Set the transaction memo
            });

           

            var itemid = custrecord_ppd_item;
            var qty = custrecord_ppd_quantity;
            var unitpurchase= custrecord_purchaseunit;
            var price = custrecord_ppd_price;
        

             // Add line items
            try {
             PPD.setValue({
                fieldId: 'custrecord_ppd_item',
                value: itemid // Set the transaction memo
            });

            PPD.setValue({
                fieldId: 'custrecord_ppd_qtydemand',
                value: qty // Set the transaction memo
            });
            PPD.setValue({
                fieldId: 'custrecord_purchaseunit',
                value: unitpurchase // Set the transaction memo
            });
            PPD.setValue({
                fieldId: 'custrecord_ppd_unitrate',
                value: custrecord_unitrate // Set the transaction memo
            });

            if (custrecord_unitrate==0) {custrecord_unitrate=1;}
                
                qty=Math.ceil(qty/custrecord_unitrate);
            PPD.setValue({
                fieldId: 'custrecord_ppd_quantity',
                value: qty // Set the transaction memo
            });


            PPD.setValue({
                fieldId: 'custrecord_ppd_price',
                value: price // Set the transaction memo
            });
            amount=qty*price;
            amountdol=amount*custrecord_ppd_currencyrate;
            PPD.setValue({  fieldId: 'custrecord_ppd_currency', value: currency });
            PPD.setValue({  fieldId: 'custrecord_ppd_currencyrate', value: custrecord_ppd_currencyrate });
            PPD.setValue({  fieldId: 'custrecord_ppd_amountdollar', value: amountdol });
            PPD.setValue({  fieldId: 'custrecord_ppd_amount', value: amount });
            
           
            PPD.save();
            } catch (e) {
            log.error("error",e);
            }
            totpo++
            log.audit("processing.: ",totpo);

            
            context.write(fsearchId, fresult);

        };
        
        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);
            

            context.write(context.key, fresult);
        };

        var summarize = function summarize(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_po_ppdid'
            });

            log.debug("PPDID",PPDID);

            try { 
            var paramppd = GENERALTOOLS.get_PPDID(PPDID);
            var PPDNAME = paramppd.data.getValue({fieldId: "name"});

            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The generation of PPD ("+PPDNAME+ ") is done";


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