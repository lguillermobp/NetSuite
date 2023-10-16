/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

 define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        const currentRecordId = context.newRecord.id;

       

        if (context.type === context.UserEventType.VIEW) {
            // ================================================================================
            // BOM PDF
            // ================================================================================
            const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1048&deploy=1&id=${currentRecordId}`

            context.form.addButton({
                id: "custpage_print",
                label: "BKS Print",
                functionName: `window.open('${printSuitelet}');`
            })
        }
    }

    function beforeSubmit(context) {
        // ================================================================================
        // Set Customer PO Number and Sales Order Requested Ship Date
        // ================================================================================
        const currentRecordId = context.newRecord.id;

        if (context.type === context.UserEventType.CREATE) {
            const soId = session.get({name: "soid"});
            if (soId) {
                const salesOrderBodyFields = search.lookupFields({
                    id: soId,
                    type: search.Type.SALES_ORDER,
                    columns: ["otherrefnum", "custbody_bkmn_req_ship_date"]
                })

                context.newRecord.setText({
                    fieldId: "custbody_bkmn_wo_cust_po_num",
                    text: salesOrderBodyFields.otherrefnum
                });

                context.newRecord.setText({
                    fieldId: "custbody_bkmn_wo_so_req_ship_date",
                    text: salesOrderBodyFields.custbody_bkmn_req_ship_date
                });
            }
        }

        if (context.type === context.UserEventType.EDIT) {
            try {
                let currentRecordBodyFields = search.lookupFields({
                    id: currentRecordId,
                    type: search.Type.WORK_ORDER,
                    columns: ["createdfrom"]
                });

                if (currentRecordBodyFields.createdfrom[0].value) {
                    const salesOrderBodyFields = search.lookupFields({
                        id: currentRecordBodyFields.createdfrom[0].value,
                        type: search.Type.SALES_ORDER,
                        columns: ["otherrefnum", "custbody_bkmn_req_ship_date"]
                    });

                    context.newRecord.setText({
                        fieldId: "custbody_bkmn_wo_cust_po_num",
                        text: salesOrderBodyFields.otherrefnum
                    });

                    context.newRecord.setText({
                        fieldId: "custbody_bkmn_wo_so_req_ship_date",
                        text: salesOrderBodyFields.custbody_bkmn_req_ship_date
                    });
                }
            } catch (e) {
            }
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    }
})

