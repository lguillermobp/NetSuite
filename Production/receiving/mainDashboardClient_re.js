/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/search',"N/ui/message","N/runtime","N/currentRecord", "N/error", "N/log",'N/url'],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (s,message,runtime,currentRecord, error, log, url) {



        function pageInit(context) {
            log.debug("context",context);

        }
        function get_PO_internalID(po) {

            var internalid;
            var retval = {};
            log.debug("po",po);
            var fsearch = s.create({
                type: "transaction",
                filters:
                    [
                        ["numbertext","is",po],
                        "AND",
                        ["type","anyof","PurchOrd","TrnfrOrd"], 
                        "AND",
                        ["mainline","is","T"], 
                        "AND", 
                        ["status","anyof","PurchOrd:B","PurchOrd:D","PurchOrd:E","TrnfrOrd:F","TrnfrOrd:E"], 
                        "AND", 
                        ["type","anyof","PurchOrd","TrnfrOrd"]
                    ],
                columns:
                    [
                        "mainline",
                        "tranid",
                        "internalid"
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize": 1000
            });
            log.debug("pagedData",pagedData);
            pagedData.pageRanges.forEach(function (pageRange) {
                log.debug("pageRange",pageRange);
               var page = pagedData.fetch({index: pageRange.index});

               page.data.forEach(function (fresult) {
                log.debug("fresult",fresult);

                    internalid = fresult.getValue({name: "internalid"});
                    retval = {
                       "internalid": internalid
                    }

                });

            })

            return retval;
        }
        function saveRecord(context) {
            var currRec = context.currentRecord;

            var po = currRec.getValue({fieldId: "purchaseorder"});

            var script = 'customscript_dashboard_re';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });
            var retval=get_PO_internalID(po);

            if (retval.internalid) {
                var idpo=retval.internalid;
                
                suiteletURL += "&idpo=" + idpo;
                log.debug("suiteletURL",suiteletURL);

                window.open(suiteletURL, "_blank");
                return true;
            }
            else {
                message.create({
                    title: "Error",
                    message: "The Purchase Order/Transfer Order does not exist or has already been received. Please check the number and try again",
                    type: message.Type.ERROR,
                    duration: 10000
                }).show();
                log.debug("Error", "Purchase Order/Transfer Order not found");
            }      

        }

        /**
         *  Function to be executed when field is changed.*
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
        function validateInsert(context) {

            return false;

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

        }


        return {
            pageInit: pageInit,
            saveRecord: saveRecord,
            //fieldChanged: fieldChanged,
            //postSourcing: postSourcing,
            //sublistChanged: sublistChanged,
            //lineInit: lineInit,
            //validateField: validateField,
            //validateLine: validateLine,
            //validateInsert: validateInsert,
            //validateDelete: validateDelete
        }
    })
