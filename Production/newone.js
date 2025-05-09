/**
 * Module Description
 * 
 * Version    Date          Author           Remarks
 * 1.00             	Abhishek Pundir
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function customizeGlImpact(transactionRecord, standardLines, customLines, book)
{
  var countStandard=standardLines.getCount();
  nlapiLogExecution("DEBUG", "Line Count",standardLines.getCount());

  nlapiLogExecution("DEBUG", "Book",book);
  nlapiLogExecution("DEBUG", "Transaction Record",transactionRecord);
  nlapiLogExecution("DEBUG", "Standard Lines",standardLines);
  nlapiLogExecution("DEBUG", "Custom Lines",customLines);

 //To get the first standard line which appear in the GL impact
 var currLine = standardLines.getLine(0);
 //To get the entity from the standard line
 var entityId = currLine.getEntityId(); 
 //To get the subsidiary which is chosen on the transaction  
 var tranSubsidiary=transactionRecord.getFieldValue('subsidiary');
 //To get the record type of the transaction
 var recordType=transactionRecord.getRecordType();   
  if(recordType == 'customtransaction_ecdcustomerdeposit'){
                          
        nlapiLogExecution("DEBUG", "Subsidiary",tranSubsidiary);
        //To get the custom field value which is on the transaction
        var memo = transactionRecord.getFieldValue('memo');
        var name = parseInt(transactionRecord.getFieldValue('custbody_customer'));
        var nametext = transactionRecord.getFieldText('custbody_customer');
        var amount= transactionRecord.getFieldValue('custbody_amount'); 
        var typep = transactionRecord.getFieldValue('custbody_typepayment');
        var omitgl = transactionRecord.getFieldValue('custbody_omitgl');
        nlapiLogExecution("DEBUG", "typep",typep);


        if (omitgl == "T"){
            return;
        }

        cta1001 = {id: 738, name: "", memo: "Deposit "+nametext};
        cta1205 = {id: 755, name: name, memo: ""};
        cta4035 = {id: 472, name: "", memo: ""};
        cta2005 = {id: 326, name: name, memo: ""};
        cta5006 = {id: 937, name: "", memo: ""};
      
        switch(typep) {
            case "1":
                firstaccount=cta1001;
                secondaccount=cta2005;
                thirdaccount="";
                forthaccount="";
                memo="Deposit "+nametext;
                break;
            case "2":
                firstaccount=cta1001;
                secondaccount=cta2005;
                thirdaccount="";
                forthaccount="";
                memo="Deposit "+nametext;
                break;
            case "3":
                firstaccount=cta1205;
                secondaccount=cta2005;
                thirdaccount="";
                forthaccount="";
                break;
            case "4":
                firstaccount=cta1001;
                secondaccount=cta1205;
                thirdaccount=cta2005;
                forthaccount=cta5006;
                memo="Trade In "+nametext;
                break;
            default:
                amount=0;
              // code block
          }


            if(amount>0){
                nlapiLogExecution("DEBUG", "amount",amount);
                nlapiLogExecution("DEBUG", "memo",memo);
                nlapiLogExecution("DEBUG", "name",name);

                    //To add new custom line in the GL impact  

                var newLine = customLines.addNewLine();
                newLine.setDebitAmount(amount);
                newLine.setAccountId(firstaccount.id);
                if (firstaccount.name != ""){
                    newLine.setEntityId(firstaccount.name);
                }
                if (firstaccount.memo != ""){
                    newLine.setMemo(firstaccount.memo);}
                

                if (forthaccount){
                    var newLine = customLines.addNewLine(); 
                    newLine.setDebitAmount(amount);
                    newLine.setAccountId(forthaccount.id);
                    if (forthaccount.name != ""){
                        newLine.setEntityId(forthaccount.name);
                    }
                    if (forthaccount.memo != ""){
                        newLine.setMemo(forthaccount.memo);}
                }

                var newLine = customLines.addNewLine(); 
                newLine.setCreditAmount(amount);
                newLine.setAccountId(secondaccount.id); 
                if (secondaccount.name != ""){
                    newLine.setEntityId(secondaccount.name);
                }
                if (secondaccount.memo != ""){
                    newLine.setMemo(secondaccount.memo);}

                if (thirdaccount){
                    var newLine = customLines.addNewLine(); 
                    newLine.setCreditAmount(amount);
                    newLine.setAccountId(thirdaccount.id);
                    if (thirdaccount.name != ""){
                        newLine.setEntityId(thirdaccount.name);
                    }
                    if (thirdaccount.memo != ""){
                        newLine.setMemo(thirdaccount.memo);}
                }
                
                    
                
            }
   }
}