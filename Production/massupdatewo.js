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
                value: "17845"
            });
            log.debug("lineNumber",lineNumber);

            if (lineNumber>-1)             
            {
                try {  
                rec.removeLine({
                    sublistId: 'item',
                    line: lineNumber
                });
                
                rec.commitLine({
                    sublistId: 'item'
                });  
            } catch (e) {
                log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

            }             
            }
            else {
                shipcrelines(rec);
            }

            try {  
            var saverec = rec.save();
            log.debug({
                title: 'EACH',
                details: saverec,
            });
        } catch (e) {
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

        }    
        }

        function shipcrelines(rec)
        {
        var lineCount = rec.getLineCount('item');
        log.debug("lineCount",lineCount);
        for(var i = lineCount-1; i > -1; i--) {

            var lineNum = rec.selectLine({
                sublistId: 'item',
                line: i
            });

            try {

                rec.removeLine({
                    sublistId: 'item',
                    line: i
                });
                
                rec.commitLine({
                    sublistId: 'item'
                });

            } catch (e) {
                log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

            }
            }
            rec.selectNewLine({sublistId: "item"});
            rec.setCurrentSublistValue({sublistId: "item", fieldId: "item", value: "17845"});
            rec.commitLine({sublistId: "item"});

        }
        

        return {
            each: each,
            shipcrelines:shipcrelines
        };
    }
);