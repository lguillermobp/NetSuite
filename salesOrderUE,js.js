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
                label: "Print Packing List",
                functionName: "printpackinglist"
            });
            context.form.clientSriptModulePath = './salesOrderCL.js';
        }

    }


})