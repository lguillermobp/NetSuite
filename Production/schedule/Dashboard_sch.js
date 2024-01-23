/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */
var ecddays = [];
var ecdholydays = [];
define(['N/file','N/redirect',"N/runtime","N/ui/serverWidget", "N/record", "N/search", "N/file", "N/error",'N/log'],
	/**
	 *
	 * @param serverWidget
	 * @param search
	 * @param file
	 * @param error
	 * @param base
	 * @param _
	 */
	function (file, redirect, runtime,serverWidget,record, search, file, error,log) {
		/**
		 *
		 * @param context
		 */
        function onRequest(context) {

            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Schedule`
                });
                form.clientScriptModulePath = '/SuiteScripts/schedule/DashboardClient_sch.js';

                form.addButton({
                    id: 'custpage_process',
                    label: 'Refresh',
                    functionName: "process()"
                });

                
    
                let htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                
                htmlField.defaultValue = tabladib();
    

                
                context.response.writePage(form);
            } else {
              
            
            }
    }
	function tabladib() {

        pecddays();

        var tabla=  " <style> " + 
                    " .tb th, .tb td { padding:5px; border: solid 1px #777; text-align: center; } " +
                    " .tb th { border-collapse: collapse; background-color: lightblue}"  +
                    " #tbdaysr, #tbdays, #tbdaysm {writing-mode: vertical-rl;  text-orientation: mixed} " +
                    " #tbdaysr { background-color: red} " +
                    "  </style> ";

        //tabla = "<style> .tb th { border-collapse: collapse; background-color: lightblue}   #tbdaysr, #tbdays, #tbdaysm {writing-mode: vertical-rl;  text-orientation: mixed;}   #tbdaysr { background-color: red}   .tb  { padding:1px; border: solid 1px #777; }    #tbdays  { writing-mode: vertical-rl;  text-orientation: mixed; } </style> ";
        
        tabla +="<table class='tb'  width='100%'> ";

        //days

        tabla += "<tr>";
        tabla += "<th>TASKS</th>";


        for (let i = 0; i < ecddays.length; i++) {
            datelist=new Date(ecddays[i]);
            if (datelist.getDay() == 1) {
                tabla += "<th id='tbdaysr'>"+ ecddays[i] + "</th>";
            }
            else {
                tabla += "<th id='tbdays'>"+ ecddays[i] + "</th>";
            }
        }
        tabla += "</tr>";

        //months
        
        tabla += "<tr>";
        tabla += "<th>TASK 1 </th>";
        var duration=4;

        for (let m = 1; m < 14; m++) {
        tabla += "<td colspan='"+ duration +"'>"+ m + "</td>";
        }
        var resto=ecddays.length-(duration*13);
        tabla += "<th colspan='"+ resto +"'></th>";
        tabla += "</tr>";
        tabla += "</table>";

    return tabla;
    }

        function findCases1() {


		var pagedatas=[];

		var fsearch = search.create({
			type: "customrecord_so_scheduletasks",
            filters:
            [
                ["custrecord_salecontract.mainline","is","T"]
            ],
            columns:
            [
                "internalid",
                "custrecord_salecontract",
                "custrecord_so_sc_productionline",
                "custrecord_so_sc_tasksgroup",
                search.createColumn({
                    name: "custrecord_sc_task",
                    join: "CUSTRECORD_SO_SC_TASK"
                }),
                "custrecord_so_sc_note",
                search.createColumn({
                    name: "custrecord_sc_days",
                    join: "CUSTRECORD_SO_SC_TASK"
                }),
                search.createColumn({
                    name: "custrecord_sc_tasksseq",
                    join: "CUSTRECORD_SO_SC_TASK",
                    sort: search.Sort.ASC
                }),
                search.createColumn({
                    name: "custrecord_so_sc_startdate",
                    sort: search.Sort.ASC
                }),
                "custrecord_so_sc_enddate",
                "custrecord_so_sc_status",
                search.createColumn({
                    name: "entity",
                    join: "CUSTRECORD_SALECONTRACT"
                })
            ]
});

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});
            var prod="";
            var isfirsttime=true;
            var qtytot=0;
            var memo="";

			page.data.forEach(function (fresult) {

                if (isfirsttime) {prod=fresult.getText({name: "item",summary: "GROUP"});isfirsttime=false}
                
                if (prod!=fresult.getText({name: "item",summary: "GROUP"}))
                {  
                    prod=fresult.getText({name: "item",summary: "GROUP"});

				    pagedatas[i] = {
					"preferredvendor": preferredvendor,
                    "preferredvendorid": preferredvendorid,
					"item": item,
                    "itemid": itemid,
					"price": price,
					"qty": qtytot,
                    "memo": memo
				    }
                    qtytot=0;
                    memo="";
                    
    				i++;
                }
            preferredvendor=fresult.getText({name: "vendor",join: "item",summary: "GROUP"});
            preferredvendorid=fresult.getValue({name: "vendor",join: "item",summary: "GROUP"});
            item=fresult.getText({name: "item",summary: "GROUP"});
            itemid=fresult.getValue({name: "item",summary: "GROUP"});
            price=fresult.getValue({name: "formulacurrency",summary: "MAX"});
            qtytot+=Number(fresult.getValue({name: "formulanumeric",summary: "SUM"}));
            memo+=fresult.getValue({name: "altname",join: "customerMain",summary: "GROUP"})+"; ";
			})
		});

		return pagedatas;
	}

    

    function pecddays() {
        
        var fsearch = search.create({
            type: "customrecord_blocksofdays",
            columns:
            [
               "internalid",
               search.createColumn({
                  name: "custrecord_blockdate",
                  sort: search.Sort.ASC
               }),
               "custrecord_blockno",
               "name",
               "custrecord_sequence"
            ]
        });


        var pagedData = fsearch.runPaged({
            "pageSize" : 1000
        });
        var i=1;
        pagedData.pageRanges.forEach(function (pageRange) {
            var page = pagedData.fetch({index: pageRange.index});
            page.data.forEach(function (fresult1) {

                custrecord_sequence = fresult1.getValue({ name: "custrecord_sequence" });
                custrecord_blockdate = fresult1.getValue({ name: "custrecord_blockdate" });

                ecdholydays[i]=custrecord_blockdate;
                i++;
                
            });
            
        });


        const td = new Date();
        log.debug("td",td);

        var newstartdate=new Date(td);
        newstartdate.setDate(td.getDate()-30);
        log.debug("newstartdate",newstartdate);

        for (i=0;i<270;i++)
        {
            newstartdate.setDate(newstartdate.getDate()+1);
            if (newstartdate.getDay() == 0) {i--;continue;}
            if (newstartdate.getDay() == 6) {i--;continue;}

            var y = newstartdate.getFullYear();
            var m = newstartdate.getMonth() + 1;
            var d = newstartdate.getDate();
            datetofind = m + "/" + d + "/" + y;
            initial = parseInt(ecdholydays.indexOf(datetofind));
            if (initial!=-1)      {log.debug("holydays",datetofind);i--;continue;}
            log.debug("datetofind",datetofind)
            ecddays[i]=datetofind;
        }
        
       
    }
    return {
        onRequest: onRequest
    };
});