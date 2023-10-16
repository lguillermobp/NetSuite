var o = nlapiLoadRecord("workorder", 11729814);
for (var i = 1; i <= o.getLineItemCount("item"); i++)
    o.setLineItemValue("item", "isclosed", i, "F");
var stat = nlapiSubmitRecord(o);

o = nlapiLoadRecord("workorder", 11729814);
var x = 1;