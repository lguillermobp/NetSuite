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


            var IdSo= rec.getValue({fieldId: "createdfrom"});
            var UnDep= rec.getValue({fieldId: "undepfunds"});
            var statusCS= rec.getValue({fieldId: "status"});

            var recSO = record.load({
                type: "salesorder",
                id: IdSo
            });


            recSO.setValue({
                fieldId: "shipstate",
                value: "NY"
            })

            var saverec = recSO.save();

            log.debug({
                title: 'EACH',
                details: saverec,
            });

            rec.setValue({
                fieldId: "shipstate",
                value: "NY"
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