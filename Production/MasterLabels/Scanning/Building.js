/**
 * [Folio3 License]
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

   

    var searchInventoryDetailsForItem = function searchInventoryDetailsForItem(item, location, join,binn) {
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



    var transformSOToItemBuildingRecord = function transformSOToItemBuildingRecord(woId) {
        var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return record.transform({
            fromType: "workorder",
            fromId: woId,
            toType: "assemblybuild",
            isDynamic: true
        });
    };

    var createItemBuilding = function createItemBuilding(customFulfillOrdersRecord) {

        var datetran = new Date();

        const soId = customFulfillOrdersRecord.values["GROUP(internalid)"].value;
        var saleschannel = customFulfillOrdersRecord.values["GROUP(cseg_saleschann_new)"].value;
        var binn = customFulfillOrdersRecord.values["GROUP(custrecordbin.cseg_saleschann_new)"].value;
        var fulfillsts = customFulfillOrdersRecord.values["GROUP(custrecordfulfillment_status.cseg_saleschann_new)"].value;

        var values = {};


            var varrut = GENERALTOOLS.get_SO_value(soId);

            if (varrut.backorder ) {
                values["custbody_ffstatus"] = 2;
                values["custbody_fferror"] = "Sale Order contains item (s) in backorder"
                submitCustomFulfillOrdersRecordFields({
                    type: "salesorder",
                    id: soId,
                    values: values
                });
                return;


            }


        try {
            var itemBuildingRecord = transformSOToItemBuildingRecord(soId);
        } catch (e) {
            values["custbody_ffstatus"] = 2;
            values["custbody_fferror"] = "Error Name: " + String(e.name) + " | " + saleschannel + " Error Message: " + String(e.message)
            submitCustomFulfillOrdersRecordFields({
                type: "salesorder",
                id: soId,
                values: values
            });
            return;
        }

        itemBuildingRecord.setValue('shipmethod', customFulfillOrdersRecord.values["GROUP(shipmethod)"].value);
        itemBuildingRecord.setValue('trandate', datetran);
        //itemBuildingRecord.setValue('postingperiod', customFulfillOrdersRecord.values["GROUP(postingperiod)"].value);

        var _loop = function _loop(i) {

            var requiredQuantity = itemBuildingRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantityremaining',
                line: i
            });
            var inventoryDetailAvail = itemBuildingRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'inventorydetailavail',
                line: i
            });
            var item = itemBuildingRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });
            var itemText = itemBuildingRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });
            itemBuildingRecord.setSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: requiredQuantity,
                line: i
            });

            var fulfillLocation = customFulfillOrdersRecord.values["GROUP(location)"].value;


            if (inventoryDetailAvail === 'T') {
                var isSerialItem = itemBuildingRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'isserial',
                    line: i
                }) === 'T';
                var isLotItem = itemBuildingRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'isnumbered',
                    line: i
                }) === 'T';
                var useBins = itemBuildingRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'binitem',
                    line: i
                }) === 'T';







                if (!itemBuildingRecord.hasSublistSubrecord({
                    sublistId: 'item',
                    fieldId: 'inventorydetail',
                    line: i
                }) && (isSerialItem || isLotItem || useBins)) {
                    var inventoryDetailSubRecord = itemBuildingRecord.getSublistSubrecord({
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


                    var itemInventoryDetails = searchInventoryDetailsForItem(item, fulfillLocation, join,binn);

                    var itemSearchResultCount = itemInventoryDetails.runPaged().count;

                    log.debug({  title: "itemSearchResultCount: ", details: itemSearchResultCount});
                    if (!itemSearchResultCount) {
                        log.error({title: itemText, details: "No Inventory Detail"})
                        var values = {};
                        values["custbody_ffstatus"] = 2;
                        values["custbody_fferror"] = "Sale Order contains item (s) is not in binlocacion";
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
                        log.error({title: itemText, details: "Not Enough Quantity"})
                        throw new Error("Required quantity for item: ".concat(itemText, " cannot be fulfilled"));
                    }

                }
            }
        };

        var itemBuildingLineCount = itemBuildingRecord.getLineCount('item');

        for (var i = 0; i < itemBuildingLineCount; i += 1) {
            _loop(i);
        }
        log.debug({  title: "itemBuildingRecord ", details: itemBuildingRecord});


        try {
            var itemBuildingRecordId = itemBuildingRecord.save();



        } catch (e) {
            log.debug({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
            return;
        }


        log.debug({  title: "itemBuildingRecordId: ", details: itemBuildingRecordId + " record: " + irec});

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
            id: itemBuildingRecordId,
            values: {
                shipstatus: endsts,
                trandate: getNSDate(datetran)
            }
        });
        var values = {};
        values["custbody_ffstatus"] = 3;
        values["custbody_fferror"] = "Done";

        submitCustomFulfillOrdersRecordFields({
            type: "salesorder",
            id: soId,
            values: values
        });

        log.audit("Processed " + String(soId) + " record: " + irec)
    };

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
        searchInventoryDetailsForItem: searchInventoryDetailsForItem,
        transformSOToItemBuildingRecord: transformSOToItemBuildingRecord,
        createItemBuilding: createItemBuilding,
        submitCustomFulfillOrdersRecordFields: submitCustomFulfillOrdersRecordFields,
    };
});