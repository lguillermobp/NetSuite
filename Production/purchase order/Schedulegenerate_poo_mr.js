/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (runtime,log, search, record,email, GENERALTOOLS) {

        var getInputData = function getInputData(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_memo'
            });

            log.debug("PPDID",PPDID);
            log.debug("DATE_PO",DATE_PO);
            log.debug("MEMO",MEMO);

            var fsearch = search.create({
                type: "customrecord_ppd",
                filters:
                [
                    ["custrecord_ppd_code.custrecord_poid","anyof","@NONE@"], 
                    "AND", 
                    ["custrecord_ppd_id","anyof",PPDID]
                 ],
                
                columns:
                [
                    "custrecord_ppd_productionline",
                    "custrecord_ppd_task",
                    search.createColumn({
                        name: "custrecord_so_sc_startdate",
                        join: "CUSTRECORD_PPD_TASK"
                    }),
                    search.createColumn({
                        name: "custrecord_so_sc_enddate",
                        join: "CUSTRECORD_PPD_TASK"
                    }),
                    "custrecord_ppd_leadtime",
                    search.createColumn({
                        name: "custrecord_ppd_vendor",
                        sort: search.Sort.ASC
                    }),
                    search.createColumn({
                        name: "custrecord_ppd_item",
                        sort: search.Sort.ASC
                    }),
                    search.createColumn({
                        name: "custrecord_ppd_customer",
                        sort: search.Sort.ASC
                    }),
                    "custrecord_ppd_quantity",
                    "custrecord_ppd_currency",
                    "custrecord_ppd_amount",
                    "custrecord_ppd_amountdollar",
                    "custrecord_ppd_date",
                    "custrecord_purchaseunit",
                    "created",
                    "custrecord_ppd_code",
                    "custrecord_ppd_duedate",
                    "custrecord_ppd_id",
                    "custrecord_ppd_price",
                    "custrecord_ppd_status",
                    search.createColumn({
                       name: "custentity_noppdbatching",
                       join: "CUSTRECORD_PPD_VENDOR"
                    }),
                    search.createColumn({
                       name: "internalid",
                       join: "CUSTRECORD_PPD_TASK"
                    }),
                    search.createColumn({
                       name: "custrecord_so_sc_task",
                       join: "CUSTRECORD_PPD_TASK"
                    }),
                    search.createColumn({
                       name: "quantityavailable",
                       join: "CUSTRECORD_PPD_ITEM"
                    }),
                    search.createColumn({
                       name: "quantityonorder",
                       join: "CUSTRECORD_PPD_ITEM"
                    }),
                    search.createColumn({
                       name: "purchaseunit",
                       join: "CUSTRECORD_PPD_ITEM"
                    }),
                    search.createColumn({
                       name: "unitstype",
                       join: "CUSTRECORD_PPD_ITEM"
                    }),
                    search.createColumn({
                       name: "custrecord_poid",
                       join: "CUSTRECORD_PPD_CODE"
                    })
                ]
            });
          
           
            return fsearch;
        };

        var map = function map(context) {

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);

            context.write(customFulfillRecordId, customFulfillRecord);

        };

        var reduce = function reduce(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_memo'
            });

            log.debug("PPDID",PPDID);
            log.debug("DATE_PO",DATE_PO);
            log.debug("MEMO",MEMO);

            var fresult = JSON.parse(context.values[0]);

            log.audit("fresult",fresult);

            var productionline = fresult.values["custrecord_ppd_productionline"].value;
            prodlinetext=fresult.values["custrecord_ppd_productionline"].text;
            var task = fresult.values["custrecord_ppd_task"].value;
            var taskd = fresult.values["custrecord_so_sc_startdate.CUSTRECORD_PPD_TASK"];

            var ppdpot = fresult.values["custrecord_ppd_code"].value;
            
            var customerid = fresult.values["custrecord_ppd_customer"].value;

            var vendorid = fresult.values["custrecord_ppd_vendor"].value;

            var taskds = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_taskds',
            line: i });
            var podate = fresult.values["custrecord_ppd_vendor"];
            var leadtime = currentRec.getSublistValue({sublistId: 'custpage_records',fieldId: 'custrecordml_leadtime',
            line: i });


            log.audit("prodlinetext",prodlinetext);
            log.debug("prodlinevalue",prodlinevalue);
            
            context.write(context.key, salesOrderData);
        };

        var summarize = function summarize(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_ppdid'
            });
/*
            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The generation of Batch printer lot ("+PPDID+ ") is done";


            email.send({
                author : userObj.id,
                recipients : emaildest,
                subject : subject,
                body : subject
            });
            */

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });