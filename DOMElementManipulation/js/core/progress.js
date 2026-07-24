const Progress = {
    _state: { modules: {} },

    init() {
        this._state = { modules: {} };
        this.updateProgressBar();
    },

    completeModule(moduleId) {
        this._state.modules[moduleId] = 'completed';
        this.updateProgressBar();
    },

    isModuleCompleted(moduleId) {
        return this._state.modules[moduleId] === 'completed';
    },

    isModuleUnlocked(moduleId) {
        const mod = window.AppConstants.MODULES.find(m => m.id === moduleId);
        if (!mod) return false;

        if (mod.level === 1) return true;

        for (let lvl = 1; lvl < mod.level; lvl++) {
            const levelObj = window.AppConstants.LEVELS.find(l => l.id === lvl);
            if (!levelObj) continue;
            for (const mid of levelObj.moduleIds) {
                if (!this.isModuleCompleted(mid)) return false;
            }
        }
        return true;
    },

    getCompletedCount() {
        return Object.values(this._state.modules).filter(v => v === 'completed').length;
    },

    getTotalCount() {
        return window.AppConstants.MODULES.length;
    },

    getProgressPercent() {
        return window.MathHelper.percentage(this.getCompletedCount(), this.getTotalCount());
    },

    getLevelStatus(levelId) {
        const levelObj = window.AppConstants.LEVELS.find(l => l.id === levelId);
        if (!levelObj) return 'locked';

        const allCompleted = levelObj.moduleIds.every(mid => this.isModuleCompleted(mid));
        if (allCompleted) return 'completed';

        const anyUnlocked = levelObj.moduleIds.some(mid => this.isModuleUnlocked(mid));
        if (anyUnlocked) return 'active';

        return 'locked';
    },

    updateProgressBar() {
        const percent = this.getProgressPercent();
        const fill = document.querySelector(`.${window.UIConstants.APP_PROGRESS.FILL}`);
        const text = document.querySelector(`.${window.UIConstants.APP_PROGRESS.TEXT}`);

        if (fill) fill.style.width = `${percent}%`;
        if (text) text.textContent = `${this.getCompletedCount()} / ${this.getTotalCount()} experiments`;
    },

    reset() {
        this._state = { modules: {} };
        this.updateProgressBar();
    }
};

window.Progress = Progress;
window.ProgressTracker = Progress;
