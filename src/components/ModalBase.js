class ModalBase extends HTMLElement {
    constructor() {
        super();
        
        this.innerHTML = `
            <div id="modal-background" 
                 class="fixed inset-0 bg-black bg-opacity-50 hidden flex justify-center items-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div class="mb-4">
                        <slot name="header">
                            <h2 class="text-xl font-bold">Confirm Action</h2>
                        </slot>
                    </div>
                    
                    <div class="mb-6">
                        <slot name="content">
                            <p>Are you sure you want to proceed?</p>
                        </slot>
                    </div>

                    <div class="flex justify-end gap-2">
                        <slot name="actions">
                            <button class="button secondary" data-action="cancel">Cancel</button>
                            <button class="button primary" data-action="confirm">Confirm</button>
                        </slot>
                    </div>
                </div>
            </div>
        `;

        this._background = this.querySelector('#modal-background');
        this._resolvePromise = null;
        this._rejectPromise = null;
    }

    connectedCallback() {
        this._background.addEventListener('click', (e) => {
            if (e.target.id === 'modal-background') {
                this.hide();
                if (this._rejectPromise) this._rejectPromise('cancelled');
            }
        });

        this.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'confirm' && this._resolvePromise) {
                this._resolvePromise(true);
                this.hide();
            } else if (action === 'cancel' && this._rejectPromise) {
                this._rejectPromise('cancelled');
                this.hide();
            }
        });
    }

    show() {
        this._background.classList.remove('hidden');
        return new Promise((resolve, reject) => {
            this._resolvePromise = resolve;
            this._rejectPromise = reject;
        });
    }

    hide() {
        this._background.classList.add('hidden');
        this._resolvePromise = null;
        this._rejectPromise = null;
    }

    setContent({ header, content, actions }) {
        if (header) {
            const headerSlot = this.querySelector('slot[name="header"]');
            headerSlot.innerHTML = header;
        }
        if (content) {
            const contentSlot = this.querySelector('slot[name="content"]');
            contentSlot.innerHTML = content;
        }
        if (actions) {
            const actionsSlot = this.querySelector('slot[name="actions"]');
            actionsSlot.innerHTML = actions;
        }
    }
}

// Register the custom element
customElements.define('modal-base', ModalBase); 