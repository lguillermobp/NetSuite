define(['N/search', 'N/url','N/record'], function (s, url, r) {
    /**
     * Client Script to add a Button to the Suitelet Cases by priority
     *
     * @export suitelet-results/cl
     *
     * @author Luis Barrios
     *
     *
     * @NApiVersion 2.0
     * @ModuleScope SameAccount
     * @NScriptType ClientScript
     *
     */
    var exports= {};

    function pageInit(context) {

    }

    function goToNextCase() {
        console.info('Go to Next Case clicked...');

        var nextCaseId = getNextCase();
        console.log('Next Case ID: ' + nextCaseId);

        var caseUrl = getCaseUrl(nextCaseId);
        console.log('Next Case URL: ' + caseUrl);
    }

    function goToBackCase() {
        console.info('Go to Before Case clicked...');

        var backCaseId = getBackCase();
        console.log('Before Case ID: ' + backCaseId);

        var caseUrl = getCaseUrl(backCaseId);
        console.log('Before Case URL: ' + caseUrl);
    }

    function getNextCase() {
        console.info('Retrieving Next Case clicked...');

        return s.load({
            id: "customsearch_bks_ecomm_5_2"
        }).run().getRange({start: 0, end: 1})[0].id;
    }
    function getBackCase() {
        console.info('Retrieving Back Case clicked...');

        return s.load({
            id: "customsearch_bks_ecomm_5_2"
        }).run().getRange({start: 0, end: 1})[0].id;
    }

    function getCaseUrl(caseId) {
        console.info('Generating URL...');

        return url.resolveRecord({
            recordType: r.Type.SUPPORT_CASE,
            recordId: caseId,
            isEditMode: true
        });
    }
        exports.pageInit = pageInit;
        exports.goToNextCase = goToNextCase;
        exports.goToBackCase = goToBackCase;
        return exports;
});