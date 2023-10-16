/**
 *@appliedtorecord reallocateIems
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(["N/record", "N/error", "N/runtime"],
    function (record, error, runtime) {
        var currentUserID = runtime.getCurrentUser().id;
        var allowedusers = [16, 44, 923, 936, 963, 1025, 1049, 1107, 104101, 51915, 51948, 55212, 452686, 508786, 1211885];
        var isallowedUser = allowedusers.indexOf(currentUserID);
        function beforeLoad(context) {
            log.debug({
                "title": "Access Log",
                "details": "Accessed By ID " + currentUserID + " Array Check " + isallowedUser
            });
            if(isallowedUser == '-1'){
                var errorObj = error.create({
                    message: 'You do not have permission to submit reallocations. Please contact IT for further assistance.'
                });
                throw errorObj;
            }
        }
        return {
            beforeLoad: beforeLoad
        };

    });