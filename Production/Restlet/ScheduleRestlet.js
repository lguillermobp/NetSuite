"use strict";

/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record", "N/log", "/SuiteScripts/Modules/generaltoolsv1.js"],
    /**
     * @param {N/search} search
     * @param {N/record} record
     * @return {{post: exports.post}}
     */
    function (search, record, log, GENERALTOOLS) {

        function get(_ref) {

            return _ref;
        }

        function post(context) {

            try {
                contextjson = JSON.parse(context);
            }
            catch (e) {
                log.debug("error", e);
                contextjson = context;
            }
            log.debug("context", contextjson);
            var option = contextjson.option;
            log.debug("option", option);


            idsearch = "customsearch_ecd_schedule";

            var fsearch = search.load({
                id: idsearch
            });

            if (option == "U") {

                var defaultFilters = fsearch.filters;
                var customFilters = [];

                customFilters = {
                    name: "lastmodifieddate",
                    operator: "within",
                    values: "today",
                    isor: false,
                    isnot: false,
                    leftparens: 0,
                    rightparens: 0

                };

                defaultFilters.push(customFilters);
                fsearch.filters = defaultFilters;
            }

            var pagedData = fsearch.runPaged({
                "pageSize": 1000
            });
            var i = 0;
            var dataf = [];
            pagedData.pageRanges.forEach(function (pageRange) {
                log.audit(pageRange.index);
                var page = pagedData.fetch({ index: pageRange.index });
                page.data.forEach(function (fresult1) {

                    dataf[i] = {
                        "productionline_id": Number(fresult1.getValue({ name: "custrecord_sc_productionline", join: "CUSTRECORD_SO_SC_TASK" })),
                        "productionline_name": fresult1.getText({ name: "custrecord_sc_productionline", join: "CUSTRECORD_SO_SC_TASK" }),
                        "task_id": Number(fresult1.getValue({ name: "internalid" })),
                        "tasks_id": Number(fresult1.getValue({ name: "internalid", join: "CUSTRECORD_SO_SC_TASK" })),
                        "task_name": fresult1.getValue({ name: "custrecord_sc_task", join: "CUSTRECORD_SO_SC_TASK" }),
                        "task_seq": Number(fresult1.getValue({ name: "custrecord_sc_tasksseq", join: "CUSTRECORD_SO_SC_TASK" })),
                        "task_sts": fresult1.getText({ name: "custrecord_so_sc_status" }),
                        "task_note": fresult1.getValue({ name: "custrecord_so_sc_note" }),
                        "task_startdate": fresult1.getValue({ name: "custrecord_so_sc_startdate" }),
                        "task_enddate": fresult1.getValue({ name: "custrecord_so_sc_enddate" }),
                        "task_duration": fresult1.getValue({ name: "custrecord_sc_soduration" }),
                        "salescontract_id": Number(fresult1.getValue({ name: "internalid", join: "CUSTRECORD_SALECONTRACT" })),
                        "group_by": fresult1.getText({ name: "custrecord_sc_tasksgroup", join: "CUSTRECORD_SO_SC_TASK" }),
                        "progress": Number(fresult1.getValue({ name: "custrecord_so_sc_progress" })),
                        "lastmodified_by": fresult1.getValue({ name: "custrecord_so_sc_user" }),
                        "sc_bay": fresult1.getText({ name: "custbody_bay", join: "CUSTRECORD_SALECONTRACT" }),
                        "sc_bay_id": Number(fresult1.getValue({ name: "custbody_bay", join: "CUSTRECORD_SALECONTRACT" })),
                    }
                    i++;

                })
            })

            return dataf;
        }


        return {
            get: get,
            post: post

        };
    });