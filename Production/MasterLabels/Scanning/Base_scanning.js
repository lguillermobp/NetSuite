/**
 *  Creates a file
 *  @param {string} name - file name
 *  @param {string} fileType - file type
 *  @param {string} contents - file content
 *  @returns {Object} file.File
 *
 * Base.js
 * @NApiVersion 2.1
 */

 define(["N/error","N/format", "N/search", "N/file", "N/log","N/runtime",'N/record',"N/email", "/SuiteScripts/Modules/generaltoolsv1.js", "/SuiteScripts/MasterLabels/Tools/masterlabeltools.js"],
 /**
  *
  * @param error
  * @param search
  * @param file
  * @param log
  * @param _
  */


 function (error, format, search, file, log, runtime, record ,email, GENERALTOOLS, MLTOOLS) {

     var paramWO;
     var paramSO;
     var idso;
     var palletid;
     var palletno;
     var headtoerror="<html><head><meta ><title>Error Generating Pallet Tag</title>		<style type='text/css'>		body {	font-family: Arial, Helvetica, sans-serif;	font-size: 13px;}.info,.success,.warning,.error,.validation {	border: 1px solid;	margin: 10px auto;	padding: 15px 10px 15px 50px;	background-repeat: no-repeat;	background-position: 10px center;	max-width: 460px;} 	.error {	color: #D8000C;	background-color: #FFBABA;	background-image: url('https://i.imgur.com/GnyDvKN.png');}	</style></head><body>	<div class='error'>[Errormessage]</div></body></html>";

     function getMasterLabelsData1(idso,mlids) {

         var filterids = new Array();

         filterids.push(
             "internalid"
         );

         if (mlids.length!=0)
         {       filterids.push("anyof");
             mlids.forEach(
                 function (idnro) {
                     filterids.push(idnro);
                 }
             )

         }
         else {
             filterids.push("noneof");
             filterids.push(" ");
         }



         paramSO = GENERALTOOLS.get_SO_value(idso);

         var shippingAddressSubrecord = paramSO.data.getSubrecord({fieldId : 'shippingaddress'});
         shipcity= shippingAddressSubrecord.getValue({fieldId: "city"});
         shipstate= shippingAddressSubrecord.getValue({fieldId: "state"});
         shipzip= shippingAddressSubrecord.getValue({fieldId: "zip"});
         shipaddr1= shippingAddressSubrecord.getValue({fieldId: "addr1"});
         shipaddr2= shippingAddressSubrecord.getValue({fieldId: "addr2"});
         shipcountry= shippingAddressSubrecord.getValue({fieldId: "country"});
         shipaddressee= shippingAddressSubrecord.getValue({fieldId: "addressee"});
         shipattention= shippingAddressSubrecord.getValue({fieldId: "attention"});
         otherrefnum= paramSO.data.getValue({fieldId: "otherrefnum"});

         var pagedatas=[];

         var fsearch = search.create({
             type: "customrecordmasterlabels",
             filters:
                 [
                     ["custrecordml_saleorder","equalto",idso],
                     "AND",
                     filterids
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
                     "custrecordml_workorder": fresult.getValue({name: "custrecordml_workorder"}),
                     "custrecordml_productdes": fresult.getValue({name: "salesdescription",
                         join: "CUSTRECORDML_PRODUCT"}),
                     "itemupc": fresult.getValue({name: "upccode",
                         join: "CUSTRECORDML_PRODUCT"}),
                     "custrecordml_casenumber": fresult.getValue({name: "custrecordml_casenumber"}),
                     "custrecordml_caseqty": fresult.getValue({name: "custrecordml_caseqty"}),
                     "custrecordml_palletid": fresult.getValue({name: "custrecordml_palletid"}),
                     "custrecordml_palletnumber": fresult.getValue({name: "custrecordml_palletnumber"}),
                     "POnumber": otherrefnum,
                     "Attention": shipattention,
                     "Addressee": shipaddressee,
                     "Addr1": shipaddr1,
                     "Addr2": shipaddr2,
                     "City": shipcity,
                     "State": shipstate,
                     "Zip": shipzip,
                     "Country": shipcountry,
                     "partialbox": partialbox,
                     "custrecordml_status": fresult.getText({name: "custrecordml_status"})
                 }
                 i++;

             })
         });

         return pagedatas;
     }





     function getMasterLabelsData(idso,palletid,palletno) {



         var SOID= idso;
         paramSO = GENERALTOOLS.get_SO_value(SOID);

         var shippingAddress = paramSO.data.getValue({fieldId : 'shipaddress'});
         var location = paramSO.data.getValue({fieldId : 'location'});
         var shippingAddressSubrecord = paramSO.data.getSubrecord({fieldId : 'shippingaddress'});
         ponumberSO= paramSO.data.getValue({fieldId: "otherrefnum"});
         ponumberSOc= paramSO.data.getValue({fieldId: "otherrefnum"});
         ponumberv= ponumberSO.split('-');
         ponumberSO=ponumberv[0];
         shipcity= shippingAddressSubrecord.getValue({fieldId: "city"});
         shipstate= shippingAddressSubrecord.getValue({fieldId: "state"});
         shipdate= paramSO.data.getValue({fieldId: "shipdate"});

         var pagedatas=[];

         var fsearch = search.create({
             type: "customrecordmasterlabels",
             filters:
                 [
                     ["custrecordml_saleorder","equalto",idso],
                     "AND",
                     ["custrecordml_palletid","is",palletid],
                     "AND",
                     ["custrecordml_palletnumber","equalto",palletno]
                 ],
             columns:
                 [
                     search.createColumn({
                         name: "custrecordml_saleorder",
                         summary: "GROUP"
                     }),
                     search.createColumn({
                         name: "custrecordml_palletid",
                         summary: "GROUP"
                     }),

                     search.createColumn({
                         name: "custrecordml_palletnumber",
                         summary: "GROUP"
                     }),
                     search.createColumn({
                     name: "upccode",
                     join: "CUSTRECORDML_PRODUCT",
                     summary: "GROUP"
                     }),
                     search.createColumn({
                         name: "custrecordml_workorder",
                         summary: "GROUP"
                     }),
                     search.createColumn({
                         name: "custrecordml_product",
                         summary: "GROUP"
                     }),
                     search.createColumn({
                         name: "custrecordml_caseqty",
                         summary: "SUM"
                     }),
                     search.createColumn({
                         name: "salesdescription",
                         join: "CUSTRECORDML_PRODUCT",
                         summary: "GROUP"
                     }),
                     search.createColumn({
                         name: "custrecordml_ssccnumber",
                         summary: "COUNT"
                     }),
                     search.createColumn({
                         name: "internalid",
                         join: "CUSTRECORDML_PRODUCT",
                         summary: "GROUP"
                     })
                 ]
         });

         var pagedData = fsearch.runPaged({
             "pageSize" : 1000
         });



         pagedData.pageRanges.forEach(function (pageRange) {

             var page = pagedData.fetch({index: pageRange.index});

             var i=0;

             page.data.forEach(function (fresult) {


                 pagedatas[i] = {
                     "custrecordml_saleorder": fresult.getValue({name: "custrecordml_saleorder",
                         summary: "GROUP"}),
                     "custrecordml_palletid": fresult.getValue({name: "custrecordml_palletid",
                         summary: "GROUP"}),
                     "custrecordml_workorder": fresult.getValue({name: "custrecordml_workorder",
                         summary: "GROUP"}),
                     "custrecordml_palletno": fresult.getValue({name: "custrecordml_palletnumber",
                         summary: "GROUP"}),
                     "salesdescription": fresult.getValue({name: "salesdescription",
                         join: "CUSTRECORDML_PRODUCT",
                         summary: "GROUP"}),
                     "internalidprod": fresult.getValue({name: "internalid",
                         join: "CUSTRECORDML_PRODUCT",
                         summary: "GROUP"}),
                     "custrecordml_product": fresult.getText({name: "custrecordml_product",
                         summary: "GROUP"}),
                     "upccode": fresult.getValue({name: "upccode",
                         join: "CUSTRECORDML_PRODUCT",
                         summary: "GROUP"}),
                     "custrecordml_caseqty": fresult.getValue({name: "custrecordml_caseqty",
                         summary: "SUM"}),
                     "custrecordml_casenumber": fresult.getValue({name: "custrecordml_ssccnumber",
                         summary: "COUNT"}),
                     "ponumberSO": ponumberSO,
                     "ponumberSOc": ponumberSOc,
                     "location": location,
                     "shipcity": shipcity,
                     "shipstate": shipstate,
                     "shipdate": shipdate,
                     "shippingAddress": shippingAddress
                 }
                 i++;

             })
         });

         return pagedatas;
     }





     function createXmlString(MasterLabelsData) {
         var userObj = runtime.getCurrentUser();
         var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
         var initials=paramemp.data.getValue({fieldId: "entitytitle"});


         let bigFacelessReportUrl = `<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">`;
         let baseXmlString = file.load({id: "/SuiteScripts/MasterLabels/Form/PalletTagHSN QRcode.html"}).getContents();
         let xmlString = "";

         var d = new Date();

         var datec = format.format({
             value: d,
             type: format.Type.DATETIME
         });

         for (let i = 0; i < MasterLabelsData.length; i++) {


             var shipdate = format.format({
                 value: MasterLabelsData[i]["shipdate"],
                 type: format.Type.DATE
             });


             xmlString += baseXmlString;
             palletid = "PL."+MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"];
             xmlString = xmlString.replace("[PO_NUMBER]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[PO_NUMBER1]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[PO_NUMBER2]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[PO_NUMBER3]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[ID_PALLET]", MasterLabelsData[i]["custrecordml_palletid"] + MasterLabelsData[i]["custrecordml_palletno"]);
             xmlString = xmlString.replace("[ID_PALLET1]", palletid);
             xmlString = xmlString.replace("[ID_PALLET2]", palletid);
             xmlString = xmlString.replace("[SHIPDATE]", shipdate);
             xmlString = xmlString.replace("[PRODUCT_UPC]", MasterLabelsData[i]["upccode"]);
             xmlString = xmlString.replace("[PALLETQTY]", MasterLabelsData[i]["custrecordml_casenumber"]);
             xmlString = xmlString.replace("[SHIPADDRESS]", MasterLabelsData[i]["shippingAddress"]);
             xmlString = xmlString.replace("[DESCRIPTION]", MasterLabelsData[i]["salesdescription"]);
             xmlString = xmlString.replace("[CASENO]", MasterLabelsData[i]["custrecordml_palletno"]);
             xmlString = xmlString.replace("[USER]", initials);
             xmlString = xmlString.replace("[DATEC]", datec);

         }
         xmlString = bigFacelessReportUrl + "<pdfset>" + xmlString + "</pdfset>";
         xmlString = xmlString.replace(/&/g, "&amp;");
         return xmlString;
     }

     function createXmlStringForHTML(MasterLabelsData) {
         var userObj = runtime.getCurrentUser();
         var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
         var initials=paramemp.data.getValue({fieldId: "entitytitle"});

         let bigFacelessReportUrl = ``;
         let baseXmlString = file.load({id: "/SuiteScripts/MasterLabels/Form/PalletTagHSN QRcode.html"}).getContents();
         let xmlString = "";

         var d = new Date();

         var datec = format.format({
             value: d,
             type: format.Type.DATETIME
         });

         for (let i = 0; i < MasterLabelsData.length; i++) {


             var shipdate = format.format({
                 value: MasterLabelsData[i]["shipdate"],
                 type: format.Type.DATE
             });

             xmlString += baseXmlString;
             palletid = "PL."+MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"];
             palletidP400 = "PL."+MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"]+ "."+MasterLabelsData[i]["ponumberSO"]+ "."+MasterLabelsData[i]["custrecordml_casenumber"];
             xmlString = xmlString.replace("[ID_PALLET1P400]", palletidP400);
             xmlString = xmlString.replace("[PO_NUMBER]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[PO_NUMBER1]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[PO_NUMBER2]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[PO_NUMBER3]", MasterLabelsData[i]["ponumberSO"]);
             xmlString = xmlString.replace("[ID_PALLET]", MasterLabelsData[i]["custrecordml_palletid"] + "." + MasterLabelsData[i]["custrecordml_palletno"]);
             xmlString = xmlString.replace("[ID_PALLET1]", palletid);

             xmlString = xmlString.replace("[ID_PALLET2]", palletid);
             xmlString = xmlString.replace("[SHIPDATE]", shipdate);
             xmlString = xmlString.replace("[PRODUCT_UPC]", MasterLabelsData[i]["upccode"]);
             xmlString = xmlString.replace("[PALLETQTY]", MasterLabelsData[i]["custrecordml_casenumber"]);
             xmlString = xmlString.replace("[SHIPADDRESS]", MasterLabelsData[i]["shippingAddress"]);
             xmlString = xmlString.replace("[PRODUCT]", MasterLabelsData[i]["custrecordml_product"]);
             xmlString = xmlString.replace("[DESCRIPTION]", MasterLabelsData[i]["salesdescription"]);
             xmlString = xmlString.replace("[CASENO]", MasterLabelsData[i]["custrecordml_palletno"]);
             xmlString = xmlString.replace("[USER]", initials);
             xmlString = xmlString.replace("[DATEC]", datec);


             var values = {};
             values["custbody_WoId"] = MasterLabelsData[i]["custrecordml_workorder"];
             values["totalcases"] = MasterLabelsData[i]["custrecordml_casenumber"];
             values["POnumber"] = MasterLabelsData[i]["ponumberSOc"];

             values["palletid"] = MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"];
             values["qty"] = MasterLabelsData[i]["custrecordml_caseqty"];

             var gt = MLTOOLS.pallettag(palletid,MasterLabelsData[i]["custrecordml_workorder"] );
             

             if (gt==0) {

                 paramWO = GENERALTOOLS.get_WO_value(MasterLabelsData[i]["custrecordml_workorder"]);
                 wonro= paramWO.data.getValue({fieldId: "tranid"});
                 values["custbody_Wo"] = wonro;
                 var buildrecordid = createBuilding(values);

                 log.audit("buildrecordid " + String(buildrecordid))

                 if (String(buildrecordid).length>10) {

                     xmlString = headtoerror;
                     xmlString = xmlString.replace("[Errormessage]", buildrecordid);
                     return xmlString;

                 }


             }

         }
         xmlString = bigFacelessReportUrl + xmlString;
         xmlString = xmlString.replace(/&/g, "&amp;");

         return xmlString;
     }

     function createXmlStringForHTML2(MasterLabelsData) {
         var userObj = runtime.getCurrentUser();
         var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
         var initials=paramemp.data.getValue({fieldId: "entitytitle"});

         let bigFacelessReportUrl = ``;
         let baseXmlString = file.load({id: "/SuiteScripts/MasterLabels/Form/PalletTagHSN2 QRcode.html"}).getContents();
         let xmlString = "";

         var d = new Date();

         var datec = format.format({
             value: d,
             type: format.Type.DATETIME
         });
         var vl=0;
         var totalc=0;
         var records ='';

         for (let i = 0; i < MasterLabelsData.length; i++) {
             if (i==0) {
                 var shipdate = format.format({
                     value: MasterLabelsData[i]["shipdate"],
                     type: format.Type.DATE
                 });

                 xmlString += baseXmlString;
                 palletid = "PL."+MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"];
                 palletidP400 = "PL."+MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"]+ "."+MasterLabelsData[i]["ponumberSO"]+ "."+MasterLabelsData[i]["custrecordml_casenumber"];
                 xmlString = xmlString.replace("[ID_PALLET1P400]", palletidP400);
                 xmlString = xmlString.replace("[PO_NUMBER]", MasterLabelsData[i]["ponumberSO"]);
                 xmlString = xmlString.replace("[PO_NUMBER1]", MasterLabelsData[i]["ponumberSO"]);
                 xmlString = xmlString.replace("[PO_NUMBER2]", MasterLabelsData[i]["ponumberSO"]);
                 xmlString = xmlString.replace("[PO_NUMBER3]", MasterLabelsData[i]["ponumberSO"]);
                 xmlString = xmlString.replace("[ID_PALLET]", MasterLabelsData[i]["custrecordml_palletid"] + "." + MasterLabelsData[i]["custrecordml_palletno"]);
                 xmlString = xmlString.replace("[ID_PALLET1]", palletid);
                 xmlString = xmlString.replace("[ID_PALLET2]", palletid);
                 xmlString = xmlString.replace("[SHIPDATE]", shipdate);
                 xmlString = xmlString.replace("[PRODUCT_UPC]", MasterLabelsData[i]["upccode"]);

                 xmlString = xmlString.replace("[SHIPADDRESS]", MasterLabelsData[i]["shippingAddress"]);
                 xmlString = xmlString.replace("[PRODUCT]", MasterLabelsData[i]["custrecordml_product"]);
                 xmlString = xmlString.replace("[DESCRIPTION]", MasterLabelsData[i]["salesdescription"]);
                 xmlString = xmlString.replace("[CASENO]", MasterLabelsData[i]["custrecordml_palletno"]);
                 xmlString = xmlString.replace("[USER]", initials);
                 xmlString = xmlString.replace("[DATEC]", datec);
             }

             if (vl==0) {
                 records += ' <tr>';
             }
                 records+='<td >' + MasterLabelsData[i]["custrecordml_product"] + '</td><td> ' + MasterLabelsData[i]["custrecordml_casenumber"] + ' </td>';
                 vl++
             if (vl==2) {
                 records += ' </tr>';
                 vl=0;
             }
             totalc+=Number(MasterLabelsData[i]["custrecordml_casenumber"]);


             var values = {};
             values["custbody_WoId"] = MasterLabelsData[i]["custrecordml_workorder"];
             values["totalcases"] = MasterLabelsData[i]["custrecordml_casenumber"];
             values["POnumber"] = MasterLabelsData[i]["ponumberSOc"];

             values["palletid"] = MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"];
             values["qty"] = MasterLabelsData[i]["custrecordml_caseqty"];

             var gt = MLTOOLS.pallettag(palletid,MasterLabelsData[i]["custrecordml_workorder"] );
            
             if (gt==0) {
                 paramWO = GENERALTOOLS.get_WO_value(MasterLabelsData[i]["custrecordml_workorder"]);
                 wonro= paramWO.data.getValue({fieldId: "tranid"});
                 values["custbody_Wo"] = wonro;

                 var buildrecordid = createBuilding(values);

                 log.audit("buildrecordid " + String(buildrecordid))

                 if (String(buildrecordid).length>10) {

                     xmlString = headtoerror;
                     xmlString = xmlString.replace("[Errormessage]", buildrecordid);
                     return xmlString;

                 }


             }

         }

         xmlString = xmlString.replace("[RECORDS]", records);
         xmlString = xmlString.replace("[PALLETQTY]", totalc);
         xmlString = bigFacelessReportUrl + xmlString;
         xmlString = xmlString.replace(/&/g, "&amp;");





         return xmlString;
     }

     function createXmlStringForHTML1(idso,MasterLabelsData) {
         paramSO = GENERALTOOLS.get_SO_value(idso);
         custbodytotalboxesso= paramSO.data.getValue({fieldId: "custbodytotalboxes"});

         var formml = paramSO.data.getText({fieldId : 'custbody_masterlabelform'});
         if (formml.length==0) {formml="MasterLabel TSC.html"}
         var idformml="/SuiteScripts/MasterLabels/Form/"+formml

         let bigFacelessReportUrl = ``;
         let baseXmlString = file.load({id: idformml}).getContents();
         let xmlString = "";



         for (let i = 0; i < MasterLabelsData.length; i++) {

             xmlString += baseXmlString;

             xmlString = xmlString.replace("[ACIDES]", "BEEKMAN 1802");
             xmlString = xmlString.replace("[ACIADD]", "8075 Beacon Lake Drive");
             xmlString = xmlString.replace("[ACIAD1]", "Ste 100");
             xmlString = xmlString.replace("[ACICIT]", "Orlando");
             xmlString = xmlString.replace("[ACISTA]", "FL");
             xmlString = xmlString.replace("[ACIPOS]", "32809");

             xmlString = xmlString.replace("[AWHDES]", MasterLabelsData[i]["Addressee"]);
             xmlString = xmlString.replace("[AWHADD]", MasterLabelsData[i]["Addr1"]);
             xmlString = xmlString.replace("[AWHAD1]", MasterLabelsData[i]["Addr2"]);
             xmlString = xmlString.replace("[AWHCIT]", MasterLabelsData[i]["City"]);
             xmlString = xmlString.replace("[AWHCTY]", MasterLabelsData[i]["Country"]);
             xmlString = xmlString.replace("[AWHSTA]", MasterLabelsData[i]["State"]);
             xmlString = xmlString.replace("[AWHPOS]", MasterLabelsData[i]["Zip"]);
             xmlString = xmlString.replace("[AWHPOS1]", MasterLabelsData[i]["Zip"]);
             xmlString = xmlString.replace("[AWHPOS_B]", MasterLabelsData[i]["Zip"]);

             paramWO = GENERALTOOLS.get_WO_value(MasterLabelsData[i]["custrecordml_workorder"]);
             custbodytotalboxes= paramWO.data.getValue({fieldId: "custbodytotalboxes"});
             expirationdate= new Date(paramWO.data.getValue({fieldId: "custbody_dateofexpiry"}));
             dataexp= (expirationdate.getMonth()+1)+"/"+expirationdate.getDate()+"/"+expirationdate.getFullYear();

             xmlString = xmlString.replace("[EXPIRATION_DATE]", dataexp);
             xmlString = xmlString.replace("[SHORT]", " ");


             // Just for Nordstrom

             shipattention=MasterLabelsData[i]["Attention"];
             const station = shipattention.slice(
                 shipattention.indexOf('(') + 7,
                 shipattention.lastIndexOf(')'),
             );
             xmlString = xmlString.replace("[STORE]", station);
             xmlString = xmlString.replace("[STORE2]", station);
             xmlString = xmlString.replace("[STORE_B]", station);

             itema = MasterLabelsData[i]["custrecordml_product"].replaceAll(" ", "");
             xmlString = xmlString.replace("[ITEMA1]", itema);
             xmlString = xmlString.replace("[ITEMA]", itema);
             ponumberv= MasterLabelsData[i]["POnumber"].split('-');
             ponumber=ponumberv[0];
             xmlString = xmlString.replace("[PO_NUMBER]", ponumber);
             xmlString = xmlString.replace("[PO_NUMBER1]", ponumber);
             xmlString = xmlString.replace("[ITEM]", MasterLabelsData[i]["custrecordml_product"]);
             xmlString = xmlString.replace("[ITEM_D]", MasterLabelsData[i]["custrecordml_productdes"]);
             itemcod = MasterLabelsData[i]["custrecordml_product"].replace(/ /g, "");
             xmlString = xmlString.replace("[ITEM1]", itemcod);
             xmlString = xmlString.replace("[ITEM_UPC]", MasterLabelsData[i]["itemupc"]);
             xmlString = xmlString.replace("[PARTIAL]", MasterLabelsData[i]["partialbox"]);
             xmlString = xmlString.replace("[ITEM_DESCRIPTION]", MasterLabelsData[i]["custrecordml_productdes"]);
             xmlString = xmlString.replace("[ITEM_UPC]", MasterLabelsData[i]["itemupc"]);
             var ssccformated1 = MLTOOLS.formatsscc181(MasterLabelsData[i]["custrecordml_ssccnumber"]);
       
             var ssccformated = MLTOOLS.formatsscc18(MasterLabelsData[i]["custrecordml_ssccnumber"]);
             xmlString = xmlString.replace("[SSCC_CODE_F1]", MasterLabelsData[i]["custrecordml_ssccnumber"]);
             xmlString = xmlString.replace("[SSCC_CODE_F]", ssccformated);
             xmlString = xmlString.replace("[SSCC_CODE]", MasterLabelsData[i]["custrecordml_ssccnumber"]);
             xmlString = xmlString.replace("[CASENO]", MasterLabelsData[i]["custrecordml_casenumber"]);
             
             xmlString = xmlString.replace("[CASE_TOTALSO]", custbodytotalboxesso);
             xmlString = xmlString.replace("[CASE_TOTAL]", custbodytotalboxes);
             xmlString = xmlString.replace("[CASES]", MasterLabelsData[i]["custrecordml_caseqty"]);
             xmlString = xmlString.replace("[CASES_B]", MasterLabelsData[i]["custrecordml_caseqty"]);

         }
         xmlString = bigFacelessReportUrl + xmlString;
         xmlString = xmlString.replace(/&/g, "&amp;");

         return xmlString;
     }

     function createXmlStringForTAG(idso,palletletter,totalpallets) {

         paramSO = GENERALTOOLS.get_SO_value(idso);
         var prepalletletter = paramSO.data.getValue({fieldId : 'custbody_prefixidpallet'});
         var entity = paramSO.data.getValue({fieldId : 'entity'});
         var shippingAddressSubrecord = paramSO.data.getSubrecord({fieldId : 'shippingaddress'});


         shipwarehouse= shippingAddressSubrecord.getValue({fieldId: "addressee"});

         shipstate= shippingAddressSubrecord.getValue({fieldId: "state"});
         otherrefnum= paramSO.data.getValue({fieldId: "otherrefnum"});
         palletletter= paramSO.data.getValue({fieldId: "custbodypalletletter"});


         ponumberv= otherrefnum.split('-');
         ponumber=ponumberv[0];
         documnumber= paramSO.data.getValue({fieldId: "tranid"});
         startnumberpallet= parseInt(paramSO.data.getValue({fieldId: "custbody_startnumberpallet"}))+0;


         if (palletletter==''){

             paramPOnumber = MLTOOLS.get_start_numberpallet(otherrefnum);

             if (paramPOnumber.records==1)
             {
                 prefixidpallet= paramPOnumber.data.getValue({name: "custbody_prefixidpallet",
                     summary: "MAX"});
                 palletletter= paramPOnumber.data.getValue({name: "custbodypalletletter",
                     summary: "MAX"});
                 startnumberpallet= parseInt(paramPOnumber.data.getValue({name: "custbodytotalpallets",
                     summary: "SUM"}))+1;
                 lastidpallet=palletletter;

             }
             else {


                 var customer = record.load({
                     type: "customer",
                     id: entity,
                     isDynamic: false,
                     defaultValues: null
                 });
                 lastidpallet=customer.getValue({fieldId: "custentity_lastletteridpallet"  });
                 prefixidpallet=customer.getValue({fieldId: "custentity_prefixidpallet"  });
                 if (lastidpallet==''){
                     lastidpallet='A';
                 }
                 else {
                     lastidpallet=nextletter(lastidpallet);
                 }

                 customer.setValue({
                     fieldId: "custentity_lastletteridpallet",
                     value: lastidpallet
                 });
                 customer.save({
                     enableSourcing: true,
                     ignoreMandatoryFields: false
                 });

             }


             var saleorder = record.load({
                type: "salesorder",
                id: idso,
                isDynamic: false,
                defaultValues: null
            });
             if (prepalletletter=='' && prefixidpallet!='')    {
                    
                prepalletletter=prefixidpallet;       
                saleorder.setValue({
                    fieldId: "custbody_prefixidpallet",
                    value: prefixidpallet
                    });
            
            }
             palletletter=prepalletletter+lastidpallet;

             if (!startnumberpallet) {startnumberpallet=1; }

                 saleorder.setValue({
                     fieldId: "custbody_startnumberpallet",
                     value: startnumberpallet
                 });
             
             
             saleorder.setValue({
                 fieldId: "custbodypalletletter",
                 value: palletletter
             });

             saleorder.save({
                 enableSourcing: true,
                 ignoreMandatoryFields: false
             });

         }


         let bigFacelessReportUrl = ``;
         let baseXmlString = file.load({id: "/SuiteScripts/MasterLabels/Form/printtaggen.html"}).getContents();
         let xmlString = "";


         for (let i = 1; i <= totalpallets; i++) {

             xmlString += baseXmlString;
             palletid=palletletter+startnumberpallet;
             despal='PL.'+ palletletter + "."+(startnumberpallet)+  "."+idso;
             xmlString = xmlString.replace("[PO_NUMBER]", ponumber);
             xmlString = xmlString.replace("[SO_NUMBER]", documnumber);
             xmlString = xmlString.replace("[WH_DESCRIPTION]", shipwarehouse);
             xmlString = xmlString.replaceAll("[SO_PALLETID]", palletid);
             xmlString = xmlString.replaceAll("[SO_PALLETID1]", despal);
             startnumberpallet+=1;

         }
         xmlString = bigFacelessReportUrl + xmlString;
         xmlString = xmlString.replace(/&/g, "&amp;");

         return xmlString;
     }
     
     // ***************************************************
     var searchInventoryDetailsForItem = function searchInventoryDetailsForItem(item, location, join,binn) {
         log.audit("binn " + binn)
         try {

             if (binn)
             {
                 var itemSearchObj = search.create({
                     type: 'item',
                     filters: [['internalid', 'anyof', item], 'AND',
                         ["".concat(join, ".location"), 'anyof', location], 'AND',
                         ["".concat(join, ".quantityavailable"), 'greaterthan', '0'], 'AND',
                         [["".concat(join,".binnumber"),"anyof",[binn]],"OR",["".concat(join,".binnumber"),"anyof",[binn]]]],

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
             }
             else
             {
                 var itemSearchObj = search.create({
                     type: 'item',
                     filters: [['internalid', 'anyof', item], 'AND',
                         ["".concat(join, ".location"), 'anyof', location], 'AND',
                         ["".concat(join, ".quantityavailable"), 'greaterthan', '0']
                     ],

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

             }

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



     var transformSOToBuildingRecord = function transformSOToBuildingRecord(woId,qty) {
         var isDynamic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
         log.audit("qty: " + qty)
         return record.transform({
             fromType: "workorder",
             fromId: parseInt(woId, 10),
             toType: "assemblybuild",
             isDynamic: false,
             defaultValues: {
                 "quantity": qty},

         });
     };
     var fulfillLocation;
     var abrec=[];
      function createBuilding(customBuildingOrdersRecord) {

          var paramrec = GENERALTOOLS.get_param_value(19);
          var bincomp = paramrec.data.getValue({fieldId: "custrecordparams_value"});
          var paramrec = GENERALTOOLS.get_param_value(20);
          var binfg = paramrec.data.getValue({fieldId: "custrecordparams_value"});

         var datetran = new Date();
         const woId = customBuildingOrdersRecord["custbody_WoId"];
         const wonro = customBuildingOrdersRecord["custbody_Wo"];

         log.audit("workorder " + String(woId))
         
         try {
             var BuildingRecord = transformSOToBuildingRecord(woId,customBuildingOrdersRecord["qty"] );
         } catch (e) {
             log.audit("error: " + String(e.message))

             return("error: " + String(e.message));
         }


         BuildingRecord.setValue('quantity', customBuildingOrdersRecord["qty"]);
         BuildingRecord.setValue('custbodytotalcases', customBuildingOrdersRecord["totalcases"]);
         var origqty= BuildingRecord.getValue('orderassemblyqty');
         BuildingRecord.setValue('custbodypalletid', "PL."+customBuildingOrdersRecord["palletid"]);



         var _loop = function _loop(i) {

             var inventoryDetailAvail = BuildingRecord.getSublistValue({
                 sublistId: 'component',
                 fieldId: 'componentinventorydetailavail',
                 line: i
             });
        
             var item = BuildingRecord.getSublistValue({
                 sublistId: 'component',
                 fieldId: 'item',
                 line: i
             });
             log.debug("1-item",item);
             var itemText = BuildingRecord.getSublistValue({
                 sublistId: 'component',
                 fieldId: 'compitemname',
                 line: i
             });
             log.debug("2-itemText",itemText);
             var itemorigqty= BuildingRecord.getSublistValue({
                 sublistId: 'component',
                 fieldId: 'origquantity',
                 line: i
             });

             var formqty = Number(itemorigqty) / Number(origqty);
             var requiredQuantity = Number(formqty) * Number(customBuildingOrdersRecord["qty"]);
             log.debug("2-requiredQuantity",requiredQuantity);
             BuildingRecord.setSublistValue({
                 sublistId: 'component',
                 fieldId: 'quantity',
                 value: requiredQuantity,
                 line: i
             });


                 fulfillLocation = BuildingRecord.getValue('location');


             if (inventoryDetailAvail === 'T') {
                 var isSerialItem = BuildingRecord.getSublistValue({
                     sublistId: 'component',
                     fieldId: 'isserial',
                     line: i
                 }) === 'T';
                 var isLotItem = BuildingRecord.getSublistValue({
                     sublistId: 'component',
                     fieldId: 'isnumbered',
                     line: i
                 }) === 'T';
                 var useBins = BuildingRecord.getSublistValue({
                     sublistId: 'component',
                     fieldId: 'binitem',
                     line: i
                 }) === 'T';

                 // **********************************
                 if (BuildingRecord.hasSublistSubrecord({
                     sublistId: 'component',
                     fieldId: 'componentinventorydetail',
                     line: i
                 }))
                 {

                     BuildingRecord.removeSublistSubrecord({
                         sublistId: 'component',
                         fieldid: 'componentinventorydetail',
                         line: i
                     });
                 }

                // **********************************

                 if (!BuildingRecord.hasSublistSubrecord({
                     sublistId: 'component',
                     fieldId: 'componentinventorydetail',
                     line: i
                 }) && (isSerialItem || isLotItem || useBins)) {
                     var inventoryDetailSubRecord = BuildingRecord.getSublistSubrecord({
                         sublistId: 'component',
                         fieldId: 'componentinventorydetail',
                         line: i
                     });
                     var join = 'inventorynumberbinonhand';

                     if (useBins && !(isSerialItem || isLotItem)) {
                         join = 'binOnHand';
                     } else if (!useBins && (isSerialItem || isLotItem)) {
                         join = 'inventorynumber';
                     }
                     var binn=bincomp;
                     var itemInventoryDetails = searchInventoryDetailsForItem(item, fulfillLocation, join,binn);


                     var itemSearchResultCount = itemInventoryDetails.runPaged().count;
                     

                     if (!itemSearchResultCount) {
                         log.error({title: itemText, details: "No Inventory Detail"})
                         isok=deleteab(abrec);
                         errmsg= "IDs= "+ abrec+ " No Inventory Detail for item: ".concat(itemText, " at location: " + fulfillLocation +" , WO:" + wonro);
                         log.debug("errmsg",errmsg);
                         return;
                         //throw new Error("IDs= "+ abrec+ " No Inventory Detail for item: ".concat(itemText, " at location, WO ID:" + woId).concat(fulfillLocation));
                     }

                     var inventoryNumberFieldName = useBins ? 'inventorynumber' : 'internalid';
                     var inventoryDetailSubRecordLine = 0;

                     var pagedData = itemInventoryDetails.runPaged({
                        "pageSize" : 1000
                    });

                    pagedData.pageRanges.forEach(function (pageRange) {

                        var page = pagedData.fetch({index: pageRange.index});
            
                        page.data.forEach(function (result) {
                                                
                   
                        log.debug("1-result",result);
                         var availableQuantity = result.getValue({
                             name: 'quantityavailable',
                             join: join
                         });
                         log.debug("3-availableQuantity",availableQuantity);


                         if (requiredQuantity==0) {return true; }


                          var invAssignmentLineCount = inventoryDetailSubRecord.getLineCount('inventoryassignment');
                         
                        if (invAssignmentLineCount && inventoryDetailSubRecordLine==0) {
                             log.debug("return","false");
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
                       
                         qtypro=availableQuantity < requiredQuantity ? availableQuantity : requiredQuantity;
                         requiredQuantity -= qtypro
                         log.debug("4-qtypro",qtypro);

                         inventoryDetailSubRecord.setSublistValue({
                             sublistId: 'inventoryassignment',
                             fieldId: 'quantity',
                             value: qtypro,
                             line: inventoryDetailSubRecordLine
                         });
                         
                         log.debug("4-requiredQuantity",requiredQuantity);

                         

                        inventoryDetailSubRecordLine += 1;
                            
                        
                         log.debug("6-requiredQuantity",requiredQuantity);
                     });
                    });
                    log.debug("6-inventoryDetailSubRecord",inventoryDetailSubRecord);
                    
                     if (requiredQuantity) {
                         log.error({title: itemText, details: "Not Enough Quantity IDs= "+ abrec})
                         isok=deleteab(abrec);
                         errmsg="There is not enough (remaining: " + requiredQuantity + " ) in the P1 WIP BIN for the item: ".concat(itemText, " cannot be fulfilled IDs= "+ abrec+ " WO:" + wonro);
                         return;
                         //throw new Error("There is not enough (remaining: " + requiredQuantity + " ) in the P1 WIP BIN for the item: ".concat(itemText, " cannot be fulfilled IDs= "+ abrec+ " WO ID:" + woId));
                     }
                 }
             }
         };




         var BuildingLineCount = BuildingRecord.getLineCount('component');

         var errmsg="";
         for (var i = 0; i < BuildingLineCount; i += 1) {

             _loop(i);
             if (errmsg.length>0)        {
                 return(errmsg)}

         }
          if (errmsg.length>0)        {
              log.debug("errmsg",errmsg);
              return(errmsg);}

         // Create the inventory detail subrecord.
             var subrec = BuildingRecord.getSubrecord({
                 sublistId: 'item',
                 fieldId: 'inventorydetail'
             });




             // Create a line on the subrecord's inventory assignment sublist.



         subrec.setSublistValue({
             sublistId: 'inventoryassignment',
             fieldId: 'receiptinventorynumber',
             value: customBuildingOrdersRecord["POnumber"],
             line: 0
         });
         subrec.setSublistValue({
             sublistId: 'inventoryassignment',
             fieldId: 'quantity',
             value: customBuildingOrdersRecord["qty"],
             line: 0
         });
          subrec.setSublistValue({
              sublistId: 'inventoryassignment',
              fieldId: 'binnumber',
              value: binfg,
              line: 0
          });

         
          myJSON = JSON.stringify(BuildingRecord);


   
         try {

             var BuildingRecordId = BuildingRecord.save();
             log.debug("BuildingRecordId",BuildingRecordId);
             abrec.push(BuildingRecordId);

         } catch (e) {
            log.debug("abrec",abrec);
             log.error({  title: "error.save: ", details: "Error Name: " + String(e.name) +  " Error Message: " + String(e.message)});
             isok=deleteab(abrec);
             return("ERROR when try to do Assembly Build: " + String(e.message)+ "IDs= "+ abrec + " WO :" + wonro);
            // throw new Error("ERROR when try to do Assembly Build: " + String(e.message)+ "IDs= "+ abrec + " WO ID:" + woId);

         }

         return BuildingRecordId;
     };


     function createLicensePlate(MasterLabelsData) {


         var paramrec = GENERALTOOLS.get_param_value(20);
         var binfg = paramrec.data.getValue({fieldId: "custrecordparams_value"});

         var totalq=0;
         for (let i = 0; i < MasterLabelsData.length; i++)
         {
             if (i == 0)
             {
                 var values = {};
                 values["custbody_WoId"] = MasterLabelsData[i]["custrecordml_workorder"];
                 values["totalcases"] = MasterLabelsData[i]["custrecordml_casenumber"];
                 values["POnumber"] = MasterLabelsData[i]["ponumberSOc"];

                 palletid = "PL."+MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"];
                 values["palletid"] = MasterLabelsData[i]["custrecordml_palletid"]+ "." + MasterLabelsData[i]["custrecordml_palletno"]+ "."+MasterLabelsData[i]["custrecordml_saleorder"];

                 values["qty"] = MasterLabelsData[i]["custrecordml_caseqty"];

                 var newLicensePlate = record.create({ // Creating a new LP
                     type: "customrecord_rfs_lp_header",
                     isDynamic: true // Important: Dynamic Mode
                 })
                 log.debug("newLicensePlate", newLicensePlate);

                 newLicensePlate.setValue({ // Setting the bin
                     fieldId: 'custrecord_rfs_lp_header_bin',
                     value: binfg
                 });
                 newLicensePlate.setValue({ // Setting the location
                     fieldId: 'custrecord_rfs_lp_header_location',
                     value: MasterLabelsData[i]["location"]
                 });
                 newLicensePlate.setValue({ // Setting the PO customer
                     fieldId: 'custrecord_pocustomer',
                     value: MasterLabelsData[i]["ponumberSO"]
                 });
                 newLicensePlate.setValue({ // Setting the Sale Order
                     fieldId: 'custrecord_saleorder',
                     value: MasterLabelsData[i]["custrecordml_saleorder"]
                 });
                 newLicensePlate.setValue({ // Setting permanent pallet
                 fieldId: 'custrecord_rfs_lp_header_permanent',
                 value: true
                 });
                 newLicensePlate.setValue({ // Setting the status
                     fieldId: 'custrecord_rfs_lp_header_status',
                     value: "3"
                 });
                 newLicensePlate.setValue({ // Setting the Pallet Id
                     fieldId: 'name',
                     value: palletid
                 });
                 try {
                     var newLicensePlateID = newLicensePlate.save(); // Attempting to save the record
                     log.debug("New License Plate ID", newLicensePlateID)



                 } catch (e) {
                     log.error("Not able to save new License Plate - " + e.name, e.message);
                     return;
                 }


             }

             // line -> recmachcustrecord_rfs_lp_line_parent


             var newLicensePlatelpline = record.create({ // Creating a line_parent
                 type: "customrecord_rfs_lp_line",
                 isDynamic: true // Important: Dynamic Mode
             })
             log.debug("newLicensePlatelpline", newLicensePlatelpline);

             newLicensePlatelpline.setValue({ // Setting the Pallet ID
                 fieldId: 'custrecord_rfs_lp_line_parent',
                 value: newLicensePlateID
             });
             newLicensePlatelpline.setValue({ // Setting Quantity
                 fieldId: 'custrecord_rfs_lp_line_quantity',
                 value: MasterLabelsData[i]["custrecordml_caseqty"]
             });
             newLicensePlatelpline.setValue({ // Setting the UOM
                 fieldId: 'custrecord_rfs_lp_line_uom',
                 value: 1
             });
             newLicensePlatelpline.setValue({ // Setting ITEM
                 fieldId: 'custrecord_rfs_lp_line_item',
                 value: MasterLabelsData[i]["internalidprod"]
             });
             newLicensePlatelpline.setValue({ // Setting Boxes
                 fieldId: 'custrecord_lnboxes',
                 value: MasterLabelsData[i]["custrecordml_casenumber"]
             });

             totalq = totalq + parseInt(MasterLabelsData[i]["custrecordml_casenumber"]);

             try {
                 var newLicensePlatelplineID = newLicensePlatelpline.save(); // Attempting to save the record
                 log.debug("New License Plate lp line ID", newLicensePlatelplineID)



             } catch (e) {
                 log.error("Not able to save new License Plate lp line - " + e.name, e.message);
             }


             // line -> recmachcustrecord_rfs_lp_line_detail_header



             var newLicensePlatelplinedetail = record.create({ // Creating a line_detail_header
                 type: "customrecord_rfs_lp_line_detail",
                 isDynamic: true // Important: Dynamic Mode
             })
             log.debug("newLicensePlatelplinedetail", newLicensePlatelplinedetail);

             newLicensePlatelplinedetail.setValue({ // Setting Pallet ID
                 fieldId: 'custrecord_rfs_lp_line_detail_header',
                 value: newLicensePlateID
             });
             newLicensePlatelplinedetail.setValue({ // Setting Quantity
                 fieldId: 'custrecord_rfs_lp_line_detail_quantity',
                 value: MasterLabelsData[i]["custrecordml_caseqty"]
             });
             newLicensePlatelplinedetail.setValue({ // Setting pallet id name
                 fieldId: 'custrecord_rfs_lp_line_detail_lpn',
                 value: palletid
             });
             newLicensePlatelplinedetail.setValue({ // Setting pallet detail ID
                 fieldId: 'custrecord_rfs_lp_line_detail_parent',
                 value: newLicensePlatelplineID
             });
             newLicensePlatelplinedetail.setValue({ // Setting the lot
                 fieldId: 'custrecord_rfs_lp_line_detail_inv_number',
                 value: MasterLabelsData[i]["ponumberSOc"]
             });
             newLicensePlatelplinedetail.setValue({ // Setting inventory sts
                 fieldId: 'custrecord_rfs_lp_line_detail_inv_status',
                 value: 1
             });
             try {
                 var newLicensePlatelplinedetailID = newLicensePlatelplinedetail.save(); // Attempting to save the record
                 log.debug("New License Plate lp line detail ID", newLicensePlatelplinedetailID)



             } catch (e) {
                 log.error("Not able to save new License Plate lp line - " + e.name, e.message);
             }





         }
         var newLicensePlate = record.load({ // Updating LP_header
             type: "customrecord_rfs_lp_header",
             id: newLicensePlateID})
         newLicensePlate.setValue({ // Setting total boxes
             fieldId: 'custrecord_hdboxes',
             value: totalq
         });
         try {
             newLicensePlate.save(); // Attempting to save the record
             log.debug("New License Plate ID", newLicensePlateID)

         } catch (e) {
             log.error("Not able to save new License Plate - " + e.name, e.message);
             return;
         }



         return;
     }
     function deleteab(abrec) {

         abrec.forEach(function (idrec) {
             var assemblyb = record.delete({
                 type: "assemblybuild",
                 id: idrec,
             });
         })
         return true;
         }

     function nextletter(c) {

         cl=c.length;
         log.debug("c", c)
         log.debug("cl", cl)
         if (c=="ZZZ") {
             return("A");}

         log.debug("c", c)
         log.debug("cl", cl)

         if (cl==3) {
             result= c.substr(0, 2)+String.fromCharCode(c.charCodeAt(2) + 1);
             if (c.charCodeAt(2)>89) {
                 result= c.substr(0, 0)+String.fromCharCode(c.charCodeAt(1) + 1);
                 if (c.charCodeAt(1)>89) {
                     result= String.fromCharCode(c.charCodeAt(0) + 1);
                     if (c.charCodeAt(0)>89) {
                         return("A");

                     }
                     else {
                         return(result);
                     }
                 }
                 else {
                     return(result);
                 }
             }
             else {
                 return(result);
             }
         }

         if (cl==2) {
             log.debug("c.charCodeAt(1)", c.charCodeAt(1))
             if (c=="ZZ") {
                 return("ZZA");}

             result= c.substr(0, 1)+String.fromCharCode(c.charCodeAt(1) + 1);


             if (c.charCodeAt(1)>89) {
                 result = String.fromCharCode(c.charCodeAt(0) + 1) + "A";
                 return(result);
             }
                 else {
                     return(result);
                 }

         }
         if (cl==1) {

             if (c=="Z") {
                 return("ZA");}
                 result = String.fromCharCode(c.charCodeAt(0) + 1);

                 return(result);

         }
         if (cl==0) {return("A"); }

     }

     // *******************


     return {
         getMasterLabelsData: getMasterLabelsData,
         getMasterLabelsData1: getMasterLabelsData1,
         createLicensePlate: createLicensePlate,
         createXmlString: createXmlString,
         createXmlStringForHTML: createXmlStringForHTML,
         createXmlStringForHTML1: createXmlStringForHTML1,
         createXmlStringForTAG:createXmlStringForTAG,
         createXmlStringForHTML2: createXmlStringForHTML2
     };

 });