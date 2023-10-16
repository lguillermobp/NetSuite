/**
 * saleOrderUE.js
 *
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define([], function () {
    var exports={};
    "use strict";
    Object.defineProperties(exports, "__esModule", {value: true});
    function beforeLoad(context) {
        if (context.type == context.UserEventType.VIEW) {
            context.form.addButton({
                id: "custpage_print",
                label: "Generate Master Labels",
                functionName: "generateMasterLabels"
            });
            context.form.clientSriptModulePath = 'sdr_cs_workorder.js';
        }

    }
    exports.beforeLoad= beforeLoad;
    return exports;

});