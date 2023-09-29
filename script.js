import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-b8280-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");

const shoppingList = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  if (inputValue === "") {
    shoppingList.textContent = "Adauga un produs prima data... meow";
    shoppingList.style.fontStyle = "italic";
  } else {
    push(shoppingListInDB, inputValue);

    clearInputFieldEl();
  }
});

onValue(shoppingListInDB, function (snapshop) {
  if (snapshop.exists()) {
    let shoppingArray = Object.entries(snapshop.val());
    shoppingList.style.fontStyle = "normal";

    clearShoppingList();

    for (let i = 0; i < shoppingArray.length; i++) {
      let currentItem = shoppingArray[i];
      // let currentItemID = currentItem[0];
      // let currentValue = currentItem[1];

      appendItemToShoppingList(currentItem);
    }
  } else {
    shoppingList.textContent = "Niciun produs adaugat... inca";
    shoppingList.style.fontStyle = "italic";
  }
});

function clearShoppingList() {
  shoppingList.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("dblclick", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingList.append(newEl);
}
