/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/ui/message", "N/search", "N/runtime", "N/log", "/SuiteScripts/Modules/generaltoolsv1.js", 'N/https'], function (record, message, search, runtime, log, GENERALTOOLS, https) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {


        const currentRecordId = context.newRecord.id;
        log.audit({ title: "context.type", details: context.type });



        var userObj = runtime.getCurrentUser();
        var userID = userObj.id;
        var userPermission = userObj.getPermission({ name: 'TRAN_PURCHORD' });
        autPO = userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
        userPermission = userObj.getPermission({ name: 'TRAN_WORKORDER' });
        autWO = userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;

        wostatus = context.newRecord.getValue({ fieldId: "status" });

        if (context.type === context.UserEventType.VIEW) {
            // ================================================================================
            // BOM PDF
            // ================================================================================
            const printSuitelet = `/app/site/hosting/scriptlet.nl?script=1610&deploy=1&id=${currentRecordId}&opt=1`

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

                if (autWO == "FULL") {
                    log.audit({ title: "autWO", details: autWO });
                    const printSuitelet3 = "/app/site/hosting/scriptlet.nl?script=3564&deploy=1&idwo=" + currentRecordId;

                    context.form.addButton({
                        id: 'custpage_copywo',
                        label: 'Import from Manufacturing Order',
                        functionName: "window.open('" + printSuitelet3 + "');"
                    });
                }
            }

            if (wostatus == "Released" || wostatus == "In Progress") {

                if (autPO == "FULL") {
                    const printSuitelet2 = `/app/site/hosting/scriptlet.nl?script=2568&deploy=1&idwo=${currentRecordId}`

                    context.form.addButton({
                        id: "custpage_createpo",
                        label: "Create POs",
                        functionName: `window.open('${printSuitelet2}');`
                    })
                }
            }



        }

        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

            itemId = context.newRecord.getValue({ fieldId: "assemblyitem" });
            productionline = context.newRecord.getValue({ fieldId: "custbody_productionline" });
            section = context.newRecord.getValue({ fieldId: "custbody_ecdsection" });
            createfrom = context.newRecord.getValue({ fieldId: "createdfrom" });
            custbody_quote_sc = context.newRecord.getValue({ fieldId: "custbody_quote_sc" });
            ctc_id = context.newRecord.getValue({ fieldId: "custbody_vecd_ctc_id" });
            if (!context.newRecord.getValue({ fieldId: "custbody_quote_sc" })) {
                context.newRecord.setValue({ fieldId: "custbody_quote_sc", value: createfrom });
            }
            //context.newRecord.setValue({fieldId: "custbody_quote_sc", value: createfrom});


            if (section) {

                var sectionRecord = record.load({
                    type: 'customrecord_section',
                    id: section,
                    isDynamic: true
                });

                var stages = sectionRecord.getValue({ fieldId: 'custrecord_stages' });

                createdfrom = context.newRecord.getValue({ fieldId: "createdfrom" });

                var customrecord_pl_scheduletaskSearchObj = search.create({
                    type: "customrecord_pl_scheduletask",
                    filters:
                        [
                            ["custrecord158", "anyof", stages],
                            "AND",
                            ["custrecord_plst_productionline", "anyof", productionline]
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
                    "pageSize": 1000
                });

                pagedData.pageRanges.forEach(function (pageRange) {
                    var page = pagedData.fetch({ index: pageRange.index });
                    page.data.forEach(function (fresult1) {

                        taskdef = fresult1.getValue({ name: "custrecord_plst_task" });
                        taskdefd = fresult1.getText({ name: "custrecord_plst_task" });
                        context.newRecord.setValue({ fieldId: "custbody_scheduletaskid", value: taskdef });

                    });
                });


                if (taskdef && createdfrom) {
                    paramschedule = GENERALTOOLS.getScheduleParams(taskdefd, createdfrom);
                    paramdata = paramschedule.data;
                    if (paramdata) {

                        internalid = paramdata.getValue({ name: "internalid" });
                        context.newRecord.setValue({ fieldId: "custbody_tasksc", value: internalid });


                    }
                }
            }

            if (itemId) {

                paramitem = GENERALTOOLS.get_item_value_new(itemId);
                paramdata = paramitem.data;
                department = paramdata.getValue({ fieldId: "department" });

                if (department) {
                    context.newRecord.setValue({ fieldId: "department", value: department });

                }

            }
        }
    }
    function postViewECD(ctc_id, opt, datasending) {

        var headerObj = {
            "Content-Type": "application/json",
            "as-api-key": "asat_10477bd142bc4e678e169f9897d2eef1"
        };

        const bodyObj = JSON.stringify({
            "items": [
                {
                    "ctc_id": ctc_id,
                    "opt": opt
                }
            ],
            "send_notification": true
        });


        var response = https.get({
            url: "https://ecdsystem.pythonanywhere.com/api/ctc/" + ctc_id + "/" + opt + "/" + datasending + "/",
            body: bodyObj,
            headers: headerObj
        });

        return response;
    }

    function beforeSubmit(context) {
        // ================================================================================
        // Set Customer PO Number and Sales Order Requested Ship Date
        // ================================================================================


        const currentRecordId = context.newRecord.id;
        log.audit({ title: "context.type", details: context.type });



    }

    function afterSubmit(context) {
        // ================================================================================
        // Set Customer PO Number and Sales Order Requested Ship Date
        // ================================================================================


        const currentRecordId = context.newRecord.id;
        log.audit({ title: "context.type", details: context.type });

        if (context.type === context.UserEventType.CREATE) {

            itemId = context.newRecord.getValue({ fieldId: "assemblyitem" });
            productionline = context.newRecord.getValue({ fieldId: "custbody_productionline" });
            section = context.newRecord.getValue({ fieldId: "custbody_ecdsection" });
            createfrom = context.newRecord.getValue({ fieldId: "createdfrom" });
            custbody_quote_sc = context.newRecord.getValue({ fieldId: "custbody_quote_sc" });
            ctc_id = context.newRecord.getValue({ fieldId: "custbody_vecd_ctc_id" });
            if (!context.newRecord.getValue({ fieldId: "custbody_quote_sc" })) {
                context.newRecord.setValue({ fieldId: "custbody_quote_sc", value: createfrom });
            }

            if (ctc_id) {
                var opt = "GET";
                dataall = postViewECD(ctc_id, opt, 'NA')
                data = JSON.parse(dataall.body);
                dataheader = data.data.dataheader;
                datadetail = data.data.datadetail;
                var datadetail = data.data.datadetail;

                if (dataheader.ctc_ownerdonor.length > 0) {
                    if (dataheader.ctc_ownerdonor == "on") {
                        var wowner = true
                    }
                    else {
                        var wowner = false
                    }
                }
                var dynamicRecord = record.load({
                    type: context.newRecord.type,
                    id: context.newRecord.id, // Only if editing an existing record
                    isDynamic: true
                });

                for (var i = 0; i < datadetail.length; i++) {

                    if (wowner && datadetail[i].item_step_id == 1) continue;
                    var item = datadetail[i];


                    dynamicRecord.selectNewLine({
                        sublistId: 'item'
                    });
                    dynamicRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item.item_id // Replace 'YOUR_ITEM_ID' with the actual internal ID of an item
                    });
                    dynamicRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: item.ctc_item_qty
                    });

                    dynamicRecord.commitLine({
                        sublistId: 'item'
                    });
                }
                var recordId = dynamicRecord.save();
                dataall = postViewECD(ctc_id, 'SET', context.newRecord.id)
                log.debug("Record ID", recordId);
                log.debug("dataall", dataall);
            }
        }



    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
})

