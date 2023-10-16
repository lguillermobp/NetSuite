/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 * @NScriptId customscript_sdr_journalentry
 */

define(["N/record", "N/search", "N/runtime", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, search, runtime, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        const currentRecordId = context.newRecord.id;
        var currRec = context.currentRecord;
        var userObj = runtime.getCurrentUser();
        var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
        var approveje=paramemp.data.getValue({fieldId: "custentity_approveje"});
        var userPermission = userObj.getPermission({	name : 'TRAN_JOURNALAPPRV'	});
        var autAB= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
        var stsapp = currRec.getValue({fieldId: "approvalstatus"});
        var userje = currRec.getValue({fieldId: "nluser"});

        currRec.setValue({fieldId: "custentity_approveje", value: approveje});

        if (context.type === context.UserEventType.CREATE) {
            currRec.setValue({fieldId: "approvalstatus", value: 1});
        }

        if (context.type === context.UserEventType.VIEW) {
            if (stsapp=='1') {
                if(approveje) {
                    currRec.setValue({fieldId: "approvalstatus", value: 2});
                }
                else {
                    context.form.addButton({
                        id: "custpage_gml",
                        label: "Submit for Approval",
                        functionName: submitforapproval()
                    })
                }


            }



        }
    }



    return {
        beforeLoad: beforeLoad,
    }
})
