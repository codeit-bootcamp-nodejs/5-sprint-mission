export class BaseService {
  constructor(httpClient, baseUrl, resourceName) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
    this.resourceName = resourceName;
  }

  async handleRequest(requestFn, operation) {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      this.handleError(error, operation);
      throw error;
    }
  }

  handleError(error, operation) {
    if (error.isAxiosError && error.response && error.response.status >= 400) {
      console.error(`Failed to ${operation} ${this.resourceName}`);
    }
  }

  async getList(params) {
    return this.handleRequest(
      () =>
        this.httpClient.get(`${this.baseUrl}/${this.resourceName}`, { params }),
      "fetch"
    );
  }

  async getById(id) {
    return this.handleRequest(
      () => this.httpClient.get(`${this.baseUrl}/${this.resourceName}/${id}`),
      "fetch"
    );
  }

  async create(data) {
    return this.handleRequest(
      () => this.httpClient.post(`${this.baseUrl}/${this.resourceName}`, data),
      "create"
    );
  }

  async update(id, data) {
    return this.handleRequest(
      () =>
        this.httpClient.patch(
          `${this.baseUrl}/${this.resourceName}/${id}`,
          data
        ),
      "update"
    );
  }

  async delete(id) {
    return this.handleRequest(
      () =>
        this.httpClient.delete(`${this.baseUrl}/${this.resourceName}/${id}`),
      "delete"
    );
  }
}
