let characters, aToM, nToZ;

$(document).ready(function () {


  $.ajax({
    type: "GET",
    url: "data.json",
    data: { get_param: "value" },
    dataType: "json",
    complete: function (data) {
      characters = data;
    },
  });

  $(document).ajaxComplete(function () {
    characters = $.parseJSON(characters.responseText);

    

    function getSortOrder() {
      return function (a, b) {
        if (a.LastName > b.LastName) {
          return 1;
        } else if (a.LastName < b.LastName) {
          return -1;
        }
        return 0;
      };
    }
    
    characters.sort(getSortOrder());
    addDataToTableBody(characters);
    
    aToM = characters.filter((item) => /^[a-m]/i.test(item["LastName"]));
    nToZ = characters.filter((item) => /^[n-z]/i.test(item["LastName"]));
    $("#sortAM").text(`A-M (${Object.keys(aToM).length})`);
    $("#sortNZ").text(`N-Z (${Object.keys(nToZ).length})`);
  });
});

// Sorting functionality
let sortColumn = null;
let sortDirection = "asc";

const sortTable = () => {
  const sortedData = characters.slice().sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (sortDirection === "asc") {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
  addDataToTableBody(sortedData);
};

$("th").on("click", function() {
  const columnIndex = $(this).index();
  if (columnIndex !== sortColumn) {
    sortColumn = columnIndex;
    sortDirection = "asc";
  } else {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
    if (sortDirection === "asc") {
      sortColumn = null;
    }
  }
  sortTable();
  const arrow = sortDirection === "asc" ? "&#x25B2;" : "&#x25BC;";
  $(this).html($(this).text() + arrow);
  $(this).siblings().html(function() {
    return $(this).text().replace("&#x25B2;", "").replace("&#x25BC;", "");
  });
});

$(document).ready(function() {
  // Retrieve JSON data
  $.getJSON("data.json", function(characters) {
    // Initialize sort order array
    var sortOrder = Array(characters[0].length).fill(null);

    // Function to populate table with JSON data
    function populateTable(characters) {
      $("tbody").empty();
      for (var i = 0; i < characters.length; i++) {
        var character = characters[i];
        var row = $("<tr>");
        row.append($("<td>").text(character.firstName));
        row.append($("<td>").text(character.LastName));
        row.append($("<td>").text(character.jutsuType));
        row.append($("<td>").text(character.ChakraStyle));
        row.append($("<td>").text(character.bestAttack));
        row.append($("<td>").text(character.dateOfBirth));
        $("tbody").append(row);
      }
    }

    // Sort table based on column header
    $("th").click(function() {
      var column = $(this).index();
      sortOrder[column] = sortOrder[column] === "asc" ? "desc" : "asc";
      $("th").removeClass("asc desc");
      $(this).addClass(sortOrder[column]);
      characters.sort(function(a, b) {
        if (sortOrder[column] === "asc") {
          return a[Object.keys(a)[column]] > b[Object.keys(b)[column]] ? 1 : -1;
        } else {
          return b[Object.keys(b)[column]] > a[Object.keys(a)[column]] ? 1 : -1;
        }
      });
      populateTable(characters);
    });

    // Initial population of table
    populateTable(characters);
  });
});


function addDataToTableBody(data){
    let rows = "";
     $.each(data, function (key, value) {
       rows += `<tr>  
                    <td>${value.firstName}</td>  
                    <td>${value.LastName}</td>  
                    <td>${value.jutsuType}</td>                
                    <td>${value.ChakraStyle}</td>  
                    <td>${value.bestAttack}</td>
                    <td>${value.dateOfBirth}</td>  
                </tr>`;
     });
 
     $("#tableBody").empty().append(rows);
}

$("#search").on("keyup", function () {
  const value = $(this).val().toLowerCase();
  if(value){
      console.log("Value", value);
      $("#tableBody tr").filter(function () {
        const $thisTr = $(this)[0];
    
        if($thisTr.firstElementChild.textContent.toLowerCase().indexOf(value) > -1){
            console.log($thisTr.firstElementChild.textContent);
            $($thisTr).addClass("searchMatched");
        } else {
            $($thisTr).removeClass("searchMatched");
        }
      });
  } else {
    $("#tableBody tr").removeClass("searchMatched");
  }
});

$("button").on("click", function() {
    let id = $(this).attr("id");
    if(id == "sortAM") {
        addDataToTableBody(aToM)
    } else if(id == "sortNZ") {
        addDataToTableBody(nToZ)
    } else if(id == "all"){
        addDataToTableBody(characters);
    }
});

