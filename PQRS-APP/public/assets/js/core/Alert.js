// ============================================================
// Alert - Toasts y modales de confirmación/información
// ============================================================

export class Alert {
    // ------------------------------------------------------------
    // TOASTS
    // ------------------------------------------------------------

    /**
     * Muestra un toast flotante.
     * @param {string} message
     * @param {string} type - 'success', 'danger', 'warning', 'info'
     * @param {number} duration - ms (default 4000)
     */
    static toast(message, type = 'success', duration = 4000) {
        const container = this._getToastContainer();

        const icons = {
            success: 'bi-check-circle-fill',
            danger:  'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info:    'bi-info-circle-fill',
        };

        const bgClass = {
            success: 'text-bg-success',
            danger:  'text-bg-danger',
            warning: 'text-bg-warning',
            info:    'text-bg-info',
        }[type] || 'text-bg-secondary';

        const toast = document.createElement('div');
        toast.className = `toast align-items-center ${bgClass} border-0 show mb-2`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="bi ${icons[type] || icons.info}"></i>
                    <span>${this._escapeHtml(message)}</span>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        container.appendChild(toast);

        // Auto-eliminar después del tiempo
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);

        // Botón de cerrar
        toast.querySelector('.btn-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }

    static success(message) { this.toast(message, 'success'); }
    static error(message)   { this.toast(message, 'danger'); }
    static warning(message) { this.toast(message, 'warning'); }
    static info(message)    { this.toast(message, 'info'); }

    // ------------------------------------------------------------
    // MODAL DE CONFIRMACIÓN
    // ------------------------------------------------------------

    /**
     * Muestra un modal de confirmación.
     * @param {string} title
     * @param {string} message
     * @param {object} options - { confirmText, cancelText, confirmClass }
     * @returns {Promise<boolean>} true si confirma, false si cancela.
     */
    static confirm(title, message, options = {}) {
        const {
            confirmText = 'Confirmar',
            cancelText  = 'Cancelar',
            confirmClass = 'btn-danger',
        } = options;

        return new Promise((resolve) => {
            const modalId = 'confirmModal_' + Date.now();
            const modalHtml = `
                <div class="modal fade" id="${modalId}" tabindex="-1" data-bs-backdrop="static">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${this._escapeHtml(title)}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <p class="mb-0">${this._escapeHtml(message)}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
                                <button type="button" class="btn ${confirmClass}" id="${modalId}_confirm">${confirmText}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            const modalEl = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalEl);

            let confirmed = false;

            document.getElementById(`${modalId}_confirm`).addEventListener('click', () => {
                confirmed = true;
                modal.hide();
            });

            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.remove();
                resolve(confirmed);
            });

            modal.show();
        });
    }

    // ------------------------------------------------------------
    // MODAL INFORMATIVO
    // ------------------------------------------------------------

    /**
     * Muestra un modal informativo (solo botón "Aceptar").
     * @param {string} title
     * @param {string} message - Puede contener HTML simple (se inserta tal cual).
     */
    static info(title, message) {
        return new Promise((resolve) => {
            const modalId = 'infoModal_' + Date.now();
            const modalHtml = `
                <div class="modal fade" id="${modalId}" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${this._escapeHtml(title)}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">${message}</div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modalEl = document.getElementById(modalId);
            const modal = new bootstrap.Modal(modalEl);
            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.remove();
                resolve();
            });
            modal.show();
        });
    }

    // ------------------------------------------------------------
    // HELPERS PRIVADOS
    // ------------------------------------------------------------

    static _getToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        return container;
    }

    static _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}