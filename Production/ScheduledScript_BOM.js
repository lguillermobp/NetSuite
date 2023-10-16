/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(["N/runtime",'N/search',"N/email",'N/log','N/record', 'N/file', "/SuiteScripts/Modules/generaltoolsv1.js"],

    function(runtime,s,email, log, record, file, GENERALTOOLS) {

        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
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

        function execute(scriptContext) {

            findCases();

        }
        function createAndSaveFile() {

            var paramrec = GENERALTOOLS.get_param_value(6);
            var folderid= paramrec.data.getValue({fieldId: "custrecordparams_value"});


            var fileObj = file.create({
                name: 'BOM.csv',
                fileType: file.Type.CSV,
                contents: datatocsv1
            });
            fileObj.folder = folderid;
            var id = fileObj.save();
            fileObj = file.load({
                id: id
            });

            var paramrec = GENERALTOOLS.get_param_value(5);
            var recipients= paramrec.data.getValue({fieldId: "custrecordparams_value"});
            var userObj = runtime.getCurrentUser();
            log.debug("userObj",userObj);

            email.send({
                author : 1205,
                recipients : recipients,
                subject : "subject",
                body : "emailBody",
                attachments: [fileObj],

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

            //********************

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


            //*********************
            jsondata = JSON.stringify(pagedatas);
            createAndSaveFile();
            return;

        }



        return {    execute: execute };

    });
