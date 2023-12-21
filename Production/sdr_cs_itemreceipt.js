/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var country;
define(["N/ui/message","N/log","N/record"],

    function(message, log, record) {

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

            datarec=context.currentRecord;

            createdfrom = datarec.getValue({fieldId: "createdfrom"});
            log.debug("createdfrom",  createdfrom);

           
           

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
        function validateLine(currentRecord) {


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
        function validateDelete(scriptContext) {

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

            
            currentRecord = context.currentRecord;

            var location = currentRecord.getValue({
                fieldId: 'location'
            });

            var itemIndex = 0;
            var itemCount = currentRecord.getLineCount({
                "sublistId": "item"
            });


            var rec;

            while (itemIndex < itemCount) {
                currentRecord.selectLine({
                    "sublistId": "item",
                    "line": itemIndex
                });


                var subRecordInventoryDetail = currentRecord.getCurrentSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail'
                });


                var itemid = subRecordInventoryDetail.getValue({
                    fieldId: 'item'
                });


                if (subRecordInventoryDetail) {
                    var srLineCount = subRecordInventoryDetail.getLineCount({
                        sublistId: 'inventoryassignment'
                    });
                    
                    if (srLineCount > 0) 
                    {
                        
                        subRecordInventoryDetail.selectLine({
                            sublistId: 'inventoryassignment',
                            line: 0
                        });

                        var binNumber = subRecordInventoryDetail.getCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'binnumber'
                        });
                        
                        if (binNumber) {

                            rec = record.load({
                                type: "inventoryitem",
                                id: itemid,
                                isDynamic: true
                            })
                        
                            
                                var lineNumber = rec.findSublistLineWithValue({
                                sublistId: 'binnumber',
                                fieldId: 'preferredbin',
                                value: true
                            });
                        
                            if (lineNumber==-1) {
                                
                                rec.selectNewLine({sublistId: "binnumber"});
                                rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "location", value: location});
                                rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "binnumber", value: binNumber});
                                rec.setCurrentSublistValue({sublistId: "binnumber", fieldId: "preferredbin", value: true});
                                rec.commitLine({sublistId: "binnumber"});
                                var saverec = rec.save();
                            }
                        }
                    }
                }
                itemIndex++;
            }

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
            saveRecord: saveRecord
        };

    });