/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/ui/message", "N/search", "N/runtime","N/log", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record,message, search, runtime,log, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {

      
        const currentRecordId = context.newRecord.id;
        log.audit({title: "context.type", details: context.type});

      

        var userObj = runtime.getCurrentUser();
		var userID = userObj.id;
		var userPermission = userObj.getPermission({	name : 'TRAN_PURCHORD'	});
		autPO= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
        log.audit({title: "autPO", details: autPO});
      

        wostatus = context.newRecord.getValue({fieldId: "status"});

        if (context.type === context.UserEventType.VIEW) {
            // ================================================================================
            // BOM PDF
            // ================================================================================
            const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1610&deploy=1&id=${currentRecordId}`

            context.form.addButton({
                id: "custpage_print", 
                label: "Print BOM ECD",
                functionName: `window.open('${printSuitelet}');`
            })

            if (wostatus == "Released" || wostatus == "In Progress") {
                const printSuitelet1 = `/app/site/hosting/scriptlet.nl?script=1626&deploy=1&idwo=${currentRecordId}`

                context.form.addButton({
                    id: "custpage_ticket", 
                    label: "Picking",
                    functionName: `window.open('${printSuitelet1}');`
                })
            }

            if (wostatus == "Released" || wostatus == "In Progress") {

                if (autPO=="FULL") 
                    {
                        const printSuitelet2 = `/app/site/hosting/scriptlet.nl?script=2568&deploy=1&idwo=${currentRecordId}`

                        context.form.addButton({
                            id: "custpage_createpo", 
                            label: "Create POs",
                            functionName: `window.open('${printSuitelet2}');`
                        })
                    }
            }


            
        }

        if (context.type === context.UserEventType.CREATE) {

            itemId = context.newRecord.getValue({fieldId: "assemblyitem"});
            productionline = context.newRecord.getValue({fieldId: "custbody_productionline"});
            section = context.newRecord.getValue({fieldId: "custbody_ecdsection"});
            createfrom = context.newRecord.getValue({fieldId: "createdfrom"});
            context.newRecord.setValue({fieldId: "custbody_quote_sc", value: createfrom});

            log.audit({title: "productionline", details: productionline});
            log.audit({title: "section", details: section});

            log.audit({title: "itemId", details: itemId});

            if (section)

                {

                var sectionRecord = record.load({
                    type: 'customrecord_section',
                    id: section,
                    isDynamic: true
                });

                var stages = sectionRecord.getValue({ fieldId: 'custrecord_stages' });
                log.debug("stages", stages);

                createdfrom = context.newRecord.getValue({fieldId: "createdfrom"});

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
                        context.newRecord.setValue({fieldId: "custbody_tasksc", value: internalid});
                        context.newRecord.setValue({fieldId: "custbody_scheduletaskid", value: taskdef});
                        
                        }
                    }
                }

            if (itemId) {

            paramitem = GENERALTOOLS.get_item_value_new(itemId);
            paramdata = paramitem.data;
            department = paramdata.getValue({fieldId: "department"});
            log.audit({title: "department", details: department});

            if (department)
            {
                context.newRecord.setValue({fieldId: "department", value: department});
                
            }
           
            }
        }
    }

    function beforeSubmit(context) {
        // ================================================================================
        // Set Customer PO Number and Sales Order Requested Ship Date
        // ================================================================================
        
      
        const currentRecordId = context.newRecord.id;
        log.audit({title: "context.type", details: context.type});
        

       
    }

    function afterSubmit(context) {
        // ================================================================================
        // Set Customer PO Number and Sales Order Requested Ship Date
        // ================================================================================
        
      
        const currentRecordId = context.newRecord.id;
        log.audit({title: "context.type", details: context.type});
        

       
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
})

