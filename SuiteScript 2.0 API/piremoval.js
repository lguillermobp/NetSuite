/**
 * SuiteScript module
 *
 * @module N/piremoval
 * @NApiVersion 2.x
 *
 */
function piremoval() {}
/**
 * Enum status values.
 * @readonly
 * @enum {string}
 */
function piremovalStatus() {
    this.CREATED = 'CREATED';
    this.PENDING = 'PENDING';
    this.COMPLETE = 'COMPLETE';
    this.ERROR = 'ERROR';
    this.DELETED = 'DELETED';
    this.NOT_APPLIED = 'NOT_APPLIED';
}
piremoval.prototype.Status = piremovalStatus;

/**
 * @protected
 * @constructor
 */
function PiRemovalTaskLogItem() {
    
    /**
     * Type
     * @name PiRemovalTaskLogItem#type
     * @type string
     * @since 2019.2
     */    
    this.prototype.type = undefined;    
    /**
     * Status
     * @name PiRemovalTaskLogItem#status
     * @type string
     * @since 2019.2
     */    
    this.prototype.status = undefined;    
    /**
     * Message
     * @name PiRemovalTaskLogItem#message
     * @type string
     * @since 2019.2
     */    
    this.prototype.message = undefined;    
    /**
     * Exception
     * @name PiRemovalTaskLogItem#exception
     * @type string
     * @since 2019.2
     */    
    this.prototype.exception = undefined;    
    /**
     * get JSON format of the object
     * @returns {Object}
     */    
    this.prototype.toJSON = function() {};    
    
    /**
     * @returns {string}
     */    
    this.prototype.toString = function() {};    
}

/**
 * @protected
 * @constructor
 */
function PiRemovalTask() {
    
    /**
     * Task id
     * @name PiRemovalTask#id
     * @type string
     * @since 2019.2
     */    
    this.prototype.id = undefined;    
    /**
     * Record Type
     * @name PiRemovalTask#recordType
     * @type string
     * @since 2019.2
     */    
    this.prototype.recordType = undefined;    
    /**
     * Record Ids
     * @name PiRemovalTask#recordIds
     * @type string[]
     * @since 2019.2
     */    
    this.prototype.recordIds = undefined;    
    /**
     * Field Ids
     * @name PiRemovalTask#fieldIds
     * @type string[]
     * @since 2019.2
     */    
    this.prototype.fieldIds = undefined;    
    /**
     * Workflow ids
     * @name PiRemovalTask#workflowIds
     * @type string[]
     * @since 2019.2
     */    
    this.prototype.workflowIds = undefined;    
    /**
     * History Only flag
     * @name PiRemovalTask#historyOnly
     * @type boolean
     * @since 2019.2
     */    
    this.prototype.historyOnly = undefined;    
    /**
     * History Replacement
     * @name PiRemovalTask#historyReplacement
     * @type string
     * @since 2019.2
     */    
    this.prototype.historyReplacement = undefined;    
    /**
     * Status
     * @name PiRemovalTask#status
     * @type PiRemovalTaskStatus
     * @since 2019.2
     */    
    this.prototype.status = undefined;    
    /**
     * Save
     * @returns {undefined}
     * @since 2019.2
     */    
    this.prototype.save = function() {};    
    
    /**
     * Delete
     * @returns {undefined}
     * @since 2019.2
     */    
    this.prototype.deleteTask = function() {};    
    
    /**
     * Run
     * @returns {undefined}
     * @since 2019.2
     */    
    this.prototype.run = function() {};    
    
    /**
     * get JSON format of the object
     * @returns {Object}
     */    
    this.prototype.toJSON = function() {};    
    
    /**
     * @returns {string}
     */    
    this.prototype.toString = function() {};    
}

/**
 * @protected
 * @constructor
 */
function PiRemovalTaskStatus() {
    
    /**
     * Status
     * @name PiRemovalTaskStatus#status
     * @type string
     * @since 2019.2
     */    
    this.prototype.status = undefined;    
    /**
     * Log List
     * @name PiRemovalTaskStatus#logList
     * @type list
     * @since 2019.2
     */    
    this.prototype.logList = undefined;    
    /**
     * get JSON format of the object
     * @returns {Object}
     */    
    this.prototype.toJSON = function() {};    
    
    /**
     * @returns {string}
     */    
    this.prototype.toString = function() {};    
}

piremoval = new piremoval();
/**
 * @type {piremoval}
 */
N.prototype.piremoval = piremoval;