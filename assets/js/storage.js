"use strict";

const STORAGE_KEY = "todoTasks";

function getTasks() {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

function updateTask(updatedTask) {
    const tasks = getTasks().map(task =>
        task.id === updatedTask.id ? updatedTask : task
    );

    saveTasks(tasks);
}

function deleteTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
}

function clearTasks() {
    localStorage.removeItem(STORAGE_KEY);
}