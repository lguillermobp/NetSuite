/**
 * [Folio3 License] LB
 *
 * module for custom bulk order fulfillment record
 *
 * Version    Date                    Author           Remarks
 * 1.00       2019-11-25              Uzair
 *
 */

/**
 * @module f3/DAO
 */

/**
 * @typedef module:f3/DAO.run
 * @type {object}
 * @property {object} context - default
 */

define(['N/log', 'N/search', 'N/record', "/SuiteScripts/Modules/generaltoolsv1.js"], function (log, search, record, GENERALTOOLS) {
    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }

    function _iterableToArrayLimit(arr, i) {
        if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
            return;
        }

        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }



    var irec=0;

    var searchPendingCustomFulFillOrdersP4 = function searchPendingCustomFulFillOrdersP4() {
        try {
            let searchSalesOrders = search.load({
                id: "customsearch_bks_ecomm_5_2_2_4"
            });
            /*
                        searchSalesOrders.filters.push(search.createFilter({
                            name: "formulanumeric",
                            operator: "equalto",
                            values: "0",
                            formula: "case when {quantity}-NVL({quantitycommitted}, 0)-{quantityshiprecv} = 0 then 0 else 1 end",
                            summarytype: "max"
                        }));

             */
            return  searchSalesOrders;

        } catch (e) {
            log.error({
                title: "searchPendingCustomFulfillOrders",
                details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
            });
        }
    };



    var searchPendingCustomFulFillOrdersP4new = function searchPendingCustomFulFillOrdersP4new() {
        try {
            var salesOrders=[];
            var salesOrders1;

            let searchSalesOrders = search.load({
                id: "customsearch_bks_ecomm_5_2_2_4_4"
            });

            var paramrec = GENERALTOOLS.get_param_value(10);
            var maxrec= paramrec.data.getValue({fieldId: "custrecordparams_value"});

            log.debug({  title: "searchSalesOrders: ", details: searchSalesOrders});
            /*
                        searchSalesOrders.filters.push(search.createFilter({
                            name: "formulanumeric",
                            operator: "equalto",
                            values: "0",
                            formula: "case when {quantity}-NVL({quantitycommitted}, 0)-{quantityshiprecv} = 0 then 0 else 1 end",
                            summarytype: "max"
                        }));

             */
            let pagedData = searchSalesOrders.runPaged({
                pageSize: 2000
            });

            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                var max1=0;
                page.data.forEach(function (result) {

                    if (max1>=maxrec) {return salesOrders;}

                    salesOrders.push({
                        "GROUP(tranid)": Number(result.getValue({
                            name: "tranid",
                            summary: "GROUP"
                        })),
                        "internalid": Number(result.getValue({
                            name: "internalid",
                            summary: "GROUP"
                        })),
                        "cseg_saleschann_new": result.getValue({
                            name: "cseg_saleschann_new",
                            summary: "GROUP" }),
                        "formulanumeric": result.getText({name: "formulanumeric",
                            summary: "MAX",
                            formula: "case when {quantity}-NVL({quantitycommitted}, 0)-{quantityshiprecv} = 0 then 0 else 1 end"}),

                        "shipmethod": result.getValue({
                            name: "shipmethod",
                            summary: "GROUP"
                        }),
                        "trandate": result.getText({
                            name: "trandate",
                            summary: "GROUP"
                        }),
                        "postingperiod": result.getValue({
                            name: "postingperiod",
                            summary: "GROUP"}) || " ",
                        "location": result.getText({
                            name: "location",
                            summary: "GROUP"}),
                        "quantity": result.getText({
                            name: "quantity",
                            summary: "SUM"}),
                        "quantitypacked": result.getValue({
                            name: "quantitypacked",
                            summary: "SUM"}),
                        "formulatext": result.getText({
                            name: "formulatext",
                            summary: "MAX",
                            formula: "case when {quantitypacked}-{quantity} = 0 then 0 else 1 end"
                        }),
                        "custbody_ffstatus": result.getValue({
                            name: "custbody_ffstatus",
                            summary: "GROUP"}),

                        "custbody_fferror": result.getValue({
                            name: "custbody_fferror",
                            summary: "GROUP"}),
                        "custbody_fferrorqty": result.getValue({
                            name: "custbody_fferrorqty",
                            summary: "GROUP"
                        }),
                        "internalidlocaton": Number(result.getValue({
                            name: "internalid",
                            join: "location",
                            summary: "GROUP"})),
                        "custbody_ava_customerentityid": result.getValue({
                            name: "custbody_ava_customerentityid",
                            summary: "GROUP"}),
                        "custrecordfulfillment_status": result.getValue({
                            name: "custrecordfulfillment_status",
                            join: "cseg_saleschann_new",
                            summary: "GROUP"}),
                        "custrecordbin": Number(result.getValue({
                            name: "custrecordbin",
                            join: "cseg_saleschann_new",
                            summary: "GROUP"})),
                        "custbodyconcurrency_level": Number(result.getValue({
                            name: "custbodyconcurrency_level",
                            summary: "GROUP"})),
                        "custrecordlastifinternalid": Number(result.getValue({
                            name: "custrecordlastifinternalid",
                            join: "subsidiary",
                            summary: "GROUP"})),
                        "custbody_binlocation": Number(result.getValue({
                            name: "custbody_binlocation",
                            summary: "GROUP"}))
                    });
                    max1++;

                });
            });

            return  salesOrders;

        } catch (e) {
            log.error({
                title: "searchPendingCustomFulfillOrders",
                details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
            });
        }
    };






    var searchPendingCustomFulFillOrders = function searchPendingCustomFulFillOrders() {
        try {
            let searchSalesOrders = search.load({
                id: "customsearch_bks_ecomm_5_2_2"
            });


            return  searchSalesOrders;

        } catch (e) {
            log.error({
                title: "searchPendingCustomFulfillOrdersP4",
                details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
            });
        }
    };


    var searchInventoryDetailsForItem = function searchInventoryDetailsForItem(item, location, join,saleschannel,binn) {
        try {

            if (binn)
            {
                var itemSearchObj = search.create({
                    type: 'item',
                    filters: [['internalid', 'anyof', item], 'AND',
                        ["".concat(join, ".location"), 'anyof', location], 'AND',
                        ["".concat(join, ".quantityavailable"), 'greaterthan', '0'], 'AND',
                        // ["".concat(join, ".inventorynumber"),"is","qvcdsdummy"], "AND",
                        [["".concat(join,".binnumber"),"anyof",[binn]],"OR",["".concat(join,".binnumber"),"anyof",[binn]]]],

                    columns: [search.createColumn({
                        name: 'quantityavailable',
                        join: join,
                        sort: search.Sort.DESC,
                        label: 'Available'
                    }), search.createColumn({
                        name: 'quantityonhand',
                        join: join,
                        label: 'On Hand'
                    })]
                });
            }
            else
            {
                var itemSearchObj = search.create({
                    type: 'item',
                    filters: [['internalid', 'anyof', item], 'AND',
                        ["".concat(join, ".location"), 'anyof', location], 'AND',
                        ["".concat(join, ".quantityavailable"), 'greaterthan', '0']
                    ],

                    columns: [search.createColumn({
                        name: 'quantityavailable',
                        join: join,
                        sort: search.Sort.DESC,
                        label: 'Available'
                    }), search.createColumn({
                        name: 'quantityonhand',
                        join: join,
                        label: 'On Hand'
                    })]
                });

            }
            if (join === 'inventorynumberbinonhand') {
                itemSearchObj.columns.unshift(search.createColumn({
                    name: 'inventorynumber',
                    join: join,
                    label: 'Inventory Number'
                }));
                itemSearchObj.columns.unshift(search.createColumn({
                    name: 'binnumber',
                    join: join,
                    label: 'Bin Number'
                }));
            } else if (join === 'inventorynumber') {
                itemSearchObj.columns.unshift(search.createColumn({
                    name: 'inventorynumber',
                    join: join,
                    label: 'Inventory Number'
                }));
                itemSearchObj.columns.unshift(search.createColumn({
                    name: 'internalid',
                    join: join,
                    label: 'Internal ID'
                }));
            } else {
                itemSearchObj.columns.unshift(search.createColumn({
                    name: 'binnumber',
                    join: join,
                    label: 'Bin Number'
                }));
            }

            return itemSearchObj;
        } catch (e) {
            log.error({
                title: e.name,
                details: "Could not create Item Inventory Detail Saved Search: ".concat(e.message)
            });
        }
    };



    var transformSOToItemFulfillmentRecord = function transformSOToItemFulfillmentRecord(soId) {
        var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        log.debug({  title: "isDynamic: ", details: isDynamic});
        return record.transform({
            fromType: record.Type.SALES_ORDER,
            fromId: parseInt(soId, 10),
            toType: record.Type.ITEM_FULFILLMENT,
            isDynamic: isDynamic
        });
    };

    var createItemFulfillmentold = function createItemFulfillmentold(customFulfillOrdersRecord) {



        var datetran = new Date();
        log.debug({  title: "customFulfillOrdersRecord: ", details: customFulfillOrdersRecord});
        const soId = customFulfillOrdersRecord.values["GROUP(internalid)"].value;
        const soNo = customFulfillOrdersRecord.values["GROUP(tranid)"].value;
        var saleschannel = customFulfillOrdersRecord.values["GROUP(cseg_saleschann_new)"].value;
        var binn = customFulfillOrdersRecord.values["GROUP(custrecordbin.cseg_saleschann_new)"].value;

        var binn1 = customFulfillOrdersRecord.values["GROUP(custbody_binlocation)"].value;
        //if (binn1 != " ") {binn=binn1;}
        log.debug({  title: "binn1: ", details: binn1});
        var fulfillsts = customFulfillOrdersRecord.values["GROUP(custrecordfulfillment_status.cseg_saleschann_new)"].value;
        var backorder = customFulfillOrdersRecord.values["MAX(formulanumeric)"];

        log.debug({  title: "customFulfillOrdersRecord: ", details: customFulfillOrdersRecord});
        log.debug({  title: "soId: ", details: soId});
        log.debug({  title: "backorder: ", details: backorder});

        var values = {};


        if (backorder==1 ) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Sale Order contains item (s) in backorder"
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;


        }


        try {
            var itemFulfillmentRecord = transformSOToItemFulfillmentRecord(soId);
        } catch (e) {
            log.debug({  title: String(e.name), details:String(e.message)});
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " | " + saleschannel + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;
        }
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }
        itemFulfillmentRecord.setValue('shipmethod', customFulfillOrdersRecord.values["GROUP(shipmethod)"].value);
        itemFulfillmentRecord.setValue('trandate', datetran);
        itemFulfillmentRecord.setValue('shipstatus', endsts);
        itemFulfillmentRecord.setValue('sonum', soNo);
        //itemFulfillmentRecord.setValue('postingperiod', customFulfillOrdersRecord.values["GROUP(postingperiod)"].value);

        var _loop = function _loop(i) {

            var requiredQuantity = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            var item = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            var locitem = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: i
            });

            var itemText = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });



            var fulfillLocation = customFulfillOrdersRecord.values["GROUP(location)"].value;
            if (locitem != 272)
            {
                log.debug("requiredQuantity",requiredQuantity);
                itemFulfillmentRecord.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: requiredQuantity,
                    line: i
                });

                if (inventoryDetailAvail === 'T') {
                    var isSerialItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isserial',
                        line: i
                    }) === 'T';
                    var isLotItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isnumbered',
                        line: i
                    }) === 'T';
                    var useBins = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'binitem',
                        line: i
                    }) === 'T';

                    if (!itemFulfillmentRecord.hasSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    }) && (isSerialItem || isLotItem || useBins)) {
                        var inventoryDetailSubRecord = itemFulfillmentRecord.getSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail',
                            line: i
                        });
                        var join = 'inventorynumberbinonhand';

                        if (useBins && !(isSerialItem || isLotItem)) {
                            join = 'binOnHand';
                        } else if (!useBins && (isSerialItem || isLotItem)) {
                            join = 'inventorynumber';
                        }

                        log.debug({  title: "binn: ", details: binn});
                        var itemInventoryDetails = searchInventoryDetailsForItem(item, locitem, join, saleschannel, binn);

                        var itemSearchResultCount = itemInventoryDetails.runPaged().count;


                        if (!itemSearchResultCount) {
                            log.error({title: itemText, details: "No Inventory Detail"})
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- is not in binlocacion";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("No Inventory Detail for item: ".concat(itemText, " at location ").concat(fulfillLocation));
                        }

                        var inventoryNumberFieldName = useBins ? 'inventorynumber' : 'internalid';
                        var inventoryDetailSubRecordLine = 0;



                       var pagedData = itemInventoryDetails.runPaged({
                            "pageSize" : 1000
                        });

                        pagedData.pageRanges.forEach(function (pageRange) {

                            var page = pagedData.fetch({index: pageRange.index});

                            page.data.forEach(function (result) {

                                log.debug("result",result);


                            var availableQuantity = result.getValue({
                                name: 'quantityavailable',
                                join: join
                            });

                                if (requiredQuantity==0) {return true; }

                           var invAssignmentLineCount = inventoryDetailSubRecord.getLineCount('inventoryassignment');

                            if (invAssignmentLineCount) {
                                requiredQuantity = 0;
                                return false;
                            }


                     
                            inventoryDetailSubRecord = inventoryDetailSubRecord.insertLine({
                                sublistId: 'inventoryassignment',
                                line: inventoryDetailSubRecordLine,
                                ignoreRecalc: true
                            });

                                if (isSerialItem || isLotItem) {
                                    log.debug({  title: "isSerialItem: ", details: isSerialItem});
                                    log.debug({  title: "isLotItem: ", details: isLotItem});
                                    inventoryDetailSubRecord.setSublistValue({
                                        sublistId: 'inventoryassignment',
                                        fieldId: 'issueinventorynumber',
                                        value: result.getValue({
                                            name: inventoryNumberFieldName,
                                            join: join
                                        }),
                                        line: inventoryDetailSubRecordLine
                                    });
                                    log.debug({  title: "inventoryNumberFieldName: ", details: result.getValue({
                                            name: inventoryNumberFieldName,
                                            join: join
                                        })});
                                }

                                if (useBins) {
                                    log.debug({  title: "useBins: ", details: useBins});
                                    inventoryDetailSubRecord.setSublistValue({
                                        sublistId: 'inventoryassignment',
                                        fieldId: 'binnumber',
                                        value: result.getValue({
                                            name: 'binnumber',
                                            join: join
                                        }),
                                        line: inventoryDetailSubRecordLine
                                    });
                                    log.debug({  title: "binnumber: ", details: result.getValue({
                                            name: 'binnumber',
                                            join: join
                                        })});
                                }
                                qtypro=availableQuantity < requiredQuantity ? availableQuantity : requiredQuantity;
                                requiredQuantity -= qtypro
                                log.debug("4-qtypro",qtypro);

                            inventoryDetailSubRecord.setSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: qtypro,
                                line: inventoryDetailSubRecordLine
                            });


                                inventoryDetailSubRecordLine += 1;


                        });
                    });
                        if (requiredQuantity) {
                            log.error({title: itemText, details: "Not Enough Quantity"});
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- Not Enough Quantity";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("Required quantity for item: ".concat(itemText, " cannot be fulfilled"));
                        }

                    }
                }

            }

        };

        var itemFulfillmentLineCount = itemFulfillmentRecord.getLineCount('item');

        for (var i = 0; i < itemFulfillmentLineCount; i += 1) {
            _loop(i);
        }



        try {
            var itemFulfillmentRecordId = itemFulfillmentRecord.save();



        } catch (e) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            return;
        }

        irec++;
        log.debug({  title: "itemFulfillmentRecordId: ", details: itemFulfillmentRecordId + " record: " + irec});



        /*
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }

        record.submitFields({
            type: record.Type.ITEM_FULFILLMENT,
            id: itemFulfillmentRecordId,
            values: {
                shipstatus: endsts,
                trandate: getNSDate(datetran)
            }
        });
         */

        var values = {};
        values["custbody_ffstatus"] = 3;
        values["custbody_fferror"] = "Done";
        values["custbody_fferrorqty"] = 0;

        submitCustomFulfillOrdersRecordFields({
            type: "salesorder",
            id: soId,
            values: values
        });

        log.audit("Processed " + String(soId) + " record: " + irec)
        if (irec>19) {
            log.audit("Ending "  + irec)

            return true;}
    };

    var createItemFulfillment = function createItemFulfillment(customFulfillOrdersRecord) {



        var datetran = new Date();
        log.debug({  title: "customFulfillOrdersRecord: ", details: customFulfillOrdersRecord});
        const soId = customFulfillOrdersRecord.values["GROUP(internalid)"].value;
        const soNo = customFulfillOrdersRecord.values["GROUP(tranid)"].value;
        var saleschannel = customFulfillOrdersRecord.values["GROUP(cseg_saleschann_new)"].value;
        var binn = customFulfillOrdersRecord.values["GROUP(custrecordbin.cseg_saleschann_new)"].value;
        log.debug({  title: "binn: ", details: binn});
        var binn1 = customFulfillOrdersRecord.values["GROUP(custbody_binlocation)"].value;

        if (binn1) {binn=binn1;}
        log.debug({  title: "binn1: ", details: binn1});
        var fulfillsts = customFulfillOrdersRecord.values["GROUP(custrecordfulfillment_status.cseg_saleschann_new)"].value;
        var backorder = customFulfillOrdersRecord.values["MAX(formulanumeric)"];

        log.debug({  title: "customFulfillOrdersRecord: ", details: customFulfillOrdersRecord});
        log.debug({  title: "soId: ", details: soId});
        log.debug({  title: "backorder: ", details: backorder});

        var values = {};


        if (backorder==1 ) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Sale Order contains item (s) in backorder"
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;


        }


        try {
            var itemFulfillmentRecord = transformSOToItemFulfillmentRecord(soId);
        } catch (e) {
            log.debug({  title: String(e.name), details:String(e.message)});
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " | " + saleschannel + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;
        }
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }
        itemFulfillmentRecord.setValue('shipmethod', customFulfillOrdersRecord.values["GROUP(shipmethod)"].value);
        itemFulfillmentRecord.setValue('trandate', datetran);
        itemFulfillmentRecord.setValue('shipstatus', endsts);
        itemFulfillmentRecord.setValue('sonum', soNo);
        //itemFulfillmentRecord.setValue('postingperiod', customFulfillOrdersRecord.values["GROUP(postingperiod)"].value);

        var _loop = function _loop(i) {

            var requiredQuantity = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            var item = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            var locitem = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: i
            });

            var itemText = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });



            var fulfillLocation = customFulfillOrdersRecord.values["GROUP(location)"].value;
            if (locitem != 272)
            {
                itemFulfillmentRecord.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: requiredQuantity,
                    line: i
                });

                if (inventoryDetailAvail === 'T') {
                    var isSerialItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isserial',
                        line: i
                    }) === 'T';
                    var isLotItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isnumbered',
                        line: i
                    }) === 'T';
                    var useBins = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'binitem',
                        line: i
                    }) === 'T';

                    if (!itemFulfillmentRecord.hasSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    }) && (isSerialItem || isLotItem || useBins)) {
                        var inventoryDetailSubRecord = itemFulfillmentRecord.getSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail',
                            line: i
                        });
                        var join = 'inventorynumberbinonhand';

                        if (useBins && !(isSerialItem || isLotItem)) {
                            join = 'binOnHand';
                        } else if (!useBins && (isSerialItem || isLotItem)) {
                            join = 'inventorynumber';
                        }


                        var itemInventoryDetails = searchInventoryDetailsForItem(item, locitem, join, saleschannel, binn);

                        var itemSearchResultCount = itemInventoryDetails.runPaged().count;


                        if (!itemSearchResultCount) {
                            log.error({title: itemText, details: "No Inventory Detail"})
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- is not in binlocacion";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("No Inventory Detail for item: ".concat(itemText, " at location ").concat(fulfillLocation));
                        }

                        var inventoryNumberFieldName = useBins ? 'inventorynumber' : 'internalid';
                        var inventoryDetailSubRecordLine = 0;
                        itemInventoryDetails.run().each(function (result) {

                            var availableQuantity = result.getValue({
                                name: 'quantityavailable',
                                join: join
                            });

                            var invAssignmentLineCount = inventoryDetailSubRecord.getLineCount('inventoryassignment');

                            if (invAssignmentLineCount && inventoryDetailSubRecordLine==0) {
                                requiredQuantity = 0;
                                return false;
                            }

                            inventoryDetailSubRecord = inventoryDetailSubRecord.insertLine({
                                sublistId: 'inventoryassignment',
                                line: inventoryDetailSubRecordLine,
                                ignoreRecalc: true
                            });

                            if (isSerialItem || isLotItem) {
                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'issueinventorynumber',
                                    value: result.getValue({
                                        name: inventoryNumberFieldName,
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });
                            }

                            if (useBins) {
                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'binnumber',
                                    value: result.getValue({
                                        name: 'binnumber',
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });
                            }

                            inventoryDetailSubRecord.setSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: availableQuantity < requiredQuantity ? availableQuantity : requiredQuantity,
                                line: inventoryDetailSubRecordLine
                            });

                            if (availableQuantity < requiredQuantity) {
                                requiredQuantity -= availableQuantity;
                                inventoryDetailSubRecordLine += 1;
                                return true;
                            }
                            requiredQuantity = 0;
                        });

                        if (requiredQuantity) {
                            log.error({title: itemText, details: "Not Enough Quantity"});
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- Not Enough Quantity";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("Required quantity for item: ".concat(itemText, " cannot be fulfilled"));
                        }

                    }
                }

            }

        };

        var itemFulfillmentLineCount = itemFulfillmentRecord.getLineCount('item');

        for (var i = 0; i < itemFulfillmentLineCount; i += 1) {
            _loop(i);
        }



        try {
            var itemFulfillmentRecordId = itemFulfillmentRecord.save();



        } catch (e) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            return;
        }

        irec++;
        log.debug({  title: "itemFulfillmentRecordId: ", details: itemFulfillmentRecordId + " record: " + irec});



        /*
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }

        record.submitFields({
            type: record.Type.ITEM_FULFILLMENT,
            id: itemFulfillmentRecordId,
            values: {
                shipstatus: endsts,
                trandate: getNSDate(datetran)
            }
        });
         */

        var values = {};
        values["custbody_ffstatus"] = 3;
        values["custbody_fferror"] = "Done";
        values["custbody_fferrorqty"] = 0;

        submitCustomFulfillOrdersRecordFields({
            type: "salesorder",
            id: soId,
            values: values
        });

        log.audit("Processed " + String(soId) + " record: " + irec)
        if (irec>19) {
            log.audit("Ending "  + irec)

            return true;}
    };

    // new begin

    var createItemFulfillmentnew = function createItemFulfillmentnew(customFulfillOrdersRecord) {


        var datetran = new Date();

        const soId = customFulfillOrdersRecord["internalid"];
        const soNo = customFulfillOrdersRecord["GROUP(tranid)"];
        var saleschannel = customFulfillOrdersRecord["cseg_saleschann_new"];
        var binn = customFulfillOrdersRecord["custrecordbin"];
        var binn1 = customFulfillOrdersRecord["custbody_binlocation"];
        if (binn1) {binn=binn1;}

        log.debug({  title: "binn1: ", details: binn1});
        var fulfillsts = customFulfillOrdersRecord["custrecordfulfillment_status"];
        var shipmethod = customFulfillOrdersRecord["shipmethod"];
        var fulfillLocation = customFulfillOrdersRecord["internalidlocation"];

        log.debug({  title: "soId: ", details: soId});
        log.debug({  title: "customFulfillOrdersRecord: ", details: customFulfillOrdersRecord});

        var values = {};


        try {
            var itemFulfillmentRecord = transformSOToItemFulfillmentRecord(soId);
        } catch (e) {
            log.debug({  title: String(e.name), details:String(e.message)});
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " | " + saleschannel + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;
        }
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }
        itemFulfillmentRecord.setValue('shipmethod', shipmethod);
        itemFulfillmentRecord.setValue('trandate', datetran);
        itemFulfillmentRecord.setValue('shipstatus', endsts);
        itemFulfillmentRecord.setValue('sonum', soNo);

        var _loop = function _loop(i) {

            var requiredQuantity = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            var item = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            var locitem = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: i
            });

            var itemText = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });




            if (locitem != 272)
            {
                itemFulfillmentRecord.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: requiredQuantity,
                    line: i
                });

                if (inventoryDetailAvail === 'T') {
                    var isSerialItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isserial',
                        line: i
                    }) === 'T';
                    var isLotItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isnumbered',
                        line: i
                    }) === 'T';
                    var useBins = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'binitem',
                        line: i
                    }) === 'T';

                    if (!itemFulfillmentRecord.hasSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    }) && (isSerialItem || isLotItem || useBins)) {
                        var inventoryDetailSubRecord = itemFulfillmentRecord.getSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail',
                            line: i
                        });
                        var join = 'inventorynumberbinonhand';

                        if (useBins && !(isSerialItem || isLotItem)) {
                            join = 'binOnHand';
                        } else if (!useBins && (isSerialItem || isLotItem)) {
                            join = 'inventorynumber';
                        }


                        var itemInventoryDetails = searchInventoryDetailsForItem(item, locitem, join, saleschannel, binn);

                        var itemSearchResultCount = itemInventoryDetails.runPaged().count;


                        if (!itemSearchResultCount) {
                            log.error({title: itemText, details: "No Inventory Detail"})
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- is not in binlocacion";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("No Inventory Detail for item: ".concat(itemText, " at location ").concat(fulfillLocation));
                        }

                        var inventoryNumberFieldName = useBins ? 'inventorynumber' : 'internalid';
                        var inventoryDetailSubRecordLine = 0;


                        var pagedData = itemInventoryDetails.runPaged({
                            "pageSize" : 1000
                        });

                        pagedData.pageRanges.forEach(function (pageRange) {

                            var page = pagedData.fetch({index: pageRange.index});

                            page.data.forEach(function (result) {

                                log.debug("item",item);

                            var availableQuantity = result.getValue({
                                name: 'quantityavailable',
                                join: join
                            });

                                var invAssignmentLineCount = inventoryDetailSubRecord.getLineCount('inventoryassignment');
                                log.debug({  title: "invAssignmentLineCount: ", details: invAssignmentLineCount});
                                if (invAssignmentLineCount && inventoryDetailSubRecordLine==0) {
                                    requiredQuantity = 0;
                                    return false;
                                }
                                if (requiredQuantity==0) {
                                    log.debug({  title: "true: ", details: true});
                                    return true; }
                                log.debug({  title: "result: ", details: result});


                            inventoryDetailSubRecord = inventoryDetailSubRecord.insertLine({
                                sublistId: 'inventoryassignment',
                                line: inventoryDetailSubRecordLine,
                                ignoreRecalc: true
                            });

                            if (isSerialItem || isLotItem) {

                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'issueinventorynumber',
                                    value: result.getValue({
                                        name: inventoryNumberFieldName,
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });

                            }

                            if (useBins) {
                                log.debug({  title: "useBins: ", details: useBins});
                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'binnumber',
                                    value: result.getValue({
                                        name: 'binnumber',
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });

                            }
                                qtypro=availableQuantity < requiredQuantity ? availableQuantity : requiredQuantity;
                                requiredQuantity -= qtypro
                                log.debug("4-qtypro",qtypro);
                            inventoryDetailSubRecord.setSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: qtypro,
                                line: inventoryDetailSubRecordLine
                            });

                                inventoryDetailSubRecordLine += 1;
                        });
                            log.debug({  title: "aftertrue: ", details: true});
                    });

                        if (requiredQuantity) {
                            log.error({title: itemText, details: "Not Enough Quantity"});
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- Not Enough Quantity";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("Required quantity for item: ".concat(itemText, " cannot be fulfilled"));
                        }

                    }
                }

            }

        };

        var itemFulfillmentLineCount = itemFulfillmentRecord.getLineCount('item');

        for (var i = 0; i < itemFulfillmentLineCount; i += 1) {
            _loop(i);
        }



        try {
            var itemFulfillmentRecordId = itemFulfillmentRecord.save();



        } catch (e) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            return;
        }

        irec++;
        log.debug({  title: "itemFulfillmentRecordId: ", details: itemFulfillmentRecordId + " record: " + irec});



        /*
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }

        record.submitFields({
            type: record.Type.ITEM_FULFILLMENT,
            id: itemFulfillmentRecordId,
            values: {
                shipstatus: endsts,
                trandate: getNSDate(datetran)
            }
        });
         */

        var values = {};
        values["custbody_ffstatus"] = 3;
        values["custbody_fferror"] = "Done";
        values["custbody_fferrorqty"] = 0;

        submitCustomFulfillOrdersRecordFields({
            type: "salesorder",
            id: soId,
            values: values
        });

        log.audit("Processed " + String(soId) + " record: " + irec)
        if (irec>19) {
            log.audit("Ending "  + irec)

            return true;}
    };


    // new end

    // old p4 begin

    var createItemFulfillmentp4 = function createItemFulfillmentp4(customFulfillOrdersRecord) {



        var datetran = new Date();

        const soId = customFulfillOrdersRecord["internalid"];
        const soNo = customFulfillOrdersRecord["GROUP(tranid)"];
        var saleschannel = customFulfillOrdersRecord["cseg_saleschann_new"];
        var binn = customFulfillOrdersRecord["custrecordbin"];
        var binn1 = customFulfillOrdersRecord["custbody_binlocation"];
        if (binn1) {binn=binn1;}

        log.debug({  title: "binn1: ", details: binn1});
        var fulfillsts = customFulfillOrdersRecord["custrecordfulfillment_status"];
        var shipmethod = customFulfillOrdersRecord["shipmethod"];
        var fulfillLocation = customFulfillOrdersRecord["internalidlocation"];

        log.debug({  title: "soId: ", details: soId});
        log.debug({  title: "customFulfillOrdersRecord: ", details: customFulfillOrdersRecord});

        var values = {};


        try {
            var itemFulfillmentRecord = transformSOToItemFulfillmentRecord(soId);
        } catch (e) {
            log.debug({  title: String(e.name), details:String(e.message)});
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " | " + saleschannel + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;
        }
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }
        log.debug({  title: "fulfillsts: ", details: fulfillsts});

        itemFulfillmentRecord.setValue('shipmethod', shipmethod);
        log.debug({  title: "shipmethod: ", details: shipmethod});
        itemFulfillmentRecord.setValue('trandate', datetran);
        log.debug({  title: "datetran: ", details: datetran});
        itemFulfillmentRecord.setValue('shipstatus', endsts);
        log.debug({  title: "endsts: ", details: endsts});

        itemFulfillmentRecord.setValue('sonum', soNo);


        var _loop = function _loop(i) {

            var requiredQuantity = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            var item = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            var locitem = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'location',
                line: i
            });

            var itemText = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });




            if (locitem != 272)
            {
                itemFulfillmentRecord.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: requiredQuantity,
                    line: i
                });

                if (inventoryDetailAvail === 'T') {
                    var isSerialItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isserial',
                        line: i
                    }) === 'T';
                    var isLotItem = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'isnumbered',
                        line: i
                    }) === 'T';
                    var useBins = itemFulfillmentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'binitem',
                        line: i
                    }) === 'T';

                    if (!itemFulfillmentRecord.hasSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    }) && (isSerialItem || isLotItem || useBins)) {
                        var inventoryDetailSubRecord = itemFulfillmentRecord.getSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail',
                            line: i
                        });
                        var join = 'inventorynumberbinonhand';

                        if (useBins && !(isSerialItem || isLotItem)) {
                            join = 'binOnHand';
                        } else if (!useBins && (isSerialItem || isLotItem)) {
                            join = 'inventorynumber';
                        }


                        var itemInventoryDetails = searchInventoryDetailsForItem(item, locitem, join, saleschannel, binn);

                        var itemSearchResultCount = itemInventoryDetails.runPaged().count;


                        if (!itemSearchResultCount) {
                            log.error({title: itemText, details: "No Inventory Detail"})
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- is not in binlocacion";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("No Inventory Detail for item: ".concat(itemText, " at location ").concat(fulfillLocation));
                        }

                        var inventoryNumberFieldName = useBins ? 'inventorynumber' : 'internalid';
                        var inventoryDetailSubRecordLine = 0;
                        itemInventoryDetails.run().each(function (result) {
                            log.debug({  title: "result: ", details: result});
                            log.debug("item",item);

                            var availableQuantity = result.getValue({
                                name: 'quantityavailable',
                                join: join
                            });
                            log.debug({  title: "availableQuantity: ", details: availableQuantity});
                            var invAssignmentLineCount = inventoryDetailSubRecord.getLineCount('inventoryassignment');
                            log.debug({  title: "invAssignmentLineCount: ", details: invAssignmentLineCount});
                            if (invAssignmentLineCount) {
                                requiredQuantity = 0;
                                return false;
                            }

                            inventoryDetailSubRecord = inventoryDetailSubRecord.insertLine({
                                sublistId: 'inventoryassignment',
                                line: inventoryDetailSubRecordLine,
                                ignoreRecalc: true
                            });

                            if (isSerialItem || isLotItem) {
                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'issueinventorynumber',
                                    value: result.getValue({
                                        name: inventoryNumberFieldName,
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });
                            }

                            if (useBins) {
                                inventoryDetailSubRecord.setSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'binnumber',
                                    value: result.getValue({
                                        name: 'binnumber',
                                        join: join
                                    }),
                                    line: inventoryDetailSubRecordLine
                                });
                            }
                            log.debug({  title: "quantity: ", details: availableQuantity < requiredQuantity ? availableQuantity : requiredQuantity});

                            inventoryDetailSubRecord.setSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: availableQuantity < requiredQuantity ? availableQuantity : requiredQuantity,
                                line: inventoryDetailSubRecordLine
                            });
                            log.debug({  title: "availableQuantity: ", details: availableQuantity});
                            log.debug({  title: "requiredQuantity: ", details: requiredQuantity});
                            log.debug({  title: "inventoryDetailSubRecordLine: ", details: inventoryDetailSubRecordLine});
                            if (availableQuantity < requiredQuantity) {
                                requiredQuantity -= availableQuantity;
                                inventoryDetailSubRecordLine += 1;
                                return true;
                            }
                            requiredQuantity = 0;
                        });

                        if (requiredQuantity) {
                            log.error({title: itemText, details: "Not Enough Quantity"});
                            var values = {};
                            values["custbody_ffstatus"] = 2;
                            values["custbody_fferror"] = itemText + "- Not Enough Quantity";
                            values["custbody_fferrorqty"] = requiredQuantity;
                            submitCustomFulfillOrdersRecordFields({
                                type: "salesorder",
                                id: soId,
                                values: values
                            });
                            throw new Error("Required quantity for item: ".concat(itemText, " cannot be fulfilled"));
                        }

                    }
                }

            }

        };

        var itemFulfillmentLineCount = itemFulfillmentRecord.getLineCount('item');

        for (var i = 0; i < itemFulfillmentLineCount; i += 1) {
            _loop(i);
        }



        try {
            var itemFulfillmentRecordId = itemFulfillmentRecord.save();



        } catch (e) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " Error Message: " + String(e.message)
            values["custbody_fferrorqty"] = 0;
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            return;
        }

        irec++;
        log.debug({  title: "itemFulfillmentRecordId: ", details: itemFulfillmentRecordId + " record: " + irec});



        /*
        if (fulfillsts=='1')  {endsts="A"}
        else {
            if (fulfillsts=='2')  {endsts="B"}
            else {
                if (fulfillsts=='3')  {endsts="C"}
                else                    {endsts="B"}
            }
        }

        record.submitFields({
            type: record.Type.ITEM_FULFILLMENT,
            id: itemFulfillmentRecordId,
            values: {
                shipstatus: endsts,
                trandate: getNSDate(datetran)
            }
        });
         */

        var values = {};
        values["custbody_ffstatus"] = 3;
        values["custbody_fferror"] = "Done";
        values["custbody_fferrorqty"] = 0;

        submitCustomFulfillOrdersRecordFields({
            type: "salesorder",
            id: soId,
            values: values
        });

        log.audit("Processed " + String(soId) + " record: " + irec)
        if (irec>19) {
            log.audit("Ending "  + irec)

            return true;}
    };

    // old p4 end

    var submitCustomFulfillOrdersRecordFields = function submitCustomFulfillOrdersRecordFields(options) {

        return record.submitFields(options);
    };

    var getNSDate = function getNSDate(date) {
        var vDate = null;

        try {
            var dateMatch = /(\d{1,2})[/-](\d{1,2})[/-](\d{1,4})/.exec(date);

            if (dateMatch) {
                var _dateMatch = _slicedToArray(dateMatch, 4),
                    month = _dateMatch[1],
                    day = _dateMatch[2],
                    year = _dateMatch[3];

                vDate = new Date(year, month - 1, day);
                return vDate;
            }
        } catch (e) {
            log.error({
                title: e.name,
                details: "".concat(e.message, ". Created new Date() instead.")
            });
        }

        return new Date();
    };



    return {
        searchPendingCustomFulFillOrders: searchPendingCustomFulFillOrders,
        searchPendingCustomFulFillOrdersP4: searchPendingCustomFulFillOrdersP4,
        searchPendingCustomFulFillOrdersP4new: searchPendingCustomFulFillOrdersP4new,
        searchInventoryDetailsForItem: searchInventoryDetailsForItem,
        transformSOToItemFulfillmentRecord: transformSOToItemFulfillmentRecord,
        createItemFulfillment: createItemFulfillment,
        createItemFulfillmentnew: createItemFulfillmentnew,
        createItemFulfillmentp4: createItemFulfillmentp4,
        submitCustomFulfillOrdersRecordFields: submitCustomFulfillOrdersRecordFields,
    };
});