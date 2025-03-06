/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search','N/ui/serverWidget','N/log','N/url', 'N/redirect',"N/ui/message","N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (s,serverWidget, log, url, redirect,message, runtime, GENERALTOOLS) {
    const onRequest = (scriptContext) => {
        if (scriptContext.request.method === 'GET') {

            SOID = scriptContext.request.parameters.idso;
            paramSO = GENERALTOOLS.get_SO_value(SOID);
            SONo = paramSO.data.getValue({fieldId: "tranid"});
            customerso = paramSO.data.getValue({fieldId: "entityname"});

            let form = serverWidget.createForm({
                title: 'Import MOs from Sales Contract '
            });

            var userObj = runtime.getCurrentUser();
           
            form.clientScriptModulePath = '/SuiteScripts/copysc/DashboardClient_cpysc.js';


            var fieldgroup1 = form.addFieldGroup({
                id : 'fieldgroupid1',
                label : 'New Sale Contract'
            });
            var fieldgroup2 = form.addFieldGroup({
                id : 'fieldgroupid2',
                label : 'Source Sale Contract'
            });

            let fieldscn = form.addField({
                id: 'salesordernew',
                type: serverWidget.FieldType.TEXT,
                label: 'Sale Contract New',
                container : 'fieldgroupid1'
            });

            fieldscn.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });
            fieldscn.defaultValue = SONo;

            let customer = form.addField({
                id: "custpage_customer",
                type: serverWidget.FieldType.TEXT,
                label: "Customer",
                container : 'fieldgroupid1'
            });
            customer.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });
            
            customer.defaultValue = customerso;


            let fieldsco = form.addField({
                id: 'salesorderorigen',
                type: serverWidget.FieldType.TEXT,
                label: 'Sale Contract Source',
                container : 'fieldgroupid2'
            });

            let customerori = form.addField({
                id: "custpage_customero",
                type: serverWidget.FieldType.TEXT,
                label: "Customer",
                container : 'fieldgroupid2'
            });
            customerori.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });
           
            let fsoidnew = form.addField({
                id: "custpage_soidnew",
                label: "SC Internal ID new",
                type: serverWidget.FieldType.TEXT,
            });

            fsoidnew.defaultValue = SOID;

            fsoidnew.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

            let fsoidori = form.addField({
                id: "custpage_soidori",
                label: "SC Internal ID origin",
                type: serverWidget.FieldType.TEXT,
            });

            fsoidori.updateDisplayType({
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
                type : serverWidget.SublistType.INLINEEDITOR,
                label: 'Items'
            });
            
            var slwoido = sublistpm.addField({
                id: "custrecordml_woido",
                type: serverWidget.FieldType.TEXT,
                label:'MO origin'
            });
            slwoido.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            var slitemd = sublistpm.addField({
                id: "custrecordml_itemo",
                type: serverWidget.FieldType.TEXT,
                label:'Item SC origin'
            });
            slitemd.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });
            var slworkordero = sublistpm.addField({
                id: "custrecordml_workordero",
                type: serverWidget.FieldType.TEXT,
                label:'Has MO origin'
            });
            slworkordero.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });

            var slwoidn = sublistpm.addField({
                id: "custrecordml_woidn",
                type: serverWidget.FieldType.TEXT,
                label:'MO New'
            });
            slwoidn.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            var slitem = sublistpm.addField({
                id: "custrecordml_itemn",
                type: serverWidget.FieldType.TEXT,
                label:'Item SC New'
            });
            slitem.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });
            var slworkordern = sublistpm.addField({
                id: "custrecordml_workordern",
                type: serverWidget.FieldType.TEXT,
                label:'Has MO New'
            });
            slworkordern.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });
            var willbecopied = sublistpm.addField({
                id: "custrecordml_willbecopied",
                type: serverWidget.FieldType.CHECKBOX,
                label:'Will be copied'
            });
            willbecopied.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });

            var lineCount = paramSO.data.getLineCount('item');
                log.debug("lineCount",lineCount);
                log.debug("paramSO",paramSO.data);

                for(var i = 0; i < lineCount; i++) {
                    
                    var item = paramSO.data.getSublistText({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_itemn',
                        line: i,
                        value: item
                    });


                    var moidn = paramSO.data.getSublistValue({
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

                    var workorder = paramSO.data.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'createwo',
                        line: i
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_workordern',
                        line: i,
                        value: workorder+" "
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
  
    return {onRequest}
});