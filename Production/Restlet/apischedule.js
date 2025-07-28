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
            // Convert date from YYYY-MM-DD to MM-DD-YYYY
            if (contextjson.task_startdate) {
                var parts = contextjson.task_startdate.split("-");
                if (parts.length === 3) {
                    contextjson.task_startdate = parts[1] + "/" + parts[2] + "/" + parts[0];
                }
            }
            if (contextjson.task_enddate) {
                var parts = contextjson.task_enddate.split("-");
                if (parts.length === 3) {
                    contextjson.task_enddate = parts[1] + "/" + parts[2] + "/" + parts[0];
                }
            }
            log.debug("task_startdate", contextjson.task_startdate);
            log.debug("task_enddate", contextjson.task_enddate);
            rec.setValue({
                fieldId: 'custrecord_so_sc_startdate',
                value: new Date(contextjson.task_startdate)
            });
            rec.setValue({
                fieldId: 'custrecord_so_sc_enddate',
                value: new Date(contextjson.task_enddate)
            });

            var recId = rec.save();
            log.debug('Record Created', 'ID: ' + recId);

            return recId;
        }


        return {
            get: get,
            post: post

        };
    });