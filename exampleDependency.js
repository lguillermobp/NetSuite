/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define (["N/ui/message"], function (message) {
    function ShowMessage() {
        message.create({
            title: "Hello, My Friend",
            message: "You have used a dependency correctly.",
            type: message.Type.CONFIRMATION
        }).show();
    }
    return {
        pageInit: ShowMessage
    };


});