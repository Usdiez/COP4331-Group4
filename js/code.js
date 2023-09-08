const urlBase = "http://cop4331group4.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

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
  let url = urlBase + "/AddContact." + extension;

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
  // retrieve search text from HTML element
  let srch = document.getElementById("searchText").value;

  // clear the search result
  document.getElementById("contactSearchResult").innerHTML = "";

  // clear the list
  let contactList = "";

  // prepare payload
  let tmp = { search: srch, userId: userId };
  let jsonPayload = JSON.stringify(tmp);

  // define URL for searching Contacts
  let url = urlBase + "/SearchContacts." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // contact(s) has been retrieved
        document.getElementById("contactSearchResult").innerHTML =
          "Contact(s) has been retrieved";
        let jsonObject = JSON.parse(xhr.responseText);

        for (let i = 0; i < jsonObject.results.length; i++) {
          contactList += jsonObject.results[i];
          if (i < jsonObject.results.length - 1) {
            contactList += "<br />\r\n";
          }
        }

        document.getElementsByTagName("p")[0].innerHTML = contactList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}
