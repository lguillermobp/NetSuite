/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 * @NID customscript_bkm_cs_wo_0001
 */
define(["N/log","N/record","N/email","N/ui/message", 'N/ui/dialog',"N/runtime", "N/search", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(log, r,email,message, nDialog,runtime,search, GENERALTOOLS) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(context) 
        {

                workorderId = context.currentRecord.getValue({fieldId: "createdfrom"});
                log.audit({title: "workorderId", details: workorderId});
              
        
                var userObj = runtime.getCurrentUser();
                var userID = userObj.id;
                var userPermission = userObj.getPermission({	name : 'TRAN_PURCHORD'	});
                autPO= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
                log.audit({title: "autPO", details: autPO});
        
                var itembo = searchboitems(workorderId);
                        log.debug("itembo", itembo);
                        if (itembo.length > 0) {
                            if (itembo.length == 1) {
                                var msgbo = "Please note the following item is not transferred: " + itembo.toString();
                            } else {
                                var msgbo = "Please note the following items are not transferred: " + itembo.toString();
                            }
                            log.debug("msgbo", msgbo);
                        
                            message.create({
                                title: "Manufacturing Order contains items have not transferred",
                                message:  msgbo,
                                type: message.Type.ERROR
                            }).show();
                        }


               
        }

        function searchboitems(workorderId) {

            var itembo=[];
    
    
            var fsearch = search.create({
                type: "transaction",
                settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                filters:
                [
                   [[["status","anyof","WorkOrd:B","WorkOrd:G"],"AND",["internalid","anyof",workorderId],"AND",["type","anyof","WorkOrd"]],"OR",[["type","anyof","InvTrnfr"],"AND",["custbody_mo.internalid","anyof",workorderId],"AND",["custbody_mo.mainline","is","T"],"AND",["memo","isnotempty",""]]], 
                   "AND", 
                   ["mainline","is","F"], 
                   "AND", 
                   ["location","anyof","4"], 
                   "AND", 
                   ["sum(formulanumeric: CASE  WHEN {type}='Manufacturing Order' THEN {quantity} ELSE 0 END - CASE  WHEN {type}='Inventory Transfer' THEN {quantity} ELSE 0 END)","notequalto","0"], 
                   "AND", 
                   ["item.type","anyof","Assembly","InvtPart"]
                ],
                columns:
                [
                   search.createColumn({
                      name: "formulatext",
                      summary: "MAX",
                      formula: "CASE  WHEN {type}='Manufacturing Order' THEN {customermain.altname} ELSE '' END"
                   }),
                   search.createColumn({
                      name: "formulatext",
                      summary: "GROUP",
                      formula: "CASE  WHEN {type}='Inventory Transfer' THEN {memo} ELSE {number} END"
                   }),
                   search.createColumn({
                      name: "formulatext",
                      summary: "MAX",
                      formula: "CASE  WHEN {type}='Inventory Transfer' THEN {number} ELSE  ' ' END"
                   }),
                   search.createColumn({
                      name: "formulanumeric",
                      summary: "MAX",
                      formula: "CASE  WHEN {type}='Manufacturing Order' THEN {internalid} ELSE  0 END"
                   }),
                   search.createColumn({
                      name: "item",
                      summary: "GROUP"
                   }),
                   search.createColumn({
                      name: "formulanumeric",
                      summary: "SUM",
                      formula: "CASE  WHEN {type}='Manufacturing Order' THEN {quantity} ELSE 0 END"
                   }),
                   search.createColumn({
                      name: "formulanumeric",
                      summary: "SUM",
                      formula: "CASE  WHEN {type}='Inventory Transfer' THEN {quantity} ELSE 0 END"
                   }),
                   search.createColumn({
                      name: "formulanumeric",
                      summary: "SUM",
                      formula: "CASE  WHEN {type}='Manufacturing Order' THEN {quantity}-NVL({quantitycommitted}, 0) ELSE 0 END"
                   }),
                   search.createColumn({
                      name: "datecreated",
                      summary: "MAX"
                   }),
                   search.createColumn({
                      name: "formulanumeric",
                      summary: "SUM",
                      formula: "sum(CASE  WHEN {type}='Manufacturing Order' THEN {quantity} ELSE 0 END - CASE  WHEN {type}='Inventory Transfer' THEN {quantity} ELSE 0 END)"
                   })
                ]
             });
    
             var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });
            log.debug("pagedData.pageRanges.length",pagedData.pageRanges.length);
           
            
            if (pagedData.pageRanges.length > 0) {
    
                pagedData.pageRanges.forEach(function (pageRange) {
                    var page = pagedData.fetch({index: pageRange.index});
                    page.data.forEach(function (fresult1) {
                        
                        item=fresult1.getText(fresult1.columns[4])
                        qty=fresult1.getValue(fresult1.columns[7]);
                     if (qty != 0) {
                        descrip=item + " - (" + qty + ") -";
                        itembo.push(descrip);
                    }
                    });
                });
    
            }
    
            return itembo;
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


               


        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(context) {


        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(context) {






            return true;
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
        function validateInsert(scriptContext) {

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
        function validateDelete(context) {


        }



        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        var finalResultSet = false;
        var WO;
        var PO;
        var location;
        var locationPO;
        var userID;
        function saveRecord(context) 
        {

                var currentRecord = context.currentRecord;

            
                return true;

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            //postSourcing: postSourcing,
            //sublistChanged: sublistChanged,
            //lineInit: lineInit,
            //validateField: validateField,
            //validateLine: validateLine,
            //validateInsert: validateInsert,
            //validateDelete: validateDelete,
            //generateMasterLabels : generateMasterLabels,
            saveRecord: saveRecord
        };

    });