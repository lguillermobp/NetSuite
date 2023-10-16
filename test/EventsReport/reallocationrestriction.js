/**
 *@appliedtorecord reallocateIems
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(["N/record", "N/error", "N/runtime",'N/search','N/ui/serverWidget',"N/ui/message"],
    function (record, error, runtime, search,serverWidget, mess) {

        var currentUserID = runtime.getCurrentUser().id;

        //var allowedusers = [16, 44, 923, 936, 963, 1025, 1049, 1107, 104101, 51915, 51948, 55212, 452686, 508786,
        // 1211885];
        //var isallowedUser = allowedusers.indexOf(currentUserID);
        function beforeLoad(context) {
            var auth = findemp(currentUserID);
            log.debug({
                "title": "Access Log",
                "details": "Accessed By ID " + currentUserID + " Allowed To Reallocate? " + auth
            });
            if (auth!=true){
                ShowMessage();
                var errorObj = error.create({
                    message: 'You do not have permission to submit reallocations. Please contact IT for further assistance.'
                });
                throw errorObj;
            }
        }
        return {
            beforeLoad: beforeLoad
        };

        function findemp(id) {
            var employeeNameFieldLookUp = search.lookupFields({
                type: "employee",
                id: id ,
                columns: ["altname", "email", "custentityallowedtoreallocate"]
            });

            var altname = employeeNameFieldLookUp.altname;
            var email = employeeNameFieldLookUp.email;
            var custentityallowedtoreallocate = employeeNameFieldLookUp.custentityallowedtoreallocate;

            return custentityallowedtoreallocate;

        }
        function ShowMessage(context) {



        }

    });