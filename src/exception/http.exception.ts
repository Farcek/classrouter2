export abstract class HttpException extends Error {

    constructor(
        public readonly name: string,
        public readonly message: string,
        public readonly status: number
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message
        }
    }
}