/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/search", "N/runtime","N/log", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, search, runtime,log, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        const currentRecordId = context.newRecord.id;
        log.audit({title: "context.type", details: context.type});
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

            
        }

        if (context.type === context.UserEventType.CREATE) {

            itemId = context.newRecord.getValue({fieldId: "assemblyitem"});

            log.audit({title: "itemId", details: itemId});

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

        

       
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    }
})

