/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(["N/runtime",'N/log', 'N/search', 'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"],
    function (runtime,log, search, record,email, GENERALTOOLS, MLTOOLS) {

        var y=0;
        var irec=0;
        var getInputData = function getInputData(context) {
            var script = runtime.getCurrentScript();
            log.debug("script",script);
            log.debug("context",context);


            var WOID = runtime.getCurrentScript().getParameter({
                name: 'custscript_mrwoid'
            });
            var startsscc = Number(runtime.getCurrentScript().getParameter({
                name: 'custscript_mrstartsscc'
            }));
            var startcases = Number(runtime.getCurrentScript().getParameter({
                name: 'custscript_mrstartcases'
            }));

            log.debug("WOID",WOID);
            log.debug("startsscc",startsscc);
            log.debug("startcases",startcases);

            var workorderSearchObj = search.create({
                type: "workorder",
                filters:
                    [
                        ["type","anyof","WorkOrd"],
                        "AND",
                        ["internalid","anyof",WOID],
                        "AND",
                        ["mainline","is","T"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "ordertype",
                            sort: search.Sort.ASC
                        }),
                        "mainline",
                        "trandate",
                        "asofdate",
                        "postingperiod",
                        "taxperiod",
                        "type",
                        "tranid",
                        "entity",
                        "account",
                        "memo",
                        "amount",
                        "custbody_ns_pos_transaction_status",
                        "custbody_nsts_vp_prepay_total",
                        "custbody4",
                        "custbody6",
                        "custbody_canceldate",
                        "line.cseg_saleschann_new",
                        "cseg_saleschann_new"
                    ]
            });

            var script = runtime.getCurrentScript();
            log.debug("script",script);
            log.debug("context",context);


            var WOID = runtime.getCurrentScript().getParameter({
                name: 'custscript_mrwoid'
            });
            var startsscc = Number(runtime.getCurrentScript().getParameter({
                name: 'custscript_mrstartsscc'
            }));
            var startcases = Number(runtime.getCurrentScript().getParameter({
                name: 'custscript_mrstartcases'
            }));

            log.debug("WOID",WOID);
            log.debug("startsscc",startsscc);
            log.debug("startcases",startcases);

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
            if (!SOID) {SOID= paramWO.data.getValue({fieldId: "custbody_so_manual"});}
            entity = paramWO.data.getValue({fieldId: "entity"});
            var paramcust=GENERALTOOLS.get_customer_value (entity)
            var formsscc= paramcust.data.getValue({fieldId: "custentity_formforsscc"});
            log.debug("formsscc",formsscc);
            woquantity = paramWO.data.getValue({fieldId: "quantity"});


            var paramrec = GENERALTOOLS.get_param_value(9);
            var vendorssccparam = paramrec.data.getValue({fieldId: "custrecordparams_value"});

            log.debug("custbodytotalboxes",custbodytotalboxes);
            var i=0;
            var lastml="";
            if ((custbodytotalboxes-startcases)<1500)
            {limit=custbodytotalboxes-startcases+1;}
            else
            {limit=1500;}

            for (i=0;i<limit;i++) {
                log.debug("i",i);
                var MasterLabel = record.create({
                    type: "customrecordmasterlabels",
                    isDynamic: false,
                    defaultValues: null
                });

                MasterLabel.setValue({
                    fieldId: "custrecordml_form",
                    value: formsscc,
                    ignoreFieldChange: false
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
                    fieldId: "custrecordml_sointernalid",
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
                    fieldId: "ccustrecordml_palletnumber",
                    value: 0
                });
                MasterLabel.setValue({
                    fieldId: "name",
                    value: ML2
                });
                lastml=ML2;
                MasterLabel.setValue({
                    fieldId: "custrecordml_partialbox",
                    value: partialbox
                });

                MasterLabel.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });

            }
            if (lastml.length>0) {
                var ok = record.submitFields({
                    type: "customrecord_formsscc",
                    id: formsscc,
                    values: {
                        custrecord_sscc_last: lastml
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
            }


            return workorderSearchObj;
        };

        var map = function map(context) {


            log.debug('context.map', context);

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);
            context.write(customFulfillRecordId, customFulfillRecord);
        };

        var reduce = function reduce(context) {


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


