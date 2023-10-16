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
     *
     */
    var exports= {};

    function goToNextCase() {
        console.info('Go to Next Case clicked...');

        var nextCaseId = getNextCase();
        console.log('Next Case ID: ' + nextCaseId);

        var caseUrl = getCaseUrl(nextCaseId);
        console.log('Next Case URL: ' + caseUrl);
    }

    function getNextCase() {
        console.info('Retrieving Next Case clicked...');

        return s.load({
            id: "customsearch_case_by_priority"
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

        exports.goToNextCase = goToNextCase;
        return exports;
});