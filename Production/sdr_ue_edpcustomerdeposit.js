/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/search", "N/runtime","N/log", "/SuiteScripts/Modules/generaltoolsv1.js"], function (record, search, runtime,log, GENERALTOOLS) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {

      
        const currentRecordId = context.newRecord.id;
        log.audit({title: "context.type", details: context.type});


        var userObj = runtime.getCurrentUser();
		var userID = userObj.id;
		var userPermission = userObj.getPermission({	name : 'TRAN_PURCHORD'	});
		autPO= userPermission === runtime.Permission.FULL ? 'FULL' : userPermission;
        log.audit({title: "autPO", details: autPO});
      

        if (context.type === context.UserEventType.VIEW) {
           

            
        }

        if (context.type === context.UserEventType.CREATE) {

            SOID = context.request.parameters.soid;

            if (SOID) {
                paramSO = GENERALTOOLS.get_SO_value(SOID);
                SONo = paramSO.data.getValue({fieldId: "tranid"});
                customerso = paramSO.data.getValue({fieldId: "entity"});

                context.newRecord.setValue({fieldId: "custbody_customer", value: customerso});
                context.newRecord.setValue({fieldId: "custbody_quote_sc", value: SOID});
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

