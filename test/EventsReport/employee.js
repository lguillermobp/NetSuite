/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

define([],

    function() {


        return {
            afterSubmit : function (context) {

                var employee 		= context.newRecord;
                var empCode 		= employee.getValue('custentity_sdr_employee_code');
                var spervisorName 	= employee.getText('supervisor');
                var supervisorId 	= employee.getValue('supervisor');

                log.debug('Employee Code', empCode);
                log.debug('Supervisor ID', supervisorId);
                log.debug('Supervisor Name', spervisorName);


            }
        };

    });