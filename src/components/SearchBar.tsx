import { type RefObject } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
    searchQuery: string;
    isSearchFocused: boolean;
    onSearchChange: (value: string) => void;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
    onSearchClick: () => void;
    onClearSearch: () => void;
    searchInputRef: RefObject<HTMLInputElement | null>;
}

function SearchBar({
    searchQuery,
    isSearchFocused,
    onSearchChange,
    onSearchFocus,
    onSearchBlur,
    onSearchClick,
    onClearSearch,
    searchInputRef,
}: SearchBarProps) {
    return (
        <div
            style={{
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
            }}
            className="relative mb-5 flex items-center justify-center gap-x-2 rounded-4xl bg-gradient-to-r from-blue-400 to-blue-600"
        >
            {!(isSearchFocused || searchQuery.trim()) && (
                <div
                    className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center gap-x-1.5 text-ghost-white"
                    onClick={onSearchClick}
                >
                    <FiSearch size={18} />
                    <span>Search</span>
                </div>
            )}
            <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                className="w-full bg-transparent px-6 py-1.5 text-white outline-none"
            />
            {searchQuery.trim() && (
                <button
                    onClick={onClearSearch}
                    className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <FiX size={16} />
                </button>
            )}
        </div>
    );
}

export default SearchBar;
