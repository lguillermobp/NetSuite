/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log'],
    function(record, log ) {
        function each(params) {

            var soId=params.id;

            var rec = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
            });
            rec.setValue({
                fieldId: "paymentmethod",
                value: "20"
            })


            var saverec = rec.save();
            log.debug({
                title: 'EACH',
                details: saverec,
            });
            
        }

        return {
            each: each
        };
    }
);