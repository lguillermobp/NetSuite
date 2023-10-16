define(['N/record', 'N/log'], function (r, log) {
    /**
     * Example 1; calc
     * @export suitelet-results
     *
     * @author Luis Barrios
     *
     * @requires N/record
     *
     * @requires N/log
     *
     * @NApiVersion 2.0
     * @ModuleScope SameAccount
     * @NScriptType UserEventScript
     *
     */
function onAfterSubmit(context) {

        log.audit({title: "Load Employee"});

        var currentRecord = context.newRecord;
        var salesRepId = currentRecord.getValue({
            fieldId: "salesrep"
        });

   if (!salesRepId) {
       return;
   }

   var salesRepRec = r.load({
       type: r.Type.EMPLOYEE,
       id: salesRepId,
       isDynamic: false,
       defaultValues: null
   });
   var salesRepEmail = salesRepEmail.getValue({
       fieldId: "email"
   });
   if (salesRepEmail) {
       sendAwesomeNotification(salesRepEmail);
   }

   function sendAwesomeNotification(email) {


   }
    }

});