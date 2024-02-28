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
                sublistId: 'itemvendor'
            });
            log.debug('lineCount', lineCount);
            

            for (var i = 0; i < lineCount; i++) {

                rec.removeLine({
                    sublistId: 'itemvendor',
                    line: i,
                    ignoreRecalc: true
                });
               
            }
            try {var saverec = rec.save();}
             catch(e) {
             log.debug('Error', e);log.debug('params.id', params.id);}



            // try {var preferredvendor = rec.setSublistValue({
            //     sublistId: 'itemvendor',
            //     fieldId: 'preferredvendor',
            //     line: 0,
            //     value: true
            // });
            // var saverec = rec.save();
            // }
            // catch(e) {
            //     log.debug('Error', e);}
           
             
            /*

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
            */

            // var descpo = rec.getValue({fieldId:"purchasedescription"})
            // rec.setValue({fieldId:"salesdescription",value: descpo})
            // var saverec = rec.save();
            
        }
        return {
            each: each
        };
    }
);