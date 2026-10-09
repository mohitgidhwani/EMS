import React, { createContext, useEffect, useState } from 'react';

export const ThemeCon = createContext();

// Applied once here (not inside Settings) so the theme is live the
// instant the app boots, on every route, and after a refresh —
// Settings previously only applied it while it was mounted.
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('colorTheme') || 'blue');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-color-theme', colorTheme);
        localStorage.setItem('colorTheme', colorTheme);
    }, [colorTheme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    return (
        <ThemeCon.Provider value={{ theme, setTheme, toggleTheme, colorTheme, setColorTheme }}>
            {children}
        </ThemeCon.Provider>
    );
}

export default ThemeProvider;
