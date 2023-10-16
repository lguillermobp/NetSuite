/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/log','N/record', 'N/runtime',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(log, record, runtime,email, GENERALTOOLS) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(context) {

            var script = runtime.getCurrentScript();


            var salesOrderDatastr = runtime.getCurrentScript().getParameter({
                name: 'custscriptcustscriptsalesorderdata'
            });
            var batchcode = runtime.getCurrentScript().getParameter({
                name: 'custscriptcustscriptbatchcode'
            });


            const salesOrderData = JSON.parse(salesOrderDatastr);


            for (let i = 0; i < salesOrderData.length; i++) {
                var errorf='N';
                try {
                rec = record.load({
                    type: "itemfulfillment",
                    id: salesOrderData[i]["internalid"],
                    isDynamic: false
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

                        log.debug("internalid ", salesOrderData[i]["internalid"]);
                        log.debug("bachcode1", batchcode);

                        rec.setValue({
                            fieldId: 'custbodyprintbatchcode',
                            value: batchcode,
                            ignoreFieldChange: true
                        });

                        rec.save({enableSourcing: false});
                    }
                }
            }

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



        }

        return {    execute: execute };

    });