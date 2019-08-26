incrStock = function(word){
  var query = word.selectionText;
	var url = "https://script.google.com/macros/s/[SHEET URL]/exec?action=check&input=" + query;

	fetch(url, {mode: 'cors'})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		alert(text);
	})
	.catch(function(error) {
		console.log(error);
		alert(error);
	})
};

decrStock = function(word){
  var query = word.selectionText;
	var url = "https://script.google.com/macros/s/[SHEET URL]/exec?action=check&input=" + query;

	fetch(url, {mode: 'cors'})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		alert(text);
	})
	.catch(function(error) {
		console.log(error);
		alert(error);
	})
};

checkStock = function(word){
  var query = word.selectionText;
	var url = "https://script.google.com/macros/s/[SHEET URL]/exec?action=check&input=" + query;

	fetch(url, {mode: 'cors'})
	.then(function(response) {
		return response.text();
	})
	.then(function(text) {
		alert(text);
	})
	.catch(function(error) {
		console.log(error);
		alert(error);
	})
};

chrome.contextMenus.create({
  title: "Increment Stock",
  contexts:["selection"],
  onclick: incrStock
});

chrome.contextMenus.create({
  title: "Decrement Stock",
  contexts:["selection"],
  onclick: decrStock
});

chrome.contextMenus.create({
  title: "Check Stock",
  contexts:["selection"],
  onclick: checkStock
});





