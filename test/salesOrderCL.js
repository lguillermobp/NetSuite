/**
 * saleOrderCL.js
 *
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(["N/currentRecord", "N/url","N/ui/message"], function (cr, url, message) {

    var exports={};
    var customerId;
    function pageInit(context) {
         customerId = context.get().getValue({"fieldId": "entity"});
    }

    function generateMasterLabels() {

        message.create({
            title: "You have clicked it " + customerId,
            message: "You are the best.",
            type: message.Type.CONFIRMATION,
            duration: 2000
        }).show();


    }
    exports.pageInit = pageInit;
    exports.generateMasterLabels = generateMasterLabels;
    return exports;

});