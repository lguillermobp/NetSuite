/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(["N/log","N/record","N/search", 'N/ui/dialog',"N/runtime"], function(log, record, search, nDialog,runtime) {
    function pageInit(context) {
        // Code to execute when the page loads
        var currentRecord = context.currentRecord;
        var subsidiaryId = currentRecord.getValue({ fieldId: "subsidiary" });

        // Load the subsidiary record
        var subsidiaryRecord = record.load({
            type: record.Type.SUBSIDIARY,
            id: subsidiaryId,
            isDynamic: false
        });

        var shippingAddress = currentRecord.getValue({ fieldId: "shippingaddress_text" });
        

        if (!shippingAddress) {
           
            currentRecord.setValue({ fieldId: "shippingaddress_text", value: subsidiaryRecord.getValue({ fieldId: "shippingaddress_text" }) });
            log.debug("shippingAddress", currentRecord.getValue({ fieldId: "shippingaddress_text" }));
        }
    }

    function fieldChanged(context) {
        // Code to execute when a field value changes
    }

    function saveRecord(context) {
        // Code to execute when the record is saved
    }

    return {
        pageInit: pageInit
        //fieldChanged: fieldChanged,
       // saveRecord: saveRecord
    };
});
