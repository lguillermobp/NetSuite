/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
var country;
define(["N/ui/message","N/log","N/record", "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(message,log, r, GENERALTOOLS) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */


        function pageInit(context) {


            log.debug("context.mode",context.mode);

            datarec=context.currentRecord;
            country = datarec.getValue({fieldId: "shipcountry"});
            totalcftype = datarec.getValue({fieldId: "custbody_totalcf"});
            entity = datarec.getValue({fieldId: "entity"});
            log.debug("address",country);
            if (entity && !totalcftype) {
                var paramCustomer = GENERALTOOLS.get_customer_value(entity);
                cfcalculation = paramCustomer.data.getValue({fieldId: "custentity_cfcalculation"});
                datarec.setValue({fieldId: "custbody_totalcf", value: cfcalculation});

            }
            //calculateBoxesPallets(context) ;

        }



        /**
         * Function to be executed when field is changed.
         *
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

            var order=context.currentRecord;

            if (context.sublistId == "item") {

                var itemcode = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'item'
                });
                var description = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'description'
                });

                worksml = order.getValue({fieldId: "custbody_worksml"});
                worksml = false;

                log.debug("worksml ", worksml);
                if (worksml) {

                    log.debug("1 context.sublistId ", context.sublistId);


                    var chgbox = 0;
                    var order = context.currentRecord;

                    var quantity = order.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    var custcolcasespermasterbox = order.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcolcasespermasterbox'
                    });

                    var custcolboxesperpallet = order.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcolboxesperpallet'
                    });


                    var custcolweight = order.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcolweight'
                    });

                    var itemid = order.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });

                    var boxesact = order.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcolboxes'
                    });


                    log.debug("2 custcolcasespermasterbox", custcolcasespermasterbox);

                    if (custcolcasespermasterbox == 0) {

                        // hhhhhhhh


                        var varrut = GENERALTOOLS.get_item_informations(itemcode);
                        log.debug("3 varrut", varrut);
                        databasic = varrut.data.data.basic;
                        log.debug("3 databasic", databasic);


                        if (databasic.recordType == "lotnumberedassemblyitem") {

                            if (custcolcasespermasterbox == 0 || custcolboxesperpallet == 0 || custcolweight == 0) {

                                try {
                                    var itemrec = r.load({
                                        type: "inventoryitem",
                                        id: itemid,
                                        isDynamic: false,
                                        defaultValues: null
                                    });
                                    log.debug("itemrec",itemrec);
                                }
                                catch(err) {
                                    try {
                                        var itemrec = r.load({
                                            type: "noninventoryitem",
                                            id: itemid,
                                            isDynamic: false,
                                            defaultValues: null
                                        });
                                        log.debug("itemrec",itemrec);
                                    }
                                    catch(err) {
                                        try {
                                            var itemrec = r.load({
                                                type: "lotnumberedassemblyitem",
                                                id: itemid,
                                                isDynamic: false,
                                                defaultValues: null
                                            });
                                            log.debug("itemrec",itemrec);
                                        }
                                        catch(err) {
                                            try {
                                                var itemrec = r.load({
                                                    type: "assemblyitem",
                                                    id: itemid,
                                                    isDynamic: false,
                                                    defaultValues: null
                                                });
                                                log.debug("paramrec",paramrec);
                                            }
                                            catch(err) { }



                                        }
                                    }
                                }


                                var custcolcasespermasterbox = itemrec.getValue({fieldId: "custitemcasespermasterbox"});
                                log.debug("4 custcolcasespermasterbox", custcolcasespermasterbox);

                                order.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'custcolcasespermasterbox',
                                    value: custcolcasespermasterbox + 0,
                                    ignoreFieldChange: true
                                });

                                log.debug("5 custcolboxesperpallet", custcolboxesperpallet);

                                if (custcolboxesperpallet == 0) {

                                    var custcolboxesperpallet = itemrec.getValue({fieldId: "custitemboxesperpallet"});

                                    order.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcolboxesperpallet',
                                        value: custcolboxesperpallet + 0,
                                        ignoreFieldChange: true
                                    });

                                }
                                log.debug("6 custcolweight", custcolweight);
                                if (custcolweight == 0) {

                                    var custcolweight = itemrec.getValue({fieldId: "weight"});

                                    order.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'custcolweight',
                                        value: custcolweight + 0,
                                        ignoreFieldChange: true
                                    });

                                }


                            }


                        }


                        // ffffffff


                    }
                    if (custcolcasespermasterbox == 0) {
                        var boxes = 0;
                    } else {
                        var boxes = Math.ceil(quantity / custcolcasespermasterbox);
                    }


                    if (boxes != boxesact) {

                        order.setCurrentSublistValue({
                            "sublistId": "item",
                            "fieldId": "custcolboxes",
                            "value": boxes,
                            ignoreFieldChange: true
                        });
                        chgbox = 1;

                    }

                    if (chgbox == 1) {
                        //calculateBoxesPallets(context) ;
                        chgbox = 0;
                    }

                    if (custcolweight=='') { custcolweight=0;  }
                    if (custcolboxesperpallet=='') { custcolboxesperpallet=0;  }

                    order.setCurrentSublistValue({
                        "sublistId": "item",
                        "fieldId": "custcol_weightbypallet",
                        "value": parseInt(custcolboxesperpallet)*custcolweight,
                        ignoreFieldChange: true
                    });
                    order.setCurrentSublistValue({
                        "sublistId": "item",
                        "fieldId": "custcol_weighttotal",
                        "value": parseInt(quantity)*custcolweight,
                        ignoreFieldChange: true
                    });
                    totalcftype = order.getValue({fieldId: "custbody_totalcf"});
                    var totalcf = 0;
                    if (totalcftype==1) {

                        if (custcolboxesperpallet != 0) {
                            totalcf = Math.ceil((parseInt(boxes)  * 3.5))
                        } else {
                            totalcf = 0;
                        }
                    }
                    if (totalcftype==2) {

                        if (custcolboxesperpallet != 0) {
                            totalcf = (parseInt(boxes) / parseInt(custcolboxesperpallet)) * 55.55;
                        } else {
                            totalcf = 0;
                        }
                    }


                    order.setCurrentSublistValue({
                        "sublistId": "item",
                        "fieldId": "custcol_totalcf",
                        "value": totalcf.toFixed(3),
                        ignoreFieldChange: true
                    });

                    try {
                        var itemrec = r.load({
                            type: "inventoryitem",
                            id: itemid,
                            isDynamic: false,
                            defaultValues: null
                        });
                        log.debug("itemrec",itemrec);
                    }
                    catch(err) {
                        try {
                            var itemrec = r.load({
                                type: "noninventoryitem",
                                id: itemid,
                                isDynamic: false,
                                defaultValues: null
                            });
                            log.debug("itemrec",itemrec);
                        }
                        catch(err) {
                            try {
                                var itemrec = r.load({
                                    type: "lotnumberedassemblyitem",
                                    id: itemid,
                                    isDynamic: false,
                                    defaultValues: null
                                });
                                log.debug("itemrec",itemrec);
                            }
                            catch(err) {
                                try {
                                    var itemrec = r.load({
                                        type: "assemblyitem",
                                        id: itemid,
                                        isDynamic: false,
                                        defaultValues: null
                                    });
                                    log.debug("paramrec",paramrec);
                                }
                                catch(err) { }



                            }
                        }
                    }

                    var weightold = itemrec.getValue({fieldId: "weight"});
                    var casesperboxesold = itemrec.getValue({fieldId: "custitemcasespermasterbox"});
                    var boxesperpalletold = itemrec.getValue({fieldId: "custitemboxesperpallet"});

                    var itemchg=0;
                    if (casesperboxesold != custcolcasespermasterbox) {
                        itemrec.setValue({
                            fieldId: "custitemcasespermasterbox",
                            value: custcolcasespermasterbox
                        });
                        itemchg=1;
                    }
                    if (boxesperpalletold != custcolboxesperpallet) {
                        itemrec.setValue({
                            fieldId: "custitemboxesperpallet",
                            value: custcolboxesperpallet
                        });
                        itemchg=1;
                    }
                    if (weightold != custcolweight) {
                        itemrec.setValue({
                            fieldId: "weight",
                            value: custcolweight
                        });
                        itemchg=1;
                    }
                    if (itemchg==1) {
                        itemrec.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                    }



                }
                log.debug("9 country", country);
                if (country != "US") {
                    var varrut = GENERALTOOLS.get_item_informations(itemcode);
                    log.debug("9 country", country);
                    if (varrut.records > 0) {
                        databasic = varrut.data.data.basic;
                        log.debug("9 databasic", databasic);

                        if (databasic.recordType != "noninventoryitem") {
                            if (description.search("HTS :") == -1) {


                                log.debug("10 detahts", varrut.detahts);
                                billid = varrut.data.data.bomid;


                                /*         if (billid != 0) {

                                             billofm = varrut.data.data.components.data;


                                             billofm[billid].forEach(function (billitem) {
                                                 log.debug("components", billitem);

                                             })
                                         }

                                 */

                                var newdesc = description + " HTS : " + varrut.detahts;

                                order.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'description',
                                    value: newdesc,
                                    ignoreFieldChange: true
                                });
                            }
                        }
                    }
                }
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
        function validateInsert(scriptContext) {

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
        function validateDelete(scriptContext) {

        }




        function calculateBoxesPallets(context) {


            var order=context.currentRecord;


            var totboxes=0;
            var totpallets=0;

            var itemIndex = 0;
            var itemCount = order.getLineCount({
                "sublistId": "item"
            });




            while (itemIndex < itemCount) {
                order.selectLine({
                    "sublistId": "item",
                    "line": itemIndex
                });


                var quantity = order.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity'
                });


                var custcolcasespermasterbox = order.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcolcasespermasterbox'
                });

                var custcolboxesperpallet = order.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcolboxesperpallet'
                });

                var custcolweight = order.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcolweight'
                });

                var itemid = order.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });

                var itemcode = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'item'
                });

                var description = order.getCurrentSublistText({
                    sublistId: 'item',
                    fieldId: 'description'
                });

                var varrut=  GENERALTOOLS.get_item_informations(itemcode);
                databasic=varrut.data.data.basic;
                log.debug("databasic",databasic);



                if (databasic.recordType=="lotnumberedassemblyitem") {
                    if (custcolcasespermasterbox == 0 || custcolboxesperpallet == 0 || custcolweight == 0) {

                        try {
                            var itemrec = r.load({
                                type: "inventoryitem",
                                id: itemid,
                                isDynamic: false,
                                defaultValues: null
                            });
                            log.debug("itemrec",itemrec);
                        }
                        catch(err) {
                            try {
                                var itemrec = r.load({
                                    type: "noninventoryitem",
                                    id: itemid,
                                    isDynamic: false,
                                    defaultValues: null
                                });
                                log.debug("itemrec",itemrec);
                            }
                            catch(err) {
                                try {
                                    var itemrec = r.load({
                                        type: "lotnumberedassemblyitem",
                                        id: itemid,
                                        isDynamic: false,
                                        defaultValues: null
                                    });
                                    log.debug("itemrec",itemrec);
                                }
                                catch(err) {
                                    try {
                                        var itemrec = r.load({
                                            type: "assemblyitem",
                                            id: itemid,
                                            isDynamic: false,
                                            defaultValues: null
                                        });
                                        log.debug("paramrec",paramrec);
                                    }
                                    catch(err) { }



                                }
                            }
                        }


                        if (custcolcasespermasterbox == 0) {

                            var custcolcasespermasterbox = itemrec.getValue({fieldId: "custitemcasespermasterbox"});

                            order.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcolcasespermasterbox',
                                value: custcolcasespermasterbox + 0,
                                ignoreFieldChange: true
                            });

                        }

                        if (custcolboxesperpallet == 0) {

                            var custcolboxesperpallet = itemrec.getValue({fieldId: "custitemboxesperpallet"});

                            order.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcolboxesperpallet',
                                value: custcolboxesperpallet + 0,
                                ignoreFieldChange: true
                            });

                        }
                        if (custcolweight == 0) {

                            var custcolweight = itemrec.getValue({fieldId: "weight"});

                            order.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcolweight',
                                value: custcolweight + 0,
                                ignoreFieldChange: true
                            });

                        }
                        if (custcolcasespermasterbox == 0) {
                            var boxes = 0;
                        } else {
                            var boxes = Math.ceil(quantity / custcolcasespermasterbox);
                        }


                            order.setCurrentSublistValue({
                                "sublistId": "item",
                                "fieldId": "custcolboxes",
                                "value": boxes,
                                ignoreFieldChange: true
                            });



                        order.commitLine({
                            sublistId: 'item'
                        });

                    }
                }
                if (custcolweight=='') { custcolweight=0;  }
                if (custcolboxesperpallet=='') { custcolboxesperpallet=0;  }
                order.setCurrentSublistValue({
                    "sublistId": "item",
                    "fieldId": "custcol_weightbypallet",
                    "value": parseInt(custcolboxesperpallet)*custcolweight,
                    ignoreFieldChange: true
                });
                order.setCurrentSublistValue({
                    "sublistId": "item",
                    "fieldId": "custcol_weighttotal",
                    "value": parseInt(quantity)*custcolweight,
                    ignoreFieldChange: true
                });

                if (custcolcasespermasterbox == 0)
                {
                    var boxes = 0;
                }
                else {
                    var boxes = Math.ceil(quantity/custcolcasespermasterbox);
                }

                if (custcolboxesperpallet == 0)
                {
                    var pallets = 0;
                }
                else {
                    var pallets = boxes/custcolboxesperpallet;
                }

                totboxes+=boxes;
                totpallets+=pallets;


                totalcftype = order.getValue({fieldId: "custbody_totalcf"});
                var totalcf = 0;
                if (totalcftype==1) {

                    if (custcolboxesperpallet != 0) {
                        totalcf = Math.ceil((parseInt(boxes)  * 3.5))
                    } else {
                        totalcf = 0;
                    }
                }
                if (totalcftype==2) {

                    if (custcolboxesperpallet != 0) {
                        totalcf = (parseInt(boxes) / parseInt(custcolboxesperpallet)) * 55.55;
                    } else {
                        totalcf = 0;
                    }
                }
                order.setCurrentSublistValue({
                    "sublistId": "item",
                    "fieldId": "custcol_totalcf",
                    "value": totalcf.toFixed(3),
                    ignoreFieldChange: true
                });

                itemIndex++;
            }
            totpallets=Math.ceil(totpallets/1);
            log.debug("totboxes",totboxes);
            log.debug("custbodytotalpallets",totpallets);
            order.setValue('custbodytotalboxes', totboxes);
            order.setValue('custbodytotalpallets', totpallets);
        }




        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(context) {


            var order=context.currentRecord;

            worksml = order.getValue({fieldId: "custbody_worksml"});
            //worksml = false;

            var itemIndex = 0;
            var itemCount = order.getLineCount({
                "sublistId": "item"
            });

            while (itemIndex < itemCount) {
                order.selectLine({
                    "sublistId": "item",
                    "line": itemIndex
                });

                var itemid = order.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });

                var custcolcasespermasterbox = order.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcolcasespermasterbox'
                });



                itemIndex++;
            }


            log.debug("order",order);
            locationid = order.getValue({fieldId: "location"});
            log.debug("location",locationid);
            if (worksml) {  calculateBoxesPallets(context) ;}

            canceldate = order.getValue({fieldId: "custbody_canceldate"});
            shipdate=  order.getValue({fieldId: "shipdate"});
            order.setValue('custbody_bkm_ship_date_domo', shipdate);
            entity = order.getValue({fieldId: "entity"});

            var paramCustomer = GENERALTOOLS.get_customer_value(entity);
            canceldateoff= paramCustomer.data.getValue({fieldId: "custentitycanceldateoff"});
            log.debug("paramCustomer",canceldateoff);

            var d = new Date();
            if (!canceldateoff) {
                if (canceldate && canceldate < d) {
                    log.debug("error", "error");
                    message.create({
                        title: "Cancel Date",
                        message: "This sale order cannot be shipped because it has been canceled.",
                        type: message.Type.ERROR,
                        duration: 10000
                    }).show();
                    return false;
                }
            }


            return true;


        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            //postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            //lineInit: lineInit,
            //validateField: validateField,
            validateLine: validateLine,
            //validateInsert: validateInsert,
            //validateDelete: validateDelete,
            saveRecord: saveRecord
        };

    });