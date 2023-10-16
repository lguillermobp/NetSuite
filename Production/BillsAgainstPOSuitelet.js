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
            var list = ui.createList({title:"Bills against Purchase Order"});




            list.clientScriptModulePath = "./billsagainstpotoexcel-cl.js";


            list.addButton({

                id : 'custpage_buttonid', //always prefix with 'custpage_'

                label : 'Export CSV', //label of the button

                functionName: 'onButtonClick("'+datatocsv+'")'
            });

            list.addColumn({
                id: "itemid",
                type: ui.FieldType.TEXT,
                label:'Item Id'
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
            }); list.addColumn({
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
                billofmaterials: results.billofmaterials,
                revisionname: results.name,
                component: results.item,
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

            billofm=varrut.data;

            var fsearch = s.create({
                type: "item",
                filters:
                    [
                        ["type", "anyof", "Assembly"],
                        "AND",
                        ["assemblyitembillofmaterials.default", "is", "T"]
                    ],

                columns:
                    [
                        s.createColumn({
                            name: "assembly",
                            join: "assemblyItemBillOfMaterials"
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

            var plantext='^Assembly^,^Bill of Materials id^,^Bill of' +
                ' Materials^,^Components^,^Revision^,^Quantity^,^Units^&&';

            var plantext1='"Assembly","Bill of Materials id","Bill of' +
                ' Materials","Components","Revision","Quantity","Units"\n';

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

                    if (billofm[billid]) {
                        billofm[billid].forEach(function (billitem) {

                            pagedatas[i] = {
                                "billofmaterialsid":billofmaterialsid,
                                "billofmaterials": billofmaterials,
                                "itemid": assembly,
                                "name":billitem.name,
                                "item": billitem.item,
                                "bomquantity": billitem.bomquantity,
                                "baseunits": billitem.baseunits,
                            };

                            jsondata += pagedatas[i];
                            plantext = '^' + assembly + '^,^' + billofmaterialsid + '^,^' + billofmaterials + '^,^'
                                + billitem.item + '^,^'  + billitem.name + '^,^' + billitem.bomquantity + '^,^' + billitem.baseunits + '^&&';

                            datatocsv += plantext;

                            plantext1 = '"' + assembly + '","' + billofmaterialsid + '","' + billofmaterials + '","'
                                + billitem.item + '","' + billitem.name + '","'
                                + billitem.bomquantity + '","' + billitem.baseunits + '"\n';

                            datatocsv1 += plantext1;
                            i++;
                        })
                    }


                })
            })
            jsondata = JSON.stringify(pagedatas);
            createAndSaveJSON();
            createAndSaveFile();
            return pagedatas;

        }
        exports.onRequest = onRequest;
        return exports;

    });