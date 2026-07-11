"use strict";

const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

function createTaskElement(task) {
    const li = document.createElement("li");

    li.className = `task-item ${task.completed ? "task-completed" : ""}`;
    li.dataset.id = task.id;

    li.innerHTML = `
        <div class="task-left">
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-date">${formatDate(task.dueDate)}</p>
            </div>
        </div>

        <span class="priority ${task.priority}">
            ${capitalize(task.priority)}
        </span>

        <div class="task-actions">
            <button class="task-btn edit" title="Edit">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button class="task-btn delete" title="Delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    return li;
}

function renderTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyState.style.display = "flex";
        return;
    }

    emptyState.style.display = "none";

    tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });

    updateStats(tasks);
}

function updateStats(tasks) {
    const completed = tasks.filter(task => task.completed).length;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}