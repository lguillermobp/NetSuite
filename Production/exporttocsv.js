/**
 * @NApiVersion 2.x
 */
require(['N/file', 'N/error', 'N/log'], function (file, error, log) {
    // This sample calculates the total for the
    // second column value in a CSV file.
    //
    // Each line in the CSV file has the following format:
    // date,amount
    //
    // Here is the data that the script adds to the file:
    // 10/21/14,200.0
    // 10/21/15,210.2
    // 10/21/16,250.3
    // Create the CSV file
    var csvFile = file.create({
        name: 'data.csv',
        contents: 'date,amount\n',
        folder: 39,
        fileType: 'CSV'
    });
    // Add the data
    csvFile.appendLine({
        value: '10/21/14,200.0'
    });
    csvFile.appendLine({
        value: '10/21/15,210.2'
    });
    csvFile.appendLine({
        value: '10/21/16,250.3'
    });
    // Save the file
    var csvFileId = csvFile.save();
    // Create a variable to store the calculated total
    var total = 0.0;
    // Load the file
    var invoiceFile = file.load({
        id: csvFileId
    });
    // Obtain an iterator to process each line in the file
    var iterator = invoiceFile.lines.iterator();
    // Skip the first line, which is the CSV header line
    iterator.each(function () {return false;});
    // Process each line in the file
    iterator.each(function (line) {
        // Update the total based on the line value
        var lineValues = line.value.split(',');
        var lineAmount = parseFloat(lineValues[1]);
        if (!lineAmount) {
            throw error.create({
                name: 'INVALID_INVOICE_FILE',
                message: 'Invoice file contained non-numeric value for total: ' + lineValues[1]
            });
            total += lineAmount;
            return true;
        }
    });
    // At this point, the total is 660.5
    log.debug({
        title: 'total',
        details: total
    });
});
