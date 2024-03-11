/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search",'N/record', 'N/error',"N/log"],
    function(search,record, error, log) {
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

            return;
        }
        // Delete a standard NetSuite record
        function _delete(context) {

            return ;
        }
        // Create a NetSuite record from request params
        function post(context) {
           


            return context;
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


        return {
            get: _get,
            delete: _delete,
            post: post,
            put: put
        };
    });

