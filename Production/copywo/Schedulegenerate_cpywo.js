/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */
var totreg;
define(["N/runtime", 'N/log', 'N/search', 'N/record', "N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function (runtime, log, search, record, email, GENERALTOOLS) {


        var getInputData = function getInputData(context) {

            var WO_IDORI = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpywo_WO_IDORI'
            });
            var WO_IDNEW = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpywo_WO_IDNEW'
            });
            var DATAPPD = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpywo_data'
            });
            var fsearch = JSON.parse(DATAPPD);

            log.debug("fsearch", fsearch);
            log.debug("WO_IDORI", WO_IDORI);
            log.debug("WO_IDNEW", WO_IDNEW);

            totreg = fsearch.length;

            return fsearch;
        };

        var map = function map(context) {

            var fsearchId = context.key;
            var fresult = JSON.parse(context.value);

            var custrecordml_woido = fresult.custrecordml_woido;
            var custrecordml_woidn = fresult.custrecordml_woidn;

            log.debug("custrecordml_woidn", custrecordml_woidn);

            try {
                var rec = record.load({
                    type: "workorder",
                    id: custrecordml_woidn.trim(),
                    isDynamic: true
                });
            } catch (e) {
                log.debug({ title: "error.save: ", details: "Error Name: " + String(e.name) + " Error Message: " + String(e.message) });
            }

            log.debug("custrecordml_woido", custrecordml_woido);

            if (custrecordml_woido != 0) {



                recfrom = record.load({
                    type: "workorder",
                    id: custrecordml_woido.trim(),
                    isDynamic: true
                });
                log.debug("recfrom", recfrom);
            }

            if (recfrom) {

                shipcrelines(rec);

                var lineCount = recfrom.getLineCount('item');
                log.debug("lineCount", lineCount);
                for (var i = 0; i < lineCount; i++) {
                    recfrom.selectLine({
                        sublistId: 'item',
                        line: i
                    });


                    var item = recfrom.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    var quantity = recfrom.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    log.debug("item", item);

                    newLine = rec.selectNewLine({
                        sublistId: 'item'
                    });


                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item
                    });

                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: quantity
                    });

                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'bomquantity',
                        value: quantity
                    });

                    rec.commitLine({
                        sublistId: 'item'
                    });

                }
            }


            try {
                var saverec = rec.save();
                log.debug({
                    title: 'EACH',
                    details: saverec,
                });
            } catch (e) {
                log.debug({ title: "error.save: ", details: "Error Name: " + String(e.name) + " Error Message: " + String(e.message) });

            }

            function shipcrelines(rec) {
                var lineCount = rec.getLineCount('item');
                log.debug("lineCount", lineCount);
                for (var i = lineCount - 1; i > -1; i--) {

                    var lineNum = rec.selectLine({
                        sublistId: 'item',
                        line: i
                    });

                    try {

                        rec.removeLine({
                            sublistId: 'item',
                            line: i
                        });

                    } catch (e) {
                        log.debug({ title: "error.save: ", details: "Error Name: " + String(e.name) + " Error Message: " + String(e.message) });

                    }
                }

            }

            log.debug("recfrom", recfrom);

            context.write(fsearchId, fresult);

        };

        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);

            context.write(context.key, fresult);
        };

        var summarize = function summarize(context) {

            var WO_IDNEW = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpywo_WO_IDNEW'
            });


            try {

                var userObj = runtime.getCurrentUser();
                log.debug("userObj", userObj.id);
                var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
                var emaildest = paramemp.data.getValue({ fieldId: "email" });

                log.debug("emaildest", emaildest);

                subject = "The copy is done";


                email.send({
                    author: userObj.id,
                    recipients: emaildest,
                    subject: subject,
                    body: subject
                });
            } catch (e) {
                log.error("error", e);
            }

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });