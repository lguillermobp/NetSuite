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
            
            task = currentRecord.getValue({fieldId: "custbody_task"});
            createdfrom = currentRecord.getValue({fieldId: "createdfrom"});
            if (createdfrom == 46356 || createdfrom == 46357 || createdfrom == 46358 || createdfrom == 45781 || createdfrom == 46083 || createdfrom == 45955) { 

                log.debug("taskb",task);

                if (task =='SL - Base Vehicle Title')
                {
                    task = 'CL -Base Vehicle Title / Parts Dispatch - STAGE 0';

                }
                if (task =='SL - PARTS DISP. Diff Parts Stg 0')
                {
                    task = 'CL -Base Vehicle Title / Parts Dispatch - STAGE 0';
                }
                if (task =='SL - PARTS DISP. ROLLER DT')
                {
                    task = 'CL -Parts Dispatch - STAGE 1';
                }
                if (task =='SL - PARTS DISP,. UPH, COS, ELEC')
                {
                    task = 'CL -Parts Dispatch - STAGE 1';
                }
                if (task =='SL - QC Inspection P4')
                {
                    task = 'CL -PHASE 6 - FINAL COSMETICS (20 ISSUES) +FINAL LINE QC INSPECTION';
                }
                currentRecord.setValue({fieldId: "custbody_task", value: task});
                log.debug("taska",task);
            }
            
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