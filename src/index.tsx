import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { CountrySearch } from './CountrySearchCDN';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<CountrySearch />);

