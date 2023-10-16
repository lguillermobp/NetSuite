/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log'],
    function(record, log ) {
        function each(params) {
            var rec = record.load({
                type: params.type,
                id: params.id
            });

            rec.getValue({fieldId: "custrecordml_saleorder"})

            rec.setValue({
                fieldId: "custrecordml_sointernalid",
                value: rec.getValue({fieldId: "custrecordml_saleorder"})
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