export type Priority = "high" | "medium" | "low" | "none";
export type Category = "meeting" | "review" | "marketing" | "design" | "other";
export type FilterType = "all" | "undone" | "meeting" | "consummation";

export interface Data {
    id: string;
    isCompleted: boolean;
    text: string;
    priority: Priority;
    category: Category;
    dueDate?: Date;
    dueTime?: string;
    isRecurring: boolean;
}
