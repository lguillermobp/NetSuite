/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log', "/SuiteScripts/Modules/generaltoolsv1.js"],
    function(record, log, GENERALTOOLS) {
        function each(params) {
            var currentRecord = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
            });

            trandate = currentRecord.getValue({fieldId: "trandate"});
            tranid = currentRecord.getValue({fieldId: "tranid"});
            
            log.debug("trandate",trandate);
            log.debug("tranid",tranid);



            currentRecord.setValue({fieldId: "trandate", value:  new Date("06/30/2024")});
       
            currentRecord.save();
            }

        return {
            each: each
        };
    }
);