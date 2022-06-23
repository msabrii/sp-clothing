import { HttpHeaderName, HttpContentType, HttpContentTypeCharset } from '../constants/httpHeaders';
import { HttpStatusCode } from '../constants/httpStatusCodes';

const defaultStatusCode = 500;

export interface ErrorResponseBody {
    message: string;
}

export class Response {
    public statusCode!: number;
    public body!: string;
    public headers: { [headerName: string]: string };

    constructor(statusCode?: number, body?: string | Object, headers: { [headerName: string]: string } = {}) {
        this.statusCode = statusCode && !Number.isNaN(statusCode) ? statusCode : defaultStatusCode;
        this.headers = headers;
        if (body !== undefined) {
            if (body instanceof Object) {
                this.body = JSON.stringify(body);
            } else if (this.statusCode !== HttpStatusCode.OK) {
                const errorResponse: ErrorResponseBody = {
                    message: body,
                };
                this.body = JSON.stringify(errorResponse);
            } else {
                this.body = body;
            }
        }
    }
}

export class HtmlResponse {
    public statusCode: number;
    public body?: string;
    public headers: { [key: string]: string };

    constructor(statusCode?: number, body?: string) {
        this.statusCode = statusCode && !Number.isNaN(statusCode) ? statusCode : defaultStatusCode;
        this.body = body;
        this.headers = {};
        this.headers[HttpHeaderName.ContentType] = `${HttpContentType.Html}; ${HttpContentTypeCharset.Utf8}`;
    }
}
