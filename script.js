const loginForm = document.querySelector("#loginForm");
const createForm = document.querySelector("#createForm");
const loginMenu = document.querySelector("#login");
const createMenu = document.querySelector("#create");
const loggedIn = document.querySelector("#loggedIn");
const subscribe = document.querySelector("#subscribe");
const unsubscribe = document.querySelector("#unsubscribe");
const subCheckbox = document.querySelector("#sub");
const logOut = document.querySelector("#logOut");
const createSuccess = document.querySelector("#newUserSuccess");
const createFail = document.querySelector("#newUserFail");


document.addEventListener("DOMContentLoaded", ()=>{
    showLogin()
    loginMenu.addEventListener("click", e =>{
        e.preventDefault()
        showLogin()
    })
    createMenu.addEventListener("click", e =>{
        e.preventDefault()
        showCreate()
    })
});

function showLogin(){
    loginForm.classList.remove("form--hidden");
    createMenu.classList.remove("menuLink--hidden");
    createForm.classList.add("form--hidden");
    loginMenu.classList.add("menuLink--hidden");
    createFail.classList.add("form--hidden");
    createSuccess.classList.add("form--hidden");
}

function showCreate(){
    createForm.classList.remove("form--hidden")
    loginMenu.classList.remove("menuLink--hidden");
    loginForm.classList.add("form--hidden");
    createMenu.classList.add("menuLink--hidden");
    createFail.classList.add("form--hidden");
    createSuccess.classList.add("form--hidden");
};

function login(){
    console.log("login");

    fetch('http://localhost:3000/login', {
        method: 'POST',
        body:JSON.stringify({username:document.getElementById("loginUser").value.toLowerCase(), 
        pw:document.getElementById("loginPw").value}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        if(! response.ok){
            return Promise.reject(response);
        }
        return response.json();
      })
      .then(function(user) {
        localStorage.setItem("loggedInUserId", user._id)
        loggedIn.classList.remove("loggedIn--hidden");
        loginForm.classList.add("form--hidden");
        logOut.classList.remove("menuLink--hidden")
        if(user.subscribed === true){
          subCheckbox.checked = true;
          subscribe.classList.add("sub--hidden");
          unsubscribe.classList.remove("sub--hidden");  
        }
        else {
            subCheckbox.checked = false;
            subscribe.classList.remove("sub--hidden");
            unsubscribe.classList.add("sub--hidden");
        }
      }).catch(function(error){
        error.json().then((err) =>{
            console.log(err.message);
        })
    });    
};

function changeSub(){
    console.log(localStorage.getItem("loggedInUserId"));
    fetch('http://localhost:3000/users', {
        method: 'PUT',
        body:JSON.stringify({userId:localStorage.getItem("loggedInUserId"),
        subscribed:document.getElementById("sub").checked}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(function(response){
        if(! response.ok){
            return Promise.reject(response);
        }
        return response.statusText
    }).then(function(status){
        console.log(status);
        if(subCheckbox.checked === true){
            subscribe.classList.add("sub--hidden");
            unsubscribe.classList.remove("sub--hidden");
        }
        else{
            subscribe.classList.remove("sub--hidden");
            unsubscribe.classList.add("sub--hidden");
        }
    }).catch(function(error){
        console.log(error.statusText); 
    })
};

function createNewUser(){
    fetch('http://localhost:3000/newuser', {
        method: 'POST',
        body:JSON.stringify({username:document.getElementById("createUser").value.toLowerCase(),
        email:document.getElementById("createEmail").value, 
        pw:document.getElementById("createPw").value, subscribed:false} ),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        if(! response.ok){
            return Promise.reject(response);
        }
        return response.statusText;
      })
      .then(function(status) {
        console.log(status);
        createForm.classList.add("form--hidden")
        createSuccess.classList.remove("form--hidden");
        document.getElementById("createUser").value = "";
        document.getElementById("createEmail").value = "";
        document.getElementById("createPw").value = ""; 
        return
      }).catch(function(error){
        console.log(error.statusText);
        createForm.classList.add("form--hidden");
        createFail.classList.remove("form--hidden");
        document.getElementById("createUser").value = "";
        document.getElementById("createEmail").value = "";
        document.getElementById("createPw").value = ""; 
    })
};
