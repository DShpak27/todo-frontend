import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import { FiCalendar } from "react-icons/fi";
import { FiSearch, FiX } from "react-icons/fi";
import clsx from "clsx";

import FilterButton from "./components/FilterButton";

type Priority = "high" | "medium" | "low" | "none";
type Category = "meeting" | "review" | "marketing" | "design" | "other";
type FilterType = "all" | "undone" | "meeting" | "consummation";

interface Data {
    id: string;
    isCompleted: boolean;
    text: string;
    description?: string;
    priority: Priority;
    category: Category;
    time?: string;
    assignees: string[];
    isRecurring: boolean;
}

const data: Data[] = [
    {
        id: "1",
        isCompleted: false,
        text: "Project daily stand-up",
        description: "Go over yesterday's Outcomes",
        priority: "medium",
        category: "meeting",
        time: "9:30 am",
        assignees: ["👨‍💼", "👩‍💻", "👨‍🎨"],
        isRecurring: true,
    },
    {
        id: "2",
        isCompleted: false,
        text: "Interna new UI style",
        description: "Remember to bring presents",
        priority: "high",
        category: "design",
        time: "11:30 am",
        assignees: ["👩‍💻", "👨‍🎨"],
        isRecurring: false,
    },
    {
        id: "3",
        isCompleted: false,
        text: "Weekly Review",
        description: "Wendy Square 23",
        priority: "low",
        category: "review",
        time: "1:30 pm",
        assignees: ["👨‍💼", "👩‍💻"],
        isRecurring: true,
    },
    {
        id: "4",
        isCompleted: false,
        text: "Interview",
        description: "Remember to bring laptop",
        priority: "high",
        category: "meeting",
        time: "4:30 pm",
        assignees: ["👨‍💼"],
        isRecurring: false,
    },
];

function App() {
    const [todos, setTodos] = useState<Data[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [newTask, setNewTask] = useState<Partial<Data>>({
        text: "",
        description: "",
        priority: "medium",
        category: "meeting",
        assignees: [],
        isRecurring: false,
    });
    const searchInputRef = useRef<HTMLInputElement>(null);

    const addTodo = () => {
        if (newTask.text?.trim()) {
            const task: Data = {
                id: nanoid(),
                isCompleted: false,
                text: newTask.text,
                description: newTask.description || "",
                priority: newTask.priority || "medium",
                category: newTask.category || "meeting",
                assignees: newTask.assignees || [],
                isRecurring: newTask.isRecurring || false,
            };
            setTodos(prev => [...prev, task]);
            setNewTask({
                text: "",
                description: "",
                priority: "medium",
                category: "meeting",
                assignees: [],
                isRecurring: false,
            });
            setShowAddModal(false);
        }
    };

    const togglePriority = (priority: Priority) => {
        setNewTask(prev => ({ ...prev, priority }));
    };

    const toggleCategory = (category: Category) => {
        setNewTask(prev => ({ ...prev, category }));
    };

    const toggleRecurring = () => {
        setNewTask(prev => ({ ...prev, isRecurring: !prev.isRecurring }));
    };

    const updateTaskText = (text: string) => {
        setNewTask(prev => ({ ...prev, text }));
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleSearchClick = () => {
        searchInputRef.current?.focus();
    };

    const handleFilterClick = (filter: FilterType) => {
        if (activeFilter === filter) {
            setActiveFilter("all");
        } else {
            setActiveFilter(filter);
        }
    };

    const toggleTodoCompletion = (id: string) => {
        setTodos(prev => prev.map(todo => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo)));
    };

    const undoneTodos = todos.filter(todo => !todo.isCompleted);
    const meetingTodos = todos.filter(todo => todo.category === "meeting");
    const completedTodos = todos.filter(todo => todo.isCompleted);

    const filteredTodos = todos.filter(todo => {
        // Спочатку фільтруємо за активним фільтром
        let matchesFilter = true;

        if (activeFilter === "undone") {
            matchesFilter = !todo.isCompleted;
        } else if (activeFilter === "meeting") {
            matchesFilter = todo.category === "meeting";
        } else if (activeFilter === "consummation") {
            matchesFilter = todo.isCompleted;
        }

        // Потім фільтруємо за пошуковим запитом
        const matchesSearch =
            !searchQuery.trim() ||
            todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    useEffect(() => {
        setTodos(data);
    }, []);

    if (showAddModal) {
        return (
            <div className="mx-auto min-h-screen max-w-3xl bg-custom-blue px-6 pt-20 text-3xl md:my-2 md:rounded-3xl md:pt-18 md:shadow-2xs">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="font-custom text-2xl font-bold text-gray-800">Today</h1>
                        <p className="text-sm text-gray-500">18 Jun 2019, Tuesday</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 shadow-card">
                        <FiCalendar className="text-gray-600" size={16} />
                    </div>
                </div>

                <div className="rounded-4xl bg-blue-500 p-6 text-white shadow-strong">
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-white/80">─</span>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="text-xl text-white/80 transition-colors hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="What do you need to do?"
                            value={newTask.text || ""}
                            onChange={e => updateTaskText(e.target.value)}
                            className="w-full border-b border-white/20 bg-transparent pb-2 text-xl text-white placeholder-white/60 outline-none"
                        />
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                        {(["meeting", "review", "marketing", "design"] as Category[]).map(category => (
                            <button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={clsx(
                                    "rounded-full px-4 py-2 text-sm font-medium",
                                    newTask.category === category ? "bg-white text-blue-500" : "bg-blue-400 text-white",
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

                    <div className="mb-6">
                        <h3 className="mb-4 font-medium text-white">Priority</h3>
                        <div className="flex gap-4">
                            {(
                                [
                                    { value: "high", label: "High !!!" },
                                    { value: "medium", label: "Medium !!" },
                                    { value: "low", label: "Low !" },
                                    { value: "none", label: "None" },
                                ] as Array<{ value: Priority; label: string }>
                            ).map(({ value, label }) => (
                                <label key={value} className="flex items-center gap-2 text-white">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={value}
                                        checked={newTask.priority === value}
                                        onChange={() => togglePriority(value)}
                                        className="h-4 w-4 bg-white text-blue-600"
                                    />
                                    <span className="text-sm">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="mb-4 font-medium text-white">Invite</h3>
                        <div className="flex gap-2">
                            {["👨‍💼", "👩‍💻", "👨‍🎨", "👩‍🎨"].map((avatar, index) => (
                                <div
                                    key={index}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg"
                                >
                                    {avatar}
                                </div>
                            ))}
                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white">
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
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
                            onClick={addTodo}
                            className="rounded-5xl bg-white px-6 py-2 font-medium text-blue-500 shadow-medium transition-all hover:bg-gray-50 hover:shadow-strong"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-full max-w-3xl bg-ghost-white px-6 pt-16 md:my-2 md:rounded-5xl md:pt-14 md:shadow-medium">
            <div className="mb-5.5 flex items-center justify-between">
                <div className="flex flex-col gap-y-1.5">
                    <h1 className="text-3xl font-bold text-charcoal">Today</h1>
                    <p className="text-xs font-medium text-gray-400">18 Jun 2019, Tuesday</p>
                </div>
                <div className="pr-0.5">
                    <FiCalendar className="text-gray-400" size={18} />
                </div>
            </div>

            <div className="relative mb-4 flex items-center justify-center gap-x-2 rounded-4xl bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-400">
                {!(isSearchFocused || searchQuery.trim()) && (
                    <div
                        className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center gap-x-1.5 text-ghost-white"
                        onClick={handleSearchClick}
                    >
                        <FiSearch size={18} />
                        <span>Search</span>
                    </div>
                )}
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full bg-transparent px-6 py-1.5 text-white outline-none"
                />
                {searchQuery.trim() && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <FiX size={16} />
                    </button>
                )}
            </div>

            <div className="mb-6 flex gap-3">
                <FilterButton
                    filter="undone"
                    label="Undone"
                    activeFilter={activeFilter}
                    count={undoneTodos.length}
                    badgeColor="red"
                    onClick={handleFilterClick}
                />
                <FilterButton
                    filter="meeting"
                    label="Meetings"
                    activeFilter={activeFilter}
                    count={meetingTodos.length}
                    badgeColor="green"
                    onClick={handleFilterClick}
                />
                <FilterButton
                    filter="consummation"
                    label="Consummation"
                    activeFilter={activeFilter}
                    count={completedTodos.length}
                    badgeColor="purple"
                    onClick={handleFilterClick}
                />
                {activeFilter !== "all" && (
                    <button
                        onClick={() => handleFilterClick("all")}
                        className="rounded-3xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-600 transition-all duration-300 hover:scale-102 hover:bg-gray-200 hover:shadow-md"
                    >
                        Clear filter
                    </button>
                )}
            </div>

            <div className="mb-6 space-y-3">
                {filteredTodos.length === 0 && searchQuery.trim() ? (
                    <div className="py-8 text-center text-gray-500">
                        <div className="mb-2 text-2xl">🔍</div>
                        <p>Нічого не знайдено для "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredTodos.map(todo => (
                        <div
                            key={todo.id}
                            className="rounded-4xl bg-todo-bg p-4 shadow-card transition-shadow hover:shadow-medium"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleTodoCompletion(todo.id)}
                                        className={clsx(
                                            "h-2 w-2 rounded-full transition-colors",
                                            todo.isCompleted ? "bg-green-500" : "bg-gray-300 hover:bg-gray-400",
                                        )}
                                    ></button>
                                    <div className="flex-1">
                                        <h3
                                            className={clsx(
                                                "font-custom font-medium",
                                                todo.isCompleted ? "text-gray-500 line-through" : "text-gray-800",
                                            )}
                                        >
                                            {todo.text}
                                        </h3>
                                        <p
                                            className={clsx(
                                                "text-sm",
                                                todo.isCompleted ? "text-gray-400" : "text-gray-500",
                                            )}
                                        >
                                            {todo.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {todo.time && <span className="text-xs text-gray-400">{todo.time}</span>}
                                    <div className="flex -space-x-1">
                                        {todo.assignees.map((avatar, index) => (
                                            <div
                                                key={index}
                                                className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gray-200 text-xs"
                                            >
                                                {avatar}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={() => setShowAddModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-4xl bg-blue-500 py-4 font-medium text-white shadow-medium transition-all hover:bg-blue-600 hover:shadow-strong"
            >
                <span className="text-xl">+</span>
                Add new task
            </button>
        </div>
    );
}

export default App;
