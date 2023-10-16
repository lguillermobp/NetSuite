/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @NScriptId customscript_ScheduledDeleteML_wo
 */
define(['N/log','N/record', 'N/runtime',"/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"],

    function(log, record, runtime, GENERALTOOLS, MLTOOLS) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(context) {

            var script = runtime.getCurrentScript();
            log.debug("script",script);


            var WOID = runtime.getCurrentScript().getParameter({
                name: 'custscriptwoiddelete'
            });
            log.debug("WOID",WOID);
            var qtydel = MLTOOLS.delete_ML_WO(WOID);
      
            
        }

        var cont=0;


        return {    execute: execute };

    });