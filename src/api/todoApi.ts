import type { Data } from "../types";

const BASE_URL = "http://localhost:3000";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
    error?: string;
}

export interface CreateTaskRequest {
    text: string;
    priority?: "high" | "medium" | "low" | "none";
    category?: "meeting" | "review" | "marketing" | "design" | "other";
    dueDate?: string;
    dueTime?: string;
    isRecurring?: boolean;
}

class TodoApi {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${BASE_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    ...options?.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "API request failed");
            }

            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    async getAllTasks(): Promise<Data[]> {
        const response = await this.request<ApiResponse<Data[]>>("/tasks");
        return (
            response.data?.map(task => ({
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            })) || []
        );
    }

    async getTaskById(id: string): Promise<Data | null> {
        try {
            const response = await this.request<ApiResponse<Data>>(`/tasks/${id}`);
            const task = response.data;
            if (!task) return null;

            return {
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            };
        } catch (error) {
            console.error(`Failed to get task ${id}:`, error);
            return null;
        }
    }

    async createTask(taskData: CreateTaskRequest): Promise<Data> {
        const response = await this.request<ApiResponse<Data>>("/tasks", {
            method: "POST",
            body: JSON.stringify(taskData),
        });

        const task = response.data!;
        return {
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        };
    }

    async updateTask(id: string, updates: Partial<Data>): Promise<Data | null> {
        try {
            const requestBody = {
                ...updates,
                dueDate: updates.dueDate ? updates.dueDate.toISOString().split("T")[0] : undefined,
            };

            const response = await this.request<ApiResponse<Data>>(`/tasks/${id}`, {
                method: "PUT",
                body: JSON.stringify(requestBody),
            });

            const task = response.data;
            if (!task) return null;

            return {
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            };
        } catch (error) {
            console.error(`Failed to update task ${id}:`, error);
            return null;
        }
    }

    async deleteTask(id: string): Promise<boolean> {
        try {
            await this.request<ApiResponse<void>>(`/tasks/${id}`, {
                method: "DELETE",
            });
            return true;
        } catch (error) {
            console.error(`Failed to delete task ${id}:`, error);
            return false;
        }
    }

    async toggleTaskCompletion(id: string): Promise<Data | null> {
        try {
            const response = await this.request<ApiResponse<Data>>(`/tasks/${id}/toggle`, {
                method: "PATCH",
            });

            const task = response.data;
            if (!task) return null;

            return {
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            };
        } catch (error) {
            console.error(`Failed to toggle task ${id}:`, error);
            return null;
        }
    }
}

export const todoApi = new TodoApi();
