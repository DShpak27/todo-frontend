import { useEffect, useState, type ChangeEvent } from "react";
import { nanoid } from "nanoid";

interface Data {
    id: string;
    isCompleted: boolean;
    text: string;
}

const data: Data[] = [
    { id: "1", isCompleted: false, text: "Wake Up" },
    { id: "2", isCompleted: false, text: "Wipe off the table" },
];

function App() {
    const [todos, setTodos] = useState<Data[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const addTodo = () => {
        if (inputValue) {
            const newTask: Data = {
                id: nanoid(),
                isCompleted: false,
                text: inputValue,
            };
            setTodos(prev => [...prev, newTask]);
            setInputValue("");
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value);
    };

    useEffect(() => {
        setTodos(data);
    }, []);

    return (
        <div className="flex flex-col w-full h-full">
            <h1 className="font-bold">Today</h1>
            <p className="color text-gray-400 text-xs">18 june 219, Tuesday</p>
            <div className="flex gap-2">
                <button className=" relative not-only:not-last-of-type:rounded-2xl bg-blue-400 border border-blue-300 p-3 text-blue-200">
                    Undone{" "}
                    <div className="flex absolute w-4 h-4 rounded-[50%] justify-center items-center bg-red-500 right-1 top-1.5 text-sm">
                        <div>4</div>
                    </div>
                </button>
                <button className="rounded-2xl bg-blue-400 border p-1 border-blue-300">Meetings</button>
                <button className="rounded-2xl bg-blue-400 border p-1 border-blue-300">Consummation</button>
            </div>
            <ul className="">
                {todos.map(todo => (
                    <li>{todo.text}</li>
                ))}
            </ul>
            <input type="text" onChange={handleChange} value={inputValue} />
            <button onClick={addTodo} type="button">
                Add new task
            </button>
        </div>
    );
}

export default App;
