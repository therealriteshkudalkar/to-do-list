$(document).ready(function() {

  $(document).on ("click", ":submit", function() {
    const itemName = $(this).parent().children()[0].value;
    const listName = this.value;
    $.ajax({
      url: "/",
      method: "put",
      contentType: "application/json",
      data: JSON.stringify({itemName: itemName, listName: listName}),
      success: function(response) {
        var container = $(".box")[1];
        container.innerHTML = '';
        var html = "";
        response.listItems.forEach(function(item) {
          html += '<form onsubmit="return false;">';
            html += '<div class="item">';
              html += '<input type="checkbox" name="checkbox" value="' + item._id + '"/>';
              html += '<p>' + item.itemName + '</p>';
            html += '</div>';
            html += '<input type="hidden" name="listName" value="' + listName + '"></input>';
          html += '</form>';
        });
        html += '<form onsubmit="return false;" class="item inputText">';
          html += '<input type="text" name="nextItem" placeholder="New Item" autocomplete="off">';
          html += '<button name="button" value="' + listName + '"><span class="material-icons">add</span></button>';
        html += '</form>';
        container.innerHTML = html;
      }
    });
  });

  $(document).on("change", ":checkbox", function() {
    const listName = $(this).parent().parent().children()[1].value;
    const itemId = this.value;
    $.ajax({
      url: "/",
      method: "delete",
      contentType: "application/json",
      data: JSON.stringify({itemId: itemId, listName: listName}),
      success: function(response) {
        var container = $(".box")[1];
        container.innerHTML = '';
        var html = "";
        response.listItems.forEach(function(item) {
          html += '<form onsubmit="return false;">';
            html += '<div class="item">';
              html += '<input type="checkbox" name="checkbox" value="' + item._id + '"/>';
              html += '<p>' + item.itemName + '</p>';
            html += '</div>';
            html += '<input type="hidden" name="listName" value="' + listName + '"></input>';
          html += '</form>';
        });
        html += '<form onsubmit="return false;" class="item inputText">';
          html += '<input type="text" name="nextItem" placeholder="New Item" autocomplete="off">';
          html += '<button name="button" value="' + listName + '"><span class="material-icons">add</span></button>';
        html += '</form>';
        container.innerHTML = html;
      }
    });
  });

});
