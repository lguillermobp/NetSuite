/******************************************************************************************************
 Script Name - AVA_UES_Customer.js
 Company -     Avalara Technologies Pvt Ltd.
 ******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

define(['N/ui/serverWidget', 'N/runtime', 'N/search', 'N/record', 'N/cache', './utility/AVA_Library'],
    function(ui, runtime, search, record, cache, ava_library){
        function AVA_CustomerBeforeLoad(context){
            var cForm = context.form;
            var nRecord = context.newRecord;
            var executionContext = runtime.executionContext;

            if(executionContext == 'USERINTERFACE' || executionContext == 'USEREVENT' || executionContext == 'WEBSERVICES' || executionContext == 'CSVIMPORT' || executionContext == 'SCHEDULED' || executionContext == 'SUITELET'){
                var avaConfigCache = cache.getCache({
                    name: 'avaConfigCache',
                    scope: cache.Scope.PROTECTED
                });

                var configCache = avaConfigCache.get({
                    key: 'avaConfigObjRec',
                    loader: ava_library.AVA_LoadValuesToGlobals
                });

                if(configCache != null && configCache.length > 0){
                    configCache = JSON.parse(configCache);
                }

                var exemptCertNo;
                if(executionContext == 'USERINTERFACE'){
                    exemptCertNo = cForm.getField({
                        id: 'custentity_ava_exemptcertno'
                    });
                    exemptCertNo.updateDisplayType({
                        displayType: ui.FieldDisplayType.HIDDEN
                    });
                }

                if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1 && configCache.AVA_DisableTax == false){
                    var addressBookSublist = cForm.getSublist({
                        id: 'addressbook'
                    });

                    if(addressBookSublist != null){
                        addressBookSublist.addField({
                            id: 'custpage_ava_entityusecode',
                            type: ui.FieldType.SELECT,
                            label: 'Entity/Use Code',
                            source: 'customrecord_avaentityusecodes'
                        });

                        if(executionContext == 'USERINTERFACE'){
                            addressBookSublist.addField({
                                id: 'custpage_ava_gposr',
                                type: ui.FieldType.CHECKBOX,
                                label: 'Goods/Service Rendered Address'
                            });
                            addressBookSublist.addField({
                                id: 'custpage_ava_originaddr',
                                type: ui.FieldType.CHECKBOX,
                                label: 'Point of Order Origin Address'
                            });
                            addressBookSublist.addField({
                                id: 'custpage_ava_import',
                                type: ui.FieldType.CHECKBOX,
                                label: 'Import Address'
                            });
                        }
                    }

                    cForm.addTab({
                        id: 'custpage_avatab',
                        label: 'AvaTax'
                    });

                    var exemptionFieldLength = cForm.addField({
                        id: 'custpage_ava_exemption',
                        type: ui.FieldType.TEXT,
                        label: 'Exemption Certificate No.',
                        source: null,
                        container: 'custpage_avatab'
                    });
                    exemptionFieldLength.maxLength = 25;

                    var exemptionIdDisplayType = cForm.addField({
                        id: 'custpage_ava_exemptionid',
                        type: ui.FieldType.TEXT,
                        label: 'Exemption ID',
                        source: null,
                        container: 'custpage_avatab'
                    });
                    exemptionIdDisplayType.updateDisplayType({
                        displayType: ui.FieldDisplayType.HIDDEN
                    });

                    if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
                        var searchRecord = search.create({
                            type: 'customrecord_avacustomerexemptmapping',
                            filters: ['custrecord_ava_exemptcustomerid', 'anyof', nRecord.id],
                            columns: ['custrecord_ava_exemptno', 'custrecord_ava_exemptcustomerid']
                        });

                        var searchresult = searchRecord.run();
                        searchresult = searchresult.getRange({
                            start: 0,
                            end: 1000
                        });

                        if(context.type == context.UserEventType.EDIT){
                            var exemptNoField = cForm.addField({
                                id: 'custpage_ava_exemptno',
                                type: ui.FieldType.LONGTEXT,
                                label: 'Exempt No'
                            });
                            exemptNoField.updateDisplayType({
                                displayType: ui.FieldDisplayType.HIDDEN
                            });

                            if(searchresult != null && searchresult.length > 0){
                                var exemptionFieldValue = cForm.getField({
                                    id: 'custpage_ava_exemptno'
                                });
                                exemptionFieldValue.defaultValue = JSON.stringify(searchresult);
                            }
                        }

                        exemptCertNo = nRecord.getValue({
                            fieldId: 'custentity_ava_exemptcertno'
                        });

                        var exemption;
                        if(exemptCertNo != null && exemptCertNo.length > 0){
                            exemption = cForm.getField({
                                id: 'custpage_ava_exemption'
                            });
                            exemption.defaultValue = exemptCertNo;
                        }
                        else{
                            for(var i = 0; searchresult != null && i < searchresult.length; i++){
                                exemption = cForm.getField({
                                    id: 'custpage_ava_exemption'
                                });
                                exemption.defaultValue = searchresult[i].getValue('custrecord_ava_exemptno');

                                var exemptionId = cForm.getField({
                                    id: 'custpage_ava_exemptionid'
                                });
                                exemptionId.defaultValue = searchresult[i].id;
                            }
                        }

                        if(addressBookSublist != null){
                            var searchRecord = search.create({
                                type: 'customrecord_avaentityusemapping',
                                filters: ['custrecord_ava_customerid', 'anyof', nRecord.id],
                                columns: ['custrecord_ava_entityusemap', 'custrecord_ava_addressid']
                            });

                            var searchresult = searchRecord.run();
                            searchresult = searchresult.getRange({
                                start: 0,
                                end: 1000
                            });

                            var addressLineCount = nRecord.getLineCount({
                                sublistId: 'addressbook'
                            });

                            for(var k = 0; k < addressLineCount && searchresult != null && searchresult.length > 0; k++){
                                var addId = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'id',
                                    line: k
                                });

                                for(var m = 0; m < searchresult.length; m++){
                                    if(searchresult[m].getValue('custrecord_ava_addressid') == addId){
                                        nRecord.setSublistValue({
                                            sublistId: 'addressbook',
                                            fieldId: 'custpage_ava_entityusecode',
                                            line: k,
                                            value: searchresult[m].getValue('custrecord_ava_entityusemap')
                                        });
                                        break;
                                    }
                                }
                            }
                        }

                        if(executionContext == 'USERINTERFACE'){
                            var searchRecordVatAddresses = search.create({
                                type: 'customrecord_vataddresses',
                                filters: ['custrecord_ava_vatcustid', 'anyof', nRecord.id],
                                columns: ['custrecord_ava_gosaddid', 'custrecord_ava_gsrenderedflag', 'custrecord_ava_originaddid', 'custrecord_ava_originflag', 'custrecord_ava_importaddid', 'custrecord_ava_importflag']
                            });
                            var searchResultVatAddresses = searchRecordVatAddresses.run();
                            searchResultVatAddresses = searchResultVatAddresses.getRange({
                                start: 0,
                                end: 1000
                            });

                            for(var i = 0; i < addressLineCount && searchResultVatAddresses != null && searchResultVatAddresses.length > 0; i++){
                                var addId = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'id',
                                    line: i
                                });

                                for(var j = 0; j < searchResultVatAddresses.length; j++){
                                    if(searchResultVatAddresses[j].getValue('custrecord_ava_gosaddid') == addId){
                                        nRecord.setSublistValue({
                                            sublistId: 'addressbook',
                                            fieldId: 'custpage_ava_gposr',
                                            line: i,
                                            value: searchResultVatAddresses[j].getValue('custrecord_ava_gsrenderedflag')
                                        });
                                    }

                                    if(searchResultVatAddresses[j].getValue('custrecord_ava_originaddid') == addId){
                                        nRecord.setSublistValue({
                                            sublistId: 'addressbook',
                                            fieldId: 'custpage_ava_originaddr',
                                            line: i,
                                            value: searchResultVatAddresses[j].getValue('custrecord_ava_originflag')
                                        });
                                    }

                                    if(searchResultVatAddresses[j].getValue('custrecord_ava_importaddid') == addId){
                                        nRecord.setSublistValue({
                                            sublistId: 'addressbook',
                                            fieldId: 'custpage_ava_import',
                                            line: i,
                                            value: searchResultVatAddresses[j].getValue('custrecord_ava_importflag')
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function AVA_CustomerBeforeSubmit(context){
            var nRecord = context.newRecord;
            var executionContext = runtime.executionContext;

            if((context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT || context.type == context.UserEventType.COPY) && (executionContext == 'USERINTERFACE' || executionContext == 'USEREVENT' || executionContext == 'WEBSERVICES' || executionContext == 'CSVIMPORT' || executionContext == 'SCHEDULED' || executionContext == 'SUITELET' || executionContext == 'WEBSTORE' || executionContext == 'WEBAPPLICATION' || executionContext == 'MAPREDUCE')){
                var avaConfigCache = cache.getCache({
                    name: 'avaConfigCache',
                    scope: cache.Scope.PROTECTED
                });

                var configCache = avaConfigCache.get({
                    key: 'avaConfigObjRec',
                    loader: ava_library.AVA_LoadValuesToGlobals
                });

                if(configCache != null && configCache.length > 0){
                    configCache = JSON.parse(configCache);
                }

                if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
                    if(executionContext != 'CSVIMPORT' && executionContext != 'WEBSERVICES' && executionContext != 'WEBSTORE' && executionContext != 'WEBAPPLICATION'){

                        //Set Exemption Certificate No in Entity field
                        nRecord.setValue({
                            fieldId: 'custentity_ava_exemptcertno',
                            value: nRecord.getValue('custpage_ava_exemption'),
                            ignoreFieldChange: true
                        });
                    }

                    //Set Taxability of the Customer
                    if(configCache.AVA_MarkCustTaxable != null && configCache.AVA_MarkCustTaxable != 0){
                        if(configCache.AVA_MarkCustTaxable == 1 || ((context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY) && configCache.AVA_MarkCustTaxable == 2) || (context.type == context.UserEventType.EDIT && configCache.AVA_MarkCustTaxable == 3)){
                            nRecord.setValue({
                                fieldId: 'taxable',
                                value: true,
                                ignoreFieldChange: true
                            });
                        }
                    }

                    if(nRecord.getValue('taxitem') == null || (nRecord.getValue('taxitem') != null && nRecord.getValue('taxitem').length <= 0)){
                        if(configCache.AVA_DefaultCustomerTaxcode != null && configCache.AVA_DefaultCustomerTaxcode != 0){
                            var subsidiaryId = nRecord.getValue('subsidiary');

                            var searchRecord = search.create({
                                type: 'customrecord_avasubsidiaries',
                                filters: ['custrecord_ava_subsidiary', 'anyof', subsidiaryId],
                                columns: ['custrecord_ava_subdeftaxcode']
                            });

                            var searchResult = searchRecord.run();
                            searchResult = searchResult.getRange({
                                start: 0,
                                end: 1000
                            });

                            var taxCodeId;
                            if(searchResult != null){
                                for(var i = 0; i < Math.min(1, searchResult.length); i++){
                                    taxCodeId = searchResult[i].getValue('custrecord_ava_subdeftaxcode');
                                    break;
                                }
                            }

                            taxCodeId = (taxCodeId != null && taxCodeId.lastIndexOf('+') != -1) ? taxCodeId.substring(parseFloat(taxCodeId.lastIndexOf('+') + 1), taxCodeId.length) : null;

                            if(taxCodeId != null){
                                if(configCache.AVA_DefaultCustomerTaxcode == 1 || ((context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY) && configCache.AVA_DefaultCustomerTaxcode == 2) || (context.type == context.UserEventType.EDIT && configCache.AVA_DefaultCustomerTaxcode == 3)){
                                    nRecord.setValue({
                                        fieldId: 'taxitem',
                                        value: taxCodeId,
                                        ignoreFieldChange: true
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        function AVA_CustomerAfterSubmit(context){
            var nRecord = context.newRecord;
            var executionContext = runtime.executionContext;

            if(executionContext == 'USERINTERFACE' || executionContext == 'USEREVENT' || executionContext == 'WEBSERVICES' || executionContext == 'CSVIMPORT' || executionContext == 'SCHEDULED' || executionContext == 'SUITELET' || executionContext == 'WEBSTORE' || executionContext == 'WEBAPPLICATION'){
                var avaConfigCache = cache.getCache({
                    name: 'avaConfigCache',
                    scope: cache.Scope.PROTECTED
                });

                var configCache = avaConfigCache.get({
                    key: 'avaConfigObjRec',
                    loader: ava_library.AVA_LoadValuesToGlobals
                });

                if(configCache != null && configCache.length > 0){
                    configCache = JSON.parse(configCache);
                }

                if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
                    if(context.type == context.UserEventType.CREATE){
                        var custRec = record.load({
                            type: record.Type.CUSTOMER,
                            id: nRecord.id
                        });

                        var rec;
                        if(executionContext == 'USERINTERFACE'){
                            rec = record.create({
                                type: 'customrecord_vataddresses'
                            });
                            rec.setValue({
                                fieldId: 'custrecord_ava_vatcustid',
                                value: nRecord.id
                            });
                            rec.setValue({
                                fieldId: 'custrecord_ava_vatcustomerinternalid',
                                value: nRecord.id
                            });
                        }

                        var lineItemCount = nRecord.getLineCount({
                            sublistId: 'addressbook'
                        });

                        for(var i = 0; i < lineItemCount; i++){
                            var useCode = nRecord.getSublistValue({
                                sublistId: 'addressbook',
                                fieldId: 'custpage_ava_entityusecode',
                                line: i
                            });
                            var addId = custRec.getSublistValue({
                                sublistId: 'addressbook',
                                fieldId: 'id',
                                line: i
                            });

                            if(useCode != null && useCode.length > 0){
                                var recEntityMapping = record.create({
                                    type: 'customrecord_avaentityusemapping'
                                });
                                recEntityMapping.setValue({
                                    fieldId: 'custrecord_ava_customerid',
                                    value: nRecord.id
                                });
                                recEntityMapping.setValue({
                                    fieldId: 'custrecord_ava_addressid',
                                    value: (addId).toString()
                                });
                                recEntityMapping.setValue({
                                    fieldId: 'custrecord_ava_entityusemap',
                                    value: useCode
                                });
                                recEntityMapping.setValue({
                                    fieldId: 'custrecord_ava_custinternalid',
                                    value: (nRecord.id).toString()
                                });
                                var recId = recEntityMapping.save({});
                            }

                            //evat
                            if(executionContext == 'USERINTERFACE'){
                                var gsrAddressFlag = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'custpage_ava_gposr',
                                    line: i
                                });
                                var originAddressFlag = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'custpage_ava_originaddr',
                                    line: i
                                });
                                var importAddressFlag = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'custpage_ava_import',
                                    line: i
                                });

                                if(gsrAddressFlag == 'T'){
                                    var address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', i);

                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gsrenderedflag',
                                        value: true
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosaddid',
                                        value: addId
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosaddr1',
                                        value: address.getValue('addr1')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosaddr2',
                                        value: address.getValue('addr2')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_goscity',
                                        value: address.getValue('city')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosstate',
                                        value: address.getValue('state')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_goszip',
                                        value: address.getValue('zip')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_goscountry',
                                        value: address.getValue('country')
                                    });
                                }

                                if(originAddressFlag == 'T'){
                                    var address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', i);

                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originflag',
                                        value: true
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originaddid',
                                        value: addId
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originaddr1',
                                        value: address.getValue('addr1')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originaddr2',
                                        value: address.getValue('addr2')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_origincity',
                                        value: address.getValue('city')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originstate',
                                        value: address.getValue('state')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originzip',
                                        value: address.getValue('zip')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_origincountry',
                                        value: address.getValue('country')
                                    });
                                }

                                if(importAddressFlag == 'T'){
                                    var address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', i);

                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importflag',
                                        value: true
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importaddid',
                                        value: addId
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importaddr1',
                                        value: address.getValue('addr1')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importaddr2',
                                        value: address.getValue('addr2')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importcity',
                                        value: address.getValue('city')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importstate',
                                        value: address.getValue('state')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importzip',
                                        value: address.getValue('zip')
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importcountry',
                                        value: address.getValue('country')
                                    });
                                }
                            }
                        }

                        if(executionContext == 'USERINTERFACE'){
                            rec.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            });
                        }
                    }
                    else if(context.type == context.UserEventType.EDIT){
                        var searchRecord = search.create({
                            type: 'customrecord_avaentityusemapping',
                            filters: ['custrecord_ava_customerid', 'anyof', nRecord.id],
                            columns: ['custrecord_ava_addressid', 'custrecord_ava_entityusemap']
                        });
                        var searchResult = searchRecord.run();
                        searchResult = searchResult.getRange({
                            start : 0,
                            end : 1000
                        });

                        var addressBookLineCount = nRecord.getLineCount({
                            sublistId: 'addressbook'
                        });

                        for(var ii = 0; searchResult != null && ii < searchResult.length; ii++){
                            var addressIdFlag = 'F';

                            for(var j = 0; j < addressBookLineCount && addressBookLineCount <= 10000; j++){
                                var lineItemValue = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'id',
                                    line: j
                                });

                                if(searchResult[ii].getValue('custrecord_ava_addressid') == lineItemValue){
                                    addressIdFlag = 'T';
                                    break;
                                }
                            }

                            if(addressIdFlag == 'F'){
                                record.delete({
                                    type: 'customrecord_avaentityusemapping',
                                    id: searchResult[ii].id
                                });
                            }
                        }

                        var exemptNo = nRecord.getValue('custpage_ava_exemptno');
                        if(exemptNo != null && exemptNo.length > 0){
                            var searchResult1 = JSON.parse(nRecord.getValue('custpage_ava_exemptno'));
                            record.delete({
                                type: 'customrecord_avacustomerexemptmapping',
                                id: searchResult1[0].id
                            });
                        }

                        var custRec = record.load({
                            type: record.Type.CUSTOMER,
                            id: nRecord.id
                        });

                        var lineCount = nRecord.getLineCount({
                            sublistId: 'addressbook'
                        });

                        searchResult = searchRecord.run();
                        searchResult = searchResult.getRange({
                            start : 0,
                            end : 1000
                        });

                        for(var iii=0; iii < lineCount && lineCount <= 10000; iii++){
                            var rec, existFlag = 'F', changeFlag = 0, delRec;

                            var addId = custRec.getSublistValue({
                                sublistId: 'addressbook',
                                fieldId: 'id',
                                line: iii
                            });
                            addId = (addId).toString();

                            var useCode = nRecord.getSublistValue({
                                sublistId: 'addressbook',
                                fieldId: 'custpage_ava_entityusecode',
                                line: iii
                            });

                            for(var customRec = 0; searchResult != null && customRec < searchResult.length; customRec++){
                                if(searchResult[customRec].getValue('custrecord_ava_addressid') == addId){
                                    if(useCode != null && useCode.length > 0){
                                        if(searchResult[customRec].getValue('custrecord_ava_entityusemap') != useCode){
                                            record.submitFields({
                                                type : 'customrecord_avaentityusemapping',
                                                id : searchResult[customRec].id,
                                                values : {'custrecord_ava_entityusemap' : useCode}
                                            });
                                            changeFlag = 1;//Record exists but value changed
                                        }
                                        else{
                                            changeFlag = 2;//Record exists but value is not changed
                                        }
                                    }
                                    else{
                                        delRec = searchResult[customRec].id;
                                        changeFlag = 3;//Record exists with blank value
                                    }

                                    existFlag = 'T';
                                    break;
                                }
                            }

                            if(useCode != null && useCode.length > 0){
                                if(existFlag == 'F' && changeFlag == 0){
                                    rec = record.create({
                                        type : 'customrecord_avaentityusemapping'
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_ava_customerid',
                                        value : nRecord.id
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_ava_addressid',
                                        value : addId
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_ava_entityusemap',
                                        value : useCode
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_ava_custinternalid',
                                        value : (nRecord.id).toString()
                                    });
                                    var recId = rec.save({});
                                }
                            }
                            else{
                                if(existFlag == 'T' && changeFlag == 3){
                                    if(executionContext == 'USERINTERFACE'){
                                        record.delete({
                                            type : 'customrecord_avaentityusemapping',
                                            id : delRec
                                        });
                                    }
                                }
                            }
                        }

                        if(executionContext == 'USERINTERFACE'){
                            //evat
                            var address, gosprFlag, orderOriginFlag, importFlag, flagGospr = 0, flagOrderOrigin = 0, flagImport = 0;

                            searchRecord = search.create({
                                type: 'customrecord_vataddresses',
                                filters: ['custrecord_ava_vatcustid', 'anyof', nRecord.id],
                                columns: ['custrecord_ava_gosaddid', 'custrecord_ava_originaddid', 'custrecord_ava_importaddid', 'custrecord_ava_vatcustomerinternalid']
                            });
                            searchResult = searchRecord.run();
                            searchResult = searchResult.getRange({
                                start: 0,
                                end: 1000
                            });

                            if(searchResult != null && searchResult.length > 0){
                                var rec = record.load({
                                    type: 'customrecord_vataddresses',
                                    id: searchResult[0].id
                                });

                                for(var iii = 0; iii < lineCount && lineCount <= 10000; iii++){
                                    var addId = custRec.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: iii
                                    });
                                    gosprFlag = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_gposr',
                                        line: iii
                                    });
                                    orderOriginFlag = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_originaddr',
                                        line: iii
                                    });
                                    importFlag = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_import',
                                        line: iii
                                    });

                                    if(gosprFlag == 'T' && flagGospr == 0){
                                        flagGospr = 1;
                                        address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);

                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gsrenderedflag',
                                            value: true
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosaddid',
                                            value: addId
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosaddr1',
                                            value: address.getValue('addr1')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosaddr2',
                                            value: address.getValue('addr2')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_goscity',
                                            value: address.getValue('city')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosstate',
                                            value: address.getValue('state')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_goszip',
                                            value: address.getValue('zip')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_goscountry',
                                            value: address.getValue('country')
                                        });
                                    }

                                    if(orderOriginFlag == 'T' && flagOrderOrigin == 0){
                                        flagOrderOrigin = 1;
                                        address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);

                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originflag',
                                            value: true
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originaddid',
                                            value: addId
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originaddr1',
                                            value: address.getValue('addr1')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originaddr2',
                                            value: address.getValue('addr2')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_origincity',
                                            value: address.getValue('city')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originstate',
                                            value: address.getValue('state')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originzip',
                                            value: address.getValue('zip')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_origincountry',
                                            value: address.getValue('country')
                                        });
                                    }

                                    if(importFlag == 'T' && flagImport == 0){
                                        flagImport = 1;
                                        address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);

                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importflag',
                                            value: true
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importaddid',
                                            value: addId
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importaddr1',
                                            value: address.getValue('addr1')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importaddr2',
                                            value: address.getValue('addr2')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importcity',
                                            value: address.getValue('city')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importstate',
                                            value: address.getValue('state')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importzip',
                                            value: address.getValue('zip')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importcountry',
                                            value: address.getValue('country')
                                        });
                                    }
                                }

                                if(flagGospr == 0){
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gsrenderedflag',
                                        value: false
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosaddid',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosaddr1',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosaddr2',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_goscity',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_gosstate',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_goszip',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_goscountry',
                                        value: ''
                                    });
                                }

                                if(flagOrderOrigin == 0){
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originflag',
                                        value: false
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originaddid',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originaddr1',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originaddr2',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_origincity',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originstate',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_originzip',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_origincountry',
                                        value: ''
                                    });
                                }

                                if(flagImport == 0){
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importflag',
                                        value: false
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importaddid',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importaddr1',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importaddr2',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importcity',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importstate',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importzip',
                                        value: ''
                                    });
                                    rec.setValue({
                                        fieldId: 'custrecord_ava_importcountry',
                                        value: ''
                                    });
                                }

                                rec.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                });
                            }
                            else{
                                var rec = record.create({
                                    type: 'customrecord_vataddresses'
                                });
                                rec.setValue({
                                    fieldId: 'custrecord_ava_vatcustid',
                                    value: nRecord.id
                                });
                                rec.setValue({
                                    fieldId: 'custrecord_ava_vatcustomerinternalid',
                                    value: nRecord.id
                                });

                                for(var iii = 0; iii < lineCount && lineCount <= 10000; iii++){
                                    var addId = custRec.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: iii
                                    });
                                    gosprFlag = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_gposr',
                                        line: iii
                                    });
                                    var originAddressFlag = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_originaddr',
                                        line: iii
                                    });
                                    var importAddressFlag = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_import',
                                        line: iii
                                    });

                                    if(gosprFlag == 'T'){
                                        address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);

                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gsrenderedflag',
                                            value: true
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosaddid',
                                            value: addId
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosaddr1',
                                            value: address.getValue('addr1')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosaddr2',
                                            value: address.getValue('addr2')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_goscity',
                                            value: address.getValue('city')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_gosstate',
                                            value: address.getValue('state')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_goszip',
                                            value: address.getValue('zip')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_goscountry',
                                            value: address.getValue('country')
                                        });
                                    }

                                    if(originAddressFlag == 'T'){
                                        var address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);

                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originflag',
                                            value: true
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originaddid',
                                            value: addId
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originaddr1',
                                            value: address.getValue('addr1')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originaddr2',
                                            value: address.getValue('addr2')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_origincity',
                                            value: address.getValue('city')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originstate',
                                            value: address.getValue('state')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_originzip',
                                            value: address.getValue('zip')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_origincountry',
                                            value: address.getValue('country')
                                        });
                                    }

                                    if(importAddressFlag == 'T'){
                                        var address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);

                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importflag',
                                            value: true
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importaddid',
                                            value: addId
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importaddr1',
                                            value: address.getValue('addr1')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importaddr2',
                                            value: address.getValue('addr2')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importcity',
                                            value: address.getValue('city')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importstate',
                                            value: address.getValue('state')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importzip',
                                            value: address.getValue('zip')
                                        });
                                        rec.setValue({
                                            fieldId: 'custrecord_ava_importcountry',
                                            value: address.getValue('country')
                                        });
                                    }
                                }

                                rec.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                });
                            }
                        }
                    }
                    else if(context.type == context.UserEventType.DELETE){
                        var searchRecord = search.create({
                            type: 'customrecord_avaentityusemapping',
                            filters: ['custrecord_ava_custinternalid', 'is', (nRecord.id).toString()]
                        });

                        var searchResult = searchRecord.run();
                        searchResult = searchResult.getRange({
                            start : 0,
                            end : 1000
                        });

                        for(var k = 0; searchResult != null && k < searchResult.length; k++){
                            record.delete({
                                type : 'customrecord_avaentityusemapping',
                                id : searchResult[k].id
                            });
                        }

                        var exemptId = nRecord.getValue('custpage_ava_exemptionid');
                        if(exemptId != null && exemptId.length > 0){
                            record.delete({
                                type : 'customrecord_avacustomerexemptmapping',
                                id : exemptId
                            });
                        }

                        //evat
                        searchRecord = search.create({
                            type: 'customrecord_vataddresses',
                            filters: ['custrecord_ava_vatcustomerinternalid', 'equalto', nRecord.id]
                        });
                        searchResult = searchRecord.run();
                        searchResult = searchResult.getRange({
                            start : 0,
                            end : 1000
                        });

                        for(var k = 0; searchResult != null && k < searchResult.length; k++){
                            record.delete({
                                type : 'customrecord_vataddresses',
                                id : searchResult[k].id
                            });
                        }
                    }
                }
            }
        }

        return{
            beforeLoad: AVA_CustomerBeforeLoad,
            beforeSubmit: AVA_CustomerBeforeSubmit,
            afterSubmit: AVA_CustomerAfterSubmit
        };
    }
);