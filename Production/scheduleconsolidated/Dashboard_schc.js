/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */
var ecddays = [];
var ecdholydays = [];
var shstartdate = "";
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
         * 
		 */
        var prodline;
        var tdhoy = new Date();
        var y = tdhoy.getFullYear();
        var m = ('0'+(tdhoy.getMonth()+1)).slice(-2)
        var d = ('0'+(tdhoy.getDate())).slice(-2)
        var tdhoydate = m + "/" + d + "/" + y;
        var tdhoydatey = y + "/" + m + "/" + d;
        function onRequest(context) {

            if (context.request.method === 'GET') {
        
                let form = serverWidget.createForm({
                    title: `Schedule Consolidated`
                });
                form.clientScriptModulePath = '/SuiteScripts/schedule consolidated/DashboardClient_schc.js';

                form.addButton({
                    id: 'custpage_process',
                    label: 'Refresh Schedule',
                    functionName: "process()"
                });

                prodline = context.request.parameters.productionline;

                var productionline = form.addField({
                    id : 'custpage_taskconsolidated',
                    type : serverWidget.FieldType.SELECT,
                    label : 'Task Consolidated',
                    source: 'customrecord_scheduletasksconsolidated'
                    });

                    productionline.updateLayoutType({
                        layoutType: serverWidget.FieldLayoutType.ENDROW
                    });

                    if (prodline) { productionline.defaultValue = prodline; }
    
                let htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                
                htmlField.defaultValue = tabladib();

                context.response.writePage(form);
            } 
    }
	function tabladib() {

        pecddays();

        var tabla=  " <style> " + 
                   // " .tb tbody, .tb thead  { display: block; } " +
                    " .tb thead, .tb th {position:sticky} " +
                    " .tb thead { top: 0; z-index: 2; } " +
                    " .tb th { left: 0; z-index: 1; } " +
                    " .tb tbody { height: 500px; width: 800px; overflow-y: auto; overflow-x: hidden;} " +
                    " .tb tbody td, .tb thead th {width: 100%; border-right: 1px solid black; }" +
                    " .tb th, .tb td { padding:5px; border: solid 1px #777; text-align: center; } " +
                    " .tb th { border-collapse: collapse; background-color: lightblue}"  +
                    " #tbdaysr, #tbdays, #tbdaysm, #tbdaysh {writing-mode: vertical-rl;  text-orientation: mixed} " +
                    " #tbdaysr { background-color: red} #tbdayse { background-color: #DADADA}" +
                    " #tbdaysh { background-color: #95CBF3} #taskwlate { background-color: #ff9900} " +
                    " #taskwot { background-color: #ffff00} #tasktoday { background-color: #95CBF3};" +
                    " #tasknots { background-color: #ff0000} #taskdone { background-color: #00e600} #taskfuture { background-color: white}" +
                    " #months {bgcolor: '#757575';  color: #FAFAFA; background-color: #6D6D6D; font-style: italic; font-size: medium; } " +
                    "  </style> ";

        //tabla = "<style> .tb th { border-collapse: collapse; background-color: lightblue}   #tbdaysr, #tbdays, #tbdaysm {writing-mode: vertical-rl;  text-orientation: mixed;}   #tbdaysr { background-color: red}   .tb  { padding:1px; border: solid 1px #777; }    #tbdays  { writing-mode: vertical-rl;  text-orientation: mixed; } </style> ";
        
        tabla +="<table class='tb'  width='100%'> ";

        //days
        tabla += "<thead>";
        tabla += "<tr>";
        tabla += "<th>_______PRODUCTION_LINE_/_TASKS_____________</th>";
        var mes=[];

        datelist=new Date(ecddays[0]);
        mesp=datelist.getMonth();
        var colspan=0;
        for (let i = 0; i < ecddays.length; i++) {
            datelist=new Date(ecddays[i]);
            var y = datelist.getFullYear();
            var m = datelist.getMonth() + 1;
            var d = datelist.getDate();
            var m = ('0'+(datelist.getMonth()+1)).slice(-2)
            var d = ('0'+(datelist.getDate())).slice(-2)
            
            datelistdate = m + "/" + d + "/" + y;
            if (datelist.getDay() == 1) {
                tabla += "<th id='tbdaysr'>"+ ecddays[i] + "</th>";
            }
            else {
                if (datelistdate == tdhoydate) {
                    tabla += "<th id='tbdaysh'>"+ ecddays[i] + "</th>";
                }
                else {
                tabla += "<th id='tbdays'>"+ ecddays[i] + "</th>";
                }
            }
           
            
            if (datelist.getMonth() != mesp) 
            {
                mes.push(mesp +";" +colspan);
                mesp=datelist.getMonth();
                colspan=0;
            }
            colspan++;
        }
        mes.push(mesp +";" +colspan);
        mesp=datelist.getMonth();
        tabla += "</tr>";

        //months
        log.debug("mes",mes);
        tabla += "<tr>";
        tabla += "<th>MONTHS</th>";
        var duration=4;
        var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        for (let m = 0; m < mes.length; m++) {
        var mesp=mes[m].split(";")[0];
        var duration=mes[m].split(";")[1];
        
        tabla += "<th id='months' colspan='"+ duration +"'>"+ months[mesp] + "</th>";
        }
        tabla += "</tr>";
        tabla += "</thead>";
        tabla += "<tbody>";

        //tasks
        
        tabla =findCases(tabla);
        tabla += "</tbody>";
        tabla += "</table>";

    return tabla;
    }

        function findCases(tabla) {
            if (prodline==null || prodline=='') {prodline=1;}

		var fsearch = search.create({
			type: "customrecord_so_scheduletasks",
            filters:
            [
                ["custrecord_salecontract.mainline","is","T"], 
                "AND", 
                ["custrecord_so_sc_task.custrecord_tasksconsolidated","anyof",prodline], 
                "AND", 
                ["custrecord_so_sc_startdate","onorafter",ecddays[0]]
            ],
            columns:
            [
                "internalid",
                "custrecord_salecontract",
                search.createColumn({
                    name: "custrecord_tasksconsolidated",
                    join: "CUSTRECORD_SO_SC_TASK",
                    sort: search.Sort.ASC
                 }),
                search.createColumn({
                    name: "custrecord_so_sc_productionline",
                    sort: search.Sort.ASC
                }),
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
                }),
                "custrecord_sc_soduration",
                search.createColumn({
                   name: "custbody_appf_make_ecd",
                   join: "CUSTRECORD_SALECONTRACT"
                }),
                search.createColumn({
                   name: "custbody_appf_veh_model",
                   join: "CUSTRECORD_SALECONTRACT"
                })
            ]
});

		var pagedData = fsearch.runPaged({
			"pageSize" : 1000
		});



		pagedData.pageRanges.forEach(function (pageRange) {

			var page = pagedData.fetch({index: pageRange.index});
            var task="";
            var isfirsttime=true;
            
			page.data.forEach(function (fresult) {

                if (isfirsttime) 
                {   columtotal=0;
                    startdate= new Date(fresult.getValue({name: "custrecord_so_sc_startdate"}));
                    log.debug("startdate",startdate);
                    var y = startdate.getFullYear();
                    var m = startdate.getMonth() + 1;
                    var d = startdate.getDate();
                    var m = ('0'+(startdate.getMonth()+1)).slice(-2)
                    var d = ('0'+(startdate.getDate())).slice(-2)
                    
                    datetofind = m + "/" + d + "/" + y;
                    initial = parseInt(ecddays.indexOf(datetofind));
                    log.debug("initial",initial);
                    if (initial==-1)      {colspan=0;}
                    else {colspan=initial;}
                    tabla += "<tr>";
                    tabla += "<th style='text-align: left;'>"+ "<strong>" +fresult.getText({name: "custrecord_so_sc_productionline"})+"</strong>" + " - " + fresult.getValue({name: "custrecord_sc_task",join: "CUSTRECORD_SO_SC_TASK"}) +"</th>";
                    if (initial!=0) {tabla += "<td id='tbdayse' colspan='"+ initial +"'></td>";}
                    //tabla += "<td id='tbdayse' colspan='"+ initial +"'></td>";
                    columtotal+=colspan;
                    log.debug("colspan",colspan);
                    
                    task=fresult.getValue({name: "custrecord_so_sc_productionline"})+ " - " +fresult.getValue({name: "custrecord_sc_tasksseq",join: "CUSTRECORD_SO_SC_TASK"});
                    isfirsttime=false;
                }
                
                if (task!=fresult.getValue({name: "custrecord_so_sc_productionline"})+ " - " +fresult.getValue({name: "custrecord_sc_tasksseq",join: "CUSTRECORD_SO_SC_TASK"}))
                {   
                    
                    startdate= new Date(fresult.getValue({name: "custrecord_so_sc_startdate"}));
                    var y = startdate.getFullYear();
                    var m = startdate.getMonth() + 1;
                    var d = startdate.getDate();
                    var m = ('0'+(startdate.getMonth()+1)).slice(-2)
                    var d = ('0'+(startdate.getDate())).slice(-2)
                    datetofind = m + "/" + d + "/" + y;
                    initial = parseInt(ecddays.indexOf(datetofind));
                    if (initial==-1)      {colspan=0;}
                    else {colspan=initial;}
                    resto=ecddays.length-columtotal;
                    tabla += "<td id='tbdayse' colspan='"+ resto +"'></td>";
                    tabla += "</tr>";
                    tabla += "<tr>";
                    tabla += "<th style='text-align: left;'>"+ "<strong>" +fresult.getText({name: "custrecord_so_sc_productionline"})+"</strong>"+ " - " +fresult.getValue({name: "custrecord_sc_task",join: "CUSTRECORD_SO_SC_TASK"}) +"</th>";
                    if (colspan!=0) {tabla += "<td id='tbdayse' colspan='"+ colspan +"'></td>";}
                    //tabla += "<td id='tbdayse' colspan='"+ colspan +"'></td>";
                    columtotal=colspan;

                    task=fresult.getValue({name: "custrecord_so_sc_productionline"})+ " - " +fresult.getValue({name: "custrecord_sc_tasksseq",join: "CUSTRECORD_SO_SC_TASK"});
                }
                classtask="";
                if (fresult.getValue({name: "custrecord_so_sc_status"})=="1") {classtask="taskwot";}
                if (fresult.getValue({name: "custrecord_so_sc_status"})=="2") {classtask="taskwlate";}
                if (fresult.getValue({name: "custrecord_so_sc_status"})=="3") {classtask="tasknots";}
                if (fresult.getValue({name: "custrecord_so_sc_status"})=="4") {classtask="taskdone";}

                startdate= new Date(fresult.getValue({name: "custrecord_so_sc_startdate"}));
                var y = startdate.getFullYear();
                var m = startdate.getMonth() + 1;
                var d = startdate.getDate();
                
                var m = ('0'+(startdate.getMonth()+1)).slice(-2)
                var d = ('0'+(startdate.getDate())).slice(-2)
                datetofind = m + "/" + d + "/" + y;
                datetofindy = y + "/" + m + "/" + d;
                enddate= new Date(fresult.getValue({name: "custrecord_so_sc_enddate"}));
                var y = enddate.getFullYear();
                var m = enddate.getMonth() + 1;
                var d = enddate.getDate();
                
                var m = ('0'+(enddate.getMonth()+1)).slice(-2)
                var d = ('0'+(enddate.getDate())).slice(-2)
                datetoend = m + "/" + d + "/" + y;
                datetoendy = y + "/" + m + "/" + d;
                initial = parseInt(ecddays.indexOf(datetofind));
                if (initial==-1)      {colspan=0;}
                else {colspan=initial-columtotal;}
                if (colspan!=0) 
                {
                    columtotal+=colspan;
                    tabla += "<td id='tbdayse' colspan='"+ colspan +"'></td>";
                }
                
                if (tdhoydatey>=datetofindy && tdhoydatey<=datetoendy) {
                    log.audit("tdhoydatey",tdhoydatey);
                    log.audit("datetofindy",datetofindy);
                    log.audit("datetoendy",datetoendy);
                    classtask="tasktoday";}

                if (datetofindy>tdhoydatey) {classtask="taskfuture";}
                
                tabla += "<td id='"+classtask+"' colspan='"+ fresult.getValue({name: "custrecord_sc_soduration"}) +"'><a href='https://5896209.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1313&id="+ fresult.getValue({name: "internalid"}) +"' target='_blank'>"+ fresult.getText({name: "entity",join: "CUSTRECORD_SALECONTRACT"}) +"<br/> (" + fresult.getText({name: "custbody_appf_veh_model",join: "CUSTRECORD_SALECONTRACT"}) +") </a><br/> ";
                //tabla += "<a href='#' onclick='javascript:changenext(\""+ fresult.getValue({name: "internalid"}) +"\",\""+ fresult.getValue({name: "custrecord_so_sc_status"}) + "\")'> [N] </a>";
                tabla += "</td>"
                columtotal+=parseInt(fresult.getValue({name: "custrecord_sc_soduration"}));
            
			})
            resto=ecddays.length-columtotal;
            tabla += "<td id='tbdayse' colspan='"+ resto +"'></td>";
            tabla += "</tr>";
            tabla += "</table>";
		});

		return tabla;
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

                vstartdate= new Date(custrecord_blockdate);
                var y = vstartdate.getFullYear();
                var m = vstartdate.getMonth() + 1;
                var d = vstartdate.getDate();
                var m = ('0'+(vstartdate.getMonth()+1)).slice(-2)
                var d = ('0'+(vstartdate.getDate())).slice(-2)
                datetofind = m + "/" + d + "/" + y;
                ecdholydays[i]=datetofind;
                i++;
                
            });
            
        });


        const td = new Date();
        log.debug("td",td);

        var newstartdate=new Date(td);
        newstartdate.setDate(td.getDate()-60);

        shstartdate=new Date(td);
        shstartdate.setDate(td.getDate()-60);

        log.debug("newstartdate",newstartdate);

        for (i=0;i<270;i++)
        {
            newstartdate.setDate(newstartdate.getDate()+1);
            if (newstartdate.getDay() == 0) {i--;continue;}
            if (newstartdate.getDay() == 6) {i--;continue;}

            var y = newstartdate.getFullYear();
            var m = newstartdate.getMonth() + 1;
            var d = newstartdate.getDate();
            var m = ('0'+(newstartdate.getMonth()+1)).slice(-2)
            var d = ('0'+(newstartdate.getDate())).slice(-2)
            datetofind = m + "/" + d + "/" + y;
            initial = parseInt(ecdholydays.indexOf(datetofind));
            if (initial!=-1)      {log.debug("holydays",datetofind);i--;continue;}
            
            ecddays[i]=datetofind;
        }
        
       
    }
    
    return {
        onRequest: onRequest
    };
});