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
                fieldId: "location",
                value: "30"
            })
            rec.setValue({
                fieldId: "department",
                value: "118"
            })
            rec.setValue({
                fieldId: "cseg_saleschann_new",
                value: "2"
            })

            linesitem(rec);

            var saverec = rec.save();
            log.debug({
                title: 'EACH',
                details: saverec,
            });
            
        }

        function linesitem(rec)
        {
            var lineCount = rec.getLineCount('item');

            for(var i = 0; i < lineCount; i++) {

                if (rec.getSublistValue({sublistId: "item", fieldId: "location", line: i})=='')
                {
                    var lineNum = rec.selectLine({
                        sublistId: 'item',
                        line: i
                    });
                    rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'location',
                        value: "30",
                        ignoreFieldChange: true
                    });
                    rec.commitLine({
                        sublistId: 'item'
                    });


                }

            }
        }

        return {
            each: each,
            linesitem: linesitem
        };
    }
);