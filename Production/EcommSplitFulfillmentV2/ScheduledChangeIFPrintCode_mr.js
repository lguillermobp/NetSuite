/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (runtime,log, search, record,email, GENERALTOOLS) {



        var getInputData = function getInputData(context) {

            var recordsToProcess = runtime.getCurrentScript().getParameter({
                name: 'custscriptsalesorderdata'
            });
            const obj = JSON.parse(recordsToProcess);
            log.debug('obj: ', obj);
            return obj;
        };

        var map = function map(context) {

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);

            context.write(customFulfillRecordId, customFulfillRecord);

        };

        var reduce = function reduce(context) {

            var salesOrderData = JSON.parse(context.values[0]);

            var batchcode = runtime.getCurrentScript().getParameter({
                name: 'custscriptbatchcode'
            });


            var errorf='N';
            try {
                rec = record.load({
                    type: "itemfulfillment",
                    id: salesOrderData["internalid"],
                    isDynamic: true
                })

            } catch (e) {
                errorf='Y';
                log.error({
                    title: "changing print batch code",
                    details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
                });
            }

            if (errorf=='N') {

                batchcoderec = rec.getValue({
                    fieldId: 'custbodyprintbatchcode'
                });

                if (batchcoderec.length == 0) {

                    log.debug("internalid ", salesOrderData["internalid"]);
                    log.debug("bachcode1", batchcode);

                    rec.setValue({
                        fieldId: 'custbodyprintbatchcode',
                        value: batchcode,
                        ignoreFieldChange: true
                    });

                    rec.save({enableSourcing: false});
                }
            }


            context.write(context.key, salesOrderData);
        };

        var summarize = function summarize(context) {

            var batchcode = runtime.getCurrentScript().getParameter({
                name: 'custscriptbatchcode'
            });

            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The generation of Batch printer lot ("+batchcode+ ") is done";


            email.send({
                author : userObj.id,
                recipients : emaildest,
                subject : subject,
                body : subject
            });

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });