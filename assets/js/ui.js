(function (window) {
    const app = window.todoApp = window.todoApp || {};

    function cacheElements() {
        const emptyState = document.getElementById('empty-state');

        return {
            body: document.body,
            form: document.getElementById('todo-form'),
            taskInput: document.getElementById('task-input'),
            prioritySelect: document.getElementById('priority'),
            dueDateInput: document.getElementById('due-date'),
            searchInput: document.getElementById('search-task'),
            filterButtons: Array.from(document.querySelectorAll('.filter-btn')),
            taskList: document.getElementById('task-list'),
            taskSection: document.querySelector('.task-section'),
            emptyState,
            emptyStateTitle: emptyState ? emptyState.querySelector('h2') : null,
            emptyStateMessage: emptyState ? emptyState.querySelector('p') : null,
            totalTasks: document.getElementById('total-tasks'),
            completedTasks: document.getElementById('completed-tasks'),
            pendingTasks: document.getElementById('pending-tasks'),
            themeToggle: document.querySelector('.theme-toggle')
        };
    }

    function setThemeToggle(theme, themeToggle) {
        if (!themeToggle) {
            return;
        }

        const isDarkTheme = theme === 'dark';
        const icon = themeToggle.querySelector('i');

        themeToggle.setAttribute('aria-pressed', String(isDarkTheme));
        themeToggle.setAttribute('aria-label', isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme');

        if (icon) {
            icon.className = isDarkTheme ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    function renderFilters(filterButtons, activeFilter) {
        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === activeFilter;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    function renderStats(elements, tasks) {
        const stats = app.filters.getTaskStats(tasks);

        if (elements.totalTasks) {
            elements.totalTasks.textContent = String(stats.total);
        }

        if (elements.completedTasks) {
            elements.completedTasks.textContent = String(stats.completed);
        }

        if (elements.pendingTasks) {
            elements.pendingTasks.textContent = String(stats.pending);
        }
    }

    function createTaskActionButton(label, className, iconClass, actionName, taskId) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = className;
        button.dataset.action = actionName;
        button.dataset.taskId = taskId;
        button.setAttribute('aria-label', label);

        const icon = document.createElement('i');
        icon.className = iconClass;
        button.append(icon);

        return button;
    }

    function createTaskItem(task) {
        const listItem = document.createElement('li');
        listItem.className = `task-item${task.completed ? ' task-completed' : ''}${task.overdue ? ' overdue' : ''}`;
        listItem.dataset.taskId = task.id;

        const leftSection = document.createElement('div');
        leftSection.className = 'task-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.dataset.action = 'toggle-task';
        checkbox.dataset.taskId = task.id;
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', task.completed ? `Mark ${task.title} as active` : `Mark ${task.title} as completed`);

        const content = document.createElement('div');
        content.className = 'task-content';

        const title = document.createElement('span');
        title.className = 'task-title';
        title.textContent = task.title;

        const metadata = document.createElement('div');
        metadata.className = 'task-meta';

        const dueDate = document.createElement('span');
        dueDate.className = 'task-date';
        dueDate.textContent = app.utils.getDueDateLabel(task);

        const priority = document.createElement('span');
        priority.className = `priority ${app.utils.getPriorityClass(task.priority)}`;
        priority.textContent = app.utils.getPriorityLabel(task.priority);

        metadata.append(dueDate, priority);
        content.append(title, metadata);
        leftSection.append(checkbox, content);

        const actions = document.createElement('div');
        actions.className = 'task-actions';
        actions.append(
            createTaskActionButton(
                `Edit ${task.title}`,
                'task-btn edit',
                'fa-solid fa-pen',
                'edit-task',
                task.id
            ),
            createTaskActionButton(
                `Delete ${task.title}`,
                'task-btn delete',
                'fa-solid fa-trash',
                'delete-task',
                task.id
            )
        );

        listItem.append(leftSection, actions);
        return listItem;
    }

    function renderTaskList(elements, tasks) {
        if (!elements.taskList) {
            return;
        }

        elements.taskList.replaceChildren(...tasks.map(createTaskItem));
    }

    function renderEmptyState(elements, state, visibleTasks) {
        if (!elements.emptyState || !elements.taskSection) {
            return;
        }

        const hasVisibleTasks = visibleTasks.length > 0;
        const hasTasks = state.tasks.length > 0;

        elements.taskSection.hidden = !hasVisibleTasks;
        elements.emptyState.hidden = hasVisibleTasks;

        if (hasVisibleTasks) {
            return;
        }

        if (!(elements.emptyStateTitle && elements.emptyStateMessage)) {
            return;
        }

        if (!hasTasks) {
            elements.emptyStateTitle.textContent = 'No Tasks Yet';
            elements.emptyStateMessage.textContent = 'Start by adding your first task.';
            return;
        }

        if (state.searchQuery) {
            elements.emptyStateTitle.textContent = 'No Matching Tasks';
            elements.emptyStateMessage.textContent = 'Try a different search term or clear the search box.';
            return;
        }

        if (state.filter === 'completed') {
            elements.emptyStateTitle.textContent = 'No Completed Tasks';
            elements.emptyStateMessage.textContent = 'Complete a task to see it here.';
            return;
        }

        if (state.filter === 'active') {
            elements.emptyStateTitle.textContent = 'No Active Tasks';
            elements.emptyStateMessage.textContent = 'All tasks are completed. Nice work.';
            return;
        }

        elements.emptyStateTitle.textContent = 'No Tasks Found';
        elements.emptyStateMessage.textContent = 'Add a new task to get started.';
    }

    function renderState(state, visibleTasks) {
        const { elements } = state;

        renderStats(elements, state.tasks);
        renderFilters(elements.filterButtons, state.filter);
        setThemeToggle(state.theme, elements.themeToggle);
        renderTaskList(elements, visibleTasks);
        renderEmptyState(elements, state, visibleTasks);
    }

    function resetForm(elements) {
        if (!elements.form) {
            return;
        }

        elements.form.reset();

        if (elements.prioritySelect) {
            elements.prioritySelect.value = 'medium';
        }

        if (elements.taskInput) {
            elements.taskInput.focus();
        }
    }

    app.ui = {
        cacheElements,
        setThemeToggle,
        renderFilters,
        renderStats,
        renderTaskList,
        renderEmptyState,
        renderState,
        resetForm
    };
})(window);