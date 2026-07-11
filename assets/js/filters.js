"use strict";

const searchInput=document.getElementById("search-task");
const filterButtons=document.querySelectorAll(".filter-btn");

searchInput.addEventListener("input",handleSearch);

filterButtons.forEach(button=>{
    button.addEventListener("click",handleFilter);
});

function handleSearch(){
    const keyword=searchInput.value.toLowerCase().trim();
    const filteredTasks=getTasks().filter(task=>
        task.title.toLowerCase().includes(keyword)
    );

    renderTasks(filteredTasks);
}

function handleFilter(event){
    filterButtons.forEach(button=>{
        button.classList.remove("active");
    });

    event.currentTarget.classList.add("active");
    const filter=event.currentTarget.dataset.filter;
    let tasks=getTasks();

    if(filter==="active"){
        tasks=tasks.filter(task=>!task.completed);
    }

    if(filter==="completed"){
        tasks=tasks.filter(task=>task.completed);
    }

    renderTasks(tasks);
}