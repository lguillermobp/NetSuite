/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(['N/record','N/log', "/SuiteScripts/Modules/generaltoolsv1.js"],
    function(record, log, GENERALTOOLS) {
        var salecontract;
        function each(params) {
            var currentRecord = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
            });
            
            task = currentRecord.getText({fieldId: "custbody_task"});
            assembly= currentRecord.getValue({fieldId: "assemblyitem"});
            createdfrom = currentRecord.getValue({fieldId: "createdfrom"});
            if (createdfrom == 11485) { 

                salecontract = record.load({
                    type: 'salesorder',
                    id: createdfrom,
                    isDynamic: true
                });
                productionline = salecontract.getValue({fieldId: "custbody_productionline"});
                currentRecord.setValue({fieldId: "custbody_productionline", value: productionline});

                var lineNumber = salecontract.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: assembly
                });
                log.debug("lineNumber",lineNumber);

                var parmassambly = record.load({
                    type: 'assemblyitem',
                    id: assembly,
                    isDynamic: true
                });
                log.debug("taskb",task);
                task = parmassambly.getText({fieldId: "custitem_task"});

                if (lineNumber != -1) {
                    
                

                salecontract.selectLine({
                    sublistId: 'item',
                    line: lineNumber
                });
                salecontract.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_taskid',
                    value: task,
                    ignoreFieldChange: true
                });
                salecontract.commitLine({
                    sublistId: 'item'
                });
            }
                currentRecord.setValue({fieldId: "custbody_task", value: task});
                log.debug("taska",task);
                salecontract.save();
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