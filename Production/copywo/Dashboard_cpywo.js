/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/ui/serverWidget', 'N/log', 'N/url', 'N/redirect', "N/ui/message", "N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (s, serverWidget, log, url, redirect, message, runtime, GENERALTOOLS) {
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {

                WOID = scriptContext.request.parameters.idwo;
                paramWO = GENERALTOOLS.get_WO_value(WOID);
                WONo = paramWO.data.getValue({ fieldId: "tranid" });
                customerwo = paramWO.data.getValue({ fieldId: "entityname" });

                let form = serverWidget.createForm({
                    title: 'Import MOs from Main MO'
                });

                var userObj = runtime.getCurrentUser();

                form.clientScriptModulePath = '/SuiteScripts/copywo/DashboardClient_cpywo.js';


                var fieldgroup1 = form.addFieldGroup({
                    id: 'fieldgroupid1',
                    label: 'New Manufacturing Order'
                });
                var fieldgroup2 = form.addFieldGroup({
                    id: 'fieldgroupid2',
                    label: 'Source Manufacturing Order'
                });

                let fieldscn = form.addField({
                    id: 'workordernew',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Main MO',
                    container: 'fieldgroupid1'
                });

                fieldscn.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                fieldscn.defaultValue = WONo;

                let customer = form.addField({
                    id: "custpage_customer",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer",
                    container: 'fieldgroupid1'
                });
                customer.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });

                customer.defaultValue = customerwo;


                let fieldsco = form.addField({
                    id: 'workorderorigen',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Main MO',
                    container: 'fieldgroupid2'
                });

                let customerori = form.addField({
                    id: "custpage_customero",
                    type: serverWidget.FieldType.TEXT,
                    label: "Customer",
                    container: 'fieldgroupid2'
                });
                customerori.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });

                let fwoidnew = form.addField({
                    id: "custpage_woidnew",
                    label: "MO Internal ID new",
                    type: serverWidget.FieldType.TEXT,
                });

                fwoidnew.defaultValue = WOID;

                fwoidnew.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                let fwoidori = form.addField({
                    id: "custpage_woidori",
                    label: "MO Internal ID origin",
                    type: serverWidget.FieldType.TEXT,
                });

                fwoidori.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                let userid = form.addField({
                    id: "custpage_userid",
                    label: "User ID",
                    type: serverWidget.FieldType.TEXT,
                });

                userid.defaultValue = userObj.id;

                userid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                form.addSubmitButton({
                    label: 'Submit'
                });


                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type: serverWidget.SublistType.INLINEEDITOR,
                    label: 'Items'
                });

                var slwoido = sublistpm.addField({
                    id: "custrecordml_woido",
                    type: serverWidget.FieldType.TEXT,
                    label: 'MO origin'
                });
                slwoido.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var slitemd = sublistpm.addField({
                    id: "custrecordml_itemo",
                    type: serverWidget.FieldType.TEXT,
                    label: 'Item SC origin'
                });
                slitemd.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                var slworkordero = sublistpm.addField({
                    id: "custrecordml_workordero",
                    type: serverWidget.FieldType.TEXT,
                    label: 'Has MO origin'
                });
                slworkordero.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });

                var slwoidn = sublistpm.addField({
                    id: "custrecordml_woidn",
                    type: serverWidget.FieldType.TEXT,
                    label: 'MO New'
                });
                slwoidn.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var slitem = sublistpm.addField({
                    id: "custrecordml_itemn",
                    type: serverWidget.FieldType.TEXT,
                    label: 'Item SC New'
                });
                slitem.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                var slworkordern = sublistpm.addField({
                    id: "custrecordml_workordern",
                    type: serverWidget.FieldType.TEXT,
                    label: 'Has MO New'
                });
                slworkordern.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
                var willbecopied = sublistpm.addField({
                    id: "custrecordml_willbecopied",
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'Will be copied'
                });
                willbecopied.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });

                var lineCount = paramWO.data.getLineCount('item');
                log.debug("lineCount", lineCount);
                log.debug("paramWO", paramWO.data);

                for (var i = 0; i < lineCount; i++) {

                    var item = paramWO.data.getSublistText({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemn',
                        line: i,
                        value: item
                    });


                    var moidn = paramWO.data.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'woid',
                        line: i
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_woidn',
                        line: i,
                        value: moidn + " "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemo',
                        line: i,
                        value: " "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_woido',
                        line: i,
                        value: " "
                    });

                    var workorder = paramWO.data.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'createwo',
                        line: i
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_workordern',
                        line: i,
                        value: workorder + " "
                    });


                    var willbecopied = "F";
                    sublistpm.setSublistValue({
                        id: 'custrecordml_willbecopied',
                        line: i,
                        value: willbecopied
                    });

                }

                scriptContext.response.writePage(form);
            }
        }

        return { onRequest }
    });