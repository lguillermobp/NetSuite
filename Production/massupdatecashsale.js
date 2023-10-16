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

            var indexso = recSO.findSublistLineWithValue({"sublistId": "item", "fieldId": "item", "value": 13871});

            recSO.setSublistValue({
                "sublistId": "item",
                "fieldId": 'quantity',
                "line": indexso,
                "value": 0
            });
            recSO.setValue({
                fieldId: "custbody_massprocess",
                value: false
            })

            var saverec = recSO.save();

            log.debug({
                title: 'EACH',
                details: saverec,
            });

            var index = rec.findSublistLineWithValue({"sublistId": "item", "fieldId": "item", "value": 13871});

            rec.setSublistValue({
                "sublistId": "item",
                "fieldId": 'quantity',
                "line": index,
                "value": 0
            });


            rec.setValue({
                fieldId: "custbody_massprocess",
                value: false
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