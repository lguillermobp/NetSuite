/**
 * saleOrderUE.ts
 *
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

import {EntryPoints} from "N/types";
export function before(context: EntryPoints.UserEvent.beforeLoadContext) {
if (context.type == context.UserEventType.VIEW) {
    context.form.addButton(  { id: "custpage_print", label: "Print Packing List", functionName : "printpackinglist"  });
    context.form.clientSriptModulePath = './salesOrderCL.js';

}


}