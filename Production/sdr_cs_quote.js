/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var ecddays = [];
var ecdholydays = [];
define(['N/search','N/currentRecord','N/log',"N/record","N/ui/dialog"], function(s, currentRecord, log, record,dialog) {
    function pageInit(context) {

        datarec=context.currentRecord;
        // Code to be executed when the page loads
        log.debug("context",context);
        var po = datarec.getValue({
            fieldId: "otherrefnum"
        });
        log.debug("po",po);
    }

    function fieldChanged(context) {
        // Code to be executed when a field value changes
    }

    
  

    function saveRecord(context) {
        // Code to be executed when the record is saved
        return true;
    }


    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
});
