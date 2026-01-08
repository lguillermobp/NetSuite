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
    function (https,runtime,currentRecord, error,log,record, s,message,url,  _) {

        var countpos = 0;
        function pageInit(context) {

            var currentRecord = context.currentRecord;

            var sublistCount = currentRecord.getLineCount({
                sublistId: 'custpageppd_records'
            });

             currentRecord.setValue({
                fieldId: "custpage_html",
                value: "Total POs will be generated: "+ sublistCount
            });
            countpos = sublistCount;
            console.log("Totalrecord: ",sublistCount);


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
            var script = 'customscript_maindash_poo';
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
            console.log("Totalrecord: ",count);
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
            var countpo=0;
          
                   
          }
  
      


        function process1() {

            var currentRec = currentRecord.get();

            var arraylist = [];
            
            var custpageDate = currentRec.getValue({
                fieldId: "custpage_date"
            });
            var memoh = currentRec.getValue({
                fieldId: "custpage_memo"
            });
            var viewecduserid = currentRec.getValue({
                fieldId: "custpage_viewecduserid"
            });
            

            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });
            console.log("Totalrecord: ",sublistCount);

            log.debug("custpageDate",custpageDate);
            log.debug("sublistCount",sublistCount);
            var totpo = 0;
            var h = 0;

            for (var i = 0; i < sublistCount; i++) {
                
                var omit = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_omit',
                    line: i
                });
               
                if (!omit) continue; 
                var custrecordml_internalid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_internalid',line: i });
                var custrecordml_item = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_item',line: i });
                var custrecordml_sviewecd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_sviewecd',line: i });
                var custrecordml_itemid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_itemid',line: i });
                var custrecordml_additionalinformation = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_additionalinformation',line: i });
                var custrecordml_reason = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_reason',line: i });
                var custrecordml_rq_type_vecd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_rq_type_vecd',line: i });
                var custrecordml_requeststs = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_requeststs',line: i });
                var custrecordml_requeststscod = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_requeststscod',line: i });
                var custrecordml_requeststscodid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_requeststscodid',line: i });
                var custrecordml_qty = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_qty',line: i });
                var custrecordml_taskid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskid',line: i });
                var custrecordml_taskdes = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskdes',line: i });
                var custrecordml_preferredvendor = currentRec.getSublistText({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid', line: i});
                var custrecordml_preferredvendorid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_preferredvendorid',line: i });
                var custrecordml_baunit = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_baunit',line: i });
                var custrecordml_unitrate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_unitrate',line: i });
                var custrecordml_price = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_price',line: i });
                var custrecordml_currency = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_currency',line: i });
                var custrecordml_currencyrate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_currencyrate',line: i });
                var custrecordml_total =currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_total',line: i });
                var custrecordml_totalusd = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_totalusd',line: i });
                var custrecordml_customer = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customer',line: i });
                var custrecordml_customerid = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_customerid',line: i });
                var custrecordml_leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',line: i });
                var custrecordml_podate = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_podate',line: i });
                
                    arraylist[h] = {
                        "viewecduserid": viewecduserid,
                        "custrecordml_requeststscod": custrecordml_requeststscod,
                        "custrecordml_requeststscodid": custrecordml_requeststscodid,
                        "custrecordml_sviewecd": custrecordml_sviewecd,
                        "internalid": custrecordml_internalid,
                        "custrecordml_customer": custrecordml_customer,
                        "custrecordml_customerid": custrecordml_customerid,
                        "custrecordml_item": custrecordml_item,
                        "custrecordml_itemid": custrecordml_itemid,
                        "custrecordml_leadtime": custrecordml_leadtime,
                        "custrecordml_memo": memoh,
                        "custrecordml_podate": custrecordml_podate,
                        "custrecordml_preferredvendorid": custrecordml_preferredvendorid,
                        "custrecordml_price": custrecordml_price,
                        "custrecordml_qty": custrecordml_qty,
                        "custrecordml_total": custrecordml_total,
                        "custrecordml_unitrate": custrecordml_unitrate
                    }

                    console.log("h: ",h);
                    h++;
                    totpo++;

            }

            arraylist[arraylist.length] = {
                "viewecduserid": "last",
                "custrecordml_requeststscod": "last",
                "custrecordml_requeststscodid": "last",
                "custrecordml_sviewecd": "last",
                "custrecordml_internalid": "last",
                "custrecordml_customer": "last",
                "custrecordml_customerid": "last",
                "custrecordml_item": "last",
                "custrecordml_itemid": "last",
                "custrecordml_leadtime": "last",
                "custrecordml_memo": "last",
                "custrecordml_podate": "last",
                "custrecordml_preferredvendorid": "last",
                "custrecordml_price": "last",
                "custrecordml_qty": "last",
                "custrecordml_unitrate": "last"
            }
    
            var script = 'customscript_rendergenerate_rl';
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
                viewecduserid: viewecduserid,
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
                message: "We will be created " + totpo + " Purchase Orders, you will receive a confirmation email when the process is finished",
                type: message.Type.CONFIRMATION,
                duration: 30000
            }).show();

            response.then(function(res){
                setTimeout(function(){ location.reload(); }, 5000);
            }).catch(function(err){
                log.error({ title: 'process1 POST error', details: err });
            });
            
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

            console.log("idemp: ",idemp);

            var employeeRecord = record.load({
                type: record.Type.EMPLOYEE,
                id: idemp,
                isDynamic: true
            });

            console.log("employeeRecord: ",employeeRecord);

            var currentRec = currentRecord.get();  
           
            var vendors = currentRec.getValue({
                fieldId: "custpage_vendors"
            });
            log.debug("vendors",vendors);
            console.log("vendors: ",vendors);
            var customers = currentRec.getValue({
                fieldId: "custpage_customers"
            });
            log.debug("customers",customers);
            console.log("customers: ",customers);
            var requeststatusselected1 = currentRec.getValue({
                fieldId: "custpage_requeststatus"
            });
            log.debug("requeststatusselected1",requeststatusselected1);
            console.log("requeststatusselected1: ",requeststatusselected1);
            employeeRecord.setValue({
                fieldId: "custentity_vendorsselected",
                value: vendors
            });
           employeeRecord.setValue({
                fieldId: "custentity_customerssalected",
                value: customers
            });
            employeeRecord.setValue({
                fieldId: "custentity_requeststatusselected",
                value: requeststatusselected1
            });
            try {
                employeeRecord.save();
            } catch (e) {
                log.error({ title: 'Error saving employee record', details: e });
                alert('An error occurred while saving your preferences. Please try again.');
                return;
            }
            
           
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
        function addDays  (date, days)  {
             newDate = new Date(date);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
          };

       /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {
            return false;
        }
         /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {
            var currRec = scriptContext.currentRecord;
            var sublistId = scriptContext.sublistId;
            var itemVal = currRec.getCurrentSublistValue({
                sublistId: sublistId,
                fieldId: 'custrecordml_item'
            });
            log.debug('customlrecord_itemid', itemVal);

            // example: require the field to be populated
            if (!itemVal) {
                return false;
            }
            return true;

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {
            return false;
        }
        return {
            pageInit: pageInit,
            godashboard: godashboard,
            refresh: refresh,
            addDays: addDays,
            onButtonClick: onButtonClick,
            process1: process1,
            fieldChanged: fieldChanged,
            markall: markall,
            unmarkall: unmarkall,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            validateLine: validateLine
        }
    })
