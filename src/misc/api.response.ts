export class ApiResponse {
    status: 'error' | 'ok';
    message: string | null = null;
    statusCode: number;

    constructor(status: 'error' | 'ok', message: string | null = null, statusCode: number) {
        this.status = status
        this.message = message
        this.statusCode = statusCode
    }
}