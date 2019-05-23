// Identify key UI Elements
const table = document.getElementById("data-table");
const form = document.getElementById("search-form");
const aggregatedText = document.getElementById("aggregate-text");
const lists = document.getElementsByTagName("select");

// Important Stitch Info
const APP_ID = ""; // Add your Stitch App ID here
const MDB_SERVICE = "mongodb-atlas"; // Add the name of your Atlas Service ("mongodb-atlas" is the default)
const { Stitch } = stitch;

// Set list definitions
let listDefinitions = {};
listDefinitions.countryList = ["United States", "Turkey", "Brazil", "Australia", "Hong Kong", "Spain", "Portugal", "Canada"];
listDefinitions.typeList = ["Apartment", "Bed and breakfast","Condominium", "Guesthouse","House","Townhouse"];
listDefinitions.bedroomsList = [1,2,3,4,5];
listDefinitions.bathroomsList = [1,2,3,4,5];
listDefinitions.priceList = [100,200,300,400,500,600,700,800,900,1000];
listDefinitions.resultsList = [25,50,75,100];

// Setup the connection between the frontend and MongoDB Stitch
const client = stitch.Stitch.initializeDefaultAppClient(APP_ID);
const coll = client.getServiceClient(stitch.RemoteMongoClient.factory, MDB_SERVICE)
  .db('sample_airbnb')
  .collection('listingsAndReviews');

// Build the dropdown menus from the list definitions
buildLists();

// Authenticate the client if they're not already logged in
// After login search for relevant properties and populate the table
if (!client.auth.isLoggedIn) {
  client.auth.loginWithCredential(new stitch.AnonymousCredential()).then(user => {
    searchAndBuild()
  });
} else {
  searchAndBuild();
}

// Function to query MongoDB for relevant data before populating UI
function searchAndBuild() {
  //Get the current selections from the dropdowns
  let countryChoice = lists.namedItem("countryList").value;
  let bathroomsChoice = parseInt(lists.namedItem("bathroomsList").value);
  let bedroomsChoice = parseInt(lists.namedItem("bedroomsList").value);
  let priceChoice = parseInt(lists.namedItem("priceList").value);
  let typeChoice = lists.namedItem("typeList").value;
  let resultsLimit = parseInt(lists.namedItem("resultsList").value);

  // Construct a query to get the matching properties (limited to the number of results)
  // and then call the following function:
  // refreshTable(matchingData)

  // Construct an aggregation pipeline that returns the averagePrice and
  // count of ALL matching properties and then call the following function:
  // updateAggregateText(count, avgPrice, resultsLimit);
}

// Update the text showing total results and average price
function updateAggregateText(count, avgPrice, limit){
  let resultCount = Math.min(limit, count);
  avgPrice = parseInt(avgPrice);

  if(resultCount > 0){
    aggregatedText.innerHTML = "Returning " + resultCount + " out of " + count + " results.  Average price is $" + avgPrice + ".";
  } else {
    aggregatedText.innerHTML = "No Results Found";
  }
}

// Clear current data and re-populate the table with property data
function refreshTable(tableData) {
  table.innerHTML = table.tBodies[0].innerHTML;

   return new Promise((resolve, reject) => {
     for (let [index, row] of tableData.entries()) {
       buildRow(row);
     }
   });
 }

// Translate property data into table rows
 function buildRow(rowData) {
   let tr = document.createElement("tr");
   tr.className = "table-data";

   for (const key of Object.keys(rowData)){
     if(key != "_id" & key != "address"){
       let tempRow = document.createElement("td");
       tempRow.innerText = rowData[key];
       tr.appendChild(tempRow);
     }
   }

   // Add the row to the end of the table
   table.appendChild(tr);
}

// Build the elements of the dropdown list from the list definitions
function buildLists(){
  for (let curList of lists) {
    curList.options.length = 0;
    listItems = listDefinitions[curList.id];

    for(var i = 0; i < listItems.length; i++){
      curList.options[i] = new Option(listItems[i], listItems[i]);
    }
  }
}
