/**
 * @NScriptType ClientScript
 * @NApiVersion 2.x
 *
 */

define(['N/url',"N/email","N/ui/message","N/ui/dialog","N/format","N/runtime","N/currentRecord", "N/error", "N/record","N/log", "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/helptools.js"],
    /**
     *
     * @param currentRecord
     * @param error
     */
    function (url,email,message,dialog, format,runtime,currentRecord, error,record,log, GENERALTOOLS,HELPTOOLS) {

    var barcode;



        function pageInit(context) {
            log.debug("context",context);
            var currRec = context.currentRecord;
            var boxesinpallet = currRec.getLineCount({"sublistId": "custpage_palletpm"});
            var tboxesinpallet = currRec.getValue({
                fieldId: "custpage_tboxesinpallet"
            });

            var wpalletid = getUrlVars()["palletid"];
            var wpalletno = getUrlVars()["palletno"];
            var elem1 = document.getElementById("MyPalletId");
            elem1.innerHTML = wpalletid+wpalletno;


            var palletidj=wpalletid+wpalletno;
            log.debug({title: 'boxesinpallet' , details: boxesinpallet });
            log.debug({title: 'tboxesinpallet' , details: tboxesinpallet });
            move(palletidj,boxesinpallet, tboxesinpallet);


            currRec.setValue({
                fieldId: "custpage_boxesinpallet",
                value: parseInt(boxesinpallet)
            });
            var nextElement1 = document.getElementsByName('custpage_buttonhelp');
            nextElement1[0].style.backgroundColor = "red";
            var nextElement2 = document.getElementsByName('custrecordml_ssccnumber');
            nextElement2[0].focus();

        }
        function move(textb,actual, final) {
            var width=Math.round(actual/final*100);
            var elem = document.getElementById("myBar");
            var elem1 = document.getElementById("myProgress");

            if (width<33)                   { elem.style.backgroundColor = "#9e5d20";}
            else if (width>32 && width<66)  { elem.style.backgroundColor = "#095219";}
            else if (width<100)             { elem.style.backgroundColor = "#51875d";}
            else if (width>99)              { elem.style.backgroundColor = "#0d9e2d";}

            elem.style.width = width + "%";
            elem.innerHTML = "("+actual+") "+width  + "%";
            //elem1.innerHTML = textb;

        }

        function onButtonClick() {
            var currRec = currentRecord.get();

            var saleorder = currRec.getValue({
                fieldId: "custpage_saleorder"
            });
            var palletid = currRec.getValue({
                fieldId: "custpage_palletid"
            });
            var palletno = currRec.getValue({
                fieldId: "custpage_palletno"
            });

            if (barcode.length>0 ) {

                var script = 'customscript_sml_dashboard';
                var deployment = 'customdeploy1';
                var parameters = "";

                var suiteletURL = url.resolveScript({
                    scriptId:script,
                    deploymentId: deployment,
                    returnExternalUrl: false
                });


                var urlclient = suiteletURL;



                // call Dashboard.js (2071)

                urlclient += "&idso=" + saleorder;
                urlclient += "&barcode=" + barcode;
                urlclient += "&palletid=" + palletid;
                urlclient += "&palletno=" + palletno;

                window.open(urlclient, "_self");
            }
        }

        function print() {
            var currRec = currentRecord.get();
            var saleorder = currRec.getValue({
                fieldId: "custpage_saleorder"
            });
            var palletid = currRec.getValue({
                fieldId: "custpage_palletid"
            });
            var palletno = currRec.getValue({
                fieldId: "custpage_palletno"
            });



            var script = 'customscript_renderptprintpdf_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;

            // call RenderPTPrintPDF.js (2348)

            urlclient += "&idso=" + saleorder;
            urlclient += "&palletid=" + palletid;
            urlclient += "&palletno=" + palletno;
            urlclient += "&palletletter=";
            urlclient += "&totalpallets=";
            urlclient += "&mlids= " ;

            window.open(urlclient, "_blank");
            location.reload()


        }


        function printml() {

            var currRec = currentRecord.get();
            var itemCount = currRec.getLineCount({ sublistId: 'custpage_masterlabels' });
            var mlids = [];
            for (var line = 0; line < itemCount; line++) {

                var checkb= currRec.getSublistValue({ sublistId: 'custpage_masterlabels', fieldId: 'custpage_rec_process', line: line })

                if (checkb)
                {
                    mlids.push(currRec.getSublistValue({sublistId: 'custpage_masterlabels',fieldId: 'custrecordml_id',line: line}));

                    log.debug({
                        title: 'line#' + line,
                        details: {
                            mlid: currRec.getSublistValue({
                                sublistId: 'custpage_masterlabels',
                                fieldId: 'custrecordml_id',
                                line: line
                            })
                        }
                    });
                }
            }

            var saleorder = currRec.getValue({
                fieldId: "custpage_saleorder"
            });


            var script = 'customscript_renderptprintpdf_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;


            urlclient += "&idso=" + saleorder;
            urlclient += "&palletid=";
            urlclient += "&palletno=";
            urlclient += "&palletletter=";
            urlclient += "&totalpallets=";
            urlclient += "&mlids=" + mlids;

            window.open(urlclient, "_blank");


            log.debug({title: 'mlids' , details: mlids });



        }

        function changepalletid() {
            var currRec = currentRecord.get();



            var saleorder = currRec.getValue({
                fieldId: "custpage_saleorder"
            });

            var palletid = currRec.getValue({
                fieldId: "custpage_palletid"
            });
            var palletno = currRec.getValue({
                fieldId: "custpage_palletno"
            });


            if (currRec.getField("custpage_palletid").isDisabled == true) {
                currRec.getField("custpage_palletid").isDisabled = false;
                currRec.getField("custpage_palletno").isDisabled = false;
            } else
            {
                currRec.getField("custpage_palletid").isDisabled = true;
                currRec.getField("custpage_palletno").isDisabled = true;


            // call Dashboard.js (2071)

            var script = 'customscript_dashboard_scanning';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });


            var urlclient = suiteletURL;
            urlclient += "&idso=" + saleorder;
            urlclient += "&palletid=" + palletid;
            urlclient += "&palletno=" + palletno;

            window.open(urlclient, "_self");
        }
        }
        function godashboard() {
            var script = 'customscript_maindashboard';
            var deployment = 'customdeploy1';
            var parameters = "";

            var suiteletURL = url.resolveScript({
                scriptId:script,
                deploymentId: deployment,
                returnExternalUrl: false
            });

            window.open(suiteletURL, "_self");

        }
        function deletepallet(wptodelete) {

            dialog.confirm({
                title: 'Are you sure?',
                message: 'You are deleting this pallet'
            }).then(success).catch(fail);

                    function success(result) {

                        if (result) {

                            document.getElementById("custpage_deletepallet").disabled = true;
                            message.create({
                                title: "Deleting Pallet...",
                                message: "We are deleting the Pallet right now, it will be done in a few seconds",
                                type: message.Type.WARNING,
                                duration: 10000
                            }).show();

                            var paramrec = GENERALTOOLS.delassembly(wptodelete);

                            location.reload();
                        }
                    }

                    function fail(reason)
                    {
                        return false;
                    }
        }
        function getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });
            return vars;
        }
        function gohelp() {

            var currRec = currentRecord.get();

            var saleorderno = currRec.getValue({
                fieldId: "custpage_saleorderno"
            });
            log.debug({title: 'saleorderno' , details: saleorderno });
            var okg=HELPTOOLS.helpgo(saleorderno);

        }

        function saveRecord(context) {

        }

        /**
        *  Function to be executed when field is changed.*
        * @param {Object} scriptContext
        * @param {Record} scriptContext.currentRecord - Current form record
        * @param {string} scriptContext.sublistId - Sublist name
        * @param {string} scriptContext.fieldId - Field name
        * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
        * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
        *
        * @since 2015.2
        */
        function fieldChanged(context) {

            //avoid the standard NetSuite warning message when navigating away
            if (window.onbeforeunload){
                window.onbeforeunload=function() { null;};
            };

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(context) {

            var currRec = context.currentRecord;


            if (context.sublistId == "custpage_palletpm")
            {



                var wpalletid = getUrlVars()["palletid"];
                var wpalletno = getUrlVars()["palletno"];
                var saleorder = currRec.getValue({
                    fieldId: "custpage_saleorder"
                });
                var ponro = currRec.getValue({
                    fieldId: "custpage_ponro"
                });

                palletid = "PL." + wpalletid+ "." + wpalletno + "." + saleorder;

                var paramrec=GENERALTOOLS.findassembly(palletid);

                var datarec=paramrec.data;

                log.debug("paramrec",paramrec);


                    if (paramrec.sts==true)
                    {
                        message.create({
                            title: "Master Label ERROR",
                            message: "The Pallet ID has a  Assembly Build " + datarec.getValue({name: "tranid"}),
                            type: message.Type.ERROR,
                            duration: 10000
                        }).show();

                        return false;
                    }

                var mlinternalid = currRec.getCurrentSublistValue({
                    sublistId: context.sublistId,
                    fieldId: 'custrecordml_id'
                });

                var masterlabelrec = record.load({
                    type: "customrecordmasterlabels",
                    id: mlinternalid,
                    isDynamic: false,
                    defaultValues: null
                });

                // Change Record in MasterLabel.


                masterlabelrec.setValue({
                    fieldId: "custrecordml_palletid",
                    value: ""
                });
                masterlabelrec.setValue({
                    fieldId: "custrecordml_palletnumber",
                    value: 0
                });
                masterlabelrec.setValue({
                    fieldId: "custrecordml_status",
                    value: 1
                });
                masterlabelrec.setValue({
                    fieldId: "custrecordml_scanningdate",
                    value: null
                });
                masterlabelrec.setValue({
                    fieldId: "custrecordml_scanningbyuser",
                    value: null
                });


                masterlabelrec.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });

                var boxesinpallet = currRec.getLineCount({"sublistId": "custpage_palletpm"});
                currRec.setValue({
                    fieldId: "custpage_boxesinpallet",
                    value: parseInt(boxesinpallet)-1
                });
                var tboxesinpallet = currRec.getValue({
                    fieldId: "custpage_tboxesinpallet"
                });

                var palletidj=wpalletid+wpalletno;
                move(palletidj,parseInt(boxesinpallet)-1, tboxesinpallet);

                    log.debug("mlinternalid",mlinternalid);
            }


        return true;
        }


        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(context) {

            return false

        }
        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(context) {



        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(context) {


            var wpalletid = getUrlVars()["palletid"];
            var wpalletno = getUrlVars()["palletno"];


            log.debug("wpalletid",wpalletid);
            log.debug("wpalletno",wpalletno);


            log.debug("currRec",currRec);

            if (context.sublistId == "custpage_palletpm") {


                var currRec = context.currentRecord;
                barcode = currRec.getCurrentSublistValue({
                    sublistId: 'custpage_palletpm',
                    fieldId: 'custrecordml_ssccnumber'
                });


                if (barcode.length>0)
                {

                    const myArray = barcode.split(".");
                    if (myArray.length==4) {

                        currRec.setValue({
                            fieldId: "custpage_palletid",
                            value:myArray[1]
                        });
                        currRec.setValue({
                            fieldId: "custpage_palletno",
                            value:myArray[2]
                        });
                        currRec.setValue({
                            fieldId: "custpage_saleorder",
                            value:myArray[3]
                        });
                        currRec.getField("custpage_palletid").isDisabled = false;
                        currRec.getField("custpage_palletno").isDisabled = false;
                        changepalletid()
                        return false;
                    }
                    if (barcode.length==9) {
                        barcode='00008404081'+barcode;
                    }
                }







                var saleorder = currRec.getValue({
                    fieldId: "custpage_saleorder"
                });
                var palletid = currRec.getValue({
                    fieldId: "custpage_palletid"
                });

                var palletno = currRec.getValue({
                    fieldId: "custpage_palletno"
                });
                var ponro = currRec.getValue({
                    fieldId: "custpage_ponro"
                });
                var boxesinpallet = currRec.getLineCount({"sublistId": "custpage_palletpm"});

                var tboxesinpallet = currRec.getValue({
                    fieldId: "custpage_tboxesinpallet"
                });

                palletidf = "PL." + palletid+ "." + palletno + "." + saleorder;
                var paramrec=GENERALTOOLS.findassembly(palletidf);
                var datarec=paramrec.data;

                if (paramrec.sts==true)
                {
                    message.create({
                        title: "Master Label ERROR",
                        message: "The Pallet ID has a  Assembly Build " + datarec.getValue({name: "tranid"}),
                        type: message.Type.ERROR,
                        duration: 10000
                    }).show();

                    return false;
                }

                log.debug("barcode",barcode);
                log.debug("palletid",palletid);
                log.debug("palletno",palletno);


                if (palletid.length==0 || palletno==0)
                {
                    message.create({
                        title: "Master Label ERROR",
                        message: "The Pallet ID can not be blank or Pallet Number can not be zero",
                        type: message.Type.ERROR,
                        duration: 10000
                    }).show();

                    return false;
                }

                if (boxesinpallet>=tboxesinpallet)
                {
                    message.create({
                        title: "Master Label ERROR",
                        message: "The pallet has reached its maximum number of boxes",
                        type: message.Type.ERROR,
                        duration: 10000
                    }).show();

                    return false;
                }




                if (palletid!=wpalletid || palletno!=wpalletno)
                {
                    message.create({
                        title: "Master Label ERROR",
                        message: "Please, press the Change Pallet ID button",
                        type: message.Type.ERROR,
                        duration: 10000
                    }).show();

                    return false;
                }


                if (barcode.length>0 && palletid.length>0 && palletno>0) {

                    var index = currRec.findSublistLineWithValue({"sublistId": "custpage_masterlabels", "fieldId": "custrecordml_ssccnumber", "value": barcode});

                    if (index==-1)
                    {
                        message.create({
                            title: "Master Label ERROR",
                            message: "This master label " + barcode + " does not exist",
                            type: message.Type.ERROR,
                            duration: 10000
                        }).show();
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_ssccnumber",
                            value: "",
                            ignoreFieldChange: true
                        });

                        return false;
                    }

                    log.debug("index",index);
                    if (index!=-1)
                    {

                        var masterlabel_id = currRec.getSublistValue({
                            "sublistId": "custpage_masterlabels",
                            "fieldId": 'custrecordml_id',
                            "line": index
                        });
                        var masterlabel_wo = currRec.getSublistValue({
                            "sublistId": "custpage_masterlabels",
                            "fieldId": 'custrecordml_workorder',
                            "line": index
                        });


                        paramWO = GENERALTOOLS.get_WO_value(masterlabel_wo);
                        var wostatus= paramWO.data.getValue({fieldId: "status"});

                        if (wostatus != "Released" && wostatus != "In Process")
                        {
                            var wodoc= paramWO.data.getValue({fieldId: "tranid"});
                            message.create({
                                title: "Master Label ERROR",
                                message: "This master label " + barcode +" belongs to WO : " + wodoc + " not Released " ,
                                type: message.Type.ERROR,
                                duration: 10000
                            }).show();
                            currRec.setCurrentSublistValue({
                                sublistId: 'custpage_palletpm',
                                fieldId: "custrecordml_ssccnumber",
                                value: "",
                                ignoreFieldChange: true
                            });

                            return false;
                        }



                        var userObj = runtime.getCurrentUser();
                        var userID = userObj.id;


                        var d = new Date();

                        var formattedDateString = format.format({
                            value: d,
                            type: format.Type.DATETIME
                        });


                        var masterlabelrec = record.load({
                            type: "customrecordmasterlabels",
                            id: masterlabel_id,
                            isDynamic: false,
                            defaultValues: null
                        });
                        var ssccnumber = masterlabelrec.getValue({
                            fieldId: "custrecordml_ssccnumber",
                        });
                        var workorder = masterlabelrec.getValue({
                            fieldId: "custrecordml_workorder",
                        });
                        var product = masterlabelrec.getText({
                            fieldId: "custrecordml_product",
                        });
                        var casenumber = masterlabelrec.getValue({
                            fieldId: "custrecordml_casenumber",
                        });
                        var caseqty = masterlabelrec.getValue({
                            fieldId: "custrecordml_caseqty",
                        });
                        var stsml = masterlabelrec.getValue({
                            fieldId: "custrecordml_status",
                        });
                        var palid = masterlabelrec.getValue({
                            fieldId: "custrecordml_palletid",
                        });
                        var palno = masterlabelrec.getValue({
                            fieldId: "custrecordml_palletnumber",
                        });
                        var masterlabelid = masterlabelrec.getValue({
                            fieldId: "id",
                        });

                        if (stsml != "1")
                        {
                            message.create({
                                title: "Master Label ERROR",
                                message: "This master label " + barcode + " has been scanned in: " + palid+"-"+palno,
                                type: message.Type.ERROR,
                                duration: 10000
                            }).show();
                            currRec.setCurrentSublistValue({
                                sublistId: 'custpage_palletpm',
                                fieldId: "custrecordml_ssccnumber",
                                value: "",
                                ignoreFieldChange: true
                            });

                            return false;
                        }


                        // Change Record in MasterLabel.


                        masterlabelrec.setValue({
                            fieldId: "custrecordml_palletid",
                            value: palletid
                        });
                        masterlabelrec.setValue({
                            fieldId: "custrecordml_palletnumber",
                            value: palletno
                        });
                        masterlabelrec.setValue({
                            fieldId: "custrecordml_status",
                            value: 5
                        });
                        masterlabelrec.setValue({
                            fieldId: "custrecordml_scanningdate",
                            value: d
                        });
                        masterlabelrec.setValue({
                            fieldId: "custrecordml_scanningbyuser",
                            value: userID
                        });

                        masterlabelrec.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: false
                        });

                        log.debug("palletid",palletid);
                        log.debug("palletno",palletno);


                        // Change line in sublist custpage_masterlabels.

                        currRec.selectLine({
                            "sublistId": "custpage_masterlabels",
                            "line": index
                        });

                        currRec.setCurrentSublistValue({
                            "sublistId": "custpage_masterlabels",
                            "fieldId": 'custrecordml_palletid',
                            "line": index,
                            value: palletid,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            "sublistId": "custpage_masterlabels",
                            "fieldId": 'custrecordml_palletnumber',
                            "line": index,
                            value: 0+palletno,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            "sublistId": "custpage_masterlabels",
                            "fieldId": 'custrecordml_status',
                            "line": index,
                            value: 5,
                            ignoreFieldChange: true
                        });


                        currRec.commitLine({
                            sublistId: 'custpage_masterlabels'
                        });

                        log.debug("barcode",barcode);



                        // Add new line in sublist custpage_palletpm.




                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_ssccnumber",
                            value: ssccnumber,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_workorder",
                            value: workorder,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_product",
                            value: product,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_casenumber",
                            value: casenumber,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_caseqty",
                            value: caseqty,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_palletid",
                            value: palletid,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_palletnumber",
                            value: palletno,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_status",
                            value: "Scanned",
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "cucustrecordml_idstrecordml_status",
                            value: palletid,
                            ignoreFieldChange: true
                        });
                        currRec.setCurrentSublistValue({
                            sublistId: 'custpage_palletpm',
                            fieldId: "custrecordml_id",
                            value: masterlabelid,
                            ignoreFieldChange: true
                        });

                        currRec.setValue({
                            fieldId: "custpage_boxesinpallet",
                            value: parseInt(boxesinpallet)+1
                        });
                        var tboxesinpallet = currRec.getValue({
                            fieldId: "custpage_tboxesinpallet"
                        });
                        var palletidj=wpalletid+wpalletno;
                        move(palletidj,parseInt(boxesinpallet)+1, tboxesinpallet);

                       /* currRec.commitLine({
                            sublistId: 'custpage_palletpm'
                        });
                        */
                        return true;




                    }

                }


            }

        }


        return {
            pageInit: pageInit,
            deletepallet: deletepallet,
            fieldChanged: fieldChanged,
            //saveRecord: saveRecord,
            onButtonClick: onButtonClick,
            godashboard: godashboard,
            gohelp: gohelp,
            changepalletid: changepalletid,
            print: print,
            printml: printml,
            //postSourcing: postSourcing,
            //sublistChanged: sublistChanged,
            //lineInit: lineInit,
            //validateField: validateField,
            validateLine: validateLine,
            validateInsert: validateInsert,
            validateDelete: validateDelete
        }
    })
