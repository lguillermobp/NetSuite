/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 */

define(['N/https', "N/runtime", "N/currentRecord", "N/error", 'N/log', "N/record", "N/search", "N/ui/message", "N/url", "/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (https, runtime, currentRecord, error, log, record, s, message, url, GENERALTOOLS) {
        function pageInit() {
        }

        function process() {

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
            var fieldId = context.fieldId;

            if (fieldId === 'workorderorigen') {
                var workorderorigen = currentRecord.getValue({
                    fieldId: 'workorderorigen'
                });

                var retval = get_WO_internalID(workorderorigen);

                if (retval.internalid) {
                    var idwo = retval.internalid;
                    paramWO = GENERALTOOLS.get_WO_value(idwo);
                    WONo = paramWO.data.getValue({ fieldId: "tranid" });
                    customero = paramWO.data.getValue({ fieldId: "entityname" });
                    currentRecord.setValue({ fieldId: 'custpage_customero', value: customero });
                    currentRecord.setValue({ fieldId: 'custpage_woidori', value: idwo });

                    var lineCount = paramWO.data.getLineCount('item');

                    for (var i = 0; i < lineCount; i++) {

                        var item = paramWO.data.getSublistText({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: i
                        });
                        var workorder = paramWO.data.getSublistText({
                            sublistId: 'item',
                            fieldId: 'createwo',
                            line: i
                        });
                        var moidn = paramWO.data.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'woid',
                            line: i
                        });

                        try {
                            var lineNumber = currentRecord.findSublistLineWithValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_itemn',
                                value: item
                            });

                            errorv = "F";
                        } catch (err) { errorv = "V"; }

                        if (errorv == "F" && lineNumber != -1) {

                            currentRecord.selectLine({
                                sublistId: "custpage_records",
                                line: lineNumber
                            });

                            var workordern = currentRecord.getCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_workordern'
                            });

                            currentRecord.setCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_itemo',
                                value: item,
                                ignoreFieldChange: false
                            });
                            currentRecord.setCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_woido',
                                value: moidn + " ",
                                ignoreFieldChange: false
                            });


                            console.log("workorder", workorder);
                            console.log("workordern", workordern);

                            if (workorder == "T" && workordern == "true ") {
                                console.log("workorder", workorder);
                                console.log("workordern", workordern);
                                currentRecord.setCurrentSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_willbecopied',
                                    value: true
                                });
                            } else {
                                currentRecord.setCurrentSublistValue({
                                    sublistId: 'custpage_records',
                                    fieldId: 'custrecordml_willbecopied',
                                    value: false
                                });
                            }
                            currentRecord.setCurrentSublistValue({
                                sublistId: 'custpage_records',
                                fieldId: 'custrecordml_workordero',
                                value: workorder + " "
                            });

                            console.log("item", item);
                            console.log("lineNumber", lineNumber);
                            currentRecord.commitLine({
                                sublistId: 'custpage_records'
                            });

                        }

                    }

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
                console.log("workorderorigen", workorderorigen);
            }

        }

        function get_WO_internalID(wo) {

            var internalid;
            var retval = {};

            console.log("wo", wo);


            var fsearch = s.create({
                type: "workorder",
                filters:
                    [
                        ["numbertext", "is", wo],
                        "AND",
                        ["type", "anyof", "WorkOrd"],
                        "AND",
                        ["mainline", "is", "T"]
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
            log.debug("pagedData", pagedData);
            pagedData.pageRanges.forEach(function (pageRange) {
                log.debug("pageRange", pageRange);
                var page = pagedData.fetch({ index: pageRange.index });

                page.data.forEach(function (fresult) {
                    log.debug("fresult", fresult);

                    internalid = fresult.getValue({ name: "internalid" });
                    retval = {
                        "internalid": internalid
                    }

                });

            })
            console.log("retval", retval);
            return retval;
        }


        function changenext(id, sts) {
            var currRec = currentRecord.get();
            console.log("id", id);
            console.log("sts", sts);
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


            return false;

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

            var currentRec = context.currentRecord;

            var internalidori = currentRec.getValue({
                fieldId: "custpage_woidori"
            });
            var internalidnew = currentRec.getValue({
                fieldId: "custpage_woidnew"
            });
            console.log("internalidori: ", internalidori);
            console.log("internalidnew: ", internalidnew);

            var sublistCount = currentRec.getLineCount({
                sublistId: 'custpage_records'
            });

            var arraylist = [];
            totpo = 0;

            for (var i = 0; i < sublistCount; i++) {


                var omit = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_willbecopied',
                    line: i
                });

                if (!omit) continue;

                var custrecordml_itemo = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_itemo',
                    line: i
                });
                var custrecordml_woido = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_woido',
                    line: i
                });
                var custrecordml_woidn = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_woidn',
                    line: i
                });
                var custrecordml_itemn = currentRec.getSublistValue({
                    sublistId: 'custpage_records',
                    fieldId: 'custrecordml_itemn',
                    line: i
                });

                arraylist[totpo] = {
                    "custrecordml_itemo": custrecordml_itemo,
                    "custrecordml_itemo": custrecordml_itemn,
                    "custrecordml_woido": custrecordml_woido,
                    "custrecordml_woidn": custrecordml_woidn,
                    "internalidori": internalidori,
                    "internalidnew": internalidnew
                }

                console.log("totpo: ", totpo);
                totpo = totpo + 1;
            }


            var script = 'customscriptrendergenerate_cpywo';
            var deployment = 'customdeploy1';
            var parameters = "";

            var scheme = 'https://';
            var host = url.resolveDomain({
                hostType: url.HostType.APPLICATION
            });

            var suiteletURL = url.resolveScript({
                scriptId: script,
                deploymentId: deployment,
                returnExternalUrl: false
            });
            //window.open(suiteletURL, "_blank");
            var headerObj = {
                name: 'Accept-Language',
                value: 'en-us'
            };
            var datap = {
                woidori: internalidori,
                woidnew: internalidnew,
                data: arraylist
            };
            postData = JSON.stringify(datap);

            var response = https.post.promise({
                url: scheme + host + suiteletURL,
                body: postData, // a=1&b=2&c=3
                headers: headerObj
            });

            message.create({
                title: "Process Starting ...",
                message: "We will be created " + totpo + " Mos, you will receive a confirmation email when the process is finished",
                type: message.Type.CONFIRMATION,
                duration: 10000
            }).show();


            return true;


        }

        return {
            pageInit: pageInit,
            process: process,
            fieldChanged: fieldChanged,
            changenext: changenext,
            validateInsert: validateInsert,
            validateDelete: validateDelete,
            saveRecord: saveRecord
        }
    })
