const request = require('request');

const baseUrl = 'http://localhost:3000'

export namespace http {
    export async function get(url: string) {
        return new Promise((resolve, reject) => {
            request(`${baseUrl}${url}`, { json: true }, (err: any, res: any, body: any) => {
                if (err) { return reject(err); }
                resolve(body);
            });
        })
    }
}