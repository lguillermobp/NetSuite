/**
 * SuiteScript new-generation query common module
 * Load the N/query module to create and run queries using the SuiteAnalytics Workbook query engine.
 *
 * @module N/query
 * @suiteScriptVersion 2.x
 */
function query() {}
/**
 * Creates a query.Query object.
 * @governance none
 * @param {Object} options The options object.
 * @param {string} options.type The query type that you want to use for the initial query definition.
 * @param {Object[]} [options.columns] Array of objects to be used as query columns (createColumn method will be called on all of them).
 * @param {Object[]} [options.sort] Array of objects representing sort options (createColumn and createSort methods will be called on all of them).
 * @param {Object} [options.condition] Condition of query (createCondition method will be called on supplied object).
 * @return {Query}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or type are undefined.
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If options isn't object or id isn't string.
 * @throws {SuiteScriptError} INVALID_RCRD_TYPE The specified query type is invalid.
 *
 * @since 2018.1
 */
query.prototype.create = function(options) {};

/**
 * Runs suiteQL query, parameter can be string, suiteQL object or object containing properties query and (optionally) params
 * @governance 10 units
 * @param {Object} options
 * @param {String} options.query String representation of SuiteQL query
 * @param {string[]|number[]|boolean[]} [options.params]
 * @return {ResultSet}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT if options or query are undefined
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if there's parameter of different type than string/number/boolean in params array
 *
 * @since 2018.2
 */
query.prototype.runSuiteQL = function(options) {};
query.runSuiteQL.promise = function(options) {};

/**
 * Execute the suiteQL query and return paged results.
 * @governance 10 units
 * @param {Object} options
 * @param {String} options.query String representation of SuiteQL query
 * @param {string[]|number[]|boolean[]} [options.params]
 * @return {PagedData}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT if options or query are undefined
 * @throws {SuiteScriptError} SSS_INVALID_TYPE_ARG if there's parameter of different type than string/number/boolean in params array
 *
 * @since 2020.1
 */
query.prototype.runSuiteQLPaged = function(options) {};
query.runSuiteQLPaged.promise = function(options) {};

/**
 * Loads an existing query as a query.Query object.
 * @governance 5 units
 * @param {Object} options The options object.
 * @param {string} options.id The script ID of the query to load.
 * @return {Query}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or id are undefined.
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If options isn't object or id isn't string.
 * @throws {SuiteScriptError} A query with the specified ID cannot be loaded because the query does not exist or you do not have permission to load it.
 *
 * @since 2018.1
 */
query.prototype.load = function(options) {};
query.load.promise = function(options) {};

/**
 * Lists table views for specified workbook
 * @governance 5 units
 * @typedef {Object} TableDefinition
 * @property {string} name - Name of the table view
 * @property {string} scriptId - Script id of the table view
 * @param {string} workbookId Script id of a workbook
 * @return {TableDefinition[]} Array of table views present in workbook with given script id
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If workbookId parameter is missing
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If workbookId parameter isn't string
 *
 * @since 2020.1
 */
query.prototype.listTables = function(options) {};
query.listTables.promise = function(options) {};

/**
 * Deletes query by id
 * @governance 5 units
 * @param {Object} options
 * @param {string} options.id Id of query to be delete
 * @return {void}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or id are undefined.
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If options isn't object or id isn't string.
 * @throws {SuiteScriptError} UNABLE_TO_DELETE_QUERY A query with the specified ID cannot be deleted because the query does not exist or you do not have permission to delete it.
 *
 * @since 2018.2
 */
query.prototype['delete'] = function(options) {};
query['delete'].promise = function(options) {};

/**
 * Creates a query.RelativeDate object that represents a date relative to the current date.
 * @governance none
 * @param {Object} options
 * @param {string} options.dateId The ID of the relative date to create.
 * @param {number} options.value The value to use to create the relative date.
 * @return {RelativeDate}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or id are undefined.
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If options isn't object or id isn't string.
 *
 * @since 2019.2
 */
query.prototype.createRelativeDate = function(options) {};

/**
 * Creates a query.Period object, which can be used as a filter value
 * @governance none
 * @param {Object} options
 * @param {string} options.code code of the period
 * @param {string} [options.type] type of the period
 * @param {string} [options.adjustment] adjustment of the period
 * @return {Period}
 * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options or code are undefined.
 * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If any of the parameters is not string
 * @throws {SuiteScriptError} INVALID_PERIOD_TYPE If type is a value outside of PeriodType enum
 * @throws {SuiteScriptError} INVALID_PERIOD_ADJUSTMENT If adjustment is a value outside of PeriodAdjustment enum
 * @throws {SuiteScriptError} INVALID_PERIOD_CODE If code is a value outside of PediodCode enum
 *
 * @since 2020.1
 */
query.prototype.createPeriod = function(options) {};

/**
 * Holds the string values for operators supported with the N/query Module. This enum is used to pass the operator argument to Query.createCondition(options) and Component.createCondition(options).
 * @enum {string}
 * @readonly
 */
function queryOperator() {
    this.AFTER = 'AFTER';
    this.AFTER_NOT = 'AFTER_NOT';
    this.ANY_OF = 'ANY_OF';
    this.ANY_OF_NOT = 'ANY_OF_NOT';
    this.BEFORE = 'BEFORE';
    this.BEFORE_NOT = 'BEFORE_NOT';
    this.BETWEEN = 'BETWEEN';
    this.BETWEEN_NOT = 'BETWEEN_NOT';
    this.CONTAIN = 'CONTAIN';
    this.CONTAIN_NOT = 'CONTAIN_NOT';
    this.EMPTY = 'EMPTY';
    this.EMPTY_NOT = 'EMPTY_NOT';
    this.ENDWITH = 'ENDWITH';
    this.ENDWITH_NOT = 'ENDWITH_NOT';
    this.EQUAL = 'EQUAL';
    this.EQUAL_NOT = 'EQUAL_NOT';
    this.GREATER = 'GREATER';
    this.GREATER_NOT = 'GREATER_NOT';
    this.GREATER_OR_EQUAL = 'GREATER_OR_EQUAL';
    this.GREATER_OR_EQUAL_NOT = 'GREATER_OR_EQUAL_NOT';
    this.IS = 'IS';
    this.IS_NOT = 'IS_NOT';
    this.LESS = 'LESS';
    this.LESS_NOT = 'LESS_NOT';
    this.LESS_OR_EQUAL = 'LESS_OR_EQUAL';
    this.LESS_OR_EQUAL_NOT = 'LESS_OR_EQUAL_NOT';
    this.ON = 'ON';
    this.ON_NOT = 'ON_NOT';
    this.ON_OR_AFTER = 'ON_OR_AFTER';
    this.ON_OR_AFTER_NOT = 'ON_OR_AFTER_NOT';
    this.ON_OR_BEFORE = 'ON_OR_BEFORE';
    this.ON_OR_BEFORE_NOT = 'ON_OR_BEFORE_NOT';
    this.START_WITH = 'START_WITH';
    this.START_WITH_NOT = 'START_WITH_NOT';
    this.WITHIN = 'WITHIN';
    this.WITHIN_NOT = 'WITHIN_NOT';
}
query.prototype.Operator = queryOperator;

/**
 * Holds the string values for aggregate functions supported with the N/query Module. An aggregate function performs a calculation on the column or condition values and returns a single value.
 * @enum {string}
 * @readonly
 */
function queryAggregate() {
    this.AVERAGE = 'AVERAGE';
    this.AVERAGE_DISTINCT = 'AVERAGE_DISTINCT';
    this.COUNT = 'COUNT';
    this.COUNT_DISTINCT = 'COUNT_DISTINCT';
    this.MEDIAN = 'MEDIAN';
    this.MAXIMUM = 'MAXIMUM';
    this.MAXIMUM_DISTINCT = 'MAXIMUM_DISTINCT';
    this.MINIMUM = 'MINIMUM';
    this.MINIMUM_DISTINCT = 'MINIMUM_DISTINCT';
    this.SUM = 'SUM';
    this.SUM_DISTINCT = 'SUM_DISTINCT';
}
query.prototype.Aggregate = queryAggregate;

/**
 * Holds the string values for the formula return types supported with the N/query Module.
 * @enum {string}
 * @readonly
 */
function queryReturnType() {
    this.BOOLEAN = 'BOOLEAN';
    this.DATE = 'DATE';
    this.DATETIME = 'DATETIME';
    this.FLOAT = 'FLOAT';
    this.INTEGER = 'INTEGER';
    this.STRING = 'STRING';
    this.DURATION = 'DURATION';
    this.CURRENCY = 'CURRENCY';
    this.KEY = 'KEY';
    this.RELATIONSHIP = 'RELATIONSHIP';
    this.ANY = 'ANY';
    this.PERCENT = 'PERCENT';
    this.UNKNOWN = 'UNKNOWN';
}
query.prototype.ReturnType = queryReturnType;

/**
 * Holds query.RelativeDate object values for supported date ranges in relative dates.
 * @enum {string}
 * @readonly
 */
query.prototype.RelativeDateRange = function() {};

/**
 * Holds the string values for supported date codes in relative dates.
 * @enum {string}
 * @readonly
 */
function queryDateId() {
    this.SECONDS_AGO = 'sago';
    this.MINUTES_AGO = 'nago';
    this.HOURS_AGO = 'hago';
    this.DAYS_AGO = 'dago';
    this.WEEKS_AGO = 'wago';
    this.MONTHS_AGO = 'mago';
    this.QUARTERS_AGO = 'qago';
    this.YEARS_AGO = 'yago';
    this.SECONDS_FROM_NOW = 'sfn';
    this.MINUTES_FROM_NOW = 'nfn';
    this.HOURS_FROM_NOW = 'hfn';
    this.DAYS_FROM_NOW = 'dfn';
    this.WEEKS_FROM_NOW = 'wfn';
    this.MONTHS_FROM_NOW = 'mfn';
    this.QUARTERS_FROM_NOW = 'qfn';
    this.YEARS_FROM_NOW = 'yfn';
}
query.prototype.DateId = queryDateId;

/**
 * Holds the string values for the field context to use when creating a column using Query.createColumn(options) or Component.createColumn(options).
 * @enum {string}
 * @readonly
 */
function queryFieldContext() {
    this.RAW = 'RAW';
    this.DISPLAY = 'DISPLAY';
    this.HIERARCHY = 'HIERARCHY';
    this.HIERARCHY_IDENTIFIER = 'HIERARCHY_IDENTIFIER';
    this.SIGN_CONSOLIDATED = 'SIGN_CONSOLIDATED';
    this.CURRENCY_CONSOLIDATED = 'CURRENCY_CONSOLIDATED';
    this.CONVERTED = 'CONVERTED';
}
query.prototype.FieldContext = queryFieldContext;

/**
 * Holds the string values for possible period types (START, END)
 * @enum {string}
 * @readonly
 */
function queryPeriodType() {
    this.START = 'START';
    this.END = 'END';
}
query.prototype.PeriodType = queryPeriodType;

/**
 * Holds the string values for possible period adjustments (NOT_LAST, ALL)
 * @enum {string}
 * @readonly
 */
function queryPeriodAdjustment() {
    this.NOT_LAST = 'NOT_LAST';
    this.ALL = 'ALL';
}
query.prototype.PeriodAdjustment = queryPeriodAdjustment;

/**
 * Holds the string values for possible period codes
 * @enum {string}
 * @readonly
 */
function queryPeriodCode() {
    this.FIRST_FISCAL_QUARTER_LAST_FY = 'Q1LFY';
    this.FIRST_FISCAL_QUARTER_THIS_FY = 'Q1TFY';
    this.FISCAL_QUARTER_BEFORE_LAST = 'QBL';
    this.FISCAL_YEAR_BEFORE_LAST = 'FYBL';
    this.FOURTH_FISCAL_QUARTER_LAST_FY = 'Q4LFY';
    this.FOURTH_FISCAL_QUARTER_THIS_FY = 'Q4TFY';
    this.LAST_FISCAL_QUARTER = 'LQ';
    this.LAST_FISCAL_QUARTER_ONE_FISCAL_YEAR_AGO = 'LQOLFY';
    this.LAST_FISCAL_QUARTER_TO_PERIOD = 'LFQTP';
    this.LAST_FISCAL_YEAR = 'LFY';
    this.LAST_FISCAL_YEAR_TO_PERIOD = 'LFYTP';
    this.LAST_PERIOD = 'LP';
    this.LAST_PERIOD_ONE_FISCAL_QUARTER_AGO = 'LPOLQ';
    this.LAST_PERIOD_ONE_FISCAL_YEAR_AGO = 'LPOLFY';
    this.LAST_ROLLING_18_PERIODS = 'LR18FP';
    this.LAST_ROLLING_6_FISCAL_QUARTERS = 'LR6FQ';
    this.PERIOD_BEFORE_LAST = 'PBL';
    this.SAME_FISCAL_QUARTER_LAST_FY = 'TQOLFY';
    this.SAME_FISCAL_QUARTER_LAST_FY_TO_PERIOD = 'TFQOLFYTP';
    this.SAME_PERIOD_LAST_FY = 'TPOLFY';
    this.SAME_PERIOD_LAST_FISCAL_QUARTER = 'TPOLQ';
    this.SECOND_FISCAL_QUARTER_LAST_FY = 'Q2LFY';
    this.SECOND_FISCAL_QUARTER_THIS_FY = 'Q2TFY';
    this.THIRD_FISCAL_QUARTER_LAST_FY = 'Q3LFY';
    this.THIRD_FISCAL_QUARTER_THIS_FY = 'Q3TFY';
    this.THIS_FISCAL_QUARTER = 'TQ';
    this.THIS_FISCAL_QUARTER_TO_PERIOD = 'TFQTP';
    this.THIS_FISCAL_YEAR = 'TFY';
    this.THIS_FISCAL_YEAR_TO_PERIOD = 'TFYTP';
    this.THIS_PERIOD = 'TP';
}
query.prototype.PeriodCode = queryPeriodCode;

/**
 * Holds the string values for sort locales supported with the N/query Module. This enum is used to pass the locale argument to Query.createSort(options) and Component.createSort(options).
 * @enum {string}
 * @readonly
 */
query.prototype.SortLocale = function() {};

/**
 * Holds the string values for query types used in the query definition. This enum is used to pass the initial query type argument to query.create(options).
 * @enum {string}
 * @readonly
 */
query.prototype.Type = function() {};

/**
 * @class Period
 * @classDescription Special object which can be used as a condition while querying periods
 * @constructor
 *
 * @since 2020.1
 */
function Period() {
    
    /**
     * Code of the Period
     * @name Period#code
     * @type {string}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2020.1
     */    
    this.prototype.code = undefined;    
    /**
     * Type of the Period
     * @name Period#type
     * @type {string}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2020.1
     */    
    this.prototype.type = undefined;    
    /**
     * Adjustment of the Period
     * @name Period#adjustment
     * @type {string}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2020.1
     */    
    this.prototype.adjustment = undefined;    
    /**
     * Returns the object type name (query.Period)
     * @governance none
     * @return {string}
     *
     * @since 2020.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class RelativeDate
 * @classDescription Special object which can be used as a condition while querying dates
 * @constructor
 * @protected
 *
 * @since 2019.1
 */
function RelativeDate() {
    
    /**
     * Start of relative date
     * @name RelativeDate#start
     * @type {Object}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2019.1
     */    
    this.prototype.start = undefined;    
    /**
     * End of relative date
     * @name RelativeDate#end
     * @type {Object}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2019.1
     */    
    this.prototype.end = undefined;    
    /**
     * Interval of relative date
     * @name RelativeDate#interval
     * @type {Object}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2019.1
     */    
    this.prototype.interval = undefined;    
    /**
     * Value of relative date
     * @name RelativeDate#value
     * @type {Object}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2019.1
     */    
    this.prototype.value = undefined;    
    /**
     * Flag if this relative date represents range
     * @name RelativeDate#isRange
     * @type {Boolean}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2019.1
     */    
    this.prototype.isRange = undefined;    
    /**
     * Id of relative date
     * @name RelativeDate#dateId
     * @type {Object}
     * @throws {SuiteScriptError} READ_ONLY_PROPERTY when setting the property is attempted
     *
     * @since 2019.1
     */    
    this.prototype.dateId = undefined;    
    /**
     * Returns the object type name (query.RelativeDate)
     * @governance none
     * @return {string}
     *
     * @since 2019.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2019.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class SuiteQL
 * @classDescription Object representing query in SuiteQL
 * @constructor
 * @protected
 *
 * @since 2018.2
 */
function SuiteQL() {
    
    /**
     * String representation of SuiteQL
     * @name SuiteQL#query
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.2
     */    
    this.prototype.query = undefined;    
    /**
     * Parameters
     * @name SuiteQL#params
     * @type {string[]|number[]|boolean[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.2
     */    
    this.prototype.params = undefined;    
    /**
     * Columns to be returned from the query.
     * @name SuiteQL#columns
     * @type {Column[]}
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.2
     */    
    this.prototype.columns = undefined;    
    /**
     * Type of this SuiteQL query.
     * @name SuiteQL#type
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.2
     */    
    this.prototype.type = undefined;    
    /**
     * Execute the query and return results.
     * @governance 10 units
     * @return {ResultSet} the result set object
     *
     * @since 2018.2
     */    
    this.prototype.run = function(options) {};    
    this.run.promise = function(options) {};    
    
    /**
     * Execute the suiteQL query and return paged results.
     * @governance 10 units
     * @return {PagedData} the paged query object
     *
     * @since 2018.2
     */    
    this.prototype.runPaged = function(options) {};    
    this.runPaged.promise = function(options) {};    
    
    /**
     * Returns the object type name (query.Columns)
     * @governance none
     * @return {string}
     *
     * @since 2018.2
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.2
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class Query
 * @classDescription Encapsulates the query definition. Use query.create(options) or query.load(options) to create this object. The creation of this object is the first step in creating a query with the N/query Module.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function Query() {
    
    /**
     * Describes the initial query type of the query definition.
     * @name Query#type
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.type = undefined;    
    /**
     * References the simple or nested condition (a query.Condition object) that narrows the query results.
     * @name Query#condition
     * @type {Condition}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting value of different type than Query.Condition
     *
     * @since 2018.1
     */    
    this.prototype.condition = undefined;    
    /**
     * Holds an array of result columns (query.Column objects) returned from the query.
     * @name Query#columns
     * @type {Column[]}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting value of different type than Query.Column array
     *
     * @since 2018.1
     */    
    this.prototype.columns = undefined;    
    /**
     * Holds an array of query result columns (query.Column objects) used for sorting.
     * @name Query#sort
     * @type {Sort[]}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting value of different type than Query.Sort array
     *
     * @since 2018.1
     */    
    this.prototype.sort = undefined;    
    /**
     * Holds a references to children of this component. The value of this property is an object of key/value pairs. Each key is the name of a child component. Each respective value is the corresponding query.Component object.
     * @name Query#child
     * @type {Object}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.child = undefined;    
    /**
     * Holds the ID of the query definition.
     * @name Query#id
     * @type {Number}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.2
     */    
    this.prototype.id = undefined;    
    /**
     * Holds the name of the query definition.
     * @name Query#name
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.name = undefined;    
    /**
     * References the root component of the query definition.
     * @name Query#root
     * @type {Component}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.root = undefined;    
    /**
     * Executes the query and returns the query result set.
     * @governance 10 units
     * @return {ResultSet} the result set object
     *
     * @since 2018.1
     */    
    this.prototype.run = function(options) {};    
    this.run.promise = function(options) {};    
    
    /**
     * Executes the query and returns a set of paged results.
     * @governance 10 units
     * @param {Object} options the options object
     * @param {Number} options.pageSize
     * @return {PagedData} the paged query object
     *
     * @since 2018.1
     */    
    this.prototype.runPaged = function(options) {};    
    this.runPaged.promise = function(options) {};    
    
    /**
     * Creates a join relationship.
     * @link Component.autoJoin
     */    
    this.prototype.autoJoin = function() {};    
    
    /**
     * Creates a join relationship.
     * @link Component.join
     */    
    this.prototype.join = function() {};    
    
    /**
     * Creates an explicit directional join relationship to another component from this component (a polymorphic join). This method sets the Component.target property on the returned query.Component object.
     * @link Component.joinTo
     */    
    this.prototype.joinTo = function() {};    
    
    /**
     * Creates an explicit directional join relationship from another component to this component (an inverse join). This method sets the Component.source property on the returned query.Component object.
     * @link Component.joinFrom
     */    
    this.prototype.joinFrom = function() {};    
    
    /**
     * This method creates a condition (query filter) based on the query.Query object.
     * @link Component.createCondition
     */    
    this.prototype.createCondition = function() {};    
    
    /**
     * This method creates a query result column based on the query.Query object.
     * @link Component.createColumn
     */    
    this.prototype.createColumn = function() {};    
    
    /**
     * This method creates a sort based on the query.Query object. The query.Sort object describes a sort that is placed on a particular query result column.
     * @link Component.createSort
     */    
    this.prototype.createSort = function() {};    
    
    /**
     * Creates a new condition (a query.Condition object) that corresponds to a logical conjunction (AND) of the arguments passed to the method. The arguments must be one or more query.Condition objects.
     * @governance none
     * @param {Object} options The options object
     * @param {Condition[]} options.condition One or more condition objects. There is no limit on the number of conditions you can specify.
     * @return {Condition}
     *
     * @since 2018.1
     */    
    this.prototype.and = function(options) {};    
    
    /**
     * Creates a new condition (a query.Condition object) that corresponds to a logical disjunction (OR) of the arguments passed to the method. The arguments must be one or more query.Condition objects.
     * @governance none
     * @param {Object} options The options object
     * @param {Condition[]} options.condition One or more condition objects. There is no limit on the number of conditions you can specify.
     * @return {Condition}
     *
     * @since 2018.1
     */    
    this.prototype.or = function(options) {};    
    
    /**
     * Creates a new condition (a query.Condition object) that corresponds to a logical negation (NOT) of the argument passed to the method. The argument must be a query.Condition object.
     * @governance 0 units
     * @param {Condition} One condition object.
     * @return {Condition}
     *
     * @since 2018.1
     */    
    this.prototype.not = function(options) {};    
    
    /**
     * Converts a Query object to corresponding SuiteQL representation
     * @governance none
     * @return {SuiteQL}
     *
     * @since 2018.1
     */    
    this.prototype.toSuiteQL = function(options) {};    
    this.toSuiteQL.promise = function(options) {};    
    
    /**
     * Returns the object type name (query)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class Component
 * @classDescription Encapsulates one component of the query definition. Each new component is created as a child to the previous component. All components exist as children to the query definition (query.Query).
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function Component() {
    
    /**
     * Describes the query type of this component.
     * @name Component#type
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.type = undefined;    
    /**
     * Describes the query type of the component joined to this component. This property can also be described as the inverse relationship of this component.
     * @name Component#source
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.source = undefined;    
    /**
     * Describes the query type of this component. This property can also be described as the polymorphic relationship of this component.
     * @name Component#target
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.target = undefined;    
    /**
     * Holds a references to the parent query.Component object of this component.
     * @name Component#parent
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.parent = undefined;    
    /**
     * Holds a references to children of this component. The value of this property is an object of key/value pairs. Each key is the name of a child component. Each respective value refers to the corresponding query.Component object.
     * @name Component#child
     * @type {Object}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.child = undefined;    
    /**
     * Creates a join relationship.
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.fieldId The column type (field type) that joins the parent component to the new component.
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT if fieldId is undefined
     * @throws {SuiteScriptError} RELATIONSHIP_ALREADY_USED if relationship is already used
     * @return {Component}
     *
     * @since 2018.2
     */    
    this.prototype.autoJoin = function(options) {};    
    
    /**
     * Creates a join relationship. This method is an alias to Component.autoJoin(options).
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The column type (field type) that joins the parent component to the new component. This value determines the columns on which the components are joined and the type of the newly joined component.
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If fieldId is undefined.
     * @throws {SuiteScriptError} RELATIONSHIP_ALREADY_USED The specified join relationship already exists.
     * @return {Component}
     *
     * @since 2018.2
     */    
    this.prototype.join = function(options) {};    
    
    /**
     * Creates an explicit directional join relationship to another component from this component (a polymorphic join). This method sets the Component.target property on the returned query.Component object.
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The column type (field type) that joins the parent component to the new component.
     * @param {string} options.target The query type of the component joined to this component. This value sets the Component.target property.
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If fieldId is undefined.
     * @throws {SuiteScriptError} RELATIONSHIP_ALREADY_USED The specified join relationship already exists.
     * @return {Component}
     *
     * @since 2018.2
     */    
    this.prototype.joinTo = function(options) {};    
    
    /**
     * Creates an explicit directional join relationship from another component to this component (an inverse join). This method sets the Component.source property on the returned query.Component object.
     * @governance none
     * @param {Object} options
     * @param {string} options.fieldId The column type (field type) that joins the parent component to the new component.
     * @param {string} options.source The query type of the component joined to this component.
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If relationship is undefined
     * @throws {SuiteScriptError} RELATIONSHIP_ALREADY_USED The specified join relationship already exists.
     * @return {Component}
     *
     * @since 2018.1
     */    
    this.prototype.joinFrom = function(options) {};    
    
    /**
     * Creates a condition (query filter) based on the query.Component object.
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.fieldId The name of the condition. This value sets the Condition.fieldId property.
     * @param {string} options.operator The operator used by the condition. This value sets the Condition.operator parameter.
     * @param {string[]|Date[]} options.values An array of values to use for the condition. This value sets the Condition.values property.
     * @param {string} options.formula The formula used to create the condition. This value sets the Condition.formula property.
     * @param {string} options.type If you use the options.formula parameter, use this parameter to explicitly define the formula’s return type. Defining the formula’s return type might be required if the return type cannot be determined correctly based on the specified formula. This value sets the Condition.type property.
     * @param {string} [options.aggregate] Use this parameter to run an aggregate function on a condition. An aggregate function performs a calculation on the condition values and returns a single value. This value sets the Condition.aggregate property.
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options are undefined.
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If options isn't object.
     * @throws {SuiteScriptError} OPERATOR_ARITY_MISMATCH If requested operator cannot work with specified number of.
     * @throws {SuiteScriptError} INVALID_SEARCH_OPERATOR If wrong query operator is used.
     * @return {Condition}
     *
     * @since 2018.1
     */    
    this.prototype.createCondition = function(options) {};    
    
    /**
     * Creates a query result column based on the query.Component object.
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.fieldId The name of the query result column. This value sets the Column.fieldId property.
     * @param {string} options.formula The formula used to create the query result column. This value sets the Column.formula property.
     * @param {string} options.type If you use the options.formula parameter, use this parameter to explicitly define the formula’s return type. Defining the formula’s return type might be required if the return type cannot be determined correctly based on the specified formula. This value sets the Column.type property.
     * @param {string} options.label Field (column) label
     * @param {string} [options.aggregate] Use this parameter to run an aggregate function on your query result column. An aggregate function performs a calculation on the column values and returns a single value. This value sets the Column.aggregate property.
     * @param {boolean} [options.groupBy] Indicates whether the query results are grouped by this query result column. This value sets the Column.groupBy property.
     * @param {Object} [options.context] The field context for values in the query result column. This value sets the Column.context property.
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options are undefined
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If options isn't object
     * @throws {SuiteScriptError} MUTUALLY_EXCLUSIVE_ARGUMENTS When two mutually arguments are defined
     * @throws {SuiteScriptError} NEITHER_ARGUMENT_DEFINED When neither of two mandatory arguments is defined
     * @return {Column}
     *
     * @since 2018.1
     */    
    this.prototype.createColumn = function(options) {};    
    
    /**
     * Creates a sort based on the query.Component object. The query.Sort object describes a sort that is placed on a particular query result column or condition.
     * @governance none
     * @param {Object} options The options object.
     * @param {string} options.column The query result column that you want to sort by. This value sets the Sort.column property.
     * @param {boolean} [options.ascending] Indicates whether the sort direction is ascending. This value sets the Sort.ascending property.
     * @param {boolean} [options.nullsLast] Where to put results with null value. Defaults to value of ascending flag
     * @param {boolean} [options.caseSensitive] Indicates whether query results with null values are listed at the end of the query results. This value sets the Sort.nullsLast property.
     * @param {string} [options.locale] The locale to use for the sort. This value sets the Sort.locale property.
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT If options are undefined
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE If options isn't object
     * @return {Sort}
     *
     * @since 2018.1
     */    
    this.prototype.createSort = function(options) {};    
    
    /**
     * Returns the object type name (query.Component)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * Specifies a return column.
 *
 * @class Column
 * @classDescription Encapsulates a query result column.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function Column() {
    
    /**
     * Holds the name of the query result column.
     * @name Column#fieldId
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.fieldId = undefined;    
    /**
     * Represents an alias for this column. An alias is an alternate name for a column, and the alias is used in mapped results.
     * @name Column#alias
     * @type {string}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting non-string is attempted
     *
     * @since 2018.1
     */    
    this.prototype.alias = undefined;    
    /**
     * Holds a reference to the query.Component object to which this query result column belongs.
     * @name Column#component
     * @type {Component}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.component = undefined;    
    /**
     * Describes a formula used to create the query result column.
     * @name Column#formula
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.formula = undefined;    
    /**
     * Describes the return type of the formula used to create the query result column.
     * @name Column#type
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.type = undefined;    
    /**
     * Describes an aggregate function that is performed on the query result column. An aggregate function performs a calculation on the column values and returns a single value.
     * @name Column#aggregate
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.aggregate = undefined;    
    /**
     * Indicates whether the query results are grouped by this query result column.
     * @name Column#groupBy
     * @type {Boolean}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.groupBy = undefined;    
    /**
     * Describes the field context for values in the query result column.
     * @name Column#context
     * @type {Object}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2019.1
     */    
    this.prototype.context = undefined;    
    /**
     * Label.
     * @name Column#label
     * @type {string}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting non-string is attempted
     *
     * @since 2019.2
     */    
    this.prototype.label = undefined;    
    /**
     * Returns the object type name (query.Column)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * @class Sort
 * @classDescription Encapsulates a sort based on the query.Query or query.Component object. The query.Sort object describes a sort that is placed on a particular query result column.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function Sort() {
    
    /**
     * Describes the query result column that the query results are sorted by.
     * @name Sort#column
     * @type {Column}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.column = undefined;    
    /**
     * Indicates whether the sort direction is ascending.
     * @name Sort#ascending
     * @type {Boolean}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting wrong sort order is attempted
     *
     * @since 2018.2
     */    
    this.prototype.ascending = undefined;    
    /**
     * Indicates whether the sort is case sensitive.
     * @name Sort#caseSensitive
     * @type {Boolean}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting non-boolean parameter
     *
     * @since 2018.2
     */    
    this.prototype.caseSensitive = undefined;    
    /**
     * Indicates whether query results with null values are listed at the end of the query results.
     * @name Sort#nullsLast
     * @type {Boolean}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting non-boolean parameter
     *
     * @since 2018.2
     */    
    this.prototype.nullsLast = undefined;    
    /**
     * Sort locale
     * @name Sort#locale
     * @type {string}
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE when setting non-boolean parameter
     *
     * @since 2018.2
     */    
    this.prototype.locale = undefined;    
    /**
     * Returns the object type name (query.Sort)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * Specifies the condition used to filter the results. It can consist of other Condition objects.
 * @class Condition
 * @classDescription A condition narrows the query results. The query.Condition object acts in the same capacity as the search.Filter object in the N/search Module. The primary difference is that query.Condition objects can contain other query.Condition objects.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function Condition() {
    
    /**
     * Holds an array of child conditions used to create the parent condition.
     * @name Condition#children
     * @type {Condition[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.children = undefined;    
    /**
     * Holds the name of the condition.
     * @name Condition#fieldId
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.fieldId = undefined;    
    /**
     * Holds the name of the operator used to create the condition.
     * @name Condition#operator
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.operator = undefined;    
    /**
     * Holds an array of values used by an operator to create the condition.
     * @name Condition#values
     * @type {string[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.values = undefined;    
    /**
     * Describes the formula used to create the condition.
     * @name Condition#formula
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.formula = undefined;    
    /**
     * Describes the return type of the formula used to create the condition.
     * @name Condition#type
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.type = undefined;    
    /**
     * Describes an aggregate function that is performed on the condition. An aggregate function performs a calculation on the condition values and returns a single value.
     * @name Condition#aggregate
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.aggregate = undefined;    
    /**
     * Describes the component used to created the condition
     * @name Condition#component
     * @type {string}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.component = undefined;    
    /**
     * Returns the object type name (query.Condition)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * Set of results returned by the query.
 * @class ResultSet
 * @classDescription Encapsulates the set of results returned by the query. Use Query.run() or Query.run.promise() to create this object.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function ResultSet() {
    
    /**
     * Standard SuiteScript 2.0 object for iterating through results
     * @governance 10 units for each page returned
     * @return {Iterator}
     *
     * @since 2018.1
     */    
    this.prototype.iterator = function() {};    
    
    /**
     * Standard SuiteScript 2.0 object for iterating through results
     * @return {Object[]}
     *
     * @since 2018.1
     */    
    this.prototype.asMappedResults = function() {};    
    
    /**
     * Holds an array of query.Result objects.
     * @name ResultSet#results
     * @type {Result[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.results = undefined;    
    /**
     * Holds an array of the return types for ResultSet.results.
     * @name ResultSet#types
     * @type {string[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.types = undefined;    
    /**
     * Holds an array of query return column references. The ResultSet.columns array values correspond with the ResultSet.types array values.
     * @name ResultSet#columns
     * @type {Column[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.columns = undefined;    
    /**
     * Returns the object type name (query.ResultSet)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * Corresponds to a single row of the ResultSet.
 * @class Result
 * @classDescription Encapsulates a single row of the result set (query.ResultSet).
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function Result() {
    
    /**
     * Returns the query result as a mapped result. A mapped result is a JavaScript object with key-value pairs. In this object, the key is either the field ID or the alias that was used for the corresponding query.Column object.
     * @return {Object}
     *
     * @since 2019.2
     */    
    this.prototype.asMap = function() {};    
    
    /**
     * Describes the result values. Value types correspond to the ResultSet.types property. Array values correspond to the array values for ResultSet.columns.
     * @name Result#values
     * @type {string[]|number[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.values = undefined;    
    /**
     * Returns the object type name (query.Result)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * Object for handling paged queries
 * @class PagedData
 * @classDescription Encapsulates a set of paged query results. This object also contains information about the set of paged results it encapsulates.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function PagedData() {
    
    /**
     * Get page with given index
     * @param {Object} options
     * @param {string} options.index Index of page to return
     * @throws {SuiteScriptError} MISSING_REQD_ARGUMENT if options are undefined
     * @throws {SuiteScriptError} WRONG_PARAMETER_TYPE if options isn't object nor number
     * @governance 10 units
     *
     * @return {Page}
     */    
    this.prototype.fetch = function(options) {};    
    this.fetch.promise = function(options) {};    
    
    /**
     * Standard object for iterating through pages.
     * @governance 10 units for each page returned
     * @return {Iterator}
     *
     * @since 2018.1
     */    
    this.prototype.iterator = function() {};    
    
    /**
     * Size of the page
     * @name PageData#pageSize
     * @type {number}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.pageSize = undefined;    
    /**
     * Total number of results
     * @name PagedData#count
     * @type {number}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.count = undefined;    
    /**
     * PageRanges of PagedData
     * @name PagedData#pageRanges
     * @type {PageRange[]}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.pageRanges = undefined;    
    /**
     * Returns the object type name (query.PagedData)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2018.1
     */    
    this.prototype.toJSON = function() {};    
}

/**
 * PageRange object
 * @class PageRange
 * @classDescription Encapsulates the range of query results for a page.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function PageRange() {
    
    /**
     * Describes the array index for this page range.
     * @name PageRange#index
     * @type {number}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.index = undefined;    
    /**
     * Number of results in this page range
     * @name PageRange#size
     * @type {number}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.size = undefined;}

/**
 * Object corresponding to one page of results
 * @class Page
 * @classDescription One page of the paged query results.
 * @constructor
 * @protected
 *
 * @since 2018.1
 */
function Page() {
    
    /**
     * ResultSet of the page
     * @name Page#data
     * @type {ResultSet}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.data = undefined;    
    /**
     * References the query results contained in this page.
     * @name QueryPage#pagedData
     * @type {PagedData}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.pagedData = undefined;    
    /**
     * The range of query results for this page.
     * @name QueryPage#pageRange
     * @type {PageRange}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.pageRange = undefined;    
    /**
     * Indicates whether the page is the first of the paged query results.
     * @name Page#isFirst
     * @type {boolean}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.isFirst = undefined;    
    /**
     * Indication whether this page is the last one
     * @name Page#isLast
     * @type {boolean}
     * @readonly
     * @throws {SuiteScriptError} READ_ONLY when setting the property is attempted
     *
     * @since 2018.1
     */    
    this.prototype.isLast = undefined;    
    /**
     * Returns the object type name (query.Page)
     * @governance none
     * @return {string}
     *
     * @since 2018.1
     */    
    this.prototype.toString = function() {};    
    
    /**
     * get JSON format of the object
     * @governance none
     * @return {Object}
     *
     * @since 2020.1
     */    
    this.prototype.toJSON = function() {};    
}

query = new query();
/**
 * @type {query}
 */
N.prototype.query = query;