/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/https',"N/runtime","N/currentRecord", "N/error",'N/log', "N/record", "N/search","N/ui/message","N/url", "/SuiteScripts/Modules/LoDash.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (https,runtime,currentRecord, error,log,record, s,message, url,  _) {
        function pageInit() {
        }

        function markall() {
            var currentRec = currentRecord.get();
            var count = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });

            for(var i=0;i<count;i++) {

                currentRec.selectLine({
                    sublistId: "custpage_records",
                    line: i
                });

                selecf=currentRec.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit'
                });
                if (selecf) continue;
                currentRec.setCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    value: true,
                    ignoreFieldChange: false
                });
               
            }
            currentRec.commitLine({
                sublistId: 'custpage_records'
            });
            
        }
        function godashboard() {
            var script = 'customscript_maindash_po';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });

            window.open(suiteletURL, "_self");

        }
        function unmarkall() {
            
            var currentRec = currentRecord.get();
            var count = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            
            for(var i=0;i<count;i++) {


                currentRec.selectLine({
                    sublistId: "custpage_records",
                    line: i
                });
                selecf=currentRec.getCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit'
                });
                if (!selecf) continue;
                currentRec.setCurrentSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    value: false,
                    ignoreFieldChange: false
                });
            }
            currentRec.commitLine({
                sublistId: 'custpage_records'
            });
            
        }
/**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(context) {
           
            var currentRecord = context.currentRecord;
            
            if (context.sublistId == 'custpageppd_records') 
            {
                if (context.fieldId == 'custrecordml_omit')
                    {
                        ppdpo=currentRecord.getCurrentSublistValue({sublistId: 'custpageppd_records',fieldId: 'custrecordml_ppdpo'});
                        omitppd=currentRecord.getCurrentSublistValue({sublistId: 'custpageppd_records',fieldId: 'custrecordml_omit'});

                        var count = currentRecord.getLineCount({
                            sublistId: 'custpage_records'
                        });
                        
                        for(var i=0;i<count;i++) {
            
            
                            currentRecord.selectLine({
                                sublistId: "custpage_records",
                                line: i
                            });

                            ppdporec=currentRecord.getCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_ppdpo1'
                            });

                            if (ppdporec!=ppdpo) continue;
                            
                            currentRecord.setCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_omit',
                                value: omitppd,
                                ignoreFieldChange: false
                            });
                            currentRecord.commitLine({
                                sublistId: 'custpage_records'
                            });
                        }
                        

                    }

                
                
                    
                }
             
          }
  
      
        function processppd() {

            var currentRec = currentRecord.get();
            var tppdpo;
            
            var custpageDate = currentRec.getValue({
                fieldId: "custpage_date"
            });
            var memoh = currentRec.getValue({
                fieldId: "custpage_ppdid"
            });



            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            console.log("Totalrecord: ",sublistCount);

            var totpo = 0;

            console.log("Record No: ",sublistCount);

            var arraylist = [];

            for (var i = 0; i < sublistCount; i++) {

               

                var omit = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    line: i
                });
               
                if (omit) continue; 

                var ppdpo = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_ppdpo',
                    line: i
                });

                var podate = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_podate',
                    line: i
                });
               
                if (ppdpo!=tppdpo) 
                {
                    tppdpo=ppdpo;

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
                        value: memoh // Replace with the internal ID of the vendor
                    });
                    PPDCodeR.setValue({
                        fieldId: 'custrecord_podate',
                        value: new Date(podate) // Replace with the internal ID of the vendor
                    });

                    var PPDCodeID=PPDCodeR.save();
                    
                }

                var PPD = record.create({
                    type: "customrecord_ppd",
                    isDynamic: false
                });

                var currency = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_icurrency',  line: i });

                var amountdol = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_totalusd',  line: i });
                var amount = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_total',  line: i });
                var task = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskid',
                line: i });
                var taskd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_task',
                line: i });
                var productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',
                line: i });
                var customerid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',
                line: i });
                var vendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',
                line: i });
                var ppdcode= currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpo',
                line: i });
                var taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',
                line: i });
                var leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
                line: i });
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
                    value: memoh // Set the transaction memo
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


                var itemid = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_itemid',
                    line: i
                });
                var qty = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_qty',
                    line: i
                });
                var unitpurchase= currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_pounit',
                    line: i
                });
                var price = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_price',
                    line: i
                });


                 // Add line items

                 PPD.setValue({
                    fieldId: 'custrecord_ppd_item',
                    value: itemid // Set the transaction memo
                });

                PPD.setValue({
                    fieldId: 'custrecord_ppd_quantity',
                    value: qty // Set the transaction memo
                });
                PPD.setValue({
                    fieldId: 'custrecord_purchaseunit',
                    value: unitpurchase // Set the transaction memo
                });
                PPD.setValue({
                    fieldId: 'custrecord_ppd_price',
                    value: price // Set the transaction memo
                });
                PPD.setValue({  fieldId: 'custrecord_ppd_currency', value: currency });
                PPD.setValue({  fieldId: 'custrecord_ppd_amountdollar', value: amountdol });
                PPD.setValue({  fieldId: 'custrecord_ppd_amount', value: amount });
                
                PPD.save();
                console.log("i: ",i);
                totpo++
            }
            

            message.create({
                title: "Process Completed",
                message: "Have been created " + totpo + " Purchase Orders",
                type: message.Type.CONFIRMATION,
                duration: 10000
            }).show();
            return true;
        }



        function processppd1() {

            var currentRec = currentRecord.get();
            var tppdpo;
            
            var custpageDate = currentRec.getValue({
                fieldId: "custpage_date"
            });
            var memoh = currentRec.getValue({
                fieldId: "custpage_memo"
            });

            var ppdid = currentRec.getValue({
                fieldId: "custpage_ppdid"
            });

            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            console.log("Totalrecord: ",sublistCount);

            var totpo = 0;

            console.log("Record No: ",sublistCount);

            var arraylist = [];

            for (var i = 0; i < sublistCount; i++) {

               

                var omit = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    line: i
                });
               
                if (omit) continue; 

                var ppdpo = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_ppdpo',
                    line: i
                });

                var podate = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_podate',
                    line: i
                });
               
                var currency = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_icurrency',  line: i });
                var currencyrate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_currencyrate',  line: i });
                var amountdol = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_totalusd',  line: i });
                var amount = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_total',  line: i });
                var task = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskid',
                line: i });
                var taskd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_task',
                line: i });
                var productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',
                line: i });
                var customerid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',
                line: i });
                var vendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',
                line: i });
                var ppdcode= currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpo',
                line: i });
                var ppdinternalid= currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdinternalid',
                line: i });
                var taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',
                line: i });
                var leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
                line: i });
                var unitbase = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_unitbase',
                line: i });
                var unitrate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_unitrate',
                line: i });
                var newpotdate=new Date(taskds);
                var newpotdatedue=new Date(taskds);
                newpotdate.setDate(newpotdate.getDate()-leadtime);

                if (new Date(newpotdate)<new Date(custpageDate)) 
                    {newpotdate=new Date(custpageDate);}
                
                newpotdatedue.setDate(newpotdate.getDate()+leadtime);

                var itemid = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_itemid',
                    line: i
                });
                var qty = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_qty',
                    line: i
                });
                var unitpurchase= currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_pounit',
                    line: i
                });
                var price = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_price',
                    line: i
                });


                 // Add line items

                arraylist[i] = {
                    "custrecord_ppd_id": ppdid,
                    "custrecord_ppd_code": ppdcode,
                    "custrecord_ppd_duedate": newpotdatedue,
                    "custrecord_ppd_date": podate,
                    "custrecord_ppd_vendor": vendorid,
                    "custrecord_ppd_customer": customerid,
                    "custrecord_ppd_productionline": productionline,
                    "custrecord_ppd_task": task,
                    "custrecord_ppd_currency": currency,
                    "custrecord_ppd_currencyrate": currencyrate,
                    "custrecord_ppd_leadtime": leadtime,
					"custrecord_ppd_amount": amount,
                    "custrecord_ppd_amountdollar": amountdol,
					"custrecord_ppd_status": " ",
                    "custrecord_ppd_item": itemid,
					"custrecord_ppd_quantity": qty,
                    "custrecord_ppd_price": price,
                    "custrecord_purchaseunit": unitpurchase,
                    "custrecord_unitbase": unitbase,
                    "custrecord_unitrate": unitrate,
                    "custrecord_ppdinternalid": ppdinternalid
                }
                
                console.log("i: ",i);
                totpo++
            }
            
           
           
            //window.open(suiteletURL, "_blank");

            // https.requestSuitelet({
            //     scriptId: "customscriptrendergenerate_po",
            //     deploymentId: "customdeploy1",
            //     urlParams: {
            //         'ppdid': ppdid,
            //         'datepo': custpageDate,
            //         'memo': memoh,
            //         'data': arraylist.toString()
            //     }
            // });

            
            
            var script = 'customscriptrendergenerate_po';
            var deployment = 'customdeploy1';
            var parameters = "";

            var scheme = 'https://';
            var host = url.resolveDomain({
                hostType: url.HostType.APPLICATION
                });

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });
            //window.open(suiteletURL, "_blank");
            var headerObj = {
                name: 'Accept-Language',
                value: 'en-us'
            };
            var datap  = {
                ppdid: ppdid,
                datepo: custpageDate,
                memo: memoh,
                data: arraylist
            };
            postData=JSON.stringify(datap);

            var  response = https.post.promise({
                url  : scheme + host + suiteletURL,
                body: postData, // a=1&b=2&c=3
                headers: headerObj
            });  
            
            message.create({
                title: "Process Starting ...",
                message: "We will be created " + totpo + " PPD, you will receive a confirmation email when the process is finished",
                type: message.Type.CONFIRMATION,
                duration: 10000
            }).show();
            return true;
        }
        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
    
            element.style.display = 'none';
            document.body.appendChild(element);
    
            element.click();
    
            document.body.removeChild(element);
        }

        function refresh(idemp) {

            var employeeRecord = record.load({
                type: record.Type.EMPLOYEE,
                id: idemp,
                isDynamic: true
            });

            var currentRec = currentRecord.get();

            var sections = currentRec.getValue({
                fieldId: "custpage_section"
            });
            var customers = currentRec.getValue({
                fieldId: "custpage_customers"
            });
            var vendors = currentRec.getValue({
                fieldId: "custpage_vendors"
            });

            // Set value for custentity_customerssalected field
            employeeRecord.setValue({
                fieldId: "custentity_customerssalected",
                value: customers
            });
             // Set value for custentity_customerssalected field
            employeeRecord.setValue({
                fieldId: "custentity_sectionsselected",
                value: sections
            });
            employeeRecord.setValue({
                fieldId: "custentity_vendorsselected",
                value: vendors
            });
           
            employeeRecord.save();
            
           
            location.reload();
        }

        function onButtonClick(context) {
    
            var url = new URL(document.location.href);
            var page_status = url.searchParams.get('page_status');
            log.debug('page_status', page_status);
    
    
    // XML content of the file
            var res = decodeURI(context)
                res = res.replaceAll('^', '"');
                res = res.replaceAll('&&', '\n');
                res = res.replaceAll('^', '"');
    
    
    //create file
    
            var filename = "BOM.csv";
    
            download(filename, res);
    
    
        }
        return {
            pageInit: pageInit,
            godashboard: godashboard,
            unmarkall: unmarkall,
            markall: markall,
            refresh: refresh,
            onButtonClick: onButtonClick,
            processppd: processppd,
            processppd1: processppd1,
            fieldChanged: fieldChanged
        }
    })
