const urlBase = "http://cop4331group4.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener("DOMContentLoaded", function () {
  // all your event listeners here

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-button")) {
      const id = event.target.getAttribute("data-id");
      window.location.href = "editContact.html?id=" + id;
    }
  });

  // other event listeners...

  // ...
});

// other functions and code...

function signUp() {
  userId = 0;
  firstName = "";
  lastName = "";
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  let login = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  //   var hash = md5(password);

  document.getElementById("signUpResult").innerHTML = "";

  var tmp = {
    firstName: firstName,
    lastName: lastName,
    login: login,
    password: password,
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SignUp." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("signUpResult").innerHTML =
            "Sign Up failed, wtf";
          return;
        }
        saveCookie();

        window.location.href = "contact.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("signUpResult").innerHTML = err.message;
  }
}

// Function to login user
function doLogin() {
  // reset userId, firstName, lastName
  userId = 0;
  firstName = "";
  lastName = "";

  // retrieve login and password values from the HTML elements
  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;

  //   var hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  // prepare the payload
  var tmp = { login: login, password: password };
  let jsonPayload = JSON.stringify(tmp);

  // define the URL for login
  let url = urlBase + "/Login." + extension;

  // initialize a new XMLHTTPRequest
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Parse the response received from server
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        // if userId < 1, login failed
        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        // save the cookie and redirect to contact.html
        saveCookie();

        window.location.href = "contact.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

// Function to logout user
function doLogout() {
  // reset userId, firstName, lastName and cookie
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  // redirect to index.html
  window.location.href = "index.html";
}

// Function to save cookie
function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

// Function to read cookie
function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  // if userId < 0, redirect to index.html
  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      "Logged in as " + firstName + " " + lastName;
  }
}

// Function to add contact
function addContact() {
  // retrieve contact from HTML element
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let phoneNumber = document.getElementById("phoneNumber").value;
  let email = document.getElementById("email").value;

  document.getElementById("contactAddResult").innerHTML = "";

  // prepare payload
  let tmp = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    userId: userId,
  };
  let jsonPayload = JSON.stringify(tmp);

  // define URL for adding contact
  let url = urlBase + "/CreateContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Contact has been added successfully
        document.getElementById("contactAddResult").innerHTML =
          "Contact has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

// Function to search contact
function searchContact() {
  // Clear the results container
  document.getElementById("resultsContainer").innerHTML = "";

  let searchFirstName = document.getElementById("searchFirstName").value;
  let searchLastName = document.getElementById("searchLastName").value;
  let searchPhoneNum = document.getElementById("searchPhoneNum").value;
  let searchEmail = document.getElementById("searchEmail").value;

  document.getElementById("contactSearchResult").innerHTML = "";

  let tmp = {
    firstName: searchFirstName,
    lastName: searchLastName,
    phoneNumber: searchPhoneNum,
    email: searchEmail,
    userId: userId,
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/SearchContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactSearchResult").innerHTML =
          "Contact(s) has been retrieved";
        let jsonObject = JSON.parse(xhr.responseText);

        let table = document.createElement("table");
        table.setAttribute("border", "1");

        // Create table header
        let headerRow = table.insertRow(0);
        let headerCell1 = headerRow.insertCell(0);
        headerCell1.innerHTML = "<b>ID</b>";
        let headerCell2 = headerRow.insertCell(1);
        headerCell2.innerHTML = "<b>First Name</b>";
        let headerCell3 = headerRow.insertCell(2);
        headerCell3.innerHTML = "<b>Last Name</b>";
        let headerCell4 = headerRow.insertCell(3);
        headerCell4.innerHTML = "<b>Email</b>";
        let headerCell5 = headerRow.insertCell(4);
        headerCell5.innerHTML = "<b>Phone Number</b>";

        // Create table rows
        jsonObject.results.forEach((contact, index) => {
          let row = table.insertRow(index + 1);
          let cell1 = row.insertCell(0);
          cell1.innerHTML = contact.ID;
          let cell2 = row.insertCell(1);
          cell2.innerHTML = contact.firstName;
          let cell3 = row.insertCell(2);
          cell3.innerHTML = contact.lastName;
          let cell4 = row.insertCell(3);
          cell4.innerHTML = contact.email;
          let cell5 = row.insertCell(4);
          cell5.innerHTML = contact.phoneNumber;
          let cell6 = row.insertCell(5);
          let editButton = document.createElement("button");
          editButton.innerHTML = "Edit";
          editButton.setAttribute("data-id", contact.ID); // set the data-id attribute
          editButton.classList.add("edit-button"); // add the edit-button class

          cell6.appendChild(editButton);
          let cell7 = row.insertCell(6);
          let deleteButton = document.createElement("button");
          deleteButton.innerHTML = "Delete";
          deleteButton.onclick = function () {
            deleteContact(contact.ID);
          };
          cell7.appendChild(deleteButton);
        });

        document.getElementById("resultsContainer").appendChild(table);
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}

// Function to delete contact
function deleteContact(contactId) {
  let tmp = {
    userId: userId,
    id: contactId,
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/DeleteContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactDeleteResult").innerHTML =
          "Contact has been deleted";

        // Directly remove the row of the deleted contact from the table
        let table = document
          .getElementById("resultsContainer")
          .getElementsByTagName("table")[0];
        for (let i = 1, row; (row = table.rows[i]); i++) {
          if (row.cells[0].innerHTML == contactId) {
            table.deleteRow(i);
            break;
          }
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactDeleteResult").innerHTML = err.message;
  }
}

function editContact() {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const email = document.getElementById("email").value;

  userId = getCookie();
  const tmp = {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    email: email,
    id: id,
    userId: userId,
  };

  const jsonPayload = JSON.stringify(tmp);
  const url = urlBase + "/EditContact." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // TODO: handle success
        // window.location.href = "contact.html";
      } else {
        // TODO: handle failure
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    // TODO: handle error
  }
}

function getCookie() {
  const value = "; " + document.cookie;
  const parts = value.split("; ");
  for (let i = 0; i < parts.length; i++) {
    const cookiePart = parts[i];
    if (cookiePart.includes("firstName")) {
      const cookies = cookiePart.split(",");
      for (let j = 0; j < cookies.length; j++) {
        const cookie = cookies[j];
        if (cookie.includes("userId")) {
          return parseInt(cookie.split("=")[1]);
        }
      }
    }
  }
}
