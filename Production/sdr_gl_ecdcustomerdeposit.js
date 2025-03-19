/**
 * @NApiVersion 2.x
 * @NScriptType PluginTypeImpl
 */
          define(function() {
            function customizeGlImpact(context) {
                var customLines = context.customLines;
                log.audit({title: 'context', details: context});
                log.audit({title: 'context.transactionRecord', details: context.transactionRecord});
                log.audit({title: 'context.ReadOnlyTransactionRecord.getRecordType()', details: context.ReadOnlyTransactionRecord.getRecordType()});

                if (context.ReadOnlyTransactionRecord.getRecordType() === 'customtransaction_ecdcustomerdeposit') 
                    {

                    
                        var memo = context.transactionRecord.getValue({fieldId : 'memo'});
                        var name = context.transactionRecord.getValue({fieldId : 'custbody_customer'});
                        var amount = context.transactionRecord.getValue({fieldId : 'custbody_amount'});
                        var typep = context.transactionRecord.getValue({fieldId : 'custbody_typepayment'});


                        var firstAccount = 854;
                        var secondAccount = 326;
                        var bookId = context.book.id;
                
                        var firstLine = customLines.addNewLine();
                        firstLine.accountId = firstAccount;
                        firstLine.debitAmount = amount;
                        firstLine.memo = memo + ' for book ' + bookId;
                        firstLine.isBookSpecific = false;
                    
                        var secondLine = customLines.addNewLine();
                        secondLine.accountId = secondAccount;
                        secondLine.creditAmount = amount;
                        secondLine.memo = memo + ' for book ' + bookId;
                        secondLine.name = name;
                        secondLine.isBookSpecific = false;
                    }
                }
            return {  
                customizeGlImpact: customizeGlImpact,
            }
        }); 
  