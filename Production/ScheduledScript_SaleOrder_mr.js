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

            log.debug('context', context);


            var paramrec = GENERALTOOLS.get_param_value(4);
            var itemprom= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(7);
            var startdate= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(8);
            var enddate= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(9);
            var autoff= paramrec.data.getValue({fieldId: "custrecordparams_value"});



            var fsearch = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type","anyof","SalesOrd"],
                        "AND",
                        ["item","noneof","13852","14457","13857","13242","13871","34","13239","13241"],
                        "AND",
                        ["status","anyof","SalesOrd:D","SalesOrd:E","SalesOrd:B"],
                        "AND",
                        ["mainline","is","F"],
                        "AND",
                        ["tobefulfilled","is","T"],
                        "AND",
                        ["custbodystatusinterface","anyof","@NONE@","1"],
                        "AND",
                        ["trandate","onorafter",startdate],
                        "AND",
                        [[["cseg_saleschann_new","anyof","7","2","9","4"]],"OR",[["cseg_saleschann_new","anyof","36"],"AND",["custbody_celigo_etail_channel.name","isnotempty",""]]]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "memomain",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "tranid",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "trandate",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "location",
                            summary: "COUNT"
                        }),
                        search.createColumn({
                            name: "location",
                            summary: "MAX"
                        }),
                        search.createColumn({
                            name: "formulanumeric",
                            summary: "MAX",
                            formula: "CASE WHEN {item}='B183STEPKIND-SAMPLE' THEN 1 else 0 end"
                        }),

                        search.createColumn({
                            name: "custrecordfulfillment_status",
                            join: "cseg_saleschann_new",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "custrecordbin",
                            join: "cseg_saleschann_new",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "formulanumeric1",
                            summary: "MAX",
                            formula: "CASE WHEN {item.custitem_htscode}='3303.00' THEN 1 else 0 end"
                        }),
                        search.createColumn({
                            name: "custbody_shopifychannel",
                            summary: "GROUP"
                        })
                    ]
            });




            return fsearch;
        };

        var map = function map(context) {

            log.debug('context.map', context);

            var customFulfillRecordId = context.key;
            var customFulfillRecord = JSON.parse(context.value);
            context.write(customFulfillRecordId, customFulfillRecord);
        };

        var reduce = function reduce(context) {

            var fresult = JSON.parse(context.values[0]);


            var paramrec = GENERALTOOLS.get_param_value(4);
            var itemprom= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(7);
            var startdate= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(8);
            var enddate= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(10);
            var autoff= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_param_value(15);
            var concurrency= paramrec.data.getValue({fieldId: "custrecordparams_value"});


            var ojson=context.values[0];
            log.debug('context', ojson);

            var customFulfillOrdersRecord = JSON.parse(context.values[0]);

            trandate=fresult.values["GROUP(trandate)"];
            tranid=fresult.values["GROUP(tranid)"];
            internalid=fresult.values["GROUP(internalid)"].value;
            memo=fresult.values["GROUP(memomain)"];
            locationsqt=fresult.values["COUNT(location)"].value;
            itemdone=fresult.values["MAX(formulanumeric)"];
            isaperfurm=fresult.values["MAX(formulanumeric1)"];
            shopifychannel=fresult.values["GROUP(custbody_shopifychannel)"];




            if (locationsqt!=0) {

                rec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: internalid,
                    isDynamic: true
                })
                var lineNumber = rec.findSublistLineWithValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: "13852"
                });
                log.debug("lineNumber",lineNumber);


                if (lineNumber>0)             { discountlines(rec);               }



                var salechannel=rec.getValue({fieldId: "cseg_saleschann_new"})
                var shipdate=rec.getValue({fieldId: "shipdate"})
                var location=rec.getValue({fieldId: "location"})
                var shipmethod=rec.getValue({fieldId: "shipmethod"})
                var country = rec.getValue({fieldId: "shipcountry"});
                log.debug("address",country);


                var paramrec = GENERALTOOLS.get_location_value(location);
                var returnaddress= paramrec.data.getValue({fieldId: "mainaddress_text"});

                if (itemdone==0) {
                    enddate1 = new Date(enddate);
                    trandate1 = new Date(trandate);

                    if (enddate1>=trandate1) {

                        rec.selectNewLine({sublistId: "item"});
                        rec.setCurrentSublistValue({sublistId: "item", fieldId: "item", value: "17848"});
                        rec.setCurrentSublistValue({sublistId: "item", fieldId: "quantity", value: 1});
                        rec.setCurrentSublistValue({sublistId: "item", fieldId: "location", value: location});
                        rec.setCurrentSublistValue({sublistId: "item", fieldId: "amount", value: 0});
                        rec.commitLine({sublistId: "item"});
                    }

                }
                position = memo.search("shopifyCartToken");

                if (position!=-1) {
                    let memonew = memo.substring(0, (position-1));
                    let shopydesc = memo.substring((position));

                    rec.setValue({
                        fieldId: 'memo',
                        value: memonew
                    });
                    rec.setValue({
                        fieldId: 'custbodyshopifycarttoken',
                        value: shopydesc
                    });
                }
                rec.setValue({
                    fieldId: 'custbody_bkm_ship_date_domo',
                    value: shipdate
                });
                rec.setValue({
                    fieldId: 'custbodystatusinterface',
                    value: '2'
                });

                rec.setValue({
                    fieldId: 'custbody8',
                    value: returnaddress
                });
                y++;
                if (y>concurrency) {y=1;}
                rec.setValue({
                    fieldId: 'custbodyconcurrency_level',
                    value: y
                });

                if (shopifychannel.includes("Facebook") || shopifychannel.includes("Instagram"))
                {
                    rec.setValue({
                        fieldId: 'istaxable',
                        value: false
                    });

                }


                rec.save({enableSourcing: true});
                log.debug("isaperfurm",isaperfurm);

                if (isaperfurm=='1' && country=='CA') {
                    sendemail(tranid,internalid);
                }





            }

            context.write(context.key, customFulfillOrdersRecord);
        };

        var summarize = function summarize(context) {
        };


        function sendemail(tranid,transactionId)
        {

            var userObj = runtime.getCurrentUser();

            var paramrec = GENERALTOOLS.get_param_value(14);
            var recipientsstr= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var subject = "The Sale Order No (" + tranid +  ") contains an item not allowed in Canada ";
            var emailBody = "The Sale Order No (" + tranid +  ") contains an item not allowed in Canada ";

            const recipients = recipientsstr.split(',');
            log.debug("recipients",recipients);

            email.send({
                author : 388923,
                recipients : recipients,
                subject : subject,
                body : emailBody,
                relatedRecords : {
                    transactionId : transactionId
                }
            });

        }


        function discountlines(rec)
        {
            var lineCount = rec.getLineCount('item');
            var itemskub;
            var itemdisc;
            for(let i = 0; i < lineCount; i++) {
                log.debug("sku",rec.getSublistText({sublistId: "item", fieldId: "item", line: i}));
                if (rec.getSublistValue({sublistId: "item", fieldId: "item", line: i})=='13852')
                {
                    var lineNum = rec.selectLine({
                        sublistId: 'item',
                        line: i
                    });

                    try {

                        itemdiscr=rec.getSublistValue({sublistId: "item", fieldId: "amount", line: i});
                        log.debug("itemdiscr",itemdiscr);
                        log.debug("itemdisc",itemdisc);

                        if (itemdiscr!=itemdisc && itemdisc<0) {
                            log.debug("itemdisc111",itemdisc);
                            rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'amount',
                                value: itemdisc,
                                ignoreFieldChange: true
                            });
                            rec.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: itemdisc,
                                ignoreFieldChange: true
                            });

                        }

                        rec.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol_discountappliedsku',
                            value: itemskub,
                            ignoreFieldChange: true
                        });
                        rec.commitLine({
                            sublistId: 'item'
                        });

                    } catch (e) {
                        log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});

                    }

                }
                log.debug("itemskub",itemskub);
                itemskub = rec.getSublistText({sublistId: "item", fieldId: "item", line: i});
                itemdisc = rec.getSublistValue({sublistId: "item", fieldId: "custcol_amountdiscount", line: i})*-1;


            }
        }

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize
            //  searchInventoryDetailsForItem: searchInventoryDetailsForItem,
            //  transformSOToItemFulfillmentRecord: transformSOToItemFulfillmentRecord,
            //  createItemFulfillment: createItemFulfillment,
            //  submitCustomFulfillOrdersRecordFields: submitCustomFulfillOrdersRecordFields
        };
    });


