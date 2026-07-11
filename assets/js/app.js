"use strict";

document.addEventListener("DOMContentLoaded",initializeApp);

function initializeApp(){
    dueDateInput.value=getCurrentDate();

    loadTheme();

    renderTasks(getTasks());
}

function loadTheme(){
    const theme=localStorage.getItem("theme")||"light";

    if(theme==="dark"){
        document.body.classList.add("dark");
        document.querySelector(".theme-toggle i").className="fa-solid fa-sun";
    }
}

const themeToggle=document.querySelector(".theme-toggle");

themeToggle.addEventListener("click",toggleTheme);

function toggleTheme(){
    document.body.classList.toggle("dark");

    const icon=themeToggle.querySelector("i");

    if(document.body.classList.contains("dark")){
        icon.className="fa-solid fa-sun";
        localStorage.setItem("theme","dark");
    }else{
        icon.className="fa-solid fa-moon";
        localStorage.setItem("theme","light");
    }
}