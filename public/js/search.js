'use strict' 

// Get a list of items in inventory based on the classification_id 
let searchBar = document.querySelector("#searchbar")
searchBar.addEventListener("input", function () { 
    let searchString = searchBar.value || "null-nothing-is"
    let searchStringURL = "/inv/getInv/"+searchString
    fetch(searchStringURL) 
    .then(function (response) { 
    if (response.ok) { 
        return response.json(); 
    }
    throw Error("Network response was not OK"); 
    }) 
    .then(function (data) { 
        //console.log(data); 
        buildInventorySearchList(data); 
    }) 
    .catch(function (error) { 
        console.log('There was a problem', error.message) 
    }) 
})

 // Build inventory items into HTML table components and inject into DOM 
function buildInventorySearchList(data) {
    let inventoryDisplay = document.getElementById("search-items");
    let dataTable = '<thead>';
    if (data != null) {
        // Set up the table labels 
        dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
        dataTable += '</thead>'; 
        // Set up the table body 
        dataTable += '<tbody>'; 
        // Iterate over all vehicles in the array and put each in a row 
        data.forEach(function (element) { 
        //console.log(element.inv_id + ", " + element.inv_model); 
        dataTable += `<tr><td><a href='/inv/detail/${element.inv_id}' title='Click to see more details'>${element.inv_make} ${element.inv_model}</a></td>`;
        dataTable += `<td><td>${element.inv_year}</td>`;
        dataTable += `<td><td>$${element.inv_price}</td></tr>`;
        }) 
        dataTable += '</tbody>'; 
    } else {
        dataTable += 'Sorry No cars'
        dataTable += '</tbody>'; 
    }
    
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
}