(function (window) {
    const app = window.todoApp = window.todoApp || {};

    const state = {
        elements: null,
        tasks: [],
        filter: 'all',
        searchQuery: '',
        theme: 'light'
    };

    function normalizeTasks(tasks) {
        return (Array.isArray(tasks) ? tasks : [])
            .map((task) => app.utils.normalizeTask(task))
            .filter(Boolean);
    }

    function render() {
        if (!state.elements) {
            return;
        }

        const visibleTasks = app.filters.getVisibleTasks(state.tasks, state.filter, state.searchQuery);
        app.ui.renderState(state, visibleTasks);
    }

    function persistTasks() {
        app.storage.saveTasks(state.tasks);
    }

    function loadThemePreference() {
        return app.storage.loadTheme() || app.utils.getPreferredTheme();
    }

    function applyTheme(theme, shouldPersist = false) {
        state.theme = app.utils.applyTheme(theme);

        if (shouldPersist) {
            app.storage.saveTheme(state.theme);
        }
    }

    function addTask({ title, priority, dueDate }) {
        const normalizedTitle = app.utils.normalizeTaskTitle(title);

        if (!normalizedTitle) {
            return false;
        }

        const task = app.utils.createTaskFromForm({
            title: normalizedTitle,
            priority,
            dueDate
        });

        if (!task) {
            return false;
        }

        state.tasks = [task, ...state.tasks];
        persistTasks();
        app.ui.resetForm(state.elements);
        render();
        return true;
    }

    function toggleTask(taskId, completed) {
        state.tasks = state.tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,
                completed,
                completedAt: completed ? new Date().toISOString() : null
            };
        });

        persistTasks();
        render();
    }

    function deleteTask(taskId) {
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
        persistTasks();
        render();
    }

    function editTask(taskId) {
        const currentTask = state.tasks.find((task) => task.id === taskId);

        if (!currentTask) {
            return false;
        }

        const nextTitle = window.prompt('Edit task title:', currentTask.title);

        if (nextTitle === null) {
            return false;
        }

        const normalizedTitle = app.utils.normalizeTaskTitle(nextTitle);

        if (!normalizedTitle) {
            return false;
        }

        state.tasks = state.tasks.map((task) => {
            if (task.id !== taskId) {
                return task;
            }

            return {
                ...task,
                title: normalizedTitle
            };
        });

        persistTasks();
        render();
        return true;
    }

    function setFilter(filter) {
        state.filter = filter;
        render();
    }

    function updateSearchQuery(query) {
        state.searchQuery = String(query ?? '');
        render();
    }

    function toggleTheme() {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, true);
        render();
    }

    function handleStorageChange(event) {
        if (!event || !event.key) {
            return;
        }

        if (event.key === app.storage.keys.tasks) {
            state.tasks = normalizeTasks(app.storage.loadTasks());
            render();
            return;
        }

        if (event.key === app.storage.keys.theme) {
            applyTheme(app.storage.loadTheme() || loadThemePreference());
            render();
        }
    }

    function init() {
        state.elements = app.ui.cacheElements();

        if (!state.elements.form) {
            return;
        }

        state.tasks = normalizeTasks(app.storage.loadTasks());
        applyTheme(loadThemePreference());

        app.events.bindEvents(state, {
            addTask,
            toggleTask,
            editTask,
            deleteTask,
            setFilter,
            updateSearchQuery,
            toggleTheme,
            handleStorageChange
        });

        render();
    }

    app.state = state;
    app.init = init;
    app.actions = {
        addTask,
        toggleTask,
        editTask,
        deleteTask,
        setFilter,
        updateSearchQuery,
        toggleTheme,
        handleStorageChange
    };

    document.addEventListener('DOMContentLoaded', init);
})(window);