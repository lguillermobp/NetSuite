/**
 * Base.js
 * @NApiVersion 2.1
 */

define(["N/error", "N/search", "N/file", "N/log", "/SuiteScripts/Modules/LoDash.js"],
    /**
     *
     * @param error
     * @param search
     * @param file
     * @param log
     * @param _
     */
    function (error, search, file, log, _) {

        function validateLocationId(locationId) {
            locationId = Number(locationId);
            let acceptableLocations = [10, 30];
            let locationIsAcceptable = acceptableLocations.includes(locationId);

            if (locationIsAcceptable === false) {
                throwLocationError("id");
            }

            return locationId;
        }

        function throwLocationError(type) {

            switch (type) {
                case "id":
                    throw error.create({
                        name: "INVALID_LOCATION",
                        message: "location parameter can only be 10 or 30"
                    });
                    break;
                case "name":
                    throw error.create({
                        name: "INVALID_LOCATION",
                        message: "location parameter can only be BKN Main Warehouse or Orlando warehouse"
                    });
                    break;
                case "region":
                    throw error.create({
                        name: "INVALID_LOCATION",
                        message: "location parameter can only be north or south"
                    });
                default:
                    throw error.create({
                        name: "INVALID_LOCATION",
                        message: "The type for the location error is invalid, and the function may be be used incorrectly."
                    });
            }
        }

        function getLocationAttributeFromId(id, attribute) {

            id = Number(id);

            if (attribute === "name") {
                switch (id) {
                    case 10:
                        return "BKN Main Warehouse";
                    case 30:
                        return "Orlando warehouse";
                    default:
                        throwLocationError("id");
                }
            } else if (attribute === "region") {
                switch (id) {
                    case 10:
                        return "North";
                    case 30:
                        return "South";
                    default:
                        throwLocationError("id");
                }
            } else {
                throw error.create({
                    name: "INVALID_ATTRIBUTE",
                    message: 'attribute can only be "name" or "region"'
                });
            }
        }

        function getSavedSearchIdFromLocationId(locationId) {
            let savedSearchId;
            let savedSearchBOId;
            locationId = Number(locationId);

            switch (locationId) {
                case 10:
                    savedSearchId = "customsearch_bkn_ecomm";
                    savedSearchBOId = "customsearch_bkn_ecomm_5_2_2";
                    break;
                case 30:
                    savedSearchId = "customsearch_bks_ecomm_5_4";
                    savedSearchBOId = "customsearch_bks_ecomm_5_2";
                    break;
                default:
                    throwLocationError("region");
            }
            return savedSearchId;
        }

        function getSavedSearchBOIdFromLocationId(locationId) {

            let savedSearchBOId;
            locationId = Number(locationId);

            switch (locationId) {
                case 10:
                    savedSearchBOId = "customsearch_bkn_ecomm_5_2_2";
                    break;
                case 30:
                    savedSearchBOId = "customsearch_bks_ecomm_5_2";
                    break;
                default:
                    throwLocationError("region");
            }
            return savedSearchBOId;
        }

        function getSalesOrdersData(locationId, startingDocumentNumber) {

            let salesOrders = [];
            let searchSalesOrders = search.load({
                id: getSavedSearchIdFromLocationId(locationId)
            });

            searchSalesOrders.filters.push(search.createFilter({
                name: "number",
                operator: "greaterthanorequalto",
                values: [startingDocumentNumber]
            }));

            let pagedData = searchSalesOrders.runPaged({
                pageSize: 2000
            });

            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (result) {
                    let shipVia = result.getText({name: "shipmethod"}) || " ";
                    let shipViaPriority;

                    switch (shipVia) {
                        case "Overnight Shipping":
                            shipViaPriority = 1;
                            break;
                        case "Two-Day Shipping":
                            shipViaPriority = 2;
                            break;
                        default:
                            shipViaPriority = 3;
                            break;
                    }


                    salesOrders.push({
                        "documentNumber": Number(result.getValue({
                            name: "tranid"
                        })),
                        "date": result.getValue({name: "trandate" }),
                        "backOrder": result.getValue({name: "formulanumeric", }),
                        "customer": result.getText({name: "entity"}),
                        "shipViaPriority": shipViaPriority,
                        "shipVia": result.getText({
                            name: "shipmethod"
                        }),
                        "memoMain": result.getValue({name: "memomain"}) || " ",
                        "address": result.getValue({name: "shipaddress"}),
                        "item": result.getText({
                            name: "item"
                        }),
                        "description": result.getValue({
                            name: "Memo"
                        }),
                        "quantityToShip": Number(result.getValue({name: "quantity"})) - Number(result.getValue({name: "quantityshiprecv"}))
                    });
                    log.audit({
                        "title": "getSalesOrdersData",
                        "details": "value=ff"
                    });
                    return true;
                });
            });

            return salesOrders;
        }

        function getdocumentBackOrder(locationId) {
            let documentBackOrder = [];
            let searchdocumentBackOrder = search.load({
                id: getSavedSearchBOIdFromLocationId(locationId)
            });

            let pagedData = searchdocumentBackOrder.runPaged({
                pageSize: 1000
            });

            pagedData.pageRanges.forEach(function (pageRange) {
                var page = pagedData.fetch({index: pageRange.index});
                page.data.forEach(function (result) {
                    let document = Number(result.getValue(searchdocumentBackOrder.columns[0]));
                    documentBackOrder.push(document);
                });
            });
            return documentBackOrder;
        }

        function pivotSalesOrderData(locationId,salesOrderData,numberOfPriorityOrders,allowPartialShipping) {

            let documentBackOrder = getdocumentBackOrder(locationId);
            var pivotedSalesOrderData = [];
            let priorityOrderTracker = 1;
            salesOrderData = _.sortBy(salesOrderData, ["shipViaPriority", "documentNumber"]);

            let noprocesar='N';
            if (!allowPartialShipping && documentBackOrder.indexOf(salesOrderData[0]["documentNumber"])!=-1) { noprocesar='S'}
            if (noprocesar==='N') {
                pivotedSalesOrderData[0] = {
                    "documentNumber": salesOrderData[0]["documentNumber"],
                    "customer": salesOrderData[0]["customer"],
                    "date": salesOrderData[0]["date"],
                    "memoMain": salesOrderData[0]["memoMain"],
                    "address": salesOrderData[0]["address"],
                    "shipVia": salesOrderData[0]["shipVia"],
                    "shipViaPriority": salesOrderData[0]["shipViaPriority"],
                    "lines": [{
                        "item": salesOrderData[0]["item"],
                        "description": salesOrderData[0]["description"],
                        "quantityToShip": salesOrderData[0]["quantityToShip"],
                        "backOrder": salesOrderData[0]["backOrder"]
                    }]
                };
            }

            for (let i = 1; i < salesOrderData.length; i++) {

                let noprocesar='N';
                if (!allowPartialShipping && documentBackOrder.indexOf(salesOrderData[i]["documentNumber"])!=-1) { noprocesar='S'}
                if (noprocesar==='N') {
                    if (salesOrderData[i]["documentNumber"] === salesOrderData[i - 1]["documentNumber"]) {
                        pivotedSalesOrderData[pivotedSalesOrderData.length - 1]["lines"].push({
                            "item": salesOrderData[i]["item"],
                            "description": salesOrderData[i]["description"],
                            "quantityToShip": salesOrderData[i]["quantityToShip"],
                            "backOrder": salesOrderData[i]["backOrder"]
                        });

                    } else {
                        if (salesOrderData[i]["documentNumber"] != salesOrderData[i - 1]["documentNumber"]) {priorityOrderTracker += 1;}
                        if (priorityOrderTracker > numberOfPriorityOrders) {
                            break;
                        }
                        pivotedSalesOrderData.push({
                            "documentNumber": salesOrderData[i]["documentNumber"],
                            "customer": salesOrderData[i]["customer"],
                            "date": salesOrderData[i]["date"],
                            "memoMain": salesOrderData[i]["memoMain"],
                            "address": salesOrderData[i]["address"],
                            "shipVia": salesOrderData[i]["shipVia"],
                            "shipViaPriority": salesOrderData[i]["shipViaPriority"],
                            "lines": [{
                                "item": salesOrderData[i]["item"],
                                "quantityToShip": salesOrderData[i]["quantityToShip"],
                                "description": salesOrderData[i]["description"],
                                "backOrder": salesOrderData[i]["backOrder"],
                                "priority":  priorityOrderTracker
                            }]
                        });
                    }


                }}
            return pivotedSalesOrderData;
        }

        /* function getTopNumberOfPrioritySalesOrdersAtSouth(numberOfPriorityOrders, salesOrderData,
                                                           allowPartialShipping) {

             let priorityOrderTracker = 0;
             let documentBackOrder = getdocumentBackOrder();
             let priorityOrders = [];

             for (let i = 0; i < salesOrderData.length; i++) {
                 let fulfillableLines = [];
                 for (let line = 0; line < salesOrderData[i]["lines"].length; line++) {
                     const item = salesOrderData[i]["lines"][line]["item"];
                     const quantityToShip = salesOrderData[i]["lines"][line]["quantityToShip"];
                     const backOrder = salesOrderData[i]["lines"][line]["backOrder"];
                     const description = salesOrderData[i]["lines"][line]["description"];


                     if (inventoryBalance.hasOwnProperty(item)) {

                         if (inventoryBalance[item] - quantityToShip > 0) {
                             inventoryBalance[item] -= quantityToShip;
                             fulfillableLines.push({"description": description,"backOrder": backOrder,"item": item, "quantityToShip": quantityToShip});
                         } else if (inventoryBalance[item] - quantityToShip === 0) {
                             delete inventoryBalance[item];
                             fulfillableLines.push({"description": description,"backOrder": backOrder,"item": item, "quantityToShip": quantityToShip});
                         }
                     }
                 }

                 if (fulfillableLines.length > 0) {
                     if (allowPartialShipping) {
                         priorityOrders.push(salesOrderData[i]);
                         priorityOrders[priorityOrders.length - 1]["lines"] = fulfillableLines;
                         priorityOrderTracker += 1;
                     } else {
                         if (salesOrderData[i]["lines"].length === fulfillableLines.length){
                             priorityOrders.push(salesOrderData[i]);
                             priorityOrderTracker += 1;
                         }
                     }
                 }

                 if (priorityOrderTracker === numberOfPriorityOrders) {
                     break;
                 }
             }
             return priorityOrders;
         } */

        function createXmlString(salesOrderData, locationId) {
            log.audit({
                "title": "createXmlString",
                "details": "value=" + locationId
            });
            const locationName = getLocationAttributeFromId(locationId, "name");
            let bigFacelessReportUrl = `<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">`;
            let baseXmlString = file.load({id: "/SuiteScripts/EcommSplitFulfillment/PDF.xml"}).getContents();
            let xmlString = "";
            let nropage=1;


            for (let i = 0; i < salesOrderData.length; i++) {
                var itemsdata = "";
                xmlString += baseXmlString;
                xmlString = xmlString.replace("[LOCATION]", locationName);
                xmlString = xmlString.replace("[SO_DATE]", salesOrderData[i]["date"]);
                xmlString = xmlString.replace("[NROPAGE]", "Page: " + nropage++);
                xmlString = xmlString.replace("[DOCUMENT_NUMBER]", salesOrderData[i]["documentNumber"]);
                xmlString = xmlString.replace("[DOCUMENT_NUMBER1]", salesOrderData[i]["documentNumber"]);
                xmlString = xmlString.replace("[SHIP_VIA]", salesOrderData[i]["shipVia"]);
                xmlString = xmlString.replace("[MEMO_MAIN]", salesOrderData[i]["memoMain"]);
                xmlString = xmlString.replace("[CUSTOMER]", salesOrderData[i]["customer"]);
                xmlString = xmlString.replace("[CUSTOMER_ADDRESS]", salesOrderData[i]["address"]);


                var salesOrderLines = "";
                var linepag = 0;
                var linedetail = salesOrderData[i]["lines"].length;
                for (var line = 0; line < salesOrderData[i]["lines"].length; line++) {
                    linepag++;
                    var item = salesOrderData[i]["lines"][line]["item"];
                    var description = salesOrderData[i]["lines"][line]["description"];
                    var backOrder = salesOrderData[i]["lines"][line]["backOrder"];
                    var quantityToShip = salesOrderData[i]["lines"][line]["quantityToShip"];
                    if (backOrder==1)       {var descsts = "   ****BACKORDER****";}
                    else                    {var descsts = "";}

                    for (var line1 = 1; line1 <= quantityToShip; line1++) {
                        itemsdata += item ;
                        if (linedetail  == (line + 1) && quantityToShip  == line1) {
                            itemsdata += '';
                        }
                        else {
                            itemsdata += '%0D';
                        }



                    }



                    salesOrderLines += "<tr>";
                    salesOrderLines += "<td align='center'> ";
                    salesOrderLines += `<barcode codetype="code128" showtext="true" height="1cm" value="${item}"/>  `;
                    //salesOrderLines += item;
                    salesOrderLines +=  "<p><em>" + description + "</em></p></td>";
                    salesOrderLines += `<td align="center"><barcode codetype="code128" showtext="false" height="1cm" value="${quantityToShip}"/><p align="center"><strong>` + quantityToShip + `</strong></p></td>`;
                    salesOrderLines += "<td>"+ descsts + "</td>";
                    salesOrderLines += "</tr>";

                    /*       if (linepag>5 && linedetail!=(line+1)) {
                               xmlString = xmlString.replace("[COMENT]", "CONTINUE...");
                               var linepag = 0;
                               salesOrderLines += "<tr><td colspan='3'" +
                                   " align=\"right\">Continue...</td></tr>";
                               salesOrderLines += "<tr><td colspan='3'" +
                                   " align=\"left\">...Continue </td></tr>";
                           }
                           else {
                               xmlString = xmlString.replace("[COMENT]", "");
                           }
                           */
                }

                xmlString = xmlString.replace("[ITEMSDATA]", itemsdata);
                xmlString = xmlString.replace("[ITEMSDATA1]", itemsdata);
                xmlString = xmlString.replace("[SALES_ORDER_LINES]", salesOrderLines);
            }
            xmlString = bigFacelessReportUrl + "<pdfset>" + xmlString + "</pdfset>";
            xmlString = xmlString.replace(/&/g, "&amp;");
            return xmlString;
        }

        function prioritizeSalesOrderData(salesOrderData) {
            salesOrderData = _.sortBy(salesOrderData, ["shipViaPriority", "documentNumber"]);

            let currentRank = 1;
            salesOrderData[0]["priority"] = 1;
            for (let i = 1; i < salesOrderData.length; i++) {
                if (salesOrderData[i]["documentNumber"] !== salesOrderData[i - 1]["documentNumber"]) {
                    currentRank += 1;
                }
                salesOrderData[i]["priority"] = currentRank;
            }
            return salesOrderData;
        }

        return {
            validateLocationId: validateLocationId,
            getLocationAttributeFromId: getLocationAttributeFromId,
            getSalesOrderData: getSalesOrdersData,
            /* prioritizeSalesOrderData: prioritizeSalesOrderData, */
            pivotSalesOrderData: pivotSalesOrderData,
            /* getTopNumberOfPrioritySalesOrdersAtSouth: getTopNumberOfPrioritySalesOrdersAtSouth,*/
            createXmlString: createXmlString
        };

    });