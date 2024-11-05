/**
 * @NApiVersion 2.0
 * @NScriptType fiParserPlugin
 * @NModuleScope SameAccount
 */
define(["N/log", "N/url", "../bai2", "../config"], function (_log, _url, _bai, _config) {
    const _exports = {};
    _exports.getConfigurationPageUrl = getConfigurationPageUrl;
    _exports.getStandardTransactionCodes = getStandardTransactionCodes;
    _exports.parseData = parseData;
    function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
    function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
    function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
    function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
    function getConfigurationPageUrl(context) {
      var suiteletUrl = _url.resolveScript({
        scriptId: "customscript_".concat(_config.client.id, "_rpt_feed_s"),
        deploymentId: "customdeploy_".concat(_config.client.id, "_rpt_feed_s")
      });
      context.configurationPageUrl = suiteletUrl;
    }
    function parseData(context) {
      var input = context.inputData;
      input.lines.iterator().each(function (line) {
        // Skip empty lines
        if (!line.value) {
          return true;
        }
        var data = JSON.parse(line.value);
        _log.debug({
          title: "parseDate",
          details: {
            statementIds: data.statementIds.join(","),
            accountId: data.accountId,
            numTransactions: data.transactions.length
          }
        });
        var account = context.createAccountData(_objectSpread({
          accountId: data.accountId
        }, data.balances));
        data.transactions.forEach(function (transaction) {
          account.createNewTransaction(transaction);
        });
        return true;
      });
    }
    function getStandardTransactionCodes(context) {
      var _iterator = _createForOfIteratorHelper(_bai),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var code = _step.value;
          context.createNewStandardTransactionCode(code);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return _exports;
  });