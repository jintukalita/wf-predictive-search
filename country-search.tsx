"use client"

import * as React from "react"
import { Search, X, ArrowUp, ArrowDown, CornerDownLeft, Clock } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import Fuse from 'fuse.js'

interface SearchResult {
    type: "country" | "region"
    name: string
    flag?: string
    image?: string
}

const MAX_RECENT_SEARCHES = 5

export default function CountrySearch() {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<Fuse.FuseResult<SearchResult>[]>([])
    const [selectedIndex, setSelectedIndex] = React.useState(-1)
    const [isResultsVisible, setIsResultsVisible] = React.useState(false)
    const [recentSearches, setRecentSearches] = React.useState<string[]>([])
    const inputRef = React.useRef<HTMLInputElement>(null)
    const resultsRef = React.useRef<HTMLDivElement>(null)

    const countries: SearchResult[] = [
        { type: "region", name: "Europe", image: "globe-europe" },
        { type: "country", name: "France", flag: "🇫🇷" },
        { type: "country", name: "Germany", flag: "🇩🇪" },
        { type: "country", name: "Italy", flag: "🇮🇹" },
        { type: "region", name: "Asia", image: "globe-asia" },
        { type: "country", name: "Japan", flag: "🇯🇵" },
        { type: "country", name: "China", flag: "🇨🇳" },
        { type: "country", name: "India", flag: "🇮🇳" },
        { type: "region", name: "Americas", image: "globe-americas" },
        { type: "country", name: "United States", flag: "🇺🇸" },
        { type: "country", name: "Canada", flag: "🇨🇦" },
        { type: "country", name: "Brazil", flag: "🇧🇷" },
        { type: "region", name: "Africa", image: "globe-africa" },
        { type: "country", name: "Nigeria", flag: "🇳🇬" },
        { type: "country", name: "South Africa", flag: "🇿🇦" },
        { type: "country", name: "Egypt", flag: "🇪🇬" },
        { type: "region", name: "Oceania", image: "globe-oceania" },
        { type: "country", name: "Australia", flag: "🇦🇺" },
        { type: "country", name: "New Zealand", flag: "🇳🇿" },
    ]

    const fuse = new Fuse(countries, {
        keys: ['name'],
        includeMatches: true,
        threshold: 0.3,
    })

    const handleSearch = React.useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults(countries.map((item, index) => ({ item, refIndex: index })))
        } else {
            const searchResults = fuse.search(searchQuery)
            setResults(searchResults.length > 0 ? searchResults : [])
        }
        setSelectedIndex(-1)
    }, [])

    React.useEffect(() => {
        handleSearch(query)
    }, [query, handleSearch])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault()
            handleSelect(results[selectedIndex].item)
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setIsResultsVisible(false)
        }
    }

    const handleSelect = (item: SearchResult) => {
        setQuery(item.name)
        setIsResultsVisible(false)
        addToRecentSearches(item.name)
        // You can add additional logic here, such as navigating to a country page
        console.log(`Selected: ${item.name}`)
    }

    const addToRecentSearches = (search: string) => {
        setRecentSearches(prev => {
            const updatedSearches = [search, ...prev.filter(s => s !== search)].slice(0, MAX_RECENT_SEARCHES)
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
            return updatedSearches
        })
    }

    React.useEffect(() => {
        const storedSearches = localStorage.getItem('recentSearches')
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches))
        }
    }, [])

    React.useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' })
            }
        }
    }, [selectedIndex])

    const regionIcons = {
        "globe-europe": (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <path d="M2 12h20"></path>
            </svg>
        ),
        "globe-asia": (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M2 12h20"></path>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
        ),
        "globe-americas": (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M2 12h20"></path>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
        ),
        "globe-africa": (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M2 12h20"></path>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
        ),
        "globe-oceania": (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M2 12h20"></path>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
        ),
    }

    const highlightText = (text: string, indices: readonly [number, number][]) => {
        if (indices.length === 0) return text;
        const chars = text.split('');
        indices.forEach(([start, end]) => {
            for (let i = start; i <= end; i++) {
                chars[i] = `<span class="bg-yellow-200 dark:bg-yellow-800">${chars[i]}</span>`;
            }
        });
        return chars.join('');
    };

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    React.useEffect(() => {
        if (isResultsVisible && results.length === 0 && !query) {
            handleSearch("");
        }
    }, [isResultsVisible, results.length, handleSearch, query]);

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                </div>
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsResultsVisible(true)}
                    onBlur={() => setTimeout(() => setIsResultsVisible(false), 200)}
                    className="pl-10 pr-10 h-12 text-base bg-white"
                    placeholder="Search countries... (Ctrl+K)"
                    aria-label="Search countries, press Ctrl+K to focus"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute inset-y-0 right-0 h-full hover:bg-transparent"
                        onClick={() => {
                            setQuery("")
                            inputRef.current?.focus()
                        }}
                    >
                        <X className="h-4 w-4 text-gray-500" />
                        <span className="sr-only">Clear search</span>
                    </Button>
                )}
            </div>
            {isResultsVisible && (
                <Card className="absolute mt-2 w-full z-50 overflow-hidden">
                    <ScrollArea className="max-h-[300px]">
                        {query && results.length > 0 ? (
                            <div className="p-2" ref={resultsRef}>
                                <div className="mb-4">
                                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                        Regions
                                    </div>
                                    {results
                                        .filter((result) => result.item.type === "region")
                                        .map((result, index) => (
                                            <Button
                                                key={result.item.name}
                                                variant="ghost"
                                                className={`w-full justify-start text-base font-normal ${index === selectedIndex ? 'bg-gray-100 dark:bg-gray-800' : ''
                                                    }`}
                                                onClick={() => handleSelect(result.item)}
                                            >
                                                <span className="mr-2">{result.item.image && regionIcons[result.item.image as keyof typeof regionIcons]}</span>
                                                <span dangerouslySetInnerHTML={{ __html: highlightText(result.item.name, result.matches?.[0]?.indices || []) }} />
                                            </Button>
                                        ))}
                                </div>
                                <div>
                                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                        Countries
                                    </div>
                                    {results
                                        .filter((result) => result.item.type === "country")
                                        .map((result, index) => (
                                            <Button
                                                key={result.item.name}
                                                variant="ghost"
                                                className={`w-full justify-start text-base font-normal ${index + results.filter(r => r.item.type === "region").length === selectedIndex ? 'bg-gray-100 dark:bg-gray-800' : ''
                                                    }`}
                                                onClick={() => handleSelect(result.item)}
                                            >
                                                <span className="mr-2 inline-block w-6 h-6 overflow-hidden rounded-sm" aria-hidden="true">
                                                    {result.item.flag}
                                                </span>
                                                <span dangerouslySetInnerHTML={{ __html: highlightText(result.item.name, result.matches?.[0]?.indices || []) }} />
                                            </Button>
                                        ))}
                                </div>
                            </div>
                        ) : query && results.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No items found
                            </div>
                        ) : (
                            <div className="p-2">
                                <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                                    Recent Searches
                                </div>
                                {recentSearches.map((search, index) => (
                                    <Button
                                        key={search}
                                        variant="ghost"
                                        className={`w-full justify-start text-base font-normal`}
                                        onClick={() => {
                                            setQuery(search)
                                            handleSearch(search)
                                        }}
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>{search}</span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                    {results.length > 0 && (
                        <div className="p-2 border-t text-xs text-gray-500 flex items-center justify-between">
                            <div className="flex items-center">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                <ArrowDown className="h-3 w-3 mr-2" />
                                <span>to navigate</span>
                            </div>
                            <div className="flex items-center">
                                <CornerDownLeft className="h-3 w-3 mr-1" />
                                <span>to select</span>
                            </div>
                            <span>esc to dismiss</span>
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}

