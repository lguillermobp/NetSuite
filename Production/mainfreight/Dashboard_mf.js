/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(['N/file','N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log',  "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/Modules/LoDash.js", "/SuiteScripts/Modules/qrious.js", "/SuiteScripts/Modules/qrious.min.js"],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (file, redirect, runtime,serverWidget,record, s, file, error,log,  GENERALTOOLS, _) {
		/**
		 *
		 * @param context
		 */
        function onRequest(context) {

            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Interface MainFreight`
                });
                form.clientScriptModulePath = '/SuiteScripts/mainfreight/DashboardClient_mf.js';

                form.addSubmitButton({
                    label: 'Import'
                });
    
                let fieldfilename = form.addField({
                    id: "custpage_file",
                    type: serverWidget.FieldType.FILE,
                    label: "File Name (CSV)",
                });
                
                fieldfilename.isMandatory = true;
    
                let htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                htmlField.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.ENDROW
                });
                htmlField.defaultValue = '<div> testing  </div>';
    
    
                var sublistpm = form.addSublist({
                    id: 'custpage_records',
                    type : serverWidget.SublistType.LIST,
                    label: 'Records Imported to be processed',
        
                });
				

                sublistpm.addField({
                    id: "custrecordml_internalid",
                    type: serverWidget.FieldType.TEXT,
                    label:'Internal ID'
                });
    
                sublistpm.addField({
                    id: "custrecordml_recordtype",
                    type: serverWidget.FieldType.TEXT,
                    label:'Record Type'
                });
                sublistpm.addField({
                    id: "custrecordml_transformto",
                    type: serverWidget.FieldType.TEXT,
                    label:'Transform TO'
                });
                sublistpm.addField({
                    id: "custrecordml_item",
                    type: serverWidget.FieldType.TEXT,
                    label:'Item ID'
                });
                sublistpm.addField({
                    id: "custrecordml_qty",
                    type: serverWidget.FieldType.TEXT,
                    label:'Quantity'
                });
                sublistpm.addField({
                    id: "custrecordml_lot",
                    type: serverWidget.FieldType.TEXT,
                    label:'Lot'
                });
                sublistpm.addField({
                    id: "custrecordml_location",
                    type: serverWidget.FieldType.TEXT,
                    label:'Location ID'
                });
                sublistpm.addField({
                    id: "custrecordml_bin",
                    type: serverWidget.FieldType.TEXT,
                    label:'Bin Location ID'
                });
                sublistpm.addField({
                    id: "custrecordml_exdate",
                    type: serverWidget.FieldType.TEXT,
                    label:'Expiration Date'
                });
                sublistpm.addField({
                    id: "custrecordml_notes",
                    type: serverWidget.FieldType.TEXT,
                    label:'Notes'
                });
                sublistpm.addField({
                    id: "custrecordml_status",
                    type: serverWidget.FieldType.TEXT,
                    label:'Status'
                });
    
                // loop through each line, skipping the header
                var resultspt= findCases1("all");
                var counter = 0;
                resultspt.forEach(function(result1) {


                    if (result1.custrecord_internalid) {

                    sublistpm.setSublistValue({
                        id: 'custrecordml_internalid',
                        line: counter,
                        value: result1.custrecord_internalid+" "
                        
                    });

                    sublistpm.setSublistValue({
                        id: 'custrecordml_recordtype',
                        line: counter,
                        value: result1.custrecord_recordtype +" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_transformto',
                        line: counter,
                        value: result1.custrecord_transformrecord+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_item',
                        line: counter,
                        value: result1.custrecord_itemid+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_qty',
                        line: counter,
                        value: result1.custrecord_qty+" "
                    });

                    sublistpm.setSublistValue({
                        id: 'custrecordml_location',
                        line: counter,
                        value: result1.custrecord_locationid+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_bin',
                        line: counter,
                        value: result1.custrecord_binid+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_lot',
                        line: counter,
                        value: result1.custrecord_lot+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_exdate',
                        line: counter,
                        value: result1.custrecord_expirationdate+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_notes',
                        line: counter,
                        value: result1.custrecord_note+" "
                    });
                    sublistpm.setSublistValue({
                        id: 'custrecordml_status',
                        line: counter,
                        value: result1.custrecord_recstatus+" "
                    });
                    counter++;
                }
				})

                //if (results.length> 0) {
    
                    sublistpm.addButton({
                        id: 'custpage_process',
                        label: 'Process',
                        functionName: "process()"
                    });
                    
                //}
                if (resultspt.length> 0) {
    
                sublistpm.addButton({
                    id: 'custpage_clear',
                    label: 'clear',
                    functionName: "clear()"
                });
                
                }
        
                var userObj = runtime.getCurrentUser();
                var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
                var initials=paramemp.data.getValue({fieldId: "initials"});
                
                log.debug("userObj",userObj);
                
                context.response.writePage(form);
            } else {
              var fileObj = context.request.files.custpage_file;
              fileObj.name = "mainfreight.csv";
              fileObj.folder = 2744736; //replace with own folder ID
              var id = fileObj.save();


              //var fileObj1 = file.load({  id: '458763'        });
              log.debug("fileObj",fileObj);

              //get the # of lines
              var headersfile =[];
              var arrLines = fileObj.getContents().split(/\n|\n\r/);
              log.debug("arrLines",arrLines);
              var content = arrLines[0].split(',');
              for (var i = 0; i < content.length - 1; i++) {
                  headersfile[content[i]]=i;
              }
              log.debug("headersfile",headersfile);

              for (var i = 1; i < arrLines.length - 1; i++) {
					//split the 1 line of data into an array.  If the file was a csv file, each array position holds a value from the columns of the 1 line of data
					var content = arrLines[i].split(',');



                    if (content[headersfile["Internal ID"]]) {
                        var internalid = content[headersfile["Internal ID"]];
                        var recordtype = content[headersfile["Record Type"]];
                        var transformto = content[headersfile["Transform Record"]].trim();
                        var item = content[headersfile["Item"]];
                        var qty = content[headersfile["Qty"]];
                        var lot = content[headersfile["Lot"]];
                        var location = content[headersfile["Location"]];
                        var bin = content[headersfile["Binlocation ID"]];
                        var exdate = content[headersfile["Ex Date"]];
                        var notes = "";
                        var status = "new";
                    try{ 
                        var recval = record.load({
                            type: recordtype, 
                            id: internalid,
                            isDynamic: true,
                        });
                    }catch(e){notes += "error with this internal Id"+ String(e.message); var status = "error";}
                    try{ 
                        var recvalbin = record.load({
                            type: "bin", 
                            id: bin,
                            isDynamic: true,
                        });
                    }catch(e){notes += " ; error with this Bin Id"+ String(e.message); var status = "error";}

                    if (transformto.length==0) {notes += " ; error with this Transform Record to "; var status = "error";}
                    var rec = record.create({
                        type: "customrecord_interface",
                        isDynamic: false,
                        defaultValues: null
                    });

                        log.debug("rec",rec);
                        rec.setValue({
                            fieldId: "custrecord_internalid",
                            value: internalid
                        });
                        rec.setValue({
                            fieldId: "custrecord_transformrecord",
                            value: transformto
                        });
                        rec.setValue({
                            fieldId: "custrecord_itemid",
                            value: item
                        });
                        rec.setValue({
                            fieldId: "custrecord_recordtype",
                            value: recordtype
                        });
                        rec.setValue({
                            fieldId: "custrecord_qty",
                            value: qty
                        });
                        rec.setValue({
                            fieldId: "custrecord_lot",
                            value: lot
                        });
                        rec.setValue({
                            fieldId: "custrecord_locationid",
                            value: location
                        });
                        rec.setValue({
                            fieldId: "custrecord_binid",
                            value: bin
                        });
                        rec.setValue({
                            fieldId: "custrecord_expirationdate",
                            value: exdate
                        });
                        rec.setValue({
                            fieldId: "custrecord_note",
                            value: notes
                        });
                        rec.setValue({
                            fieldId: "custrecord_recstatus",
                            value: status
                        });
                        rec.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });

                    }

                }
              

              redirect.toSuitelet({
                scriptId: 'customscript_dashboard_mf',
                deploymentId: 'customdeploy1'
            });
            
            }
    }
	function findCases1(sts) {
		var pagedatas=[];

		var fsearch = s.create({
			type: "customrecord_interface",
            filters:
            [
            ],
            columns:
            [
                s.createColumn({
                    name: "name",
                    sort: s.Sort.ASC
                }),
                "created",
                "custrecord_dateprocessed",
                "custrecord_expirationdate",
                "custrecord_itemid",
                "custrecord_locationid",
                "custrecord_lot",
                "custrecord_note",
                "custrecord_qty",
                "custrecord_recordtype",
                "custrecord_recstatus",
                "custrecord_transformrecord",
                "custrecord_internalid",
                "custrecord_binid"
            ]
		});

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});



			page.data.forEach(function (fresult) {
				pagedatas[i] = {
					"custrecord_dateprocessed": fresult.getValue({name: "custrecord_dateprocessed"}),
					"custrecord_expirationdate": fresult.getValue({name: "custrecord_expirationdate"}),
					"custrecord_itemid": fresult.getValue({name: "custrecord_itemid"}),
					"custrecord_locationid": fresult.getValue({name: "custrecord_locationid"}),
					"custrecord_lot": fresult.getValue({name: "custrecord_lot"}),
					"custrecord_note": fresult.getValue({name: "custrecord_note"}),
					"custrecord_qty": fresult.getValue({name: "custrecord_qty"}),
					"custrecord_recordtype": fresult.getValue({name: "custrecord_recordtype"}),
                    "custrecord_internalid": fresult.getValue({name: "custrecord_internalid"}),
                    "custrecord_transformrecord": fresult.getValue({name: "custrecord_transformrecord"}),
					"custrecord_recstatus": fresult.getValue({name: "custrecord_recstatus"}),
                    "custrecord_binid": fresult.getValue({name: "custrecord_binid"})
				}
                log.debug("pagedatas[i]",pagedatas[i]);

				i++;

			})
		});

		return pagedatas;
	}
    return {
        onRequest: onRequest
    };
});