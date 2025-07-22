"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record",  "N/log","/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (search, record, log, GENERALTOOLS) {

         function get (_ref) {

            return _ref;
        }

         function post (context) {
            log.debug("context", context);

                try {
                    data = JSON.parse(context);
                    }
                    catch (e) {
                        log.debug("error",e);
                        data = context;
                    }
            log.debug("data", data);
            var contextjson = data.data;
            log.debug("contextjson", contextjson);
            log.debug("contextjson.username", contextjson.username);

            var rec = record.load({
                type: 'customrecord_so_scheduletasks',
                id: contextjson.task_id,
                isDynamic: true
            });

            // Example: set fields from contextjson
            // Replace 'custrecord_field1', 'custrecord_field2' with actual field IDs
            if (contextjson.lastmodified_by) {
                rec.setValue({
                    fieldId: 'custrecord_so_sc_user',
                    value: contextjson.lastmodified_by
                });
            }
            
            rec.setValue({
                fieldId: 'custrecord_so_sc_note',
                value: contextjson.task_note
            });
         
            if (contextjson.progress) {
                rec.setValue({
                    fieldId: 'custrecord_so_sc_progress',
                    value: contextjson.progress
                });
            }
            var recId = rec.save();
            log.debug('Record Created', 'ID: ' + recId);

            return recId;
        }


        return {
            get: get,
            post: post

        };
    });