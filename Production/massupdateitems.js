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
                isDynamic: false
            });

            /*
            var price = rec.getMatrixSublistValue ({
                sublistId: 'price',
                fieldId: 'price',
                column: 0,
                line: 0
            }); 
             */
            /*
            rec.setValue({
                fieldId: 'unitstype',
                value: "1"
            });
            var saverec = rec.save();
            /*
            /*
            rec.setMatrixSublistValue ({
                sublistId: 'price',
                fieldId: 'price',
                column: 0,
                line: 0,
                value: 0,
                ignoreFieldChange: true,
                fireSlavingSync: true
            }); 

            rec.commitLine({
               sublistId: 'price'
            });
            
            
            
            try {var saverec = rec.save();}
            catch(e) {
            log.debug('Error', e);log.debug('params.id', params.id);}
            */
            /*
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
            */


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

                /*
             var descpo = rec.getValue({fieldId:"purchasedescription"})
             rec.setValue({fieldId:"salesdescription",value: descpo})

          
             
            

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
            
        }
        return {
            each: each
        };
    }
);