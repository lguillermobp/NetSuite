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
            var script = 'customscript_maindash_wopo';
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
                                fieldId: 'custrecordml_ppdpo'
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
  
      
  

        function processppd1() {

            var currentRec = currentRecord.get();
            var tppdpo;
            
            var custrecordml_podate = currentRec.getValue({
                fieldId: "custpage_date"
            });
            var memoh = currentRec.getValue({
                fieldId: "custpage_memo"
            });

            var woid = currentRec.getValue({
                fieldId: "custpage_woid"
            });

            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            var totpo = currentRec.getLineCount({
                sublistId: 'custpageppd_records'
            });
            var typeofpo = currentRec.getValue({
                fieldId: "custpage_typeofpo"    
            });
            console.log("Totalrecord: ",sublistCount);


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

                var custrecordml_memo = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_podate',
                    line: i
                });
               
                var custrecordml_memo = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_memo',
                    line: i });

                var custrecordml_customer = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',
                    line: i });

                var custrecordml_task = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskid',
                line: i });
                var custrecordml_taskid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskids',
                    line: i });
                var custrecordml_taskd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_task',
                line: i });


                var custrecordml_productionline = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_productionline',
                line: i });
                var custrecordml_leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
                    line: i });
                var custrecordml_itemid = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_itemid',
                    line: i
                });
                var custrecordml_ppdpo= currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_ppdpo',
                    line: i });
                var custrecordml_preferredvendorid= currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',
                    line: i });
                var custrecordml_price = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_price',
                    line: i
                });

                var taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',
                line: i });
               
                var custrecordml_unitrate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_unitrate',
                line: i });
                var newpotdate=new Date(taskds);
                var newpotdatedue=new Date(taskds);
                newpotdate.setDate(newpotdate.getDate()-custrecordml_leadtime); 

                if (new Date(newpotdate)<new Date(custrecordml_podate)) 
                    {newpotdate=new Date(custrecordml_podate);}
                
                newpotdatedue.setDate(newpotdate.getDate()+custrecordml_leadtime);

                
                var custrecordml_qty = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_qty',
                    line: i
                });


                 // Add line items

                 arraylist[i] = {
                    "custrecordml_customer": custrecordml_customer,
                    "custrecordml_item": custrecordml_itemid,
                    "custrecordml_itemid": custrecordml_itemid,
                    "custrecordml_leadtime": custrecordml_leadtime,
                    "custrecordml_memo": custrecordml_memo,
                    "custrecordml_podate": custrecordml_podate,
                    "custrecordml_ppdpo": custrecordml_ppdpo,
                    "custrecordml_ppdpons": custrecordml_ppdpo,
                    "custrecordml_preferredvendorid": custrecordml_preferredvendorid,
                    "custrecordml_price": custrecordml_price,
                    "custrecordml_productionline": custrecordml_productionline,
                    "custrecordml_qty": custrecordml_qty,
                    "custrecordml_task": custrecordml_task,
                    "custrecordml_taskd": custrecordml_taskd,
                    "custrecordml_taskds": custrecordml_podate,
                    "custrecordml_taskid": custrecordml_taskid,
                    "custrecordml_unitrate": custrecordml_unitrate,
                    "custrecordml_typeofpo": typeofpo
                }
                
                console.log("i: ",i);
            }
            
            arraylist[arraylist.length] = {
                "custrecordml_customer": "*last",
                "custrecordml_item": "*last",
                "custrecordml_itemid": "*last",
                "custrecordml_leadtime": "*last",
                "custrecordml_memo": "*last",
                "custrecordml_podate": "*last",
                "custrecordml_ppdpo": "*last",
                "custrecordml_ppdpons": "*last",
                "custrecordml_preferredvendorid": "*last",
                "custrecordml_price": "*last",
                "custrecordml_productionline": "*last",
                "custrecordml_qty": "*last",
                "custrecordml_task": "*last",
                "custrecordml_taskd": "*last",
                "custrecordml_taskds": "*last",
                "custrecordml_taskid": "*last",
                "custrecordml_unitrate": "*last"
            }
           
          
            
            var script = 'customscriptrendergenerate_wopo';
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
                woid: woid,
                datepo: custrecordml_podate,
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
                message: "We will be created " + totpo + " Items, you will receive a confirmation email when the process is finished",
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
            onButtonClick: onButtonClick,
            processppd1: processppd1,
            fieldChanged: fieldChanged
        }
    })
