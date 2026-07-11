(function (window) {
    const app = window.todoApp = window.todoApp || {};

    function normalizeQuery(query) {
        return String(query ?? '').trim().toLowerCase();
    }

    function matchesFilter(task, filter) {
        if (filter === 'completed') {
            return task.completed;
        }

        if (filter === 'active') {
            return !task.completed;
        }

        return true;
    }

    function matchesQuery(task, query) {
        if (!query) {
            return true;
        }

        const haystack = [
            task.title,
            app.utils.getPriorityLabel(task.priority),
            app.utils.getDueDateLabel(task),
            task.completed ? 'completed' : 'active'
        ]
            .join(' ')
            .toLowerCase();

        return haystack.includes(query);
    }

    function getVisibleTasks(tasks, filter, query) {
        const normalizedTasks = Array.isArray(tasks) ? tasks : [];
        const normalizedQuery = normalizeQuery(query);

        return normalizedTasks.filter((task) => matchesFilter(task, filter) && matchesQuery(task, normalizedQuery));
    }

    function getTaskStats(tasks) {
        const normalizedTasks = Array.isArray(tasks) ? tasks : [];
        const completedCount = normalizedTasks.filter((task) => task.completed).length;

        return {
            total: normalizedTasks.length,
            completed: completedCount,
            pending: normalizedTasks.length - completedCount
        };
    }

    app.filters = {
        normalizeQuery,
        getVisibleTasks,
        getTaskStats
    };
})(window);