class HttpError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.code = code;

        if (!message) {
            throw new Error("Un message n'a pas été passé pour l'erreur.")
        }

        if (!code) {
            throw new Error("Un code http n'a pas été passé pour l'erreur.")
        }
    }
}

module.exports = HttpError;