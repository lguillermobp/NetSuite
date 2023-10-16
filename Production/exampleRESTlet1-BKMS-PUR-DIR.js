/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(['N/record', 'N/error',"N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    function(record, error, log, GENERALTOOLS) {
        function doValidation(args, argNames, methodName) {
            for (var i = 0; i < args.length; i++)
                if (!args[i] && args[i] !== 0)
                    throw error.create({
                        name: 'MISSING_REQ_ARG',
                        message: 'Missing a required argument: [' + argNames[i] + '] for method: ' + methodName
                    });
        }
        // Get a standard NetSuite record
        function _get(context) {
            doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'GET');
            try {
                var ReturningRecord = transformCSToRARecord(context.id);
            } catch (e) {
                log.audit("error: " + String(e.message))

                return("error: " + String(e.message));
            }

            try {

                var ReturningRecordId = ReturningRecord.save();
                log.debug("ReturningRecordId",ReturningRecordId);

            } catch (e) {

                return("ERROR when try to do Return Authorization: " + String(e.message));

            }
            return JSON.stringify(ReturningRecord);
        }
        // Delete a standard NetSuite record
        function _delete(context) {
            doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'DELETE');
            record.delete({
                type: context.recordtype,
                id: context.id
            });
            return String(context.id);
        }
        // Create a NetSuite record from request params
        function post(context) {
            doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'POST');

            return context.recordtype;
        }


        // Upsert a NetSuite record from request param
        function put(context) {
            doValidation([context.recordtype, context.id], ['recordtype', 'id'], 'PUT');
            var rec = record.load({
                type: context.recordtype,
                id: context.id
            });
            for (var fldName in context)
                if (context.hasOwnProperty(fldName))
                    if (fldName !== 'recordtype' && fldName !== 'id')
                        rec.setValue(fldName, context[fldName]);
            rec.save();
            return JSON.stringify(rec);
        }
        var transformCSToRARecord = function transformCSToRARecord(csId) {

            return record.transform({
                fromType: "cashsale",
                fromId: parseInt(csId, 10),
                toType: "returnauthorization",
                isDynamic: false,
                defaultValues: {
                },

            });
        };
        return {
            get: _get,
            delete: _delete,
            post: post,
            put: put
        };
    });

     