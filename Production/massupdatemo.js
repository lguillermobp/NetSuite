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

            task = currentRecord.getValue({fieldId: "custbody2"});
            createdfrom = currentRecord.getValue({fieldId: "createdfrom"});
            log.debug("task",task);
            log.debug("createdfrom",createdfrom);
            if (task && createdfrom)
            {
            paramschedule = GENERALTOOLS.getScheduleParams(task, createdfrom);
            log.debug("paramschedule",paramschedule);
            paramdata = paramschedule.data;
            if (paramdata) 
                {
                
                log.debug("paramdata",paramdata);
                internalid = paramdata.getValue({name: "internalid"});
                log.debug("internalid",internalid);
                currentRecord.setValue({fieldId: "custbody_tasksc", value: internalid});
                
                }
            else 
            {

                currentRecord.setValue({fieldId: "custbody_tasksc", value: ''});
            }
            currentRecord.save();
            }
        

            
            
        }

     
        

        return {
            each: each
        };
    }
);