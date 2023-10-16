/**
 * SuiteScript record common module
 *
 * @module N/record
 * @suiteScriptVersion 2.x
 *
 */
function record() {}
/**
 * Create a new record object based on provided type
 *
 * @governance 10 units for transactions, 2 for custom records, 5 for all other records
 *
 * @param {Object} options
 * @param {string} options.type record type
 * @param {boolean} [options.isDynamic=false] Determines whether the new record is created in dynamic mode.
 * @param {Object} [options.defaultValues={}] Name-value pairs containing default values of fields in the new record. By default, this value is empty.
 * @return {Record}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.type is missing
 *
 * @since 2015.2
 */
record.prototype.create = function(options) {};
record.create.promise = function(options) {};

/**
 * Load an existing nlobjRecord from the database based on provided type, id
 *
 * @governance 10 units for transactions, 2 for custom records, 5 for all other records
 *
 * @param {Object} options
 * @param {string} options.type The record type.
 * @param {number|string} options.id The internal ID of the existing record instance to be loaded.
 * @param {boolean} [options.isDynamic=false] Determines whether the new record is loaded in dynamic mode.
 * @param {Object} [options.defaultValues={}] Name-value pairs containing default values of fields in the new record. By default, this value is empty.
 * @return {Record}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.type or options.id is missing
 *
 * @since 2015.2
 */
record.prototype.load = function(options) {};
record.load.promise = function(options) {};

/**
 * Copy a record object based on provided type, id
 *
 * @governance 10 units for transactions, 2 for custom records, 5 for all other records
 *
 * @param {Object} options
 * @param {string} options.type The record type.
 * @param {number|string} options.id The internal ID of the existing record instance being copied.
 * @param {boolean} [options.isDynamic=false] Determines whether the new record is created in dynamic mode.
 * @param {Object} [options.defaultValues={}] Name-value pairs containing default values of fields in the new record. By default, this value is empty.
 * @return {Record}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.type or options.id is missing
 *
 * @since 2015.2
 */
record.prototype.copy = function(options) {};
record.copy.promise = function(options) {};

/**
 * Transform a record into another type (i.e. salesOrder -> invoice -or- opportunity -> estimate)
 *
 * @governance 10 units for transactions, 2 for custom records, 5 for all other records
 *
 * @param {Object} options
 * @param {string} options.fromType The record type of the existing record instance being transformed.
 * @param {number|string} options.fromId The internal ID of the existing record instance being transformed.
 * @param {string} options.toType The record type of the record returned when the transformation is complete.
 * @param {boolean} [options.isDynamic=false] Determines whether the new record is created in dynamic mode.
 * @param {Object} [options.defaultValues={}] Name-value pairs containing default values of fields in the new record. By default, this value is empty.
 * @return {Record}
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.type or options.id is missing
 *
 * @since 2015.2
 */
record.prototype.transform = function(options) {};
record.transform.promise = function(options) {};

/**
 * Delete a record object based on provided type, id and return the id of deleted record
 *
 * @governance 20 units for transactions, 4 for custom records, 10 for all other records
 *
 * @param {Object} options
 * @param {string} options.type The record type.
 * @param {number|string} options.id The internal ID of the existing record instance to be deleted.
 * @return {number} recordId
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if type or id is missing
 *
 * @since 2015.2
 */
record.prototype['delete'] = function(options) {};
record['delete'].promise = function(options) {};

/**
 * Updates and submits one or more body fields on an existing record in NetSuite, and returns the internal ID of the parent record. When you use this method, you do not need to load or submit the parent record.
 *
 * @governance 10 units for transactions, 2 for custom records, 5 for all other records
 * @restriction only supported for records and fields where DLE (Direct List Editing) is supported
 *
 * @param {Object} options
 * @param {string} options.type When working with an instance of a standard NetSuite record type, set this value by using the record.Type enum. When working with an instance of a custom record type, set this value by using the custom record type’s string ID.
 * @param {number|string} options.id The internal ID of the existing record instance in NetSuite.
 * @param {Object} options.values The ID-value pairs for each field you want to edit and submit.
 * @param {Object} [options.options] additonal flags for submission
 * @param {boolean} [options.options.enablesourcing=true] enable sourcing during record update
 * @param {boolean} [options.options.ignoreMandatoryFields=false] ignore mandatory field during record submission
 *
 * @return {number} id of submitted record
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if type or id is missing
 *
 * @since 2015.2
 */
record.prototype.submitFields = function(options) {};
record.submitFields.promise = function(options) {};

/**
 * Attaches a record to another record.
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {Object} options.record record to be attached
 * @param {Object} options.record.type The type of record to attach.
 * @param {number|string} options.record.id The internal ID of the record to attach.
 * @param {Object} options.to The record that the options.record gets attached to.
 * @param {string} options.to.type The record type of the record to attach to.
 * @param {number|string} options.to.id The id of the destination
 * @param {Object} [options.attributes=null] name/value pairs containing attributes
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any of record or to (and their type and id) are missing
 *
 * @since 2015.2
 */
record.prototype.attach = function(options) {};
record.attach.promise = function(options) {};

/**
 * detach record from another record
 *
 * @governance 10 units
 *
 * @param {Object} options
 * @param {Object} options.record record to be detached
 * @param {Object} options.record.type The type of record to be detached.
 * @param {number|string} options.record.id The id of the record to be detached
 * @param {Object} options.from The destination record where options.record will be detached from
 * @param {string} options.from.type The type of the destination
 * @param {number|string} options.from.id The id of the destination
 * @param {Object} [options.attributes=null] name/value pairs containing attributes
 *
 * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any of record or from (and their type and id) are missing
 *
 * @since 2015.2
 */
record.prototype.detach = function(options) {};
record.detach.promise = function(options) {};

function recordType() {
    this.ACCOUNT = 'account';
    this.ACCOUNTING_BOOK = 'accountingbook';
    this.ACCOUNTING_CONTEXT = 'accountingcontext';
    this.ACCOUNTING_PERIOD = 'accountingperiod';
    this.ADV_INTER_COMPANY_JOURNAL_ENTRY = 'advintercompanyjournalentry';
    this.ALLOCATION_SCHEDULE = 'allocationschedule';
    this.AMORTIZATION_SCHEDULE = 'amortizationschedule';
    this.AMORTIZATION_TEMPLATE = 'amortizationtemplate';
    this.ASSEMBLY_BUILD = 'assemblybuild';
    this.ASSEMBLY_ITEM = 'assemblyitem';
    this.ASSEMBLY_UNBUILD = 'assemblyunbuild';
    this.BALANCE_TRX_BY_SEGMENTS = 'balancetrxbysegments';
    this.BILLING_ACCOUNT = 'billingaccount';
    this.BILLING_CLASS = 'billingclass';
    this.BILLING_RATE_CARD = 'billingratecard';
    this.BILLING_REVENUE_EVENT = 'billingrevenueevent';
    this.BILLING_SCHEDULE = 'billingschedule';
    this.BIN = 'bin';
    this.BIN_TRANSFER = 'bintransfer';
    this.BIN_WORKSHEET = 'binworksheet';
    this.BLANKET_PURCHASE_ORDER = 'blanketpurchaseorder';
    this.BOM = 'bom';
    this.BOM_REVISION = 'bomrevision';
    this.BONUS = 'bonus';
    this.BONUS_TYPE = 'bonustype';
    this.BUDGET_EXCHANGE_RATE = 'budgetexchangerate';
    this.BUNDLE_INSTALLATION_SCRIPT = 'bundleinstallationscript';
    this.BULK_OWNERSHIP_TRANSFER = 'bulkownershiptransfer';
    this.CALENDAR_EVENT = 'calendarevent';
    this.CAMPAIGN = 'campaign';
    this.CAMPAIGN_RESPONSE = 'campaignresponse';
    this.CAMPAIGN_TEMPLATE = 'campaigntemplate';
    this.CASH_REFUND = 'cashrefund';
    this.CASH_SALE = 'cashsale';
    this.CHARGE = 'charge';
    this.CHARGE_RULE = 'chargerule';
    this.CHECK = 'check';
    this.CLASSIFICATION = 'classification';
    this.CLIENT_SCRIPT = 'clientscript';
    this.CMS_CONTENT = 'cmscontent';
    this.CMS_CONTENT_TYPE = 'cmscontenttype';
    this.CMS_PAGE = 'cmspage';
    this.COMMERCE_CATEGORY = 'commercecategory';
    this.COMPETITOR = 'competitor';
    this.CONSOLIDATED_EXCHANGE_RATE = 'consolidatedexchangerate';
    this.CONTACT = 'contact';
    this.CONTACT_CATEGORY = 'contactcategory';
    this.CONTACT_ROLE = 'contactrole';
    this.COST_CATEGORY = 'costcategory';
    this.COUPON_CODE = 'couponcode';
    this.CREDIT_CARD_CHARGE = 'creditcardcharge';
    this.CREDIT_CARD_REFUND = 'creditcardrefund';
    this.CREDIT_MEMO = 'creditmemo';
    this.CURRENCY = 'currency';
    this.CUSTOMER = 'customer';
    this.CUSTOMER_CATEGORY = 'customercategory';
    this.CUSTOMER_DEPOSIT = 'customerdeposit';
    this.CUSTOMER_MESSAGE = 'customermessage';
    this.CUSTOMER_PAYMENT = 'customerpayment';
    this.CUSTOMER_PAYMENT_AUTHORIZATION = 'customerpaymentauthorization';
    this.CUSTOMER_REFUND = 'customerrefund';
    this.CUSTOMER_STATUS = 'customerstatus';
    this.CUSTOMER_SUBSIDIARY_RELATIONSHIP = 'customersubsidiaryrelationship';
    this.CUSTOM_PURCHASE = 'custompurchase';
    this.CUSTOM_RECORD = 'customrecord';
    this.CUSTOM_SALE = 'customsale';
    this.CUSTOM_TRANSACTION = 'customtransaction';
    this.DEPARTMENT = 'department';
    this.DEPOSIT = 'deposit';
    this.DEPOSIT_APPLICATION = 'depositapplication';
    this.DESCRIPTION_ITEM = 'descriptionitem';
    this.DISCOUNT_ITEM = 'discountitem';
    this.DOWNLOAD_ITEM = 'downloaditem';
    this.EMAIL_TEMPLATE = 'emailtemplate';
    this.EMPLOYEE = 'employee';
    this.EMPLOYEE_CHANGE_REQUEST = 'employeechangerequest';
    this.EMPLOYEE_CHANGE_REQUEST_TYPE = 'employeechangerequesttype';
    this.EMPLOYEE_STATUS = 'employeestatus';
    this.EMPLOYEE_TYPE = 'employeetype';
    this.ENTITY_ACCOUNT_MAPPING = 'entityaccountmapping';
    this.ESTIMATE = 'estimate';
    this.EXPENSE_AMORTIZATION_EVENT = 'expenseamortizationevent';
    this.EXPENSE_CATEGORY = 'expensecategory';
    this.EXPENSE_PLAN = 'expenseplan';
    this.EXPENSE_REPORT = 'expensereport';
    this.FAIR_VALUE_PRICE = 'fairvalueprice';
    this.FIXED_AMOUNT_PROJECT_REVENUE_RULE = 'fixedamountprojectrevenuerule';
    this.FINANCIAL_INSTITUTION = 'financialinstitution';
    this.FOLDER = 'folder';
    this.FORMAT_PROFILE = 'formatprofile';
    this.FULFILLMENT_REQUEST = 'fulfillmentrequest';
    this.GENERAL_TOKEN = 'generaltoken';
    this.GENERIC_RESOURCE = 'genericresource';
    this.GIFT_CERTIFICATE = 'giftcertificate';
    this.GIFT_CERTIFICATE_ITEM = 'giftcertificateitem';
    this.GL_NUMBERING_SEQUENCE = 'glnumberingsequence';
    this.GLOBAL_ACCOUNT_MAPPING = 'globalaccountmapping';
    this.GLOBAL_INVENTORY_RELATIONSHIP = 'globalinventoryrelationship';
    this.GOAL = 'goal';
    this.INBOUND_SHIPMENT = 'inboundshipment';
    this.INTERCOMP_ALLOCATION_SCHEDULE = 'intercompallocationschedule';
    this.INTER_COMPANY_JOURNAL_ENTRY = 'intercompanyjournalentry';
    this.INTER_COMPANY_TRANSFER_ORDER = 'intercompanytransferorder';
    this.INVENTORY_ADJUSTMENT = 'inventoryadjustment';
    this.INVENTORY_COST_REVALUATION = 'inventorycostrevaluation';
    this.INVENTORY_COUNT = 'inventorycount';
    this.INVENTORY_DETAIL = 'inventorydetail';
    this.INVENTORY_ITEM = 'inventoryitem';
    this.INVENTORY_NUMBER = 'inventorynumber';
    this.INVENTORY_STATUS = 'inventorystatus';
    this.INVENTORY_STATUS_CHANGE = 'inventorystatuschange';
    this.INVENTORY_TRANSFER = 'inventorytransfer';
    this.INVOICE = 'invoice';
    this.INVOICE_GROUP = 'invoicegroup';
    this.ISSUE = 'issue';
    this.ISSUE_PRODUCT = 'issueproduct';
    this.ISSUE_PRODUCT_VERSION = 'issueproductversion';
    this.ITEM_ACCOUNT_MAPPING = 'itemaccountmapping';
    this.ITEM_COLLECTION = 'itemcollection';
    this.ITEM_COLLECTION_ITEM_MAP = 'itemcollectionitemmap';
    this.ITEM_DEMAND_PLAN = 'itemdemandplan';
    this.ITEM_FULFILLMENT = 'itemfulfillment';
    this.ITEM_GROUP = 'itemgroup';
    this.ITEM_LOCATION_CONFIGURATION = 'itemlocationconfiguration';
    this.ITEM_PROCESS_FAMILY = 'itemprocessfamily';
    this.ITEM_PROCESS_GROUP = 'itemprocessgroup';
    this.ITEM_RECEIPT = 'itemreceipt';
    this.ITEM_REVISION = 'itemrevision';
    this.ITEM_SUPPLY_PLAN = 'itemsupplyplan';
    this.JOB = 'job';
    this.JOB_STATUS = 'jobstatus';
    this.JOB_TYPE = 'jobtype';
    this.JOURNAL_ENTRY = 'journalentry';
    this.KIT_ITEM = 'kititem';
    this.LABOR_BASED_PROJECT_REVENUE_RULE = 'laborbasedprojectrevenuerule';
    this.LEAD = 'lead';
    this.LOCATION = 'location';
    this.LOT_NUMBERED_ASSEMBLY_ITEM = 'lotnumberedassemblyitem';
    this.LOT_NUMBERED_INVENTORY_ITEM = 'lotnumberedinventoryitem';
    this.MANUFACTURING_COST_TEMPLATE = 'manufacturingcosttemplate';
    this.MANUFACTURING_OPERATION_TASK = 'manufacturingoperationtask';
    this.MANUFACTURING_ROUTING = 'manufacturingrouting';
    this.MAP_REDUCE_SCRIPT = 'mapreducescript';
    this.MARKUP_ITEM = 'markupitem';
    this.MASSUPDATE_SCRIPT = 'massupdatescript';
    this.MEM_DOC = 'memdoc';
    this.MERCHANDISE_HIERARCHY_LEVEL = 'merchandisehierarchylevel';
    this.MERCHANDISE_HIERARCHY_NODE = 'merchandisehierarchynode';
    this.MERCHANDISE_HIERARCHY_VERSION = 'merchandisehierarchyversion';
    this.MESSAGE = 'message';
    this.MFG_PLANNED_TIME = 'mfgplannedtime';
    this.NEXUS = 'nexus';
    this.NON_INVENTORY_ITEM = 'noninventoryitem';
    this.NOTE = 'note';
    this.NOTE_TYPE = 'notetype';
    this.OPPORTUNITY = 'opportunity';
    this.ORDER_SCHEDULE = 'orderschedule';
    this.ORDER_TYPE = 'ordertype';
    this.OTHER_CHARGE_ITEM = 'otherchargeitem';
    this.OTHER_NAME = 'othername';
    this.OTHER_NAME_CATEGORY = 'othernamecategory';
    this.PARTNER = 'partner';
    this.PARTNER_CATEGORY = 'partnercategory';
    this.PAYCHECK = 'paycheck';
    this.PAYCHECK_JOURNAL = 'paycheckjournal';
    this.PAYMENT_CARD = 'paymentcard';
    this.PAYMENT_CARD_TOKEN = 'paymentcardtoken';
    this.PAYMENT_ITEM = 'paymentitem';
    this.PAYMENT_METHOD = 'paymentmethod';
    this.PAYROLL_ITEM = 'payrollitem';
    this.PERFORMANCE_METRIC = 'performancemetric';
    this.PERFORMANCE_REVIEW = 'performancereview';
    this.PERFORMANCE_REVIEW_SCHEDULE = 'performancereviewschedule';
    this.PERIOD_END_JOURNAL = 'periodendjournal';
    this.PCT_COMPLETE_PROJECT_REVENUE_RULE = 'pctcompleteprojectrevenuerule';
    this.PHONE_CALL = 'phonecall';
    this.PICK_STRATEGY = 'pickstrategy';
    this.PICK_TASK = 'picktask';
    this.PORTLET = 'portlet';
    this.PRICE_BOOK = 'pricebook';
    this.PRICE_LEVEL = 'pricelevel';
    this.PRICE_PLAN = 'priceplan';
    this.PRICING_GROUP = 'pricinggroup';
    this.PROJECT_EXPENSE_TYPE = 'projectexpensetype';
    this.PROJECT_TASK = 'projecttask';
    this.PROJECT_TEMPLATE = 'projecttemplate';
    this.PROMOTION_CODE = 'promotioncode';
    this.PROSPECT = 'prospect';
    this.PURCHASE_CONTRACT = 'purchasecontract';
    this.PURCHASE_ORDER = 'purchaseorder';
    this.PURCHASE_REQUISITION = 'purchaserequisition';
    this.REALLOCATE_ITEM = 'reallocateitem';
    this.RECEIVE_INBOUND_SHIPMENT = 'receiveinboundshipment';
    this.RESOURCE_ALLOCATION = 'resourceallocation';
    this.RESTLET = 'restlet';
    this.RETURN_AUTHORIZATION = 'returnauthorization';
    this.REVENUE_ARRANGEMENT = 'revenuearrangement';
    this.REVENUE_COMMITMENT = 'revenuecommitment';
    this.REVENUE_COMMITMENT_REVERSAL = 'revenuecommitmentreversal';
    this.REVENUE_PLAN = 'revenueplan';
    this.REV_REC_SCHEDULE = 'revrecschedule';
    this.REV_REC_TEMPLATE = 'revrectemplate';
    this.SALES_ORDER = 'salesorder';
    this.SALES_ROLE = 'salesrole';
    this.SALES_TAX_ITEM = 'salestaxitem';
    this.SCHEDULED_SCRIPT = 'scheduledscript';
    this.SCHEDULED_SCRIPT_INSTANCE = 'scheduledscriptinstance';
    this.SCRIPT_DEPLOYMENT = 'scriptdeployment';
    this.SERIALIZED_ASSEMBLY_ITEM = 'serializedassemblyitem';
    this.SERIALIZED_INVENTORY_ITEM = 'serializedinventoryitem';
    this.SERVICE_ITEM = 'serviceitem';
    this.SHIP_ITEM = 'shipitem';
    this.SOLUTION = 'solution';
    this.STATISTICAL_JOURNAL_ENTRY = 'statisticaljournalentry';
    this.STORE_PICKUP_FULFILLMENT = 'storepickupfulfillment';
    this.SUBSCRIPTION = 'subscription';
    this.SUBSCRIPTION_CHANGE_ORDER = 'subscriptionchangeorder';
    this.SUBSCRIPTION_LINE = 'subscriptionline';
    this.SUBSCRIPTION_PLAN = 'subscriptionplan';
    this.SUBSIDIARY = 'subsidiary';
    this.SUBSIDIARY_SETTINGS = 'subsidiarysettings';
    this.SUBTOTAL_ITEM = 'subtotalitem';
    this.SUITELET = 'suitelet';
    this.SUPPLY_CHAIN_SNAPSHOT = 'supplychainsnapshot';
    this.SUPPLY_CHAIN_SNAPSHOT_SIMULATION = 'supplychainsnapshotsimulation';
    this.SUPPORT_CASE = 'supportcase';
    this.TASK = 'task';
    this.TAX_ACCT = 'taxacct';
    this.TAX_GROUP = 'taxgroup';
    this.TAX_PERIOD = 'taxperiod';
    this.TAX_TYPE = 'taxtype';
    this.TERM = 'term';
    this.TIME_BILL = 'timebill';
    this.TIME_ENTRY = 'timeentry';
    this.TIME_OFF_CHANGE = 'timeoffchange';
    this.TIME_OFF_PLAN = 'timeoffplan';
    this.TIME_OFF_REQUEST = 'timeoffrequest';
    this.TIME_OFF_RULE = 'timeoffrule';
    this.TIME_OFF_TYPE = 'timeofftype';
    this.TIME_SHEET = 'timesheet';
    this.TOPIC = 'topic';
    this.TRANSFER_ORDER = 'transferorder';
    this.UNITS_TYPE = 'unitstype';
    this.UNLOCKED_TIME_PERIOD = 'unlockedtimeperiod';
    this.USAGE = 'usage';
    this.USEREVENT_SCRIPT = 'usereventscript';
    this.VENDOR = 'vendor';
    this.VENDOR_BILL = 'vendorbill';
    this.VENDOR_CATEGORY = 'vendorcategory';
    this.VENDOR_CREDIT = 'vendorcredit';
    this.VENDOR_PAYMENT = 'vendorpayment';
    this.VENDOR_PREPAYMENT = 'vendorprepayment';
    this.VENDOR_PREPAYMENT_APPLICATION = 'vendorprepaymentapplication';
    this.VENDOR_RETURN_AUTHORIZATION = 'vendorreturnauthorization';
    this.VENDOR_SUBSIDIARY_RELATIONSHIP = 'vendorsubsidiaryrelationship';
    this.WAVE = 'wave';
    this.WBS = 'wbs';
    this.WEBSITE = 'website';
    this.WORKFLOW_ACTION_SCRIPT = 'workflowactionscript';
    this.WORK_ORDER = 'workorder';
    this.WORK_ORDER_CLOSE = 'workorderclose';
    this.WORK_ORDER_COMPLETION = 'workordercompletion';
    this.WORK_ORDER_ISSUE = 'workorderissue';
    this.WORKPLACE = 'workplace';
    this.ZONE = 'zone';
}
record.prototype.Type = recordType;

/**
 * Primary object used to encapsulate a record object.
 *
 * @protected
 * @param {Object} options
 * @param {Object} options.recordObj (server-generated object holding the full metadata and data for a record type,
 *     including all scripting and customization. See RecordSerializationKey.java)
 * @param {number} options.recordObj.id
 * @param {boolean} options.recordObj.isSubrecord = true if the record instance is a subrecord
 * @param {boolean} options.recordObj.isReadOnly = true if the record instance is read only instance
 * @param {boolean} options.recordObj.isDynamic = true if the record instance is a dynamic record
 * @param {boolean} options.recordObj.isCurrentRecord
 * @param {boolean} options.recordObj.isUserEvent
 * @param {Object} options.recordObj.recordContext
 * @param {Metadata} options.recordObj.metadata (record metadata data used to populate the model controller)
 * @param {ModelController} options.recordObj.data (record data used to populate the model)
 * @param {RecordStateController} options.recordObj.state (record state to use to pre-populate the model controller)
 * @return {Record} client-side record implementation
 * @constructor
 *
 * @since 2015.2
 */
function Record() {
    
    /**
     * return array of names of all body fields, including machine header field and matrix header fields
     * @governance none
     * @return {string[]}
     *
     * @since 2015.2
     */    
    this.prototype.getFields = function() {};    
    
    /**
     * return array of names of all sublists
     * @governance none
     * @return {string[]}
     *
     * @since 2015.2
     */    
    this.prototype.getSublists = function() {};    
    
    /**
     * Returns the value of a field. Gets a numeric value for rate and ratehighprecision fields.
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_API_USAGE if invoked after using setText
     *
     * @since 2015.2
     */    
    this.prototype.getValue = function(options) {};    
    
    /**
     * set value of the field
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @param {number|Date|string|Array|boolean} options.value The value to set the field to.
     * @param {boolean} [options.ignoreFieldChange=false] Ignore the field change script
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     *
     * @since 2015.2
     */    
    this.prototype.setValue = function(options) {};    
    
    /**
     * get value of the field in text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @return {string}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     *
     * @since 2015.2
     */    
    this.prototype.getText = function(options) {};    
    
    /**
     * set value of the field by text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The internal ID of a standard or custom body field.
     * @param {string} options.text ----- The text or texts to change the field value to.
     *    If the field type is multiselect: - This parameter accepts an array of string values. - This parameter accepts a
     *     null value. Passing in null deselects all currentlsy selected values. If the field type is not multiselect: this
     *     parameter accepts only a single string value.
     * @param {boolean} [options.ignoreFieldChange=false] ignore field change script and slaving event if set to true
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if fieldId is missing or undefined
     *
     * @since 2015.2
     */    
    this.prototype.setText = function(options) {};    
    
    /**
     * return the line number for the first occurrence of a field value in a sublist and return -1 if not found
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId The internal ID of the sublist.
     * @param {string} options.fieldId
     * @param {(number|Date|string|Array|boolean)} options.value
     * @return {number}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or field is missing
     *
     * @since 2015.2
     */    
    this.prototype.findSublistLineWithValue = function(options) {};    
    
    /**
     * return value of a sublist field
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     * @throws {SuiteScriptError} SSS_INVALID_API_USAGE if invoked after using setSublistText
     *
     * @since 2015.2
     */    
    this.prototype.getSublistValue = function(options) {};    
    
    /**
     * set the value of a sublist field (available for deferred dynamic only)
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @param {(number|Date|string|Array|boolean)} options.value
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     *
     * @since 2015.2
     */    
    this.prototype.setSublistValue = function(options) {};    
    
    /**
     * return value of a sublist field in text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @return {string}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     * @throws {SuiteScriptError} SSS_INVALID_API_USAGE if invoked prior using setSublistText
     *
     * @since 2015.2
     */    
    this.prototype.getSublistText = function(options) {};    
    
    /**
     * set the value of a sublist field in text representation (available for deferred dynamic only)
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @param {string} options.text
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId, fieldId, or line is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id, field id, or line number
     *
     * @since 2015.2
     */    
    this.prototype.setSublistText = function(options) {};    
    
    /**
     * return line count of sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {number}
     *
     * @since 2015.2
     */    
    this.prototype.getLineCount = function(options) {};    
    
    /**
     * insert a sublist line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {number} options.line
     * @param {string} options.beforeLineInstanceId
     * @param {boolean} [ignoreRecalc=false] options.ignoreRecalc ignore recalc scripting
     * @return {Line} [new line object]
     * @throws {SuiteScriptError} MUTUALLY_EXCLUSIVE_ARGUMENTS if both line and beforeLineInstanceId are provided
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or both line and beforeLineInstanceId
     *     are missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if sublistId or line index is invalid or if machine is not
     *     editable or before exists and before is an instanceId that does not point to a line in the sublist.
     *
     * @since 2015.2
     */    
    this.prototype.insertLine = function(options) {};    
    
    /**
     * remove a sublist line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {number} options.line
     * @param {string} options.lineInstanceId
     * @param {boolean} [ignoreRecalc=false] options.ignoreRecalc ignore recalc scripting
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} MUTUALLY_EXCLUSIVE_ARGUMENTS if both line and lineInstanceId are provided
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or both line and lineInstanceId are
     *     missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if sublistId or line index is invalid or if machine is not
     *     editable
     *
     * @since 2015.2
     */    
    this.prototype.removeLine = function(options) {};    
    
    /**
     * select a new line at the end of sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Line} [new line object]
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id or sublist is not editable
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */    
    this.prototype.selectNewLine = function(options) {};    
    
    /**
     * cancel the current selected line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if sublistId is invalid or if machine is not editable
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */    
    this.prototype.cancelLine = function(options) {};    
    
    /**
     * commit the current selected line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId is missing or undefined
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */    
    this.prototype.commitLine = function(options) {};    
    
    /**
     * return value of a sublist field on the current selected sublist line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id or field id
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */    
    this.prototype.getCurrentSublistValue = function(options) {};    
    
    /**
     * set the value for field in the current selected line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {(number|Date|string|Array|boolean)} options.value
     * @param {boolean} [options.ignoreFieldChange=false] ignore field change script and slaving event if set to true
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} A_SCRIPT_IS_ATTEMPTING_TO_EDIT_THE_1_SUBLIST_THIS_SUBLIST_IS_CURRENTLY_IN_READONLY_MODE_AND_CANNOT_BE_EDITED_CALL_YOUR_NETSUITE_ADMINISTRATOR_TO_DISABLE_THIS_SCRIPT_IF_YOU_NEED_TO_SUBMIT_THIS_RECORD
     *     if user tries to edit readonly sublist field
     *
     * @since 2015.2
     */    
    this.prototype.setCurrentSublistValue = function(options) {};    
    
    /**
     * return the value for field in the current selected line by text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @return {(number|Date|string|Array|boolean)}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if invalid sublist id or field id
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */    
    this.prototype.getCurrentSublistText = function(options) {};    
    
    /**
     * set the value for field in the current selected line by text representation
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {(number|Date|string|Array|boolean)} options.text
     * @param {boolean} [options.ignoreFieldChange=false] ignore field change script and slaving event if set to true
     * @return {Record} same record, for chaining
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} A_SCRIPT_IS_ATTEMPTING_TO_EDIT_THE_1_SUBLIST_THIS_SUBLIST_IS_CURRENTLY_IN_READONLY_MODE_AND_CANNOT_BE_EDITED_CALL_YOUR_NETSUITE_ADMINISTRATOR_TO_DISABLE_THIS_SCRIPT_IF_YOU_NEED_TO_SUBMIT_THIS_RECORD
     *     if user tries to edit readonly sublist field
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */    
    this.prototype.setCurrentSublistText = function(options) {};    
    
    /**
     * save record updates to the system
     * @governance 20 units for transactions, 4 for custom records, 10 for all other records
     *
     * @param {Object} options
     * @param {boolean} [options.enableSourcing=false] enable sourcing during record update
     * @param {boolean} [options.ignoreMandatoryFields=false] ignore mandatory field during record submission
     * @return {number} id of submitted record
     *
     * @since 2015.2
     */    
    this.prototype.save = function(options) {};    
    this.save.promise = function(options) {};    
    
    /**
     * return a value indicating if the field has a subrecord
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {boolean}
     *
     * @since 2015.2
     */    
    this.prototype.hasSubrecord = function(options) {};    
    
    /**
     * get the subrecord for the associated field
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {Record} [client-side subrecord implementation]
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.fieldId is missing or undefined
     * @throws {SuiteScriptError} FIELD_1_IS_NOT_A_SUBRECORD_FIELD if field is not a subrecord field
     * @throws {SuiteScriptError} FIELD_1_IS_DISABLED_YOU_CANNOT_APPLY_SUBRECORD_OPERATION_ON_THIS_FIELD if field is disable
     *
     * @since 2015.2
     */    
    this.prototype.getSubrecord = function(options) {};    
    
    /**
     * remove the subrecord for the associated field
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {Record} same record, for chaining
     *
     * @2015.2
     */    
    this.prototype.removeSubrecord = function(options) {};    
    
    /**
     * return a value indicating if the associated sublist field has a subrecord
     * @goverannce 0
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @restriction only available in deferred dynamic record
     * @return {boolean}
     *
     * @since 2015.2
     */    
    this.prototype.hasSublistSubrecord = function(options) {};    
    
    /**
     * get the subrecord for the associated sublist field
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @restriction only available in deferred dynamic record
     * @return {Record} [client-side subrecord implementation]
     *
     * @since 2015.2
     */    
    this.prototype.getSublistSubrecord = function(options) {};    
    
    /**
     * remove the subrecord for the associated sublist field
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @restriction only available in deferred dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */    
    this.prototype.removeSublistSubrecord = function(options) {};    
    
    /**
     * return a value indicating if the associated sublist field has a subrecord on the current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @restriction only available in dynamic record
     * @return {boolean}
     *
     * @2015.2
     */    
    this.prototype.hasCurrentSublistSubrecord = function(options) {};    
    
    /**
     * get the subrecord for the associated sublist field on the current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @restriction only available in dynamic record
     * @return {Record} [client-side subrecord implementation]
     *
     * @since 2015.2
     */    
    this.prototype.getCurrentSublistSubrecord = function(options) {};    
    
    /**
     * remove the subrecord for the associated sublist field on the current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @restriction only available in dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */    
    this.prototype.removeCurrentSublistSubrecord = function(options) {};    
    
    /**
     * returns the specified sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Sublist} [requested sublist]
     *
     * @since 2015.2
     */    
    this.prototype.getSublist = function(options) {};    
    
    /**
     * return array of names of all fields in a sublist﻿
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @return {Array}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.sublistId is missing or undefined﻿
     *
     * @since 2015.2
     */    
    this.prototype.getSublistFields = function(options) {};    
    
    /**
     * return field object from record
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId
     * @return {Field}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if options.fieldId is missing or undefined
     *
     * @since 2015.2
     */    
    this.prototype.getField = function(options) {};    
    
    /**
     * return field object from record's sublist
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @param {number} options.line
     * @return {Field} [requested field]
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @throws {SuiteScriptError} SSS_INVALID_SUBLIST_OPERATION if line number is invalid
     *
     * @since 2015.2
     */    
    this.prototype.getSublistField = function(options) {};    
    
    /**
     * return field object from record's sublist current line
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId
     * @param {string} options.fieldId
     * @return {Field}
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if sublistId or fieldId is missing
     * @restriction only available in dynamic record
     *
     * @since 2015.2
     */    
    this.prototype.getCurrentSublistField = function(options) {};    
    
    /**
     * set the value for the associated header in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @param {string} options.value the value to set it to
     * @param {boolean} [options.ignoreFieldChange] Ignore the field change script (default false)
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */    
    this.prototype.setMatrixHeaderValue = function(options) {};    
    
    /**
     * get the value for the associated header in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number|Date|string}
     *
     * @since 2015.2
     */    
    this.prototype.getMatrixHeaderValue = function(options) {};    
    
    /**
     * set the value for the associated field in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.line the line number for the field
     * @param {number} options.column the column number for the field
     * @param {string} options.value the value to set it to
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @restriction only available in deferred dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */    
    this.prototype.setMatrixSublistValue = function(options) {};    
    
    /**
     * get the value for the associated field in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.line the line number for the field
     * @param {number} options.column the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number|Date|string}
     *
     * @since 2015.2
     */    
    this.prototype.getMatrixSublistValue = function(options) {};    
    
    /**
     * get the field for the specified header in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {Field} [requested field]
     *
     * @since 2015.2
     */    
    this.prototype.getMatrixHeaderField = function(options) {};    
    
    /**
     * get the field for the specified sublist in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.column the column number for the field
     * @param {number} options.line the line number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {Field} [requested field]
     *
     * @since 2015.2
     */    
    this.prototype.getMatrixSublistField = function(options) {};    
    
    /**
     * returns the line number of the first line that contains the specified value in the specified column of the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @param {number} options.value the column number for the field
     * @param {number} options.column the line number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number}
     *
     * @since 2015.2
     */    
    this.prototype.findMatrixSublistLineWithValue = function(options) {};    
    
    /**
     * returns the number of columns for the specified matrix.
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId the id of sublist in which the matrix is in.
     * @param {string} options.fieldId the id of the matrix field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @return {number}
     *
     * @since 2015.2
     */    
    this.prototype.getMatrixHeaderCount = function(options) {};    
    
    /**
     * set the value for the line currently selected in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId - the id of sublist in which the matrix is in.
     * @param {string} options.fieldId - the id of the matrix field
     * @param {number} options.column - the column number for the field
     * @param {string} options.value - the value to set it to
     * @param {boolean} options.ignoreFieldChange (optional) - Ignore the field change script (default false)
     * @param {boolean} options.fireSlavingSync (optional) - Flag to perform slaving synchronously (default false)
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @restriction only available in dynamic record
     * @return {Record} same record, for chaining
     *
     * @since 2015.2
     */    
    this.prototype.setCurrentMatrixSublistValue = function(options) {};    
    
    /**
     * get the value for the line currently selected in the matrix
     * @governance none
     * @param {Object} options
     * @param {string} options.sublistId - the id of sublist in which the matrix is in.
     * @param {string} options.fieldId - the id of the matrix field
     * @param {number} options.column - the column number for the field
     * @throws {SuiteScriptError} SSS_MISSING_REQD_ARGUMENT if any required values are missing
     * @restriction only available in dynamic record
     * @return {number|Date|string}
     *
     * @since 2015.2
     */    
    this.prototype.getCurrentMatrixSublistValue = function(options) {};    
}

/**
 * Primary object used to encapsulate a record sublist line object.
 *
 * @protected
 * @param {Object} options
 * @param {Record} options.unproxiedRecord - Instance of recordDefinition that owns the Line object.
 * @param {string} options.sublistId
 * @param {string} options.lineInstanceId
 * @param {boolean} options.fromBuffer
 * @param {boolean} options.isReadOnly
 * @return {Line}
 * @constructor
 */
function Line() {
}

/**
 * Return a new instance of sublist object
 *
 * @param {Object} sublist
 * @param {string} sublist.type type of sublist
 * @param {SublistState} sublist.sublistState SublistState

 * @return {Sublist}
 * @constructor
 *
 * @since 2015.2
 */
function Sublist() {
    
    /**
     * The name of the sublist.
     * @name Sublist#name
     * @type string
     * @readonly
     */    
    this.prototype.getName = function() {};    
    
    /**
     * The type of the sublist.
     * @name Sublist#type
     * @type string
     * @readonly
     */    
    this.prototype.getType = function() {};    
    
    /**
     * The sublist is changed
     * @name Sublist#isChanged
     * @type boolean
     * @readonly
     */    
    this.prototype.isChanged = function() {};    
    
    /**
     * The sublist is hidden
     * @name Sublist#isHidden
     * @type boolean
     * @readonly
     */    
    this.prototype.isHidden = function() {};    
    
    /**
     * The sublist is display
     * @name Sublist#isDisplay
     * @type boolean
     * @readonly
     */    
    this.prototype.isDisplay = function() {};    
    
    /**
     * A flag to indicate whether or not the sublist supports multi-line buffer feature.
     * @name Sublist#isMultilineEditable
     * @type boolean
     * @readonly
     */    
    this.prototype.isMultilineEditable = function() {};    
    
    /**
     * Returns the object type name (sublist.Sublist)
     * @returns {string}
     */    
    this.prototype.toString = function() {};    
    
    /**
     * JSON.stringify() implementation.
     * @returns {{id: string, type: string, isChanged: boolean, isDisplay: boolean}}
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @protected
 * @constructor
 */
function Field() {
    
    /**
     * Return label of the field
     * @name Field#label
     * @type string
     * @readonly
     * @since 2015.2
     */    
    this.prototype.label = undefined;    
    /**
     * Return id of the field
     * @name Field#id
     * @type string
     * @readonly
     * @since 2015.2
     */    
    this.prototype.id = undefined;    
    /**
     * Disabled state of the field
     * @name Field#isDisabled
     * @type boolean
     * @since 2015.2
     */    
    this.prototype.isDisabled = undefined;    
    /**
     * Display state of the field
     * @name Field#isDisplay
     * @type boolean
     * @since 2015.2
     */    
    this.prototype.isDisplay = undefined;    
    /**
     * Mandatory state of the field
     * @name Field#isMandatory
     * @type boolean
     * @since 2015.2
     */    
    this.prototype.isMandatory = undefined;    
    /**
     * Read Only state of the field
     * @name Field#isReadOnly
     * @type boolean
     * @since 2015.2
     */    
    this.prototype.isReadOnly = undefined;    
    /**
     * Visible state of the field
     * @name Field#isVisible
     * @type boolean
     * @since 2015.2
     */    
    this.prototype.isVisible = undefined;    
    /**
     * Return type of the field
     * @name Field#type
     * @type string
     * @readonly
     * @since 2015.2
     */    
    this.prototype.type = undefined;    
    /**
     * Return the sublistId of the field
     * @name Field#sublistId
     * @type string
     * @readonly
     * @since 2015.2
     */    
    this.prototype.sublistId = undefined;    
    /**
     * Returns if the field is a popup
     * @name Field#isPopup
     * @type boolean
     * @readonly
     * @since 2015.2
     */    
    this.prototype.isPopup = undefined;    
    /**
     * get JSON format of the object
     * @return {{id: *, label: *, type: *}}
     *
     */    
    this.prototype.toJSON = function() {};    
    
    /**
     * @return {string}
     *
     */    
    this.prototype.toString = function() {};    
}

record = new record();
/**
 * @type {record}
 */
N.prototype.record = record;