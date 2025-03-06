/**
 *@NApiVersion 2.1
 *@NScriptType MapReduceScript
 *@NModuleScope Public
 */
 var totreg;
 define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    
    function (runtime,log, search, record,email, GENERALTOOLS) {


        var getInputData = function getInputData(context) {

            var SO_IDORI = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpysc_SO_IDORI'
            });
            var SO_IDNEW = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpysc_SO_IDNEW'
            });
            var DATAPPD = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpysc_data'
            });
            var fsearch = JSON.parse(DATAPPD); 

            log.debug("fsearch",fsearch);
            log.debug("SO_IDORI",SO_IDORI);
            log.debug("SO_IDNEW",SO_IDNEW);

            totreg = fsearch.length;
           
            return fsearch;
        };
       
        var map = function map(context) {

            var fsearchId = context.key;
            var fresult = JSON.parse(context.value);

   

           
            context.write(fsearchId, fresult);

        };
        
        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);

            context.write(context.key, fresult);
        };

        var summarize = function summarize(context) {

            var SO_IDNEW = runtime.getCurrentScript().getParameter({
                name: 'custscript_cpysc_SO_IDNEW'
            });


            try { 
            
            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj.id);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var emaildest = paramemp.data.getValue({fieldId: "email"});

            log.debug("emaildest",emaildest);

            subject = "The copy is done";


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