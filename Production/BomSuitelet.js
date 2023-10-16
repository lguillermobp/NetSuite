define(['N/search','N/ui/serverWidget','N/log','N/redirect', 'N/url', 'N/file', "/SuiteScripts/Modules/generaltoolsv1.js"],
    function (s, ui, log, redirect, url, file, GENERALTOOLS) {
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
        var datatocsv1;

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
        }
        //DO NOT REMOVE THIS FUNCTION
        function createAndSaveJSON() {
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
        }
        function renderList(results) {
            var list = ui.createList({title:"Advanced Bom Listings"});




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
                id: "iteminternalid",
                type: ui.FieldType.TEXT,
                label:'Assembly Internal ID'
            });
            list.addColumn({
                id: "billofmaterials",
                type: ui.FieldType.TEXT,
                label:'billofmaterials'
            });
            list.addColumn({
                id: "billofmaterialsid",
                type: ui.FieldType.TEXT,
                label:'Bill of Materials ID'
            });

            list.addColumn({
                id: "revisionname",
                type: ui.FieldType.TEXT,
                label:'revisionname'
            });
            list.addColumn({
                id: "revisioninternalid",
                type: ui.FieldType.TEXT,
                label:'Revision Internal ID'
            });
            list.addColumn({
                id: "component",
                type: ui.FieldType.TEXT,
                label:'component'
            });
            list.addColumn({
                id: "componentid",
                type: ui.FieldType.TEXT,
                label:'Component Internal ID'
            });

            list.addColumn({
                id: "bomquantity",
                type: ui.FieldType.TEXT,
                label:'bomquantity'
            }); list.addColumn({
                id: "baseunits",
                type: ui.FieldType.TEXT,
                label:'baseunits'
            });


            list.addRows({rows:results});
            return list;

        }


        function resultToObject(results) {


            return {
                itemid: results.itemid,
                iteminternalid: results.iteminternalid,
                billofmaterials: results.billofmaterials,
                billofmaterialsid: results.billofmaterialsid,
                revisionname: results.name,
                revisioninternalid: results.revisioninternalid,
                component: results.item,
                componentid: results.componentinternalid,
                bomquantity: results.bomquantity,
                baseunits: results.baseunits

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
            //   billofm=findCases1();
            varrut=GENERALTOOLS.get_bom_list('');
            varrut1=GENERALTOOLS.get_kits_list();
            billofm1 = varrut1.data;
            billofm=varrut.data;

            var fsearch = s.create({
                type: "item",
                filters:
                    [
                        [["type","anyof","Assembly"],"AND",["assemblyitembillofmaterials.default","is","T"]],
                        "OR",
                        [["type","anyof","Kit"]]
                    ],

                columns:
                    [
                        s.createColumn({
                            name: "assembly",
                            join: "assemblyItemBillOfMaterials"
                        }),
                        s.createColumn({
                            name: "internalid"
                        }),
                        s.createColumn({
                            name: "billofmaterialsid",
                            join: "assemblyItemBillOfMaterials"
                        }),
                        s.createColumn({
                            name: "billofmaterials",
                            join: "assemblyItemBillOfMaterials"
                        })
                    ]

            })

            var pagedData = fsearch.runPaged({
                "pageSize" : 1000
            });

            var plantext='^Assembly^,^Assembly Internal ID^,^Bill of Materials id^,^Bill of' +
                ' Materials^,^Components^,^Component Internal ID^,^Revision^,^Revision Internal Id^,^Quantity^,^Units^&&';

            var plantext1='"Assembly","Assembly Internal ID","Bill of Materials id","Bill of' +
                ' Materials","Components","Component Internal ID","Revision","Revision Internal Id","Quantity","Units"\n';

            datatocsv = plantext;
            datatocsv1 = plantext1;

            pagedData.pageRanges.forEach(function (pageRange) {

                var page = pagedData.fetch({index: pageRange.index});


                page.data.forEach(function (fresult1) {
                    billid=fresult1.getValue({name: "billofmaterials",join: "assemblyItemBillOfMaterials"});
                    billofmaterialsid=fresult1.getValue({name: "billofmaterialsid",
                        join: "assemblyItemBillOfMaterials"});
                    billofmaterials=fresult1.getText({name: "billofmaterials",
                        join: "assemblyItemBillOfMaterials"});
                    assembly=fresult1.getText({name: "assembly",
                        join: "assemblyItemBillOfMaterials"});
                    internalid=fresult1.getText({name: "internalid"});

                    if (billofm[billid]) {
                        billofm[billid].forEach(function (billitem) {

                            pagedatas[i] = {
                                "billofmaterialsid":billofmaterialsid,
                                "billofmaterials": billofmaterials,
                                "itemid": assembly,
                                "name":billitem.name,
                                "item": billitem.item,
                                "iteminternalid": internalid,
                                "componentinternalid": billitem.componentinternalid,
                                "revisioninternalid": billitem.internalid,
                                "bomquantity": billitem.bomquantity,
                                "baseunits": billitem.baseunits,
                            };

                            jsondata += pagedatas[i];
                            plantext = '^' + assembly + '^,^' + internalid + '^,^' + billofmaterialsid + '^,^' + billofmaterials + '^,^'
                                + billitem.item + '^,^' + billitem.componentinternalid + '^,^'  + billitem.name + '^,^' + billitem.internalid + '^,^' + billitem.bomquantity + '^,^' + billitem.baseunits + '^&&';

                            datatocsv += plantext;

                            plantext1 = '"' + assembly + '","' + internalid+ '","' + billofmaterialsid + '","' + billofmaterials + '","'
                                + billitem.item + '","' + billitem.componentinternalid + '","' + billitem.name + '","'
                                + billitem.internalid + '","'
                                + billitem.bomquantity + '","' + billitem.baseunits + '"\n';

                            datatocsv1 += plantext1;
                            i++;
                        })
                    }


                })

            })


            billofm1.forEach(function (detalle1, index) {


                    pagedatas[i] = {

                        "iteminternalid": detalle1.internalid,
                        "billofmaterialsid":detalle1.billofmaterialsid,
                        "billofmaterials": detalle1.billofmaterials,
                        "itemid": detalle1.itemid,
                        "internalid": detalle1.internalid,
                        "memberid": detalle1.memberid,
                        "name":detalle1.name,
                        "item": detalle1.item,
                        "bomquantity": detalle1.bomquantity,
                        "baseunits": detalle1.baseunits,
                    };

                    jsondata += pagedatas[i];
                    plantext = '^' + detalle1.itemid + '^,^' + detalle1.internalid + '^,^' + "0" + '^,^' + detalle1.billofmaterials + '^,^'
                        + detalle1.item + '^,^'  + detalle1.memberid + '^,^'  + detalle1.name + '^,^' + "0" + '^,^' + detalle1.bomquantity + '^,^' + detalle1.baseunits + '^&&';

                    datatocsv += plantext;

                    plantext1 = '"' + detalle1.itemid + '","' + detalle1.internalid + '","' + "0" + '","' + detalle1.billofmaterials + '","'
                        + detalle1.item + '","' + detalle1.memberid + '","' + detalle1.name + '","' + "0" + '","'
                        + detalle1.bomquantity + '","' + detalle1.baseunits + '"\n';

                    datatocsv1 += plantext1;
                    i++;


                })







            jsondata = JSON.stringify(pagedatas);
            createAndSaveJSON();
            createAndSaveFile();
            return pagedatas;

        }
        exports.onRequest = onRequest;
        return exports;

    });