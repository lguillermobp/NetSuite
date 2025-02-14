/**
 * @NApiVersion 2.0
 * @NScriptType MassUpdateScript
 */
define(["N/search",'N/record','N/log', "/SuiteScripts/Modules/generaltoolsv1.js"],
    function(search,record, log, GENERALTOOLS) {
        var salecontract;
        function each(params) {
            var currentRecord = record.load({
                type: params.type,
                id: params.id,
                isDynamic: true
            });
            var saveon=false;
            section = currentRecord.getValue({fieldId: "custbody_ecdsection"});

            if (!section) 
            {
                assemblyrec = record.load({
                    type: 'assemblyitem',
                    id: currentRecord.getValue({ fieldId: 'assemblyitem' }),
                    isDynamic: true
                })
                section = assemblyrec.getValue({ fieldId: 'custitem_sections' });
                log.debug("section", section);
                log.debug("assemblyrec", assemblyrec);
                if (!section)
                {
                    return;
                }
                else
                {
                    currentRecord.setValue({ fieldId: "custbody_ecdsection", value: section });
                    saveon=true;
                }
            }
            productionline = currentRecord.getValue({fieldId: "custbody_productionline"});

            var sectionRecord = record.load({
                type: 'customrecord_section',
                id: section,
                isDynamic: true
            });

            var stages = sectionRecord.getValue({ fieldId: 'custrecord_stages' });
            log.debug("stages", stages);

            assembly= currentRecord.getValue({fieldId: "assemblyitem"});
            createdfrom = currentRecord.getValue({fieldId: "createdfrom"});

            var customrecord_pl_scheduletaskSearchObj = search.create({
                type: "customrecord_pl_scheduletask",
                filters:
                [
                   ["custrecord158","anyof",stages], 
                   "AND", 
                   ["custrecord_plst_productionline","anyof",productionline]
                ],
                columns:
                [
                   "custrecord158",
                   "custrecord_plst_productionline",
                   "custrecord_plst_task"
                ]
             });
            var taskdef;
            var pagedData = customrecord_pl_scheduletaskSearchObj.runPaged({
                "pageSize" : 1000
            });

            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (fresult1) {

                    taskdef= fresult1.getValue({name: "custrecord_plst_task"});
                    taskdefd= fresult1.getText({name: "custrecord_plst_task"});

                });
            });

            if (taskdef && createdfrom)
            {
            paramschedule = GENERALTOOLS.getScheduleParams(taskdefd, createdfrom);
            log.debug("paramschedule",paramschedule);
            paramdata = paramschedule.data;
            if (paramdata) 
                {
                
                log.debug("paramdata",paramdata);
                internalid = paramdata.getValue({name: "internalid"});
                log.debug("internalid",internalid);
                currentRecord.setValue({fieldId: "custbody_tasksc", value: internalid});
                currentRecord.setValue({fieldId: "custbody_scheduletaskid", value: taskdef});
                
                }
            else 
            {
                currentRecord.setValue({fieldId: "custbody_tasksc", value: ''});
                saveon=true;
            }
            
            }
            if (saveon)           {currentRecord.save();}
            
        }
        

        return {
            each: each
        };
    }
);