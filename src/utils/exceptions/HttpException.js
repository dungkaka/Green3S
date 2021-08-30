class HttpException extends Error {
    constructor(code = 100, message = "Error") {
        super(message);
        this.status = false;
        this.code = code;
        this.message = message;
    }
}

export default HttpException;
