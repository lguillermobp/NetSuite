/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log'],
    function(record, log ) {
        function each(params) {
            var rec = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
            });

            rec.setValue({
                fieldId: "custbody_massprocess",
                value: false
            })

            rec.selectNewLine({sublistId: "item"});
            rec.setCurrentSublistValue({sublistId: "item", fieldId: "item", value: "23639"});
            rec.setCurrentSublistValue({sublistId: "item", fieldId: "quantity", value: 1});
            rec.setCurrentSublistValue({sublistId: "item", fieldId: "location", value: 30});
            rec.setCurrentSublistValue({sublistId: "item", fieldId: "amount", value: 0});
            rec.commitLine({sublistId: "item"});



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