/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */

 define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (runtime,log, search, record,email, GENERALTOOLS) {

        var getInputData = function getInputData(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_memo'
            });
            var DATAPPD = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_data'
            });
            var fsearch = JSON.parse(DATAPPD);

        
           
            return fsearch;
        };
        var PPDCodeID=0;
        var tppdpo="";
        var totpo=0;
        var map = function map(context) {

            var fsearchId = context.key;
            var fresult = JSON.parse(context.value);

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_ppdid'
            });
            var DATE_PO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_datepo'
            });
            var MEMO = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_memo'
            });
            var custpageDate = new Date(DATE_PO);
           
            context.write(fsearchId, fresult);

        };
        
        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);

            context.write(context.key, fresult);
        };

        var summarize = function summarize(context) {

            var PPDID = runtime.getCurrentScript().getParameter({
                name: 'custscript_poo_ppdid'
            });

            log.debug("PPDID",PPDID);

            try { 
            var paramppd = GENERALTOOLS.get_PPDID(PPDID);
            var PPDNAME = paramppd.data.getValue({fieldId: "name"});

            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The generation of PPD ("+PPDNAME+ ") is done";


            email.send({
                author : userObj.id,
                recipients : emaildest,
                subject : subject,
                body : subject
            });
        } catch (e) {
            log.error("error",e);
        }

        };

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
        };
    });