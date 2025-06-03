import clsx from "clsx";
import type { Data, Category } from "../types";

interface TodoItemProps {
    todo: Data;
    onToggleCompletion: (id: string) => void;
    onDelete?: (id: string) => void;
}

function getCategoryColor(category: Category): string {
    const colors = {
        meeting: "bg-blue-500",
        review: "bg-purple-500",
        marketing: "bg-pink-500",
        design: "bg-orange-500",
        other: "bg-gray-500",
    };
    return colors[category];
}

function getCategoryColorHover(category: Category): string {
    const colors = {
        meeting: "bg-blue-400",
        review: "bg-purple-400",
        marketing: "bg-pink-400",
        design: "bg-orange-400",
        other: "bg-gray-400",
    };
    return colors[category];
}

function getCategoryTextColor(category: Category): string {
    const colors = {
        meeting: "text-blue-600",
        review: "text-purple-600",
        marketing: "text-pink-600",
        design: "text-orange-600",
        other: "text-gray-600",
    };
    return colors[category];
}

function getCategoryBgColor(category: Category): string {
    const colors = {
        meeting: "bg-blue-50",
        review: "bg-purple-50",
        marketing: "bg-pink-50",
        design: "bg-orange-50",
        other: "bg-gray-50",
    };
    return colors[category];
}

export default function TodoItem({ todo, onToggleCompletion, onDelete }: TodoItemProps) {
    return (
        <div className="rounded-2xl bg-todo-bg p-5 shadow-card transition-shadow hover:shadow-medium">
            <div className="flex justify-between">
                <div className="flex flex-1 gap-3">
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onToggleCompletion(todo.id)}
                                className={clsx(
                                    "h-2.5 w-2.5 cursor-pointer rounded-full transition-colors",
                                    todo.isCompleted
                                        ? "bg-green-500"
                                        : `${getCategoryColor(todo.category)} hover:${getCategoryColorHover(todo.category)}`,
                                )}
                            ></button>
                            <h3
                                className={clsx(
                                    "font-medium",
                                    todo.isCompleted ? "text-gray-500 line-through" : "text-gray-800",
                                )}
                            >
                                {todo.text}
                            </h3>
                        </div>
                        <div className="ml-6 flex flex-col gap-y-2">
                            <span
                                className={clsx(
                                    "self-start rounded-full px-2 py-1 text-xs font-medium",
                                    getCategoryBgColor(todo.category),
                                    getCategoryTextColor(todo.category),
                                )}
                            >
                                {todo.category}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {todo.dueTime && <span className="text-xs text-gray-400">{todo.dueTime}</span>}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="rounded px-2 py-1 text-sm text-red-400 transition-colors hover:text-red-600"
                            title="Delete task"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
