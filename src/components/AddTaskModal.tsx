import clsx from "clsx";
import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Priority, Category, Data } from "../types";
import MinusIcon from "../assets/minus-icon.svg";
import CloseIcon from "../assets/close-icon.svg";

function getCategoryColor(category: Category): string {
    const colors = {
        meeting: "bg-blue-300",
        review: "bg-purple-300",
        marketing: "bg-pink-300",
        design: "bg-orange-300",
        other: "bg-gray-300",
    };
    return colors[category];
}

function getCategoryColorLight(category: Category): string {
    const colors = {
        meeting: "bg-blue-200",
        review: "bg-purple-200",
        marketing: "bg-pink-200",
        design: "bg-orange-200",
        other: "bg-gray-200",
    };
    return colors[category];
}

interface AddTaskModalProps {
    onClose: () => void;
    onSave: (taskData: Partial<Data>) => void;
}

export default function AddTaskModal({ onClose, onSave }: AddTaskModalProps) {
    const [newTask, setNewTask] = useState<Partial<Data>>({
        text: "",
        priority: "medium",
        category: "meeting",
        isRecurring: false,
        dueDate: undefined,
        dueTime: undefined,
    });

    const touchStartY = useRef<number>(0);
    const touchEndY = useRef<number>(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchEndY.current - touchStartY.current;
        const minSwipeDistance = 100;

        if (swipeDistance > minSwipeDistance) {
            onClose();
        }
    };

    const handleSave = () => {
        onSave(newTask);
    };

    const updateTaskText = (text: string) => {
        setNewTask(prev => ({ ...prev, text }));
    };

    const toggleCategory = (category: Category) => {
        setNewTask(prev => ({ ...prev, category }));
    };

    const togglePriority = (priority: Priority) => {
        setNewTask(prev => ({ ...prev, priority }));
    };

    const toggleRecurring = () => {
        setNewTask(prev => ({ ...prev, isRecurring: !prev.isRecurring }));
    };

    const updateDueDate = (date: Date | null) => {
        setNewTask(prev => ({ ...prev, dueDate: date || undefined }));
    };

    const updateDueTime = (time: string) => {
        setNewTask(prev => ({ ...prev, dueTime: time }));
    };
    return (
        <div>
            <div
                className="relative flex flex-col rounded-4xl bg-blue-500 p-6 text-white shadow-strong"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="absolute top-4 right-4">
                    <button
                        onClick={onClose}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-white/20 hover:text-white"
                    >
                        <img src={CloseIcon} alt="Close" className="h-3 w-3" />
                    </button>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 transform" style={{ top: "10px" }}>
                    <button onClick={onClose} className="text-white/80 transition-colors hover:text-white">
                        <img src={MinusIcon} alt="Minimize" className="h-6 w-6" />
                    </button>
                </div>

                <div className="mb-4 pt-16">
                    <input
                        type="text"
                        placeholder="What do you need to do?"
                        value={newTask.text || ""}
                        onChange={e => updateTaskText(e.target.value)}
                        className="w-full border-b border-white/20 bg-transparent pb-2 text-xl text-white placeholder-white/60 outline-none"
                    />
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                    {(["meeting", "review", "marketing", "design"] as Category[]).map(category => (
                        <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={clsx(
                                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                newTask.category === category
                                    ? "bg-white text-blue-500"
                                    : `${getCategoryColorLight(category)} text-gray-700 hover:${getCategoryColor(category)} hover:text-gray-800`,
                            )}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                            {category === "design" && " project"}
                        </button>
                    ))}
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-400 text-white">
                        +
                    </button>
                </div>

                <div className="mb-4 h-px bg-white/20"></div>

                <div className="mb-4">
                    <h3 className="mb-2 font-medium text-white">Priority</h3>
                    <div className="flex gap-4">
                        {(
                            [
                                { value: "high", label: "High!!!" },
                                { value: "medium", label: "Medium!!" },
                                { value: "low", label: "Low!" },
                                { value: "none", label: "None" },
                            ] as Array<{ value: Priority; label: string }>
                        ).map(({ value, label }) => (
                            <label key={value} className="flex items-center gap-1 text-white">
                                <input
                                    type="radio"
                                    name="priority"
                                    value={value}
                                    checked={newTask.priority === value}
                                    onChange={() => togglePriority(value)}
                                    className="h-4 w-4 bg-white text-blue-600"
                                />
                                <span className="text-xs">{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-4 h-px bg-white/20"></div>

                <div className="mb-4">
                    <h3 className="mb-2 font-medium text-white">Due Date & Time</h3>
                    <div className="flex flex-col gap-3">
                        <div>
                            <DatePicker
                                selected={newTask.dueDate}
                                onChange={updateDueDate}
                                placeholderText="Select due date"
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="time"
                                value={newTask.dueTime || ""}
                                onChange={e => updateDueTime(e.target.value)}
                                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-sm focus:border-white/40 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4 h-px bg-white/20"></div>

                <div className="flex flex-1 items-end">
                    <div className="flex w-full items-center justify-between">
                        <label className="flex items-center gap-2 text-white">
                            <input
                                type="checkbox"
                                checked={newTask.isRecurring || false}
                                onChange={toggleRecurring}
                                className="h-4 w-4 rounded bg-white text-blue-600"
                            />
                            <span>Recurring</span>
                        </label>
                        <button
                            onClick={handleSave}
                            className="rounded-5xl bg-white px-6 py-2 font-medium text-blue-500 shadow-medium transition-all hover:bg-gray-50 hover:shadow-strong"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
