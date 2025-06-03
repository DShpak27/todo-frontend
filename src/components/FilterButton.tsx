import clsx from "clsx";

type FilterType = "all" | "undone" | "meeting" | "consummation";

interface FilterButtonProps {
    filter: FilterType;
    label: string;
    activeFilter: FilterType;
    count: number;
    badgeColor: "red" | "green" | "purple";
    onClick: (filter: FilterType) => void;
}

export default function FilterButton({ filter, label, activeFilter, count, badgeColor, onClick }: FilterButtonProps) {
    const isActive = activeFilter === filter;

    const badgeColors = {
        red: clsx("bg-red-500 text-white", isActive ? "animate-pulse bg-red-400 shadow-lg" : "shadow-md"),
        green: clsx("bg-green-500 text-white", isActive ? "animate-pulse bg-green-400 shadow-lg" : "shadow-md"),
        purple: clsx("bg-purple-500 text-white", isActive ? "animate-pulse bg-purple-400 shadow-lg" : "shadow-md"),
    };

    return (
        <button
            onClick={() => onClick(filter)}
            className={clsx(
                "relative transform rounded-3xl px-5 py-3 text-sm font-semibold transition-all duration-300",
                isActive
                    ? "ring-opacity-50 scale-105 bg-blue-500 text-white shadow-lg ring-2 ring-blue-300"
                    : "bg-blue-50 text-blue-700 hover:scale-102 hover:bg-blue-100 hover:shadow-md",
            )}
        >
            {label}
            {count > 0 && (
                <div
                    className={clsx(
                        "absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                        badgeColors[badgeColor],
                    )}
                >
                    {count}
                </div>
            )}
        </button>
    );
}
