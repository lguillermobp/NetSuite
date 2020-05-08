define(['N/record', 'N/log'], function (r, log) {
    /**
     * Example 1; calc
     * @export suitelet-results
     *
     * @author Luis Barrios
     *
     * @requires N/record
     *
     * @requires N/log
     *
     * @NApiVersion 2.0
     * @ModuleScope SameAccount
     * @NScriptType UserEventScript
     *
     */
function createContact() {
        log.audit({title: "Creating Contact"});
    r.create({
        type: r.Type.CONTACT,
        isDynamic: false,
        defaultValues: null
    }).setValue({fieldId: "firstname",
        value: "Luis",
        ignoreFieldChange: true
        }).setValue({fieldId: "middlename",
        value: "G",
        ignoreFieldChange: true
    }).setValue({fieldId: "lastname",
        value: "Barrios",
        ignoreFieldChange: true
    }).setValue({fieldId: "email",
        value: "luis11@beekman1802.com",
        ignoreFieldChange: true
    }).setValue({fieldId: "officephone",
        value: "+19557837623",
        ignoreFieldChange: true
    }).save({
        enableSourcing: true,
        ignoreMandatoryFields: false
    });

    }
    return {
    afterSubmit: createContact
    };

});