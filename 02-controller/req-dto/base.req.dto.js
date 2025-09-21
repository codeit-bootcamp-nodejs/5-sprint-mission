export class BaseReqDto {
    #headers
    #params
    #query
    #body

    constructor({
        headers = {},
        params = {},
        query = {},
        body = {}
    }) {
        this.#headers = headers;
        this.#query = query;
        this.#params = params;
        this.#body = body;
    }

    get headers() {
        return this.#headers;
    }


    get params() {
        return this.#params;
    }


    get body() {
        return this.#body;
    }

    get query() {
        return this.#query;
    }
}