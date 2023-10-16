/**
 * Base.js
 * @NApiVersion 2.1
 */

define(["N/error", "N/search", "N/file", "N/log", "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"],
    /**
     *
     * @param error
     * @param search
     * @param file
     * @param log
     * @param _
     */


    function (error, search, file, log, GENERALTOOLS, MLTOOLS) {

        var paramWO;
        var paramSO;
        var SOID;

        function getMasterLabelsData(SOID) {

            paramSO = GENERALTOOLS.get_SO_value(SOID);
            var ponumberSO= paramSO.data.getValue({fieldId: "otherrefnum"});
            var shippingAddressSubrecord = paramSO.data.getSubrecord({fieldId : 'shippingaddress'});
            shipcity= shippingAddressSubrecord.getValue({fieldId: "city"});
            shipstate= shippingAddressSubrecord.getValue({fieldId: "state"});

            summaryitems=findCases2(SOID);
            summaryitems1=findCases3(SOID);


            var pagedatas=[];

            var fsearch = search.create({
                type: "customrecordmasterlabels",
                filters:
                    [
                        ["custrecordml_saleorder","equalto",SOID]
                    ],
                columns:
                    [
                        "custrecordml_casenumber",
                        "custrecordml_palletid",
                        "custrecordml_caseqty",
                        "custrecordml_palletnumber",
                        "custrecordml_product",
                        search.createColumn({
                            name: "salesdescription",
                            join: "CUSTRECORDML_PRODUCT"
                        }),
                        search.createColumn({
                            name: "upccode",
                            join: "CUSTRECORDML_PRODUCT"
                        }),
                        "custrecordml_ssccnumber",
                        "custrecordml_validchecker",
                        "custrecordml_status",
                        "custrecordml_partialbox",
                        "custrecordml_workorder"
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });



            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});

                var i=0;

                page.data.forEach(function (fresult) {
                    if (fresult.getValue({name: "custrecordml_partialbox"})==true)
                    {
                        partialbox="PARTIAL";
                    }
                    else
                    {
                        partialbox="";
                    }
                    pagedatas[i] = {
                        "custrecordml_ssccnumber": fresult.getValue({name: "custrecordml_ssccnumber"}),
                        "custrecordml_validchecker": fresult.getValue({name: "custrecordml_validchecker"}),
                        "custrecordml_product": fresult.getText({name: "custrecordml_product"}),
                        "custrecordml_productdes": fresult.getValue({name: "salesdescription",
                            join: "CUSTRECORDML_PRODUCT"}),
                        "itemupc": fresult.getValue({name: "upccode",
                            join: "CUSTRECORDML_PRODUCT"}),
                        "custrecordml_casenumber": fresult.getValue({name: "custrecordml_casenumber"}),
                       // "casestotal": summaryitems[fresult.getText({name: "custrecordml_product"})].custrecordml_casenumbermax,
                        "casestotal": summaryitems1["ALL"].custrecordml_casenumbermax,
                        "custrecordml_caseqty": fresult.getValue({name: "custrecordml_caseqty"}),
                        "custrecordml_palletid": fresult.getValue({name: "custrecordml_palletid"}),
                        "custrecordml_palletnumber": fresult.getValue({name: "custrecordml_palletnumber"}),
                        "POnumber": ponumberSO,
                        "City": shipcity,
                        "State": shipstate,
                        "partialbox": partialbox,
                        "custrecordml_status": fresult.getText({name: "custrecordml_status"})
                    }
                    log.debug("pagedatas[i]",pagedatas[i]);
                    i++;

                })
            });

            return pagedatas;
        }



        function findCases2(SOID) {
            var pagedatas=[];

            var fsearch = search.create({
                type: "customrecordmasterlabels",
                filters:
                    [
                        ["custrecordml_saleorder","equalto",SOID]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecordml_product",
                            summary: "GROUP"
                        }),
                        search.createColumn({
                            name: "salesdescription",
                            join: "CUSTRECORDML_PRODUCT",
                            summary: "GROUP"
                        }),

                        search.createColumn({
                            name: "custrecordml_casenumber",
                            summary: "MIN"
                        }),
                        search.createColumn({
                            name: "custrecordml_casenumber",
                            summary: "MAX"
                        }),
                        search.createColumn({
                            name: "custrecordml_ssccnumber",
                            summary: "MIN"
                        }),
                        search.createColumn({
                            name: "custrecordml_ssccnumber",
                            summary: "MAX"
                        })
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });



            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});



                page.data.forEach(function (fresult) {


                    item=fresult.getText({name: "custrecordml_product",
                        summary: "GROUP"}),

                    pagedatas[item] = {

                        "custrecordml_product": fresult.getText({name: "custrecordml_product",
                            summary: "GROUP"}),
                        "salesdescription": fresult.getValue({name: "salesdescription",
                            join: "CUSTRECORDML_PRODUCT",
                            summary: "GROUP"}),

                        "custrecordml_casenumbermin": fresult.getValue({name: "custrecordml_casenumber",
                            summary: "MIN"}),
                        "custrecordml_casenumbermax": fresult.getValue({name: "custrecordml_casenumber",
                            summary: "MAX"}),
                        "custrecordml_ssccnumbermin": fresult.getValue({name: "custrecordml_ssccnumber",
                            summary: "MIN"}),
                        "custrecordml_ssccnumbermax": fresult.getValue({name: "custrecordml_ssccnumber",
                            summary: "MAX"}),

                    }

                })
            });

            return pagedatas;
        }


        function findCases3(SOID) {
            var pagedatas=[];

            var fsearch = search.create({
                type: "customrecordmasterlabels",
                filters:
                    [
                        ["custrecordml_saleorder","equalto",SOID]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecordml_casenumber",
                            summary: "MIN"
                        }),
                        search.createColumn({
                            name: "custrecordml_casenumber",
                            summary: "MAX"
                        }),
                        search.createColumn({
                            name: "custrecordml_ssccnumber",
                            summary: "MIN"
                        }),
                        search.createColumn({
                            name: "custrecordml_ssccnumber",
                            summary: "MAX"
                        })
                    ]
            });

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });



            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});



                page.data.forEach(function (fresult) {


                    item="ALL"

                        pagedatas[item] = {


                            "custrecordml_casenumbermin": fresult.getValue({name: "custrecordml_casenumber",
                                summary: "MIN"}),
                            "custrecordml_casenumbermax": fresult.getValue({name: "custrecordml_casenumber",
                                summary: "MAX"}),
                            "custrecordml_ssccnumbermin": fresult.getValue({name: "custrecordml_ssccnumber",
                                summary: "MIN"}),
                            "custrecordml_ssccnumbermax": fresult.getValue({name: "custrecordml_ssccnumber",
                                summary: "MAX"}),

                        }

                })
            });

            return pagedatas;
        }


        function createXmlString(MasterLabelsData) {


            let bigFacelessReportUrl = `<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">`;
            let baseXmlString = file.load({id: "/SuiteScripts/MasterLabels/Form/PDF.xml"}).getContents();
            let xmlString = "";



            for (let i = 0; i < MasterLabelsData.length; i++) {

                xmlString += baseXmlString;

                xmlString = xmlString.replace("[PO_NUMBER]", MasterLabelsData[i]["POnumber"]);
                xmlString = xmlString.replace("[PO_NUMBER1]", MasterLabelsData[i]["POnumber"]);
                xmlString = xmlString.replace("[ITEM]", MasterLabelsData[i]["custrecordml_product"]);
                xmlString = xmlString.replace("[ITEM1]", MasterLabelsData[i]["custrecordml_product"]);
                xmlString = xmlString.replace("[ITEM_UPC]", MasterLabelsData[i]["itemupc"]);
                xmlString = xmlString.replace("[PARTIAL]", MasterLabelsData[i]["partialbox"]);
                xmlString = xmlString.replace("[ITEM_DESCRIPTION]", MasterLabelsData[i]["custrecordml_productdes"]);
                var ssccformated1 = MLTOOLS.formatsscc181(MasterLabelsData[i]["custrecordml_ssccnumber"]);
                log.debug("ssccformated1",ssccformated1);
                var ssccformated = MLTOOLS.formatsscc18(MasterLabelsData[i]["custrecordml_ssccnumber"]);
                xmlString = xmlString.replace("[SSCC_CODE_F1]", MasterLabelsData[i]["custrecordml_ssccnumber"]);
                xmlString = xmlString.replace("[SSCC_CODE_F]", ssccformated);
                xmlString = xmlString.replace("[SSCC_CODE]", MasterLabelsData[i]["custrecordml_ssccnumber"]);
                xmlString = xmlString.replace("[CASENO]", MasterLabelsData[i]["custrecordml_casenumber"]);
                xmlString = xmlString.replace("[CASE_TOTAL]", MasterLabelsData[i]["casestotal"]);
                xmlString = xmlString.replace("[CASES]", MasterLabelsData[i]["custrecordml_caseqty"]);

            }
            xmlString = bigFacelessReportUrl + "<pdfset>" + xmlString + "</pdfset>";
            xmlString = xmlString.replace(/&/g, "&amp;");
            return xmlString;
        }

        function createXmlStringForHTML(MasterLabelsData) {

            let bigFacelessReportUrl = ``;
            let baseXmlString = file.load({id: "/SuiteScripts/MasterLabels/Form/MasterLabel.html"}).getContents();
            let xmlString = "";



            for (let i = 0; i < MasterLabelsData.length; i++) {

                xmlString += baseXmlString;

                xmlString = xmlString.replace("[PO_NUMBER]", MasterLabelsData[i]["POnumber"]);
                xmlString = xmlString.replace("[PO_NUMBER1]", MasterLabelsData[i]["POnumber"]);
                xmlString = xmlString.replace("[ITEM]", MasterLabelsData[i]["custrecordml_product"]);
                itemcod = MasterLabelsData[i]["custrecordml_product"].replace(/ /g, "");
                xmlString = xmlString.replace("[ITEM1]", itemcod);
                xmlString = xmlString.replace("[ITEM_UPC]", MasterLabelsData[i]["itemupc"]);
                xmlString = xmlString.replace("[PARTIAL]", MasterLabelsData[i]["partialbox"]);
                xmlString = xmlString.replace("[ITEM_DESCRIPTION]", MasterLabelsData[i]["custrecordml_productdes"]);
                var ssccformated1 = MLTOOLS.formatsscc181(MasterLabelsData[i]["custrecordml_ssccnumber"]);
                log.debug("ssccformated1",ssccformated1);
                var ssccformated = MLTOOLS.formatsscc18(MasterLabelsData[i]["custrecordml_ssccnumber"]);
                xmlString = xmlString.replace("[SSCC_CODE_F]", ssccformated);
                xmlString = xmlString.replace("[SSCC_CODE_F1]", MasterLabelsData[i]["custrecordml_ssccnumber"]);
                xmlString = xmlString.replace("[SSCC_CODE]", MasterLabelsData[i]["custrecordml_ssccnumber"]);
                xmlString = xmlString.replace("[CASENO]", MasterLabelsData[i]["custrecordml_casenumber"]);
                xmlString = xmlString.replace("[CASE_TOTAL]", MasterLabelsData[i]["casestotal"]);
                xmlString = xmlString.replace("[CASES]", MasterLabelsData[i]["custrecordml_caseqty"]);

            }
            xmlString = bigFacelessReportUrl + xmlString;
            xmlString = xmlString.replace(/&/g, "&amp;");

            return xmlString;
        }



        return {
            findCases2: findCases2,
            findCases3: findCases3,
            getMasterLabelsData: getMasterLabelsData,
            createXmlString: createXmlString,
            createXmlStringForHTML: createXmlStringForHTML
        };

    });