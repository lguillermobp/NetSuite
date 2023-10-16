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
            type: message.Type.CONFIRMATION,
            duration: 10000
        }).show();
    }
    return {
        pageInit: ShowMessage
    };


});