/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
*/

define(["N/record"],
    function(record) {
        function beforeLoad(scriptContext) {
            if (scriptContext.type === "view") {

                var link = "/app/site/hosting/scriptlet.nl?script=1018&deploy=1" +
                    "&id=" + scriptContext.newRecord.id +
                    "&type=" + scriptContext.newRecord.type;

                scriptContext.form.addButton({
                    id: 'custpage_print_pallet_ticket',
                    label: 'Print Pallet Tickets',
                    functionName: "window.open('" + link + "');"
                });
            }
        }

        return {
            beforeLoad: beforeLoad
        };
    });