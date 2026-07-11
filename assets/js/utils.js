(function (window) {
    const app = window.todoApp = window.todoApp || {};

    const PRIORITY_LABELS = Object.freeze({
        low: 'Low',
        medium: 'Medium',
        high: 'High'
    });

    const PRIORITY_ORDER = Object.freeze({
        low: 1,
        medium: 2,
        high: 3
    });

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    function createTaskId() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
        }

        return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function normalizePriority(priority) {
        return Object.prototype.hasOwnProperty.call(PRIORITY_ORDER, priority) ? priority : 'medium';
    }

    function normalizeTaskTitle(title) {
        return String(title ?? '')
            .trim()
            .replace(/\s+/g, ' ');
    }

    function normalizeTask(task) {
        if (!task || typeof task !== 'object') {
            return null;
        }

        const title = normalizeTaskTitle(task.title);

        if (!title) {
            return null;
        }

        return {
            id: String(task.id || createTaskId()),
            title,
            priority: normalizePriority(task.priority),
            dueDate: typeof task.dueDate === 'string' ? task.dueDate : '',
            completed: Boolean(task.completed),
            createdAt: typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString(),
            completedAt: typeof task.completedAt === 'string' ? task.completedAt : null
        };
    }

    function createTaskFromForm({ title, priority, dueDate }) {
        return normalizeTask({
            id: createTaskId(),
            title,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        });
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return '';
        }

        const parsedDate = new Date(`${dateValue}T12:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            return '';
        }

        return dateFormatter.format(parsedDate);
    }

    function getTodayValue() {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
    }

    function isOverdue(task) {
        if (!task || task.completed || !task.dueDate) {
            return false;
        }

        return task.dueDate < getTodayValue();
    }

    function getPriorityLabel(priority) {
        return PRIORITY_LABELS[priority] || PRIORITY_LABELS.medium;
    }

    function getPriorityClass(priority) {
        return normalizePriority(priority);
    }

    function getDueDateLabel(task) {
        if (!task || !task.dueDate) {
            return 'No due date';
        }

        const formattedDate = formatDate(task.dueDate);

        if (task.completed) {
            return `Completed · ${formattedDate}`;
        }

        if (isOverdue(task)) {
            return `Overdue · ${formattedDate}`;
        }

        return `Due · ${formattedDate}`;
    }

    function resolveTheme(theme) {
        return theme === 'dark' ? 'dark' : 'light';
    }

    function getPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    function applyTheme(theme) {
        const resolvedTheme = resolveTheme(theme);
        document.body.dataset.theme = resolvedTheme;
        document.documentElement.dataset.theme = resolvedTheme;
        return resolvedTheme;
    }

    app.utils = {
        priorityOrder: PRIORITY_ORDER,
        createTaskId,
        normalizePriority,
        normalizeTaskTitle,
        normalizeTask,
        createTaskFromForm,
        formatDate,
        getDueDateLabel,
        isOverdue,
        getPriorityLabel,
        getPriorityClass,
        resolveTheme,
        getPreferredTheme,
        applyTheme
    };
})(window);