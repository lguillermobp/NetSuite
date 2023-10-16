/**
 * Base.js
 * @NApiVersion 2.1
 */

define(["N/error",'N/record', "N/search", "N/file", "N/log", "/SuiteScripts/Modules/LoDash.js"],
    /**
     *
     * @param error
     * @param search
     * @param file
     * @param log
     * @param _
     */
    function (error, record, search, file, log, _) {

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
                    break;
                case 30:
                    savedSearchId = "customsearch_bks_ecomm_5_4";
                    break;
                default:
                    throwLocationError("region");
            }
            return savedSearchId;
        }



        function getSalesOrdersData(locationId, startingDocumentNumber,statusPrinted,batchCode) {

            let salesOrders = [];
            let searchSalesOrders = search.load({
                id: getSavedSearchIdFromLocationId(locationId)
            });

            searchSalesOrders.filters.push(search.createFilter({
                name: "number",
                operator: "greaterthanorequalto",
                values: [startingDocumentNumber]
            }));
            if (statusPrinted==true) {
                searchSalesOrders.filters.push(search.createFilter({
                    name: "custbodyprintbatchcode",
                    operator: "isempty",
                    values: ""
                }));
            }
            if (statusPrinted==false && batchCode.length>0) {
                searchSalesOrders.filters.push(search.createFilter({
                    name: "custbodyprintbatchcode",
                    operator: "is",
                    values: [batchCode]
                }));
            }



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
                            name: "tranid",
                            join: "createdFrom"
                        })),
                        "documentNumberif": Number(result.getValue({
                            name: "tranid"
                        })),
                        "date": result.getValue({ name: "trandate",
                            join: "createdFrom" }),
                        "customer": result.getText({name: "entity"}),
                        "shipViaPriority": shipViaPriority,
                        "shipVia": result.getText({
                            name: "shipmethod"
                        }),
                        "lot": result.getText({
                            name: "inventorynumber",
                            join: "inventoryDetail"
                        }),
                        "memoMain": result.getValue({name: "memomain",
                            join: "createdFrom"}) || " ",
                        "custbody_ffstatus": result.getText({name: "custbody_ffstatus",
                            join: "createdFrom"}),
                        "statusref": result.getText({name: "statusref"}),
                        "address": result.getValue({name: "shipaddress"}),
                        "shipcountry": result.getText({name: "shipcountry"}),
                        "shipcountrycode": result.getValue({name: "shipcountrycode"}),
                        "item": result.getText({
                            name: "item"
                        }),
                        "quantityshiprecv": Number(result.getValue({name: "quantityshiprecv"})),

                        "quantity": Number(result.getValue({name: "quantity",
                            join: "inventoryDetail"})),
                        "description": result.getValue({
                            name: "salesdescription",
                            join: "item"
                        }),
                        "internalid": Number(result.getValue({name: "internalid"})),
                        "custbodyprintbatchcode": result.getValue({name: "custbodyprintbatchcode"}),
                        "quantityToShip": Number(result.getValue({name: "quantity",
                            join: "inventoryDetail"}))
                    });

                    return true;
                });
            });

            return salesOrders;
        }



        function pivotSalesOrderData(locationId,salesOrderData,numberOfPriorityOrders,statusPrinted,batchCode) {

            log.audit({
                "title": "salesOrderData",
                "details": salesOrderData.length
            });
            if (salesOrderData.length==0) {return;}
            var pivotedSalesOrderData = [];
            let priorityOrderTracker = 1;
            salesOrderData = _.sortBy(salesOrderData, ["shipViaPriority", "documentNumber", "internalid"]);

            let noprocesar='N';
            if (noprocesar==='N') {
                //var ifpartial="";
                //if (salesOrderData[0]["documentNumber"]==salesOrderData[1]["documentNumber"]) { ifpartial="Partial ItemFulfillment";}


                pivotedSalesOrderData[0] = {
                    "documentNumber": salesOrderData[0]["documentNumber"],
                    "internalid": salesOrderData[0]["internalid"],
                    "custbodyprintbatchcode": salesOrderData[0]["custbodyprintbatchcode"],
                    "documentNumberif": salesOrderData[0]["documentNumberif"],
                    "customer": salesOrderData[0]["customer"],
                    "date": salesOrderData[0]["date"],
                    "memoMain": salesOrderData[0]["memoMain"],
                    "custbody_ffstatus": salesOrderData[0]["custbody_ffstatus"],
                    "statusref": salesOrderData[0]["statusref"],
                    "address": salesOrderData[0]["address"],
                    "shipcountry": salesOrderData[0]["shipcountry"],
                    "shipcountrycode": salesOrderData[0]["shipcountrycode"],
                    "shipVia": salesOrderData[0]["shipVia"],
                    "shipViaPriority": salesOrderData[0]["shipViaPriority"],
                    "lines": [{
                        "item": salesOrderData[0]["item"],
                        "description": salesOrderData[0]["description"],
                        "quantity": salesOrderData[0]["quantity"],
                        "lot": salesOrderData[0]["lot"],
                        "quantityshiprecv": salesOrderData[0]["quantityshiprecv"],
                        "quantityToShip": salesOrderData[0]["quantityToShip"],
                        "backOrder": salesOrderData[0]["backOrder"]
                    }]
                };
            }

            for (let i = 1; i < salesOrderData.length; i++) {

                let noprocesar='N';

                if (noprocesar==='N') {
                    if ((salesOrderData[i]["documentNumber"] === salesOrderData[i - 1]["documentNumber"]) &&
                        (salesOrderData[i]["internalid"] === salesOrderData[i - 1]["internalid"])

                    ) {
                        pivotedSalesOrderData[pivotedSalesOrderData.length - 1]["lines"].push({
                            "item": salesOrderData[i]["item"],
                            "lot": salesOrderData[i]["lot"],
                            "description": salesOrderData[i]["description"],
                            "quantityToShip": salesOrderData[i]["quantityToShip"],
                            "backOrder": salesOrderData[i]["backOrder"]
                        });

                    } else {
                        if ((salesOrderData[i]["documentNumber"] != salesOrderData[i - 1]["documentNumber"])
                            || (salesOrderData[i]["internalid"] != salesOrderData[i - 1]["internalid"])) {priorityOrderTracker += 1;}
                        if (priorityOrderTracker > numberOfPriorityOrders) {
                            break;
                        }
                        pivotedSalesOrderData.push({
                            "documentNumber": salesOrderData[i]["documentNumber"],
                            "documentNumberif": salesOrderData[i]["documentNumberif"],
                            "internalid": salesOrderData[i]["internalid"],
                            "custbodyprintbatchcode": salesOrderData[i]["custbodyprintbatchcode"],
                            "customer": salesOrderData[i]["customer"],
                            "date": salesOrderData[i]["date"],
                            "memoMain": salesOrderData[i]["memoMain"],
                            "statusref": salesOrderData[i]["statusref"],
                            "custbody_ffstatus": salesOrderData[i]["custbody_ffstatus"],
                            "address": salesOrderData[i]["address"],
                            "shipcountry": salesOrderData[i]["shipcountry"],
                            "shipcountrycode": salesOrderData[i]["shipcountrycode"],
                            "shipVia": salesOrderData[i]["shipVia"],
                            "shipViaPriority": salesOrderData[i]["shipViaPriority"],
                            "lines": [{
                                "item": salesOrderData[i]["item"],
                                "quantityToShip": salesOrderData[i]["quantityToShip"],
                                "lot": salesOrderData[i]["lot"],
                                "quantity": salesOrderData[i]["quantity"],
                                "quantityshiprecv": salesOrderData[i]["quantityshiprecv"],
                                "description": salesOrderData[i]["description"],
                                "backOrder": salesOrderData[i]["backOrder"],
                                "priority":  priorityOrderTracker
                            }]
                        });
                    }


                }}
            return pivotedSalesOrderData;
        }




        function createXmlString(salesOrderData, locationId,statusPrinted,batchCode) {
            log.audit({
                "title": "createXmlString",
                "details": "value=" + locationId
            });
            var intord= '<tr>  <td colSpan="3" align="center"><strong style="font-size: 20px;">INTERNATIONAL ORDER</strong></td>   </tr>';
            log.debug("statusPrinted",statusPrinted);
            const locationName = getLocationAttributeFromId(locationId, "name");
            let bigFacelessReportUrl = `<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">`;
            let baseXmlString = file.load({id: "/SuiteScripts/EcommSplitFulfillmentV2/PDF.xml"}).getContents();
            let xmlString = "";
            let nropage=1;
            var internarlidmax=0;

            for (let i = 0; i < salesOrderData.length; i++) {
                var itemsdata = "";
                xmlString += baseXmlString;
                if (salesOrderData[i]["custbodyprintbatchcode"].length!=0)          {var descbatch = salesOrderData[i]["custbodyprintbatchcode"];var desccpy = "*** C O P Y ***";}
                else                                                                {var descbatch = batchCode;var desccpy = "";}


                if (salesOrderData[i]["shipcountrycode"]=="US")          {var dessts = salesOrderData[i]["custbody_ffstatus"];}
                else                                                     {var dessts = "INTERNACIONAL ORDER (" + salesOrderData[i]["shipcountry"] + ")";}

                if (salesOrderData[i]["internalid"]>internarlidmax)          {
                    internarlidmax=salesOrderData[i]["internalid"]
                }

                if (salesOrderData[i]["internalid"]>internarlidmax)          {
                    internarlidmax=salesOrderData[i]["internalid"]
                }

                xmlString = xmlString.replace("[BATCH_CODE]", descbatch);
                xmlString = xmlString.replace("[LOCATION]", locationName);
                xmlString = xmlString.replace("[REPRINT]", desccpy);
                xmlString = xmlString.replace("[STATUS]", dessts);
                xmlString = xmlString.replace("[SO_DATE]", salesOrderData[i]["date"]);
                xmlString = xmlString.replace("[NROPAGE]", "Page: " + nropage++);
                xmlString = xmlString.replace("[DOCUMENT_NUMBER]", salesOrderData[i]["documentNumber"]);
                xmlString = xmlString.replace("[DOCUMENT_NUMBER1]", salesOrderData[i]["documentNumber"]);
                xmlString = xmlString.replaceAll("[DOCUMENT_NUMBERIF]", salesOrderData[i]["documentNumberif"]);
                xmlString = xmlString.replaceAll("[DOCUMENT_NUMBERIF1]", salesOrderData[i]["documentNumberif"]);
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
                    var lot = salesOrderData[i]["lines"][line]["lot"];
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
                    salesOrderLines += `<td align="center">`+ lot + `</td>`;
                    salesOrderLines += `<td align="center"><barcode codetype="code128" showtext="false" height="1cm" value="${quantityToShip}"/><p align="center"><strong>` + quantityToShip + `</strong></p></td>`;
                    salesOrderLines += "<td>"+ descsts + "</td>";
                    salesOrderLines += "</tr>";


                }

                xmlString = xmlString.replace("[ITEMSDATA]", itemsdata);
                xmlString = xmlString.replace("[ITEMSDATA1]", itemsdata);
                xmlString = xmlString.replace("[SALES_ORDER_LINES]", salesOrderLines);




            }
            if (statusPrinted==true)
            {


                var rec = record.load({
                    type: "subsidiary",
                    id: 1,
                    isDynamic: true
                })
                rec.setValue({
                    fieldId: 'custrecordlastifinternalid',
                    value: internarlidmax,
                    ignoreFieldChange: true
                });

                rec.save({enableSourcing: true});
            }

            xmlString = bigFacelessReportUrl + "<pdfset>" + xmlString + "</pdfset>";
            xmlString = xmlString.replace(/&/g, "&amp;");
            return xmlString;
        }

        function prioritizeSalesOrderData(salesOrderData,batchCode) {

            var iftobechanged = [];
            salesOrderData = _.sortBy(salesOrderData, ["internalid"]);

            for (let i = 0; i < salesOrderData.length; i++) {
                iftobechanged[i] = {
                    "recordId": salesOrderData[i]["internalid"],
                    "custbodyprintbatchcode": batchCode
                }


            }
            log.audit({
                "title": "iftobechanged",
                "details":  iftobechanged
            });

            return iftobechanged;
        }

        return {
            validateLocationId: validateLocationId,
            getLocationAttributeFromId: getLocationAttributeFromId,
            getSalesOrderData: getSalesOrdersData,
            prioritizeSalesOrderData: prioritizeSalesOrderData,
            pivotSalesOrderData: pivotSalesOrderData,
            /* getTopNumberOfPrioritySalesOrdersAtSouth: getTopNumberOfPrioritySalesOrdersAtSouth,*/
            createXmlString: createXmlString
        };

    });