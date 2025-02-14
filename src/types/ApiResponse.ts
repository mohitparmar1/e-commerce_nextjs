export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    userId?: string;
    role?: string;
}