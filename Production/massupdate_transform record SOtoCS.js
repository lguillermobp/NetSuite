/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log'],
    function(record, log ) {
        function each(params) {

            var soId=params.id;


            try {
                   var cashsalerecord = record.transform({
                        fromType: record.Type.SALES_ORDER,
                        fromId: parseInt(soId, 10),
                        toType: "cashsale",
                        isDynamic: true
                    });

            } catch (e) {
                log.debug({  title: String(e.name), details:String(e.message)});
                return;
            }
            var d = new Date('07/26/2023');
            cashsalerecord.setValue('trandate', d);
            try {
                var cashsalerecordId = cashsalerecord.save();
    
            } catch (e) {
                log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
                return;
            }
            var rec = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
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