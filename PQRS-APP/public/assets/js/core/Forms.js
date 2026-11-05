// ============================================================
// Forms - Serialización, validación, errores y bloqueo
// ============================================================

export class Forms {
    // ------------------------------------------------------------
    // SERIALIZACIÓN
    // ------------------------------------------------------------

    /**
     * Serializa un formulario a un objeto plano.
     * @param {HTMLFormElement} formElement
     * @returns {object}
     */
    static serialize(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        for (const [key, value] of formData.entries()) {
            // Si la clave ya existe (checkboxes múltiples), convertir a array
            if (data[key] !== undefined) {
                if (!Array.isArray(data[key])) data[key] = [data[key]];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        return data;
    }

    // ------------------------------------------------------------
    // VALIDACIÓN
    // ------------------------------------------------------------

    /**
     * Valida un formulario según reglas.
     * @param {HTMLFormElement} formElement
     * @param {object} rules - ej: { username: { required: true, minLength: 3 }, email: { required: true, email: true } }
     * @returns {object} Errores por campo (vacío si no hay errores).
     */
    static validate(formElement, rules) {
        const data = this.serialize(formElement);
        const errors = {};

        for (const [field, rule] of Object.entries(rules)) {
            const value = data[field];

            if (rule.required && (!value || String(value).trim() === '')) {
                errors[field] = `El campo ${rule.label || field} es obligatorio.`;
                continue;
            }

            // Si el valor está vacío y no es requerido, no validar más
            if (!value || String(value).trim() === '') continue;

            if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors[field] = `El ${rule.label || field} no es un email válido.`;
            }
            if (rule.minLength && String(value).length < rule.minLength) {
                errors[field] = `El ${rule.label || field} debe tener al menos ${rule.minLength} caracteres.`;
            }
            if (rule.maxLength && String(value).length > rule.maxLength) {
                errors[field] = `El ${rule.label || field} no debe superar ${rule.maxLength} caracteres.`;
            }
            if (rule.numeric && isNaN(Number(value))) {
                errors[field] = `El ${rule.label || field} debe ser numérico.`;
            }
            if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
                errors[field] = rule.patternMessage || `El ${rule.label || field} no tiene un formato válido.`;
            }
        }

        return errors;
    }

    // ------------------------------------------------------------
    // MOSTRAR / LIMPIAR ERRORES
    // ------------------------------------------------------------

    /**
     * Muestra los errores en el formulario (usa clases de Bootstrap).
     * @param {HTMLFormElement} formElement
     * @param {object} errors - { campo: 'mensaje' }
     */
    static showErrors(formElement, errors) {
        this.clearErrors(formElement);

        for (const [field, message] of Object.entries(errors)) {
            const input = formElement.querySelector(`[name="${field}"]`);
            if (!input) continue;

            input.classList.add('is-invalid');

            // Buscar el contenedor .invalid-feedback
            let feedback = input.parentElement.querySelector('.invalid-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                input.parentElement.appendChild(feedback);
            }
            feedback.textContent = message;
        }
    }

    /**
     * Limpia todos los errores visuales del formulario.
     * @param {HTMLFormElement} formElement
     */
    static clearErrors(formElement) {
        formElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        formElement.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
    }

    // ------------------------------------------------------------
    // BLOQUEO / DESBLOQUEO
    // ------------------------------------------------------------

    /**
     * Bloquea todos los inputs, selects, textareas y botones del formulario.
     * @param {HTMLFormElement} formElement
     */
    static lock(formElement) {
        formElement.querySelectorAll('input, select, textarea, button').forEach(el => {
            el.disabled = true;
        });
        formElement.dataset.locked = 'true';
    }

    /**
     * Desbloquea todos los elementos del formulario.
     * @param {HTMLFormElement} formElement
     */
    static unlock(formElement) {
        formElement.querySelectorAll('input, select, textarea, button').forEach(el => {
            el.disabled = false;
        });
        formElement.dataset.locked = 'false';
    }

    /**
     * Verifica si el formulario está bloqueado.
     * @param {HTMLFormElement} formElement
     * @returns {boolean}
     */
    static isLocked(formElement) {
        return formElement.dataset.locked === 'true';
    }

    /**
     * Resetea el formulario y limpia errores.
     * @param {HTMLFormElement} formElement
     */
    static reset(formElement) {
        formElement.reset();
        this.clearErrors(formElement);
        formElement.dataset.locked = 'false';
    }

    // ------------------------------------------------------------
    // SUBMIT CON BLOQUEO AUTOMÁTICO
    // ------------------------------------------------------------

    /**
     * Ejecuta un handler de submit con bloqueo automático.
     * Si el formulario ya está bloqueado, no hace nada.
     * @param {HTMLFormElement} formElement
     * @param {function} handler - async () => { ... }
     */
    static async submit(formElement, handler) {
        if (this.isLocked(formElement)) return;

        this.lock(formElement);
        try {
            await handler();
        } catch (error) {
            console.error('Forms.submit error:', error);
        } finally {
            this.unlock(formElement);
        }
    }
}