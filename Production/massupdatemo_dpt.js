/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log', "/SuiteScripts/Modules/generaltoolsv1.js"],
    function(record, log, GENERALTOOLS) {
        function each(params) {
            var currentRecord = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
            });

            itemId = currentRecord.getValue({fieldId: "assemblyitem"});
            paramitem = GENERALTOOLS.get_item_value_new(itemId);
            paramdata = paramitem.data;
            department = paramdata.getValue({fieldId: "department"});

            if (department)
            {
                currentRecord.setValue({fieldId: "department", value: department});
                currentRecord.save();
            }
            
        }

     
        

        return {
            each: each
        };
    }
);