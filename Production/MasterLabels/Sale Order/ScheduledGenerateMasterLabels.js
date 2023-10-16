/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
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
                name: 'custscriptwoid'
            });
            var startsscc = runtime.getCurrentScript().getParameter({
                name: 'custscriptstartsscc'
            });
            var startcases = runtime.getCurrentScript().getParameter({
                name: 'custscriptstartcases'
            });

            log.debug("WOID",WOID);

            paramWO = GENERALTOOLS.get_WO_value(WOID);
            custbodytotalboxes = paramWO.data.getValue({fieldId: "custbodytotalboxes"});
            custbodytotalpallets = paramWO.data.getValue({fieldId: "custbodytotalpallets"});
            custbodycasespermasterbox = paramWO.data.getValue({fieldId: "custbodycasespermasterbox"});
            custbodyboxesperpallet = paramWO.data.getValue({fieldId: "custbodyboxesperpallet"});
            custbody_bkmn_wo_cust_po_num = paramWO.data.getValue({fieldId: "custbody_bkmn_wo_cust_po_num"});
            entityname = paramWO.data.getValue({fieldId: "entityname"});
            enddate = paramWO.data.getValue({fieldId: "enddate"});
            assemblyitem = paramWO.data.getValue({fieldId: "assemblyitem"});
            startdate = paramWO.data.getValue({fieldId: "startdate"});
            custbody_bkmn_wo_cust_po_num = paramWO.data.getValue({fieldId: "custbody_bkmn_wo_cust_po_num"});
            var SOID= paramWO.data.getValue({fieldId: "createdfrom"});

            woquantity = paramWO.data.getValue({fieldId: "quantity"});


            var paramrec = GENERALTOOLS.get_param_value(9);
            var vendorssccparam = paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var i=0;

            for (i=0;i<custbodytotalboxes;i++) {

                var MasterLabel = record.create({
                    type: "customrecordmasterlabels",
                    isDynamic: false,
                    defaultValues: null
                });

                MasterLabel.setValue({
                    fieldId: "custrecordml_workorder",
                    value: WOID,
                    ignoreFieldChange: false
                });
                MasterLabel.setValue({
                    fieldId: "custrecordml_saleorder",
                    value: SOID,
                    ignoreFieldChange: false
                });
                MasterLabel.setValue({
                    fieldId: "custrecordml_status",
                    value: "01"
                });
                MasterLabel.setValue({
                    fieldId: "custrecordml_product",
                    value: assemblyitem
                });

                var partialbox=false;
                if (custbodycasespermasterbox>woquantity) {
                    custbodycasespermasterbox=woquantity;
                    partialbox=true;
                }
                woquantity-=custbodycasespermasterbox;

                MasterLabel.setValue({
                    fieldId: "custrecordml_caseqty",
                    value: custbodycasespermasterbox
                });
                var ML="0000"+vendorssccparam+"00000000";
                var ML1=Number(ML)+Number(startsscc+i);
                var ML2="0000"+ML1;
                var chkdig=MLTOOLS.checkdigit(ML2)
                ML2 += chkdig;


                MasterLabel.setValue({
                    fieldId: "custrecordml_ssccnumber",
                    value: ML2
                });
                MasterLabel.setValue({
                    fieldId: "custrecordml_validchecker",
                    value: chkdig
                });
                MasterLabel.setValue({
                    fieldId: "custrecordml_casenumber",
                    value: startcases+i
                });
                MasterLabel.setValue({
                    fieldId: "name",
                    value: ML2
                });
                MasterLabel.setValue({
                    fieldId: "custrecordml_partialbox",
                    value: partialbox
                });

                MasterLabel.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });

            }

            generateML();
    }

var cont=0;

        function generateML() {


            log.debug("custbody_bkmn_wo_cust_po_num",custbody_bkmn_wo_cust_po_num);

        }


return {    execute: execute };

});