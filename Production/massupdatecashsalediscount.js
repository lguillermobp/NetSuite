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

            var lineNumber = rec.findSublistLineWithValue({
                sublistId: 'item',
                fieldId: 'item',
                value: "13852"
            });
            log.debug("lineNumber",lineNumber);


            if (lineNumber>0)             { discountlines(rec);               }


            var saverec = rec.save();
            log.debug({
                title: 'EACH',
                details: saverec,
            });
        }


        function discountlines(rec)
        {
            var lineCount = rec.getLineCount('item');
            var itemskub;
            for(var i = 0; i < lineCount; i++) {

                log.debug("sku",rec.getSublistText({sublistId: "item", fieldId: "item", line: i}));
                if (rec.getSublistValue({sublistId: "item", fieldId: "item", line: i})=='13852')
                {
                    var lineNum = rec.selectLine({
                        sublistId: 'item',
                        line: i
                    });

                    try {


                        rec.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_discountappliedsku',
                            value: itemskub,
                            ignoreFieldChange: true
                        });
                        rec.commitLine({
                            sublistId: 'item'
                        });

                    } catch (e) {
                        log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

                    }

                }
                log.debug("itemskub",itemskub);
                itemskub = rec.getSublistText({sublistId: "item", fieldId: "item", line: i});


            }
        }

        return {
            each: each,
            discountlines:discountlines
        };
    }
);