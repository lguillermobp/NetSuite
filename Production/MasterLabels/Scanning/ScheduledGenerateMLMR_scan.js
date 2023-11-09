/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (runtime,log, search, record,email, GENERALTOOLS) {

        var y=0;
        var irec=0;
        var getInputData = function getInputData(context) {


            return fsearch;
        };

        var map = function map(context) {

            log.debug('context.map', context);

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);
            context.write(customFulfillRecordId, customFulfillRecord);
        };

        var reduce = function reduce(context) {

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
                var chkdig=GENERALTOOLS.checkdigit(ML2)
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


        };

        var summarize = function summarize(context) {
        };



        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize

        };
    });


