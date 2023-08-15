(function () {
  //exclude older browsers by the features we need them to support
  //and legacy opera explicitly so we don't waste time on a dead browser
  if (
    !document.querySelectorAll ||
    !("draggable" in document.createElement("span")) ||
    window.opera
  ) {
    return;
  }

  //get the collection of draggable items and add their draggable attribute
  for (
    var items = document.querySelectorAll('[data-draggable="item"]'),
      len = items.length,
      i = 0;
    i < len;
    i++
  ) {
    items[i].setAttribute("draggable", "true");
  }

  //variable for storing the dragging item reference
  //this will avoid the need to define any transfer data
  //which means that the elements don't need to have IDs
  var item = null;

  //dragstart event to initiate mouse dragging
  document.addEventListener(
    "dragstart",
    function (e) {
      //set the item reference to this element
      item = e.target;

      //we don't need the transfer data, but we have to define something
      //otherwise the drop action won't work at all in firefox
      //most browsers support the proper mime-type syntax, eg. "text/plain"
      //but we have to use this incorrect syntax for the benefit of IE10+
      e.dataTransfer.setData("text", "");
    },
    false
  );

  //dragover event to allow the drag by preventing its default
  //ie. the default action of an element is not to allow dragging
  document.addEventListener(
    "dragover",
    function (e) {
      if (item) {
        e.preventDefault();
      }
    },
    false
  );

  //drop event to allow the element to be dropped into valid targets
  document.addEventListener(
    "drop",
    function (e) {
      //if this element is a drop target, move the item here
      //then prevent default to allow the action (same as dragover)
      if (e.target.getAttribute("data-draggable") == "target") {
        e.target.appendChild(item);

        e.preventDefault();
      }
    },
    false
  );

  //dragend event to clean-up after drop or abort
  //which fires whether or not the drop target was valid
  document.addEventListener(
    "dragend",
    function (e) {
      item = null;
    },
    false
  );
})();

// Add dropped areas
document.getElementById("inc").addEventListener("click", (event) => {
    event.preventDefault();

    const headingText = prompt("Enter the heading for the new dropped area:");

    if (headingText !== null && headingText.trim() !== "") {
      addDroppedArea(headingText);
    }
  });

  // Load and apply saved state from local storage
  function loadFromLocalStorage() {
    const savedState = localStorage.getItem("pageState");
    if (savedState) {
      document.querySelector(".main-container").innerHTML = savedState;
      attachEventListeners();
    }

    const addedItems = JSON.parse(localStorage.getItem("addedItems")) || [];
    const contentContainer = document.querySelector(".content-container");

    addedItems.forEach((item) => {
      const newItem = document.createElement("li");
      newItem.dataset.draggable = "item";
      newItem.setAttribute("draggable","true")
      newItem.textContent = item;
      contentContainer.appendChild(newItem);
    });
  }

// Save the current state to local storage
function saveToLocalStorage() {
  const mainContainer = document.querySelector(".main-container").innerHTML;
  localStorage.setItem("pageState", mainContainer);
}
 // Add a dropped area with heading and arrow
 function addDroppedArea(headingText) {
    const droppedArea = document.createElement("div");
    droppedArea.classList.add("dropped-area");
    droppedArea.dataset.draggable = "target";

    const heading = document.createElement("h3");
    heading.textContent = headingText;

    droppedArea.appendChild(heading);

    const mainContainer = document.querySelector(".main-container");
    mainContainer.insertBefore(droppedArea, document.getElementById("inc"));

    // Add an arrow after the dropped area
    const arrow = document.createElement("div");
    arrow.classList.add("arrow");
    arrow.innerHTML = "&#x2193;"; // Down arrow character

    mainContainer.insertBefore(arrow, droppedArea.nextSibling);

    // Save changes to local storage
    saveToLocalStorage();
  }
// Attach event listeners to buttons after loading from local storage
function attachEventListeners() {
  const addButton = document.getElementById("inc");
  addButton.removeEventListener("click", addButtonClickHandler);
  addButton.addEventListener("click", addButtonClickHandler);
}

  // Handler for + button click
  function addButtonClickHandler(event) {
    event.preventDefault();
    const headingText = prompt("Enter the heading for the new dropped area:");
    if (headingText !== null && headingText.trim() !== "") {
      addDroppedArea(headingText);
    }
  }

// Load saved state when the page loads
window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});

// Add items
document.getElementById("item-inc").addEventListener("click", (e) => {
  e.preventDefault();

  const variableNameInput = document.querySelector('input[type="text"]');
  const variableName = variableNameInput.value.trim();

  if (variableName !== "") {
    const newItem = document.createElement("li");
    newItem.dataset.draggable = "item";
    newItem.setAttribute("draggable", "true");
    newItem.textContent = variableName;

    document.querySelector(".content-container").appendChild(newItem);

    variableNameInput.value = ""; // Clear the input field
    // Save the added item to localStorage
    const addedItems = JSON.parse(localStorage.getItem("addedItems")) || [];
    addedItems.push(variableName);
    localStorage.setItem("addedItems", JSON.stringify(addedItems));
  }
});
