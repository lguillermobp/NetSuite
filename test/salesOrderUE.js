/**
 * saleOrderUE.ts
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define([], function () {
    var exports= {};
    "use strict";
    function beforeLoad(context) {
        if (context.type == context.UserEventType.VIEW) {
            context.form.addButton(  { id: "custpage_print", label: "Generate Master Labels", functionName : "generateMasterLabels"  });
            context.form.clientSriptModulePath = '/SuiteScripts/MasterLabels/salesOrderCL.js';

        }

    }
    exports.beforeLoad = beforeLoad;
    return exports;
})