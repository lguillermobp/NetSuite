/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
 define(["N/log","N/record","N/ui/message"],

 function(log, r,message) {

         /**
          * Function to be executed after page is initialized.
          *
          * @param {Object} scriptContext
          * @param {Record} scriptContext.currentRecord - Current form record
          * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
          *
          * @since 2015.2
          */
         function pageInit(context) {

                 log.debug("context.mode",context.mode);
                 log.debug("context.currentRecord",context.currentRecord);
                 datarec=context.currentRecord;
                 log.debug("datarec",datarec);

                 internalid = datarec.getValue({fieldId: "id"});
                 log.debug("internalid",internalid);


              

                 if (internalid==10950)
                 {
                         var lineCount = datarec.getLineCount({
                                 sublistId: 'item'
                         });
                         log.debug("lineCount",lineCount);
                         for (var i = 0; i < lineCount; i++)
                         {
                                 datarec.selectLine({
                                         sublistId: "item",
                                         line: i
                                 });
                                 
                                 itemid=datarec.getCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'item'
                                });
                                 qty=datarec.getCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'quantity'
                                });


                                log.debug("qty",qty);
                                datarec.setCurrentSublistValue({
                                         sublistId: 'item',
                                         fieldId: 'isclosed',
                                         value: false,
                                         ignoreFieldChange: true
                                 });
                                  
                                 
                                 datarec.commitLine({
                                         sublistId: 'item'
                                 });
                             


                         }
                 }




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
         function saveRecord(context) {


                 return true;
         }

         return {
                 pageInit: pageInit,
                 //fieldChanged: fieldChanged,
                 //postSourcing: postSourcing,
                 //sublistChanged: sublistChanged,
                 //lineInit: lineInit,
                 //validateField: validateField,
                 //validateLine: validateLine,
                 //validateInsert: validateInsert,
                 //validateDelete: validateDelete,
                 //saveRecord: saveRecord
         };

 });