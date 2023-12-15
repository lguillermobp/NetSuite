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

            

            rec.setValue({
                fieldId: "preferredbin",
                value: true
            })

            var saverec = rec.save();
            
        }
        return {
            each: each
        };
    }
);