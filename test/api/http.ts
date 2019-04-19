const request = require('request');

const baseUrl = 'http://localhost:3000'

export namespace http {
    export async function get(url: string) {
        return new Promise((resolve, reject) => {
            request({
                method: 'get',
                json: true,
                url: `${baseUrl}${url}`
            }, (err: any, res: any, body: any) => {
                if (err) { return reject(err); }
                resolve(body);
            });
        })
    }
    export async function post(url: string, data: any) {
        return new Promise((resolve, reject) => {

            request({
                method: 'post',
                body: data,
                json: true,
                url: `${baseUrl}${url}`
            }, (err: any, res: any, body: any) => {
                if (err) { return reject(err); }
                resolve(body);
            });
        })
    }
}