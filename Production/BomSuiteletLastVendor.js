define(['N/search','N/ui/serverWidget','N/log','N/redirect', 'N/url', 'N/file', "/SuiteScripts/Modules/generaltoolsv1.js"], function (s, ui, log, redirect, url, file, GENERALTOOLS) {
    /**
     * Example 1; calc
     * @export suitelet-results
     *
     * @author Luis Barrios
     *
     * @requires N/search
     * @requires N/ui/serverWidget
     * @requires N/log
     *
     * @NApiVersion 2.1
     * @ModuleScope SameAccount
     * @NScriptType Suitelet
     *
     */
    var exports= {};
    var i = 0;
    var pagedatas = [];
    var pageitems = [];

    //DO NOT REMOVE
    var jsondata;
    //DO NOT REMOVE
    var datatocsv;
    //var datatocsv1;

    /**
     * <code>onRequest</code> event handler
     *
     * @governance @
     *
     * @param context
     *        {Object}
     * @param context.request
     *        {ServerRequest} The incoming request object
     * @param context.response
     *        {ServerResponse} The outgoing response object
     *
     * @return {void}
     *
     * @static
     * @function onRequest
     */
    function onRequest(context) {

        context.response.writePage({
            pageObject: renderList(translate(findCases()))
        });

        if (context.request.method === 'GET') {
            // Our Suitelet design code is in here
        } else if (context.request.method === 'POST') {
            log.debug("Suitelet is posting.")
            var params = { page_status: 'confirmed' };

            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_bom_example',
                deploymentId: 'customdeploy_bom_example',
                params: params
            });
            redirect.redirect({ url: suiteletURL });
        }

    }

    function createAndSaveFile() {
        /*

        var fileObj = file.create({
            name: 'BOM.csv',
            fileType: file.Type.CSV,
            contents: datatocsv1
        });
        fileObj.folder = 126377;
        var id = fileObj.save();
        fileObj = file.load({
            id: id
        });

         */
    }
    //DO NOT REMOVE THIS FUNCTION
    function createAndSaveJSON() {
   /*

        var fileObj = file.create({
            name: 'BOM-JSON.txt',
            fileType: file.Type.PLAINTEXT,
            contents: jsondata
        });
        fileObj.folder = 126377;
        var id = fileObj.save();
        fileObj = file.load({
            id: id
        });

    */
    }
    function renderList(results) {
        var list = ui.createList({title:"Advanced Bom With Last Vendor Listings"});



        list.clientScriptModulePath = "./bomtoexcel-cl.js";

        /** list.clientScriptModulePath = "./bomsuitelet-result-cl.js";


         list.addButton({
            id: "Custpage btn Backecase",
            label: "Go Back Records",
            functionName: "goToBackCase"
        });

         list.addButton({
            id: "Custpage btn nextcase",
            label: "Go to Next Records",
            functionName: "goToNextCase"
        });
         */
        list.addButton({

            id : 'custpage_buttonid', //always prefix with 'custpage_'

            label : 'Export CSV', //label of the button

            functionName: 'onButtonClick("'+encodeURI(datatocsv)+'")'
        });

        list.addColumn({
            id: "itemid",
            type: ui.FieldType.TEXT,
            label:'Item Id'
        });
        list.addColumn({
            id: "upc",
            type: ui.FieldType.TEXT,
            label:'UPC'
        });
        list.addColumn({
            id: "descriptionassembly",
            type: ui.FieldType.TEXT,
            label:'description assembly'
        });
        list.addColumn({
            id: "costassembly",
            type: ui.FieldType.TEXT,
            label:'Cost Assembly',
            align : ui.LayoutJustification.RIGHT
        });

        list.addColumn({
            id: "billofmaterials",
            type: ui.FieldType.TEXT,
            label:'billofmaterials'
        }); list.addColumn({
            id: "revisionname",
            type: ui.FieldType.TEXT,
            label:'revisionname'
        }); list.addColumn({
            id: "component",
            type: ui.FieldType.TEXT,
            label:'component'
        });
        list.addColumn({
            id: "descriptioncomp",
            type: ui.FieldType.TEXT,
            label:'description component'
        });
        list.addColumn({
            id: "costcomp",
            type: ui.FieldType.TEXT,
            label:'Cost Component',
            align : ui.LayoutJustification.RIGHT
        });
        list.addColumn({
            id: "bomquantity",
            type: ui.FieldType.TEXT,
            label:'bomquantity'
        });
        list.addColumn({
            id: "baseunits",
            type: ui.FieldType.TEXT,
            label:'baseunits'
        });
        list.addColumn({
            id: "lastpurchasevendor",
            type: ui.FieldType.TEXT,
            label:'lastpurchasevendor'
        });
        list.addColumn({
            id: "lastpurchasedate",
            type: ui.FieldType.TEXT,
            label:'lastpurchasedate'
        });


        list.addRows({rows:results});
        return list;

    }


    function resultToObject(results) {


        return {
            itemid: results.itemid,
            upc: results.upccode,
            descriptionassembly: results.descriptionassembly,
            costassembly:results.costassembly,
            billofmaterials: results.billofmaterials,
            revisionname: results.name,
            component: results.item,
            descriptioncomp: results.descriptioncomp,
            costcomp:results.costcomp,
            bomquantity: results.bomquantity,
            baseunits: results.baseunits,
            lastpurchasevendor: results.lastpurchasevendor,
            lastpurchasedate: results.lastpurchasedate

        };

    }



    function translate(results) {
        return results.map(resultToObject);
    }

    function getBaseUrl() {
        return url.resolveRecord({
            recordType: s.Type.SUPPORT_CASE
        });
    }
    function findCases() {
        var pageitems1 = [];
        var pageitems2 = [];
        varrut=GENERALTOOLS.get_bom_list('');
        billofm=varrut.data;
        varrut1=GENERALTOOLS.get_kits_list();
        billofm1 = varrut1.data;
        log.debug("billofm",billofm);

        varrut1=GENERALTOOLS.get_items_listInventory(1);
        pageitems1=varrut1.data;
        varrut2=GENERALTOOLS.get_items_listInventory(2);
        pageitems2=varrut2.data;
        log.debug("varrut2",varrut2);



        var fsearch = s.create({
            type: "item",
            filters:
                [
                    ["type", "anyof", "Assembly"],
                    "AND",
                    ["assemblyitembillofmaterials.default", "is", "T"],
                    "AND",
                    ["isinactive", "is", "F"]
                ],

            columns:
                [
                    s.createColumn({
                        name: "assembly",
                        join: "assemblyItemBillOfMaterials"
                    }),
                    s.createColumn({
                        name: "description"
                    }),
                    s.createColumn({
                        name: "billofmaterialsid",
                        join: "assemblyItemBillOfMaterials"
                    }),
                    s.createColumn({
                        name: "averagecost"
                    }),
                    s.createColumn({
                        name: "lastpurchaseprice"
                    }),
                    "upccode",
                    s.createColumn({
                        name: "billofmaterials",
                        join: "assemblyItemBillOfMaterials"
                    })
                ]

        })

        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });

        var plantext='^Assembly^,^UPC^,^Description Assembly^,^Cost Assembly^,^Bill of Materials id^,^Bill of' +
            ' Materials^,^Components^,^Description Component^,^Cost' +
            ' Component^,^Revision^,^Quantity^,^Units^,^Last Vendor^,^Last PO Date^&&';

        datatocsv = plantext;

      /*  var plantext1='"Assembly","UPC","Description Assembly","Cost Assembly","Bill of Materials id","Bill of' +
            ' Materials","Components","Description Component","Cost Component","Revision","Quantity","Units","Last Vendor","Last PO Date"\n';

        datatocsv1 = plantext1;

       */


        pagedData.pageRanges.forEach(function (pageRange) {

            var page = pagedData.fetch({index: pageRange.index});


            page.data.forEach(function (fresult1) {
                var costassembly=0;
                billid=fresult1.getValue({name: "billofmaterials",join: "assemblyItemBillOfMaterials"});
                upc=fresult1.getValue({name: "upccode"});
                billofmaterialsid=fresult1.getValue({name: "billofmaterialsid",
                    join: "assemblyItemBillOfMaterials"});
                billofmaterials=fresult1.getText({name: "billofmaterials",
                    join: "assemblyItemBillOfMaterials"});
                assembly=fresult1.getText({name: "assembly",
                    join: "assemblyItemBillOfMaterials"});
                if (fresult1.getValue({name: "averagecost"}) == 0) {
                    costassembly=fresult1.getValue({name: "lastpurchaseprice"});
                }
                else {
                    costassembly=fresult1.getValue({name: "averagecost"});
                }


                if (billofm[billid]) {

                    billofm[billid].forEach(function (billitem) {

                        componentid = billitem.item;

                        if (pageitems1[componentid])
                        {
                            lastpurchaseprice=pageitems1[componentid].lastpurchaseprice;
                            averagecost=pageitems1[componentid].averagecost;
                            cost=pageitems1[componentid].cost;
                            descriptioncomp= pageitems1[componentid].description;
                            averagecostcomp= pageitems1[componentid].averagecost;
                            lastpurchasepricecomp= pageitems1[componentid].lastpurchaseprice;
                            lastpurchasevendor= pageitems1[componentid].lastpurchasevendor;
                            lastpurchasedate= pageitems1[componentid].lastpurchasedate;
                        }
                        else if (pageitems2[componentid]){
                            lastpurchaseprice=pageitems2[componentid].lastpurchaseprice;
                            cost=pageitems2[componentid].cost;
                            averagecost=pageitems2[componentid].averagecost;
                            descriptioncomp= pageitems2[componentid].description;
                            averagecostcomp= pageitems2[componentid].averagecost;
                            lastpurchasepricecomp= pageitems2[componentid].lastpurchaseprice;
                            lastpurchasevendor= pageitems2[componentid].lastpurchasevendor;
                            lastpurchasedate= pageitems2[componentid].lastpurchasedate;
                        }
                        else {
                            lastpurchaseprice = 0;
                            cost=0;
                            averagecost = 0;
                            descriptioncomp = "";
                            averagecostcomp = 0;
                            lastpurchasepricecomp = 0;
                            lastpurchasevendor = "";
                            lastpurchasedate = "";
                        }

                        costcomp=averagecost;

                        if (costcomp == 0) {
                            costcomp=lastpurchaseprice;
                        }
                        if (costcomp == 0) {
                            costcomp=cost;
                        }
                        if (i<10) {

                            pagedatas[i] = {
                                "billofmaterialsid": billofmaterialsid,
                                "billofmaterials": billofmaterials,
                                "itemid": assembly,
                                "upccode": fresult1.getValue({name: "upccode"}),
                                "name": billitem.name,
                                "item": billitem.item,
                                "bomquantity": billitem.bomquantity,
                                "baseunits": billitem.baseunits,
                                "descriptionassembly": fresult1.getValue({name: "description"}),
                                "averagecostassembly": fresult1.getValue({name: "averagecost"}),
                                "costassembly": costassembly,
                                "lastpurchasepriceassembly": fresult1.getValue({name: "lastpurchaseprice"}),
                                "descriptioncomp": descriptioncomp,
                                "averagecostcomp": averagecostcomp,
                                "lastpurchasepricecomp": lastpurchasepricecomp,
                                "lastpurchasevendor": lastpurchasevendor,
                                "lastpurchasedate": lastpurchasedate,
                                "costcomp": costcomp

                            };
                            log.debug("pagedatas[i]",pagedatas[i]);
                            i++;
                        }

                       // jsondata += pagedatas[i];
                        var upccode= fresult1.getValue({name: "upccode"});
                        var descriptionassembly = fresult1.getValue({name: "description"}).replace(/"/g, " ");
                        var description = descriptioncomp.replace(/"/g, " ");


                        plantext = '^'+assembly+'^,^'+upccode+'^,^'+descriptionassembly+'^,^'+costassembly+'^,^'+billofmaterialsid+'^,^'+billofmaterials+'^,^'
                            +billitem.item+'^,^'+description+'^,^'+costcomp+'^,^'+billitem.name+'^,^'
                            +billitem.bomquantity+'^,^'+billitem.baseunits+'^,^'+lastpurchasevendor+'^,^'+lastpurchasedate+'^&&';

                        datatocsv += plantext;

                /*        plantext1 = '"'+assembly+'","'+upccode+'","'+descriptionassembly+'","'+costassembly+'","'+billofmaterialsid+'","'+billofmaterials+'","'+
                        billitem.item+'","'+description+'","'+costcomp+'","'+billitem.name+'","'
                        +billitem.bomquantity+'","'+billitem.baseunits+'","'+lastpurchasevendor+'","'+lastpurchasedate+'"\n';

                        datatocsv1 += plantext1;

                 */

                })
                }


            })
        })

        billofm1.forEach(function (detalle1, index) {


            componentid = detalle1.item;

            if (pageitems1[componentid])
            {
                lastpurchaseprice=pageitems1[componentid].lastpurchaseprice;
                averagecost=pageitems1[componentid].averagecost;
                descriptioncomp= pageitems1[componentid].description;
                averagecostcomp= pageitems1[componentid].averagecost;
                lastpurchasepricecomp= pageitems1[componentid].lastpurchaseprice;
                lastpurchasevendor= pageitems1[componentid].lastpurchasevendor;
                lastpurchasedate= pageitems1[componentid].lastpurchasedate;
            }
            else if (pageitems2[componentid]){
                lastpurchaseprice=pageitems2[componentid].lastpurchaseprice;
                averagecost=pageitems2[componentid].averagecost;
                descriptioncomp= pageitems2[componentid].description;
                averagecostcomp= pageitems2[componentid].averagecost;
                lastpurchasepricecomp= pageitems2[componentid].lastpurchaseprice;
                lastpurchasevendor= pageitems2[componentid].lastpurchasevendor;
                lastpurchasedate= pageitems2[componentid].lastpurchasedate;
            }
            else {
                lastpurchaseprice = 0;
                averagecost = 0;
                descriptioncomp = "";
                averagecostcomp = 0;
                lastpurchasepricecomp = 0;
                lastpurchasevendor = "";
                lastpurchasedate = "05/05/2021";
            }


            if (detalle1.averagecostcomp == 0) {
                costcomp=detalle1.lastpurchasepricecomp;
            }
            else {
                costcomp=detalle1.averagecostcomp;
            }

            pagedatas[i] = {

                "billofmaterialsid": detalle1.internalid,
                "billofmaterials": detalle1.billofmaterials,
                "itemid": detalle1.itemid,
                "upccode": 0,
                "name":detalle1.name,
                "item": detalle1.item,
                "bomquantity": detalle1.bomquantity,
                "baseunits": detalle1.baseunits,
                "descriptionassembly":detalle1.descriptionk,
                "averagecostassembly":detalle1.averagecost,
                "costassembly": 0,
                "lastpurchasepriceassembly": 0,
                "descriptioncomp": detalle1.description,
                "averagecostcomp": detalle1.averagecost,
                "lastpurchasepricecomp": detalle1.lastpurchasepricecomp,
                "lastpurchasevendor": lastpurchasevendor,
                "lastpurchasedate": lastpurchasedate,
                "costcomp":costcomp

            };
            log.debug("pagedatas[i]1",pagedatas[i]);
            jsondata += pagedatas[i];


            plantext = '^'+detalle1.itemid+'^,^'+detalle1.descriptionk+'^,^'+detalle1.averagecost+'^,^'+" "+'^,^'+" "+'^,^'
                +detalle1.item+'^,^'+detalle1.description+'^,^'+costcomp+'^,^'+detalle1.name+'^,^'
                +detalle1.bomquantity+'^,^'+detalle1.baseunits+'^,^'+lastpurchasevendor+'^,^'+lastpurchasedate+'^&&';

            datatocsv += plantext;


            i++;


        })




        pageitems1=null;
        pageitems2=null;
        return pagedatas;

    }


    exports.onRequest = onRequest;
    return exports;

});