(function (window) {
    const STORAGE_KEYS = Object.freeze({
        tasks: 'todo-app.tasks',
        theme: 'todo-app.theme'
    });

    function isStorageAvailable() {
        try {
            const testKey = '__todo_app_test__';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    const canUseStorage = isStorageAvailable();

    function read(key, fallbackValue) {
        if (!canUseStorage) {
            return fallbackValue;
        }

        try {
            const rawValue = window.localStorage.getItem(key);
            return rawValue === null ? fallbackValue : JSON.parse(rawValue);
        } catch (error) {
            return fallbackValue;
        }
    }

    function write(key, value) {
        if (!canUseStorage) {
            return;
        }

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Ignore quota and serialization failures so the app keeps working.
        }
    }

    function loadTasks() {
        const tasks = read(STORAGE_KEYS.tasks, []);
        return Array.isArray(tasks) ? tasks : [];
    }

    function saveTasks(tasks) {
        write(STORAGE_KEYS.tasks, Array.isArray(tasks) ? tasks : []);
    }

    function loadTheme() {
        const theme = read(STORAGE_KEYS.theme, null);
        return theme === 'dark' || theme === 'light' ? theme : null;
    }

    function saveTheme(theme) {
        write(STORAGE_KEYS.theme, theme === 'dark' ? 'dark' : 'light');
    }

    window.todoApp = window.todoApp || {};
    window.todoApp.storage = {
        keys: STORAGE_KEYS,
        loadTasks,
        saveTasks,
        loadTheme,
        saveTheme
    };
})(window);