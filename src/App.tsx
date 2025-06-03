import { useEffect, useState, useRef } from "react";
import { FiCalendar } from "react-icons/fi";

import type { Data, FilterType } from "./types";
import FilterButton from "./components/FilterButton";
import AddTaskModal from "./components/AddTaskModal";
import TodoItem from "./components/TodoItem";
import SearchBar from "./components/SearchBar";
import { todoApi, type CreateTaskRequest } from "./api/todoApi";

function App() {
    const [todos, setTodos] = useState<Data[]>([]);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const loadTodos = async () => {
        try {
            // setIsLoading(true);
            const tasks = await todoApi.getAllTasks();
            setTodos(tasks);
        } catch (error) {
            console.error("Failed to load todos:", error);
        } finally {
            // setIsLoading(false);
        }
    };

    const addTodo = async (taskData: Partial<Data>) => {
        if (!taskData.text?.trim()) return;

        try {
            const createTaskData: CreateTaskRequest = {
                text: taskData.text,
                priority: taskData.priority || "medium",
                category: taskData.category || "meeting",
                dueDate: taskData.dueDate ? taskData.dueDate.toISOString().split("T")[0] : undefined,
                dueTime: taskData.dueTime,
                isRecurring: taskData.isRecurring || false,
            };

            const newTask = await todoApi.createTask(createTaskData);
            setTodos(prev => [...prev, newTask]);
            setShowAddModal(false);
        } catch (error) {
            console.error("Failed to create todo:", error);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleSearchClick = () => {
        searchInputRef.current?.focus();
    };

    const handleFilterClick = (filter: FilterType) => {
        setActiveFilter(prev => (prev === filter ? "all" : filter));
    };

    const toggleTodoCompletion = async (id: string) => {
        try {
            const updatedTask = await todoApi.toggleTaskCompletion(id);
            if (updatedTask) {
                setTodos(prev => prev.map(todo => (todo.id === id ? updatedTask : todo)));
            }
        } catch (error) {
            console.error("Failed to toggle todo completion:", error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            const success = await todoApi.deleteTask(id);
            if (success) {
                setTodos(prev => prev.filter(todo => todo.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const undoneTodos = todos.filter(todo => !todo.isCompleted);
    const meetingTodos = todos.filter(todo => todo.category === "meeting");
    const completedTodos = todos.filter(todo => todo.isCompleted);

    const filteredTodos = todos.filter(todo => {
        let matchesFilter = true;

        if (activeFilter === "undone") {
            matchesFilter = !todo.isCompleted;
        } else if (activeFilter === "meeting") {
            matchesFilter = todo.category === "meeting";
        } else if (activeFilter === "consummation") {
            matchesFilter = todo.isCompleted;
        }

        const matchesSearch = !searchQuery.trim() || todo.text.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    useEffect(() => {
        loadTodos();
    }, []);

    return (
        <div className="mx-auto flex h-[100dvh] max-w-3xl flex-col overflow-hidden bg-ghost-white px-6 pt-16 md:my-3 md:h-[calc(100dvh-24px)] md:rounded-5xl md:pt-14 md:shadow-medium">
            <div className="mb-5.5 flex flex-col gap-y-1.5">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-charcoal">Today</h1>
                    <div className="pr-0.5">
                        <FiCalendar className="text-gray-400" size={18} />
                    </div>
                </div>
                <p className="text-xs font-medium text-gray-400">18 Jun 2019, Tuesday</p>
            </div>
            {!showAddModal && (
                <>
                    <SearchBar
                        searchQuery={searchQuery}
                        isSearchFocused={isSearchFocused}
                        onSearchChange={setSearchQuery}
                        onSearchFocus={() => setIsSearchFocused(true)}
                        onSearchBlur={() => setIsSearchFocused(false)}
                        onSearchClick={handleSearchClick}
                        onClearSearch={clearSearch}
                        searchInputRef={searchInputRef}
                    />

                    <div className="mb-6 flex justify-center gap-x-2">
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
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-1.5">
                        {filteredTodos.length === 0 && searchQuery.trim() ? (
                            <p className="py-8 text-center text-gray-500">Nothing found for "{searchQuery}"</p>
                        ) : (
                            filteredTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggleCompletion={toggleTodoCompletion}
                                    onDelete={deleteTodo}
                                />
                            ))
                        )}
                    </div>

                    <div className="flex-shrink-0 pt-4">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-4xl bg-blue-500 py-4 font-medium text-white shadow-medium transition-all hover:bg-blue-600 hover:shadow-strong"
                        >
                            <span className="text-xl">+</span>
                            Add new task
                        </button>
                    </div>
                </>
            )}
            {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} onSave={addTodo} />}
        </div>
    );
}

export default App;
