export interface ApiResponse {
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
    userId?: string;
    role?: string;
}