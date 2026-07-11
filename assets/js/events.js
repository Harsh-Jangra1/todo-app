"use strict";

const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("due-date");

todoForm.addEventListener("submit", handleAddTask);
taskList.addEventListener("click", handleTaskActions);
taskList.addEventListener("change", handleTaskComplete);

function handleAddTask(event) {
    event.preventDefault();

    if (isEmpty(taskInput.value)) {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: generateId(),
        title: taskInput.value.trim(),
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        completed: false
    };

    addTask(task);
    renderTasks(getTasks());
    todoForm.reset();
}

function handleTaskActions(event) {
    const deleteButton = event.target.closest(".delete");

    if (!deleteButton) return;

    const taskItem = deleteButton.closest(".task-item");
    deleteTask(taskItem.dataset.id);
    renderTasks(getTasks());
}

function handleTaskComplete(event) {
    if (!event.target.classList.contains("task-checkbox")) return;

    const taskItem = event.target.closest(".task-item");
    const tasks = getTasks();
    const task = tasks.find(task => task.id === taskItem.dataset.id);

    if (!task) return;

    task.completed = event.target.checked;
    updateTask(task);
    renderTasks(getTasks());
}