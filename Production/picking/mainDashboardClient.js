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
        function get_WO_internalID(wo) {

            var internalid;
            var retval = {};
            log.debug("wo",wo);
            var fsearch = s.create({
                type: "workorder",
                filters:
                    [
                        ["numbertext","is",wo],
                        "AND",
                        ["type","anyof","WorkOrd"],
                        "AND",
                        ["mainline","is","T"]
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

            var wo = currRec.getValue({fieldId: "workorder"});

            var script = 'customscript_dashboard_pl';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });
            var retval=get_WO_internalID(wo);

            if (retval.internalid) {
                var idwo=retval.internalid;
                
                suiteletURL += "&idwo=" + idwo;
                log.debug("suiteletURL",suiteletURL);

                window.open(suiteletURL, "_blank");
                return true;
            }
            else {
                message.create({
                    title: "Error",
                    message: "The Manufacturing Order does not exist. Please check the number and try again.",
                    type: message.Type.ERROR,
                    duration: 10000
                }).show();
                log.debug("Error", "Manufacturing Order not found");
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
