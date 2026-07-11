(function (window) {
    const app = window.todoApp = window.todoApp || {};

    function bindEvents(state, actions) {
        const { elements } = state;

        if (elements.form) {
            elements.form.addEventListener('submit', (event) => {
                event.preventDefault();

                actions.addTask({
                    title: elements.taskInput ? elements.taskInput.value : '',
                    priority: elements.prioritySelect ? elements.prioritySelect.value : 'medium',
                    dueDate: elements.dueDateInput ? elements.dueDateInput.value : ''
                });
            });
        }

        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', (event) => {
                actions.updateSearchQuery(event.target.value);
            });
        }

        elements.filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                actions.setFilter(button.dataset.filter || 'all');
            });
        });

        if (elements.taskList) {
            elements.taskList.addEventListener('change', (event) => {
                const actionElement = event.target.closest('[data-action="toggle-task"]');

                if (!actionElement) {
                    return;
                }

                const taskId = actionElement.dataset.taskId || actionElement.closest('[data-task-id]')?.dataset.taskId;

                if (taskId) {
                    actions.toggleTask(taskId, event.target.checked);
                }
            });

            elements.taskList.addEventListener('click', (event) => {
                const editButton = event.target.closest('[data-action="edit-task"]');

                if (editButton) {
                    const taskId = editButton.dataset.taskId || editButton.closest('[data-task-id]')?.dataset.taskId;

                    if (taskId) {
                        actions.editTask(taskId);
                    }

                    return;
                }

                const actionElement = event.target.closest('[data-action="delete-task"]');

                if (!actionElement) {
                    return;
                }

                const taskId = actionElement.dataset.taskId || actionElement.closest('[data-task-id]')?.dataset.taskId;

                if (taskId) {
                    actions.deleteTask(taskId);
                }
            });
        }

        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', () => {
                actions.toggleTheme();
            });
        }

        window.addEventListener('storage', (event) => {
            actions.handleStorageChange(event);
        });
    }

    app.events = {
        bindEvents
    };
})(window);