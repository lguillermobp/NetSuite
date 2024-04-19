/**
 * @NScriptType UserEventScript
 * @NApiVersion 2.1
 */

define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
    var session = runtime.getCurrentSession();

    function beforeLoad(context) {
        const currentRecord = context.newRecord;
        
            context.form.addButton({
                id: "custpage_print", 
                label: "Show Bin Locations",
                functionName: `showbin("${currentRecord}")`
            })
            context.form.clientScriptModulePath = "./sdr_cs_itemreceipt.js";
        
    }

    function beforeSubmit(context) {
        
       
    }

    return {
        beforeLoad: beforeLoad
       // beforeSubmit: beforeSubmit
    }
})

