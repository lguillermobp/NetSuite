"use strict";
define(['N/search',"N/email","N/ui/message","N/runtime","N/log","N/record", "/SuiteScripts/Modules/generaltoolsv1.js"], function (s,email,message,runtime,log, r, GENERALTOOLS) {
        /**
         * Help Tools
         *
         *
         *
         * Version    Date                    Author           Remarks
         * 2.01       2021-08-119             Luis Barrios
         *
         */

        function helpgo(docnum) {
            log.debug("docnum", docnum);
            var userObj = runtime.getCurrentUser();
            log.debug("userObj", userObj);
            var paramemp = GENERALTOOLS.get_employee_value(userObj.id);
            var entitytitle=paramemp.data.getValue({fieldId: "entitytitle"});

            var saleorderno = docnum;

            var paramrec = GENERALTOOLS.get_paramnew_value('0604');
            var recipientsstr = paramrec.data.getValue({name: "custrecordparams_value"});
            var paramrec = GENERALTOOLS.get_paramnew_value('0605');
            var subject = paramrec.data.getValue({name: "custrecordparams_value"});

            subject = subject.replace("${user}", entitytitle);
            subject = subject.replace("${SO}", saleorderno);

            var emailBody = subject;

            const recipients = recipientsstr.split(',');
            log.debug("recipients", recipients);


            email.send({
                author: userObj.id,
                recipients: recipients,
                subject: subject,
                body: emailBody
            });
            message.create({
                title: "HELP has been requested",
                message: "Help is on the way!!!",
                type: message.Type.WARNING,
                duration: 10000
            }).show();

            var retvar= {};

            retvar = {
                "sts": true,
                "date": "",
                "records": "",
                "data": ""
            }
            return retvar;

        }

        return {
            helpgo: helpgo
             };




    });