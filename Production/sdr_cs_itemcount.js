/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/search','N/currentRecord','N/log',"N/record","N/ui/dialog", "/SuiteScripts/Modules/generaltoolsv1.js"], function(s, currentRecord, log, record,dialog, GENERALTOOLS) {
    function pageInit(context) {

        log.debug("context.modePI",context.mode);
        log.debug("context.currentRecordPI",context.currentRecord);
        
    }

    function fieldChanged(context) {


        // Code to be executed when a field value changes
    }


    function saveRecord(context) {

        log.debug("context.modeSV",context.mode);
        log.debug("context.currentRecordSV",context.currentRecord);

        return true;
    }


   
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    };
});
