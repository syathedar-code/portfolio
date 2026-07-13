import { useState, useMemo } from "react";

interface SearchFilterListProps<T> {
    items: T[];
    searchFields: (item: T) => string[];
    sortKeys: {
        getNewestValue: (item: T) => string | number;
        getAlphabeticalValue: (item: T) => string;
    };
    renderItem: (item: T) => React.ReactNode;
}

export default function SearchFilterList<T extends Record<string, any>>({
    items,
    searchFields,
    sortKeys,
    renderItem,
}: SearchFilterListProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">("newest");

    // Filter and Sort Engine
    // const processedItems = useMemo(() => {
    //     const query = searchQuery.toLowerCase().trim();

    //     // 1. Properly filter out items based on search keywords
    //     const filtered = items.filter((item) => {
    //         if (!query) return true;
    //         const fieldsToSearch = searchFields(item);
    //         return fieldsToSearch.some((field) =>
    //             (field || "").toLowerCase().includes(query)
    //         );
    //     });

    //     // 2. Perform explicit immutable sorting based on dropdown selection
    //     return [...filtered].sort((a, b) => {
    //         if (sortBy === "newest") {
    //             const valA = new Date(sortKeys.getNewestValue(a)).getTime() || 0;
    //             const valB = new Date(sortKeys.getNewestValue(b)).getTime() || 0;
    //             return valB - valA;
    //         }
    //         if (sortBy === "oldest") {
    //             const valA = new Date(sortKeys.getNewestValue(a)).getTime() || 0;
    //             const valB = new Date(sortKeys.getNewestValue(b)).getTime() || 0;
    //             return valA - valB;
    //         }
    //         if (sortBy === "alphabetical") {
    //             const titleA = (sortKeys.getAlphabeticalValue(a) || "").toLowerCase();
    //             const titleB = (sortKeys.getAlphabeticalValue(b) || "").toLowerCase();
    //             return titleA.localeCompare(titleB);
    //         }
    //         return 0;
    //     });
    // }, [items, searchQuery, sortBy, searchFields, sortKeys]);

    // Filter and Sort Engine
    const processedItems = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        // 1. Properly filter out items based on search keywords
        const filtered = items.filter((item) => {
            if (!query) return true;
            // Safe fallback logic if the prop reference fluctuates
            const fieldsToSearch = typeof searchFields === 'function' ? searchFields(item) : [];
            return fieldsToSearch.some((field) =>
                (field || "").toLowerCase().includes(query)
            );
        });

        // 2. Perform explicit immutable sorting based on dropdown selection
        return [...filtered].sort((a, b) => {
            // Safe inline property extraction targets standard schema tags if references shift
            const valA = sortKeys?.getNewestValue ? sortKeys.getNewestValue(a) : (a.date || a.createdAt);
            const valB = sortKeys?.getNewestValue ? sortKeys.getNewestValue(b) : (b.date || b.createdAt);

            if (sortBy === "newest") {
                const timeA = new Date(valA).getTime() || 0;
                const timeB = new Date(valB).getTime() || 0;
                return timeB - timeA;
            }
            if (sortBy === "oldest") {
                const timeA = new Date(valA).getTime() || 0;
                const timeB = new Date(valB).getTime() || 0;
                return timeA - timeB;
            }
            if (sortBy === "alphabetical") {
                const titleA = (sortKeys?.getAlphabeticalValue ? sortKeys.getAlphabeticalValue(a) : (a.title || a.name || "")).toLowerCase();
                const titleB = (sortKeys?.getAlphabeticalValue ? sortKeys.getAlphabeticalValue(b) : (b.title || b.name || "")).toLowerCase();
                return titleA.localeCompare(titleB);
            }
            return 0;
        });
        // 💡 REMOVED searchFields and sortKeys from the dependency array below:
    }, [items, searchQuery, sortBy]);

    return (
        <div className="w-full">
            {/* Control Panel Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 border-b border-line pb-4 font-mono">

                {/* Search Input Box */}
                <div className="relative w-full sm:max-w-xs group">
                    <input
                        type="text"
                        placeholder="search_archive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border border-line rounded px-3 py-1.5 pl-9 text-xs text-text placeholder:font-mono placeholder:text-text-faint transition-all duration-200 focus:outline-none focus:border-teal hover:border-text-faint/50 focus:shadow-[0_0_12px_rgba(45,212,191,0.15)]"
                    />
                    <span className="absolute left-3 top-2.5 text-text-faint group-hover:text-text-dim transition-colors duration-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>

                {/* System Status Tracker */}
                <div className="hidden sm:block text-xs text-text-faint tracking-wider select-none">
                    status: <span className="text-teal font-bold">{processedItems.length}</span> logs_found
                </div>

                {/* Sort Select Box */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                    <span className="text-text-faint uppercase tracking-wider select-none">SORT:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-bg border border-line rounded px-2.5 py-1 text-text cursor-pointer font-mono outline-none transition-all duration-200 hover:border-teal hover:text-teal focus:border-teal"
                    >
                        <option value="newest" className="bg-bg-panel text-text">newest_first</option>
                        <option value="oldest" className="bg-bg-panel text-text">oldest_first</option>
                        <option value="alphabetical" className="bg-bg-panel text-text">a_z</option>
                    </select>
                </div>
            </div>

            {/* Main Grid/List Output */}
            <div className="flex flex-col">
                {processedItems.length > 0 ? (
                    processedItems.map((item, index) => (
                        <div key={item.slug || item.id || index}>
                            {renderItem(item)}
                        </div>
                    ))
                ) : (
                    <div className="rounded border border-line bg-bg-panel px-6 py-8 font-mono text-sm text-text-faint text-center">
                        <span className="text-amber mr-2">&gt;</span>
                        no logs match search parameters.
                    </div>
                )}
            </div>
        </div>
    );
}