function initSkillTree() {
    return {
        app: null,
        init() {
            this.waitForPixi();
        },
        async createApp() {
            const appContainer = document.getElementById('skill-tree-app');
            if (appContainer) {
                this.app = new PIXI.Application();
                await this.app.init({
                width: 800,
                height: 800,
                resizeTo: appContainer,
                backgroundColor: 0x1099bb,
            });

            appContainer.appendChild(this.app.canvas);
            }
        },
        waitForPixi() {
            if (typeof PIXI === 'undefined') {
                setTimeout(this.waitForPixi.bind(this), 100);
            } else {
                this.createApp();
            }
        }
    }
}
