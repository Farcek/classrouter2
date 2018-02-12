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
        var alt: any = {};
        var self: any = this;
        Object.getOwnPropertyNames(self)
            .map((key) => {
                if (key === 'stack') return;
                if (key === 'status') return;
                alt[key] = self[key];
            });

        return alt;
    }
}