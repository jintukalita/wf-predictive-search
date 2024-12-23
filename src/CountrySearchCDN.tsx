import * as React from "react";
import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, X, ArrowUp, ArrowDown, CornerDownLeft, Clock } from 'lucide-react';
import Fuse from 'fuse.js';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';

interface SearchResult {
    type: "country" | "region";
    name: string;
    flag?: string;
    image?: string;
}

const MAX_RECENT_SEARCHES = 5;

const regionIcons = {
    "globe-europe": <span>🇪🇺</span>,
    "globe-asia": <span>🌏</span>,
    "globe-americas": <span>🌎</span>,
    "globe-africa": <span>🌍</span>,
    "globe-oceania": <span>🇦🇺</span>,
};

const highlightText = (text: string, indices: number[][]): string => {
    let highlightedText = '';
    let lastIndex = 0;
    for (const index of indices) {
        highlightedText += text.substring(lastIndex, index[0]);
        highlightedText += `<b>${text.substring(index[0], index[1] + 1)}</b>`;
        lastIndex = index[1] + 1;
    }
    highlightedText += text.substring(lastIndex);
    return highlightedText;
};


export function CountrySearch() {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<Fuse.FuseResult<SearchResult>[]>([]);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const [isResultsVisible, setIsResultsVisible] = React.useState(false);
    const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
    const [isReturningUser, setIsReturningUser] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const resultsRef = React.useRef<HTMLDivElement>(null);

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
    ];

    const fuse = new Fuse(countries, {
        keys: ['name'],
        includeMatches: true,
        threshold: 0.3,
    });

    const handleSearch = React.useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults(countries.map((item, index) => ({ item, refIndex: index })));
        } else {
            const searchResults = fuse.search(searchQuery);
            setResults(searchResults.length > 0 ? searchResults : []);
        }
        setSelectedIndex(-1);
    }, []);

    useEffect(() => {
        handleSearch(query);
    }, [query, handleSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(results[selectedIndex].item);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsResultsVisible(false);
        }
    };

    const handleSelect = (item: SearchResult) => {
        setQuery(item.name);
        setIsResultsVisible(false);
        addToRecentSearches(item.name);
        console.log(`Selected: ${item.name}`);
    };

    const addToRecentSearches = (search: string) => {
        setRecentSearches(prev => {
            const updatedSearches = [search, ...prev.filter(s => s !== search)].slice(0, MAX_RECENT_SEARCHES);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
            return updatedSearches;
        });
    };

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                const userIP = data.ip;

                const storedIP = localStorage.getItem('userIP');
                if (storedIP === userIP) {
                    setIsReturningUser(true);
                    const storedSearches = localStorage.getItem('recentSearches');
                    if (storedSearches) {
                        setRecentSearches(JSON.parse(storedSearches));
                    }
                } else {
                    localStorage.setItem('userIP', userIP);
                    setIsReturningUser(false);
                }
            } catch (error) {
                console.error('Error fetching IP:', error);
                setIsReturningUser(false);
            }
        };

        checkUserStatus();
    }, []);

    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isResultsVisible) {
            handleSearch(query);
        }
    }, [isResultsVisible, handleSearch, query]);

    return (
        <div id="country-search-container" style={{ position: 'relative', width: '100%', maxWidth: '32rem', margin: '0 auto' }}>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Search style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                </div>
                <Input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsResultsVisible(true)}
                    onBlur={() => setTimeout(() => setIsResultsVisible(false), 200)}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '3rem', fontSize: '1rem', backgroundColor: 'white' }}
                    placeholder="Search countries... (Ctrl+K)"
                    aria-label="Search countries, press Ctrl+K to focus"
                    className="country-search-input"
                />
                {query && (
                    <Button
                        variant="ghost"
                        style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', height: '100%' }}
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                    >
                        <X style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                        <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>Clear search</span>
                    </Button>
                )}
            </div>
            {isResultsVisible && (
                <Card id="country-search-results" className="country-search-results-container" style={{ position: 'absolute', marginTop: '0.5rem', width: '100%', zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {query ? (
                            results.length > 0 ? (
                                <div style={{ padding: '0.5rem' }} ref={resultsRef}>
                                    <div className="country-search-regions" style={{ marginBottom: '1rem' }}>
                                        <div className="country-search-section-title" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                            Regions
                                        </div>
                                        {results
                                            .filter((result) => result.item.type === "region")
                                            .map((result, index) => (
                                                <Button
                                                    className="country-search-region-item"
                                                    key={result.item.name}
                                                    variant="ghost"
                                                    style={{
                                                        width: '100%',
                                                        justifyContent: 'flex-start',
                                                        fontSize: '1rem',
                                                        fontWeight: 'normal',
                                                        backgroundColor: index === selectedIndex ? '#f3f4f6' : 'transparent',
                                                    }}
                                                    onClick={() => handleSelect(result.item)}
                                                >
                                                    <span style={{ marginRight: '0.5rem' }}>{result.item.image && regionIcons[result.item.image as keyof typeof regionIcons]}</span>
                                                    <span dangerouslySetInnerHTML={{ __html: highlightText(result.item.name, result.matches?.[0]?.indices || []) }} />
                                                </Button>
                                            ))}
                                    </div>
                                    <div className="country-search-countries">
                                        <div className="country-search-section-title" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                            Countries
                                        </div>
                                        {results
                                            .filter((result) => result.item.type === "country")
                                            .map((result, index) => (
                                                <Button
                                                    className="country-search-country-item"
                                                    key={result.item.name}
                                                    variant="ghost"
                                                    style={{
                                                        width: '100%',
                                                        justifyContent: 'flex-start',
                                                        fontSize: '1rem',
                                                        fontWeight: 'normal',
                                                        backgroundColor: index + results.filter(r => r.item.type === "region").length === selectedIndex ? '#f3f4f6' : 'transparent',
                                                    }}
                                                    onClick={() => handleSelect(result.item)}
                                                >
                                                    <span style={{ marginRight: '0.5rem', display: 'inline-block', width: '1.5rem', height: '1.5rem', overflow: 'hidden', borderRadius: '0.125rem' }} aria-hidden="true">
                                                        {result.item.flag}
                                                    </span>
                                                    <span dangerouslySetInnerHTML={{ __html: highlightText(result.item.name, result.matches?.[0]?.indices || []) }} />
                                                </Button>
                                            ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                                    No items found
                                </div>
                            )
                        ) : (
                            <>
                                {isReturningUser && recentSearches.length > 0 && (
                                    <div className="country-search-recent-searches" style={{ padding: '0.5rem' }}>
                                        <div className="country-search-section-title" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                            Recent Searches
                                        </div>
                                        {recentSearches.map((search, index) => (
                                            <Button
                                                key={search}
                                                variant="ghost"
                                                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '1rem', fontWeight: 'normal' }}
                                                onClick={() => {
                                                    setQuery(search);
                                                    handleSearch(search);
                                                }}
                                            >
                                                <Clock style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }} />
                                                <span>{search}</span>
                                            </Button>
                                        ))}
                                    </div>
                                )}
                                <div className="country-search-all-items" style={{ padding: '0.5rem' }}>
                                    <div className="country-search-section-title" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                        All Countries and Regions
                                    </div>
                                    {countries.map((item, index) => (
                                        <Button
                                            key={item.name}
                                            variant="ghost"
                                            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '1rem', fontWeight: 'normal' }}
                                            onClick={() => handleSelect(item)}
                                        >
                                            {item.type === 'region' ? (
                                                <span style={{ marginRight: '0.5rem' }}>{item.image && regionIcons[item.image as keyof typeof regionIcons]}</span>
                                            ) : (
                                                <span style={{ marginRight: '0.5rem', display: 'inline-block', width: '1.5rem', height: '1.5rem', overflow: 'hidden', borderRadius: '0.125rem' }} aria-hidden="true">
                                                    {item.flag}
                                                </span>
                                            )}
                                            <span>{item.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {results.length > 0 && (
                        <div className="country-search-instructions" style={{ padding: '0.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ArrowUp style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                <ArrowDown style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.5rem' }} />
                                <span>to navigate</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <CornerDownLeft style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                                <span>to select</span>
                            </div>
                            <span>esc to dismiss</span>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}
