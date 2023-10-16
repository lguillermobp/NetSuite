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

define(['N/log', 'N/search', 'N/record', '../common/f3_bm_constants'], function (log, search, record, CONSTANTS_MODULE) {
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

    var CUSTOM_FULFILL_ORDERS_FORM = CONSTANTS_MODULE.PAGE.FORMS.CUSTOM_FULFILL_ORDERS;
    var CUSTOM_FULFILL_ORDERS = CONSTANTS_MODULE.CUSTOM_RECORDS.CUSTOM_FULFILL_ORDERS;

    var setFilters = function setFilters(searchObj, context) {
        if (context.request.method === 'POST') {
            var custpage_f3_is_filter = context.request.parameters[CUSTOM_FULFILL_ORDERS_FORM.FIELDS.IS_FILTER.ID];
            var custpage_f3_entity = context.request.parameters[CUSTOM_FULFILL_ORDERS_FORM.FIELDS.ENTITY.ID];
            var custpage_f3_bosslocation = context.request.parameters[CUSTOM_FULFILL_ORDERS_FORM.FIELDS.BULK_FILL_FROM_LOCATION.ID];
            var custpage_f3_cseg_saleschann_new = context.request.parameters[CUSTOM_FULFILL_ORDERS_FORM.FIELDS.SALES_CHANNEL.ID];

            if (custpage_f3_is_filter === 'T') {
                if (custpage_f3_entity) {
                    searchObj.filters.push(search.createFilter({
                        name: 'internalid',
                        operator: search.Operator.ANYOF,
                        join: 'customer',
                        values: custpage_f3_entity
                    }));
                }

                if (custpage_f3_bosslocation) {
                    searchObj.filters.push(search.createFilter({
                        name: 'location',
                        operator: search.Operator.ANYOF,
                        values: custpage_f3_bosslocation
                    }));
                }

                if (custpage_f3_cseg_saleschann_new) {
                    searchObj.filters.push(search.createFilter({
                        name: CUSTOM_FULFILL_ORDERS_FORM.SUBLISTS.ORDERS.FIELDS.SALES_CHANNEL.SEARCH_COLUMN,
                        operator: search.Operator.ANYOF,
                        values: custpage_f3_cseg_saleschann_new
                    }));
                }
            }
        }
    };

    var searchPendingFulfillmentSO = function searchPendingFulfillmentSO(context, perPage) {
        try {
            var transactionSearchObj = search.create({
                type: search.Type.SALES_ORDER,
                filters: [['status', 'anyof', 'SalesOrd:B', 'SalesOrd:D'], 'AND', ['mainline', 'is', 'T']],
                columns: [search.createColumn({
                    name: 'trandate',
                    sort: search.Sort.ASC,
                    label: 'DATE'
                }), search.createColumn({
                    name: 'tranid',
                    label: 'ORDER #'
                }), search.createColumn({
                    name: 'altname',
                    join: 'customer',
                    label: 'CUSTOMER NAME'
                }), search.createColumn({
                    name: CUSTOM_FULFILL_ORDERS_FORM.SUBLISTS.ORDERS.FIELDS.SALES_CHANNEL.SEARCH_COLUMN,
                    label: 'Sales Channel'
                }), search.createColumn({
                    name: 'internalid',
                    label: 'Internal ID'
                }), search.createColumn({
                    name: 'memo',
                    label: 'MEMO'
                }), search.createColumn({
                    name: 'shipto',
                    label: 'SHIP TO'
                }), search.createColumn({
                    name: 'shipmethod',
                    label: 'SHIP METHOD'
                })]
            });
            setFilters(transactionSearchObj, context);
            var pagedData = transactionSearchObj.runPaged({
                pageSize: perPage || CUSTOM_FULFILL_ORDERS_FORM.PER_PAGE
            });
            return pagedData;
        } catch (e) {
            log.error({
                title: e.name,
                details: e.message
            });
        }
    };

    var saveCustomFulfillOrdersRecord = function saveCustomFulfillOrdersRecord(data) {
        var customFulfillOrdersRecord = record.create({
            type: CUSTOM_FULFILL_ORDERS.ID,
            isDynamic: false
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.DATE.ID,
            value: getNSDate(data.custpage_f3_trandate || data.date)
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.SALES_ORDER_ID.ID,
            value: data.orderNum
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.SHIP_STATUS.ID,
            value: data.custpage_f3_shipstatus || data.shipTo
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.SHIP_VIA.ID,
            value: data.custpage_f3_shipmethod || data.shipmethod
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.WEIGHT.ID,
            value: data.weightLbs
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.TRACKING_NUMBER.ID,
            value: data.trackingNum
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.ACCOUNTING_PERIOD.ID,
            value: data.custpage_f3_postingperiod
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.FULFILLMENT_LOCATION.ID,
            value: data.custpage_f3_bosslocation
        });
        customFulfillOrdersRecord.setValue({
            fieldId: CUSTOM_FULFILL_ORDERS.FIELDS.PROCESS_STATUS.ID,
            value: CONSTANTS_MODULE.PROCESS_STATUS.PENDING.ID
        });
        var customFulfillOrdersRecordId = customFulfillOrdersRecord.save();
        log.debug('customFulfillOrdersRecordId', customFulfillOrdersRecordId);
        return customFulfillOrdersRecordId;
    };

    var searchPendingCustomFulFillOrders = function searchPendingCustomFulFillOrders() {
        try {
            return search.create({
                type: 'customrecord_f3_custom_fulfill_orders',
                filters: ['custrecord_f3_process_status', 'anyof', '[1, 3]'],
                columns: [search.createColumn({
                    name: 'id',
                    sort: search.Sort.ASC,
                    label: 'ID'
                }), search.createColumn({
                    name: 'custrecord_f3_accounting_period',
                    label: 'Accounting Period'
                }), search.createColumn({
                    name: 'custrecord_f3_ship_via',
                    label: 'Ship Via'
                }), search.createColumn({
                    name: 'custrecord_f3_sales_order_id',
                    label: 'Sales Order Id'
                }), search.createColumn({
                    name: 'custrecord_f3_weight',
                    label: 'Weight'
                }), search.createColumn({
                    name: 'custrecord_f3_tracking_number',
                    label: 'Tracking Number'
                }), search.createColumn({
                    name: 'custrecord_f3_transaction_date',
                    label: 'Transaction Date'
                }), search.createColumn({
                    name: 'custrecord_f3_ship_status_to',
                    label: 'Ship Status To'
                }), search.createColumn({
                    name: 'custrecord_f3_fulfillment_location',
                    label: 'Fulfillment Location'
                })]
            });
        } catch (e) {
            log.error({
                title: "searchPendingCustomFulfillOrders",
                details: "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
            });
        }
    };



    var searchInventoryDetailsForItem = function searchInventoryDetailsForItem(item, location, join) {
        try {
            var d = new Date();
            var n = d.getHours();
            if (n < 12) {binn="3097";} // Mercantile
            else        {binn="7545"; } // QVC DS
            log.debug('bin', binn);

            var itemSearchObj = search.create({
                type: 'item',
                filters: [['internalid', 'anyof', item], 'AND',
                    ["".concat(join, ".location"), 'anyof', location], 'AND',
                    ["".concat(join, ".quantityavailable"), 'greaterthan', '0'], 'AND',
                    ["".concat(join, ".binnumber"), 'anyof', binn]], // Orlando P3  "Prod-P3" bin
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

    var getFulfillmentsOfSO = function getFulfillmentsOfSO(soId) {
        return search.create({
            type: search.Type.SALES_ORDER,
            filters: [['applyingtransaction.type', 'anyof', 'ItemShip'], 'AND', ['internalid', 'anyof', soId], 'AND', ['mainline', 'is', 'F'], 'AND', ['applyingtransaction.mainline', 'is', 'T']],
            columns: [search.createColumn({
                name: 'internalid',
                join: 'applyingTransaction',
                label: 'Internal ID'
            })]
        });
    };

    var transformSOToItemFulfillmentRecord = function transformSOToItemFulfillmentRecord(soId) {
        var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return record.transform({
            fromType: record.Type.SALES_ORDER,
            fromId: parseInt(soId, 10),
            toType: record.Type.ITEM_FULFILLMENT,
            isDynamic: isDynamic
        });
    };

    var createItemFulfillment = function createItemFulfillment(customFulfillOrdersRecord) {
        const soId = customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.SALES_ORDER_ID.ID].value
        var values = {};

        try {
            var itemFulfillmentRecord = transformSOToItemFulfillmentRecord(customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.SALES_ORDER_ID.ID].value);
        } catch (e) {
            values[CUSTOM_FULFILL_ORDERS.FIELDS.PROCESS_STATUS.ID] = CONSTANTS_MODULE.PROCESS_STATUS.PROCESSED_WITH_ERROR.ID;
            values[CUSTOM_FULFILL_ORDERS.FIELDS.ERROR.ID] = "Error Name: " + String(e.name) + " | Error Message: " + String(e.message)
            submitCustomFulfillOrdersRecordFields({
                type: customFulfillOrdersRecord.recordType,
                id: customFulfillOrdersRecord.id,
                values: values
            });
            return;
        }

        itemFulfillmentRecord.setValue('shipmethod', customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.SHIP_VIA.ID].value);
        itemFulfillmentRecord.setValue('trandate', getNSDate(customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.DATE.ID]));
        itemFulfillmentRecord.setValue('postingperiod', customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.ACCOUNTING_PERIOD.ID].value);

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
            var itemText = itemFulfillmentRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'itemname',
                line: i
            });
            itemFulfillmentRecord.setSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: requiredQuantity,
                line: i
            });

            var fulfillLocation = customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.FULFILLMENT_LOCATION.ID].value;

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

                    var itemInventoryDetails = searchInventoryDetailsForItem(item, fulfillLocation, join);
                    var itemSearchResultCount = itemInventoryDetails.runPaged().count;

                    if (!itemSearchResultCount) {
                        log.error({title: itemText, details: "No Inventory Detail"})
                        throw new Error("No Inventory Detail for item: ".concat(itemText, " at location ").concat(customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.FULFILLMENT_LOCATION.ID].text));
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

        var itemFulfillmentLineCount = itemFulfillmentRecord.getLineCount('item');
        for (var i = 0; i < itemFulfillmentLineCount; i += 1) {
            _loop(i);
        }

        var itemFulfillmentRecordId = itemFulfillmentRecord.save();
        record.submitFields({
            type: record.Type.ITEM_FULFILLMENT,
            id: itemFulfillmentRecordId,
            values: {
                shipstatus: CONSTANTS_MODULE.SHIP_STATUS[customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.SHIP_STATUS.ID].value].ID,
                trandate: getNSDate(customFulfillOrdersRecord.values[CUSTOM_FULFILL_ORDERS.FIELDS.DATE.ID])
            }
        });
        var values = {};
        values[CUSTOM_FULFILL_ORDERS.FIELDS.FULFILLMENT_ID.ID] = itemFulfillmentRecordId;
        values[CUSTOM_FULFILL_ORDERS.FIELDS.PROCESS_STATUS.ID] = CONSTANTS_MODULE.PROCESS_STATUS.PROCESSED.ID;
        submitCustomFulfillOrdersRecordFields({
            type: customFulfillOrdersRecord.recordType,
            id: customFulfillOrdersRecord.id,
            values: values
        });
        log.audit("Processed " + String(soId))
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

    var massUpdateCustomFulfillOrdersRecord = function massUpdateCustomFulfillOrdersRecord(params) {
        var customFulfillOrdersRecord = record.load({
            type: params.type,
            id: params.id
        });
        var processStatus = customFulfillOrdersRecord.getValue(CUSTOM_FULFILL_ORDERS.FIELDS.PROCESS_STATUS.ID);

        if (processStatus === "".concat(CONSTANTS_MODULE.PROCESS_STATUS.PROCESSED_WITH_ERROR.ID)) {
            customFulfillOrdersRecord.setValue(CUSTOM_FULFILL_ORDERS.FIELDS.PROCESS_STATUS.ID, CONSTANTS_MODULE.PROCESS_STATUS.PENDING.ID);
            customFulfillOrdersRecord.setValue(CUSTOM_FULFILL_ORDERS.FIELDS.ERROR.ID, '');
            customFulfillOrdersRecord.save();
        }
    };

    return {
        searchPendingFulfillmentSO: searchPendingFulfillmentSO,
        saveCustomFulfillOrdersRecord: saveCustomFulfillOrdersRecord,
        searchPendingCustomFulFillOrders: searchPendingCustomFulFillOrders,
        searchInventoryDetailsForItem: searchInventoryDetailsForItem,
        transformSOToItemFulfillmentRecord: transformSOToItemFulfillmentRecord,
        createItemFulfillment: createItemFulfillment,
        submitCustomFulfillOrdersRecordFields: submitCustomFulfillOrdersRecordFields,
        massUpdateCustomFulfillOrdersRecord: massUpdateCustomFulfillOrdersRecord
    };
});