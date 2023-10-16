/**
 * saleOrderUE.ts
 *
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

import {EntryPoints} from "N/types";

export function beforeLoad(context: EntryPoints.UserEvent.beforeLoadContext) {
if (context.type == context.UserEventType.VIEW) {
    context.form.addButton(  { id: "custpage_print", label: "Generate Master Labels", functionName : "generateMasterLabels"  });
    context.form.clientSriptModulePath = './salesOrderCL.js';

        }
    }
