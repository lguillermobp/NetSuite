// 2.0 - Fluent
/**
 * @NApiVersion 2.0
 * @NScriptType suiteScript
 * @NModuleScope SameAccount
 * @appliedtorecord customer
 */
define(["N/record","N/ui/message"], function (r,message) {
    function onAfterSubmit(context) {
        var currentRecord = context.newRecord;
        var salesRepId = currentRecord.getValue({
            fieldId: "salesrep"
        });

        if (!salesRepId) {
            return;
        };

        var salesRepRec = r.load({
            type: r.Type.EMPLOYEE,
            id: salesRepId,
            isDynamic: false,
            defaultValues: null
        });

        var salesRepEmail = salesRepRec.getValue({
            fieldId: "email"
        });

        if (salesRepEmail) {
            sendAwesomeNotification(salesRepEmail);
        }
    }

    function sendAwesomeNotification(email) {
        message.create({
            title: "Under Construction " + email ,
            message: "this option will be done soon ",
            type: message.Type.CONFIRMATION,
            duration: 5000
        }).show();
    }

    return {
        afterSubmit: onAfterSubmit
    };
});