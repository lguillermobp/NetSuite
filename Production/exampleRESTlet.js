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
            var internalid=_ref.order;

            var rec = record.load({
                type: "cashsale",
                id: internalid,
                isDynamic: true
            })

            var salechannel=rec.getText({fieldId: "cseg_saleschann_new"})
            log.debug("internalid",internalid);

            return salechannel;
        }
         function post (_ref) {

            log.debug("_ref",_ref);

            return _ref;
        }


        return {
            get: get,
            post: post

        };
    });