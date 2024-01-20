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

            var lineCount = rec.getLineCount({
                sublistId: 'billofmaterials'
            });
            log.debug('lineCount', lineCount);

            /*
            try {var preferredvendor = rec.setSublistValue({
                sublistId: 'itemvendor',
                fieldId: 'preferredvendor',
                line: 0,
                value: true
            });
            var saverec = rec.save();
            }
            catch(e) {
                log.debug('Error', e);}
           
                */


            try {
                rec.removeLine({
                    sublistId: 'billofmaterials',
                    line: 0,
                    ignoreRecalc: true
                });
               
            var saverec = rec.save();
            }
            catch(e) {
                log.debug('Error', e);}
            
           // rec.setValue({fieldId:"isspecialworkorderitem",value: false})

            //var saverec = rec.save();
            
        }
        return {
            each: each
        };
    }
);