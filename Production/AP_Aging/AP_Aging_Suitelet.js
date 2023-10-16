/**
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

define(["N/ui/serverWidget", "N/file", "N/search"],
    /**
     * @param serverWidget
     * @param file
     * @param search
     * @returns {{onRequest: onRequest}}
     */
    function (serverWidget, file, search) {
        function onRequest(context) {
            var report = file.load("/SuiteScripts/AP_Aging/AP_Aging2.html").getContents();

            var form = serverWidget.createForm({
                title: "A/P Aging Report"
            });

            var fieldReport = form.addField({
                id: "custpage_ap_aging",
                type: serverWidget.FieldType.INLINEHTML,
                label: "Report"
            });

            var searchApAging = search.load({
                id: "customsearch_ap_aging_2"
            });

            var resultsApAging = searchApAging.run();

            var htmlApAging = "";
            resultsApAging.each(function (result) {
                /**
                 * 0: Vendor
                 * 1: Terms
                 * 2: Date
                 * 3: Document Number
                 * 4: Age In Days of Due Date/Receive By
                 * 5: Due Date/Receive By
                 * 6: Balance
                 * 7: Week 1
                 * 8: Week 2
                 * 9: Week 3
                 * 10: Week 4
                 * 11: Week 5
                 * 12: Week 6
                 * 13: Week 7
                 * 14: Week 8
                 * 15: Week 9
                 * 16: Week 10
                 * 17: Week 11
                 * 18: Week 12
                 * 19: Week 13
                 * 20: Week 14
                 * 21: AMEX
                 * 22: Location
                 * 23: Category
                 */

                htmlApAging += "<tr>";
                htmlApAging += `<td>${result.getText(resultsApAging.columns[0])}</td>`;
                htmlApAging += `<td>${result.getValue(resultsApAging.columns[1])}</td>`;
                htmlApAging += `<td>${result.getValue(resultsApAging.columns[2])}</td>`;
                htmlApAging += `<td>${result.getValue(resultsApAging.columns[3])}</td>`;
                htmlApAging += `<td>${result.getValue(resultsApAging.columns[4])}</td>`;
                htmlApAging += `<td>${result.getValue(resultsApAging.columns[5])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[6])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[7])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[8])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[9])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[10])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[11])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[12])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[13])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[14])}</td>`;
              
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[15])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[16])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[17])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[18])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[19])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[20])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[21])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[22])}</td>`;
                htmlApAging += `<td >${result.getValue(resultsApAging.columns[23])}</td>`;
              
                htmlApAging += "</tr>";

                return true;
            });

            report = report.replace("[HTML_AP_AGING]", htmlApAging);

            fieldReport.defaultValue = report;

            context.response.writePage(form);
        }

        return {onRequest: onRequest}
    });