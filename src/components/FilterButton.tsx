import clsx from "clsx";
import type { FilterType } from "../types";

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
        red: "bg-red-500 text-white",
        green: "bg-green-500 text-white",
        purple: "bg-purple-500 text-white",
    };

    return (
        <button
            onClick={() => onClick(filter)}
            className={clsx(
                "relative transform rounded-3xl px-5 py-2 text-2xs font-medium tracking-wide transition-all duration-200 hover:cursor-pointer hover:shadow-sm",
                isActive ? "bg-powder-blue text-sky-blue shadow-sm" : "bg-blue-50/70 text-gray-600",
            )}
        >
            {label}
            {count > 0 && (
                <div
                    className={clsx(
                        "absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-4xs",
                        badgeColors[badgeColor],
                    )}
                >
                    {count}
                </div>
            )}
        </button>
    );
}
