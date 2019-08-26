

// input JSON format { "action' : ['incr', 'decr', 'check'], "input" : string }
// http://googleappscripting.com/doget-dopost-tutorial-examples/
function doGet(e)
{
  var input = e.parameter.input || "cancel";
  var action = e.parameter.action || "cancel";
  
  if (input === "cancel" || action === "cancel") return;
  var outString = "no response";
  switch(action)
  {
    case 'incr' : 
      outString = incrementStock(input);
      break;
      
    case 'decr' :
      outString = decrementStock(input);
      break;
      
    case 'check' :
      outString = checkStock(input);
      break;
      
    default:
      outString = "Invalid action call";
      break;
  }
  
  textOutput = ContentService.createTextOutput(outString)
  return textOutput
}


function testGet()
{
  var url = ScriptApp.getService().getUrl();
  
  var payload =
      {
        "name" : "labnol",
        "blog" : "ctrlq",
        "type" : "post",
      };
  
  var options =
      {
        "method"  : "GET",
        "payload" : payload,   
        "followRedirects" : true,
        "muteHttpExceptions": true
      };
  
  var result = UrlFetchApp.fetch(url, options);
  
  if (result.getResponseCode() == 200) {
    
    var params = JSON.parse(result.getContentText());
    
    Logger.log(params.name);
    Logger.log(params.blog);
    
  }
}

// adds new menu options on opening spreadsheet
function onOpen() 
{
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Check Stock", functionName: "checkStock"},
                     {name: "Add Part", functionName: "incrementStock"},
                     {name: "Remove Part", functionName: "decrementStock"}];
  ss.addMenu("Commands", menuEntries);    
}



Array.prototype.findIndex = function(search)
{
  if (search == "") return false;
  for (var i=0; i<this.length; i++) 
    if (this[i].toString() == search) return i+2; //table is 1-indexed, starting at second row, thus +2 
  return -1;
}


// input_string: part number to search
// returns first row of part num if found, else -1
function onSearch(input_string) 
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  if (input_string == 'cancel') return;
  var column = 1;
  var columnValues = sheet.getRange(2, column, sheet.getLastRow()).getDisplayValues();
  var searchResult = columnValues.findIndex(input_string);
  if (searchResult == 1) searchResult = -1;
  
  return searchResult;
  
  
}

// returns the row number and the stock of the part searched
function checkStock(part_num)
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  
  var output = "";
  
  if (part_num == null)
  {
    part_num = Browser.inputBox("Input search term", Browser.Buttons.OK_CANCEL);
  }
  //var part_num = Browser.inputBox("Input search term", Browser.Buttons.OK_CANCEL);
  if (part_num == "cancel") return;
  var searchResult = onSearch(part_num);
  if (searchResult != -1)
  {
    
    var stock = sheet.getRange(searchResult, 2).getValue();
    if (stock == "") stock = 0;
    output = "Search results: " + searchResult + " Stock: " + stock;
    
    SpreadsheetApp.getActiveSpreadsheet().setActiveRange(sheet.getRange(searchResult, 2))
  }
  else
  {
    output = "Search results: not in stock";
  }
  
  Browser.msgBox(output);
  return output;
}


// adds given part number to stock
// if there is an existing row for that part, increment stock
// else append new row with stock = 1
// report back updated stock for part
function incrementStock(part_num)
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  var output = "";
  if (part_num == null)
  {
    part_num = Browser.inputBox("Input search term", Browser.Buttons.OK_CANCEL);
  }
  if (part_num == "cancel") return;
  var searchResult = onSearch(part_num);
  
  // if part not found, create new row
  if (searchResult == -1)
  {
    sheet.getRange(sheet.getLastRow() + 1, 1).setValue('' + part_num); // keep concatenation in or else sheets will infer data type
    sheet.getRange(sheet.getLastRow(), 2).setValue(1);
    output = "Row: " + sheet.getLastRow() + " Stock: 1";
    Browser.msgBox(output);
    return output;
  }
  
  var stock = sheet.getRange(searchResult, 2).getValue();
  if (stock == "") stock = 1;
  else stock++;
  sheet.getRange(searchResult, 2).setValue(stock);
  output = "Row: " + searchResult + " Stock: " + stock;
  Browser.msgBox(output);
  return output;
  
}




// removes given part number from stock
// if no row exists for that part, give back error message
// if row exists && stock < 1, decrement stock
// if stock == 0, delete row
function decrementStock(part_num)
{
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = SpreadsheetApp.getActiveSheet();
  var output = "";
  if (part_num == null)
  {
    part_num = Browser.inputBox("Input search term", Browser.Buttons.OK_CANCEL);
  }
  if (part_num == "cancel") return;
  var searchResult = onSearch(part_num);
  
  // part not found
  if (searchResult == -1) 
  {
    return "Part not in stock";
  }
  
  var stock = sheet.getRange(searchResult, 2).getValue();
  
  // decrement stock, if none left, delete entry from table
  if (--stock <=0 )
  {
    sheet.deleteRow(searchResult);
    output = "Last part used, deleting entry from table";
    Browser.msgBox(output);
    return output;
  }
  
  // if there are any more of the part in stock, update table
  sheet.getRange(searchResult, 2).setValue(stock);
  output = "Table updated, Stock: " + stock;
  Browser.msgBox(output);
  return output;
}






