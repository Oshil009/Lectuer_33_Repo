import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = sessionStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch { return null; }
    });

    const [token, setToken] = useState(() =>
        sessionStorage.getItem('token') || null
    );

    const login = (newToken, newUser) => {
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        sessionStorage.clear();
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        if (token) sessionStorage.setItem('token', token);
        if (user) sessionStorage.setItem('user', JSON.stringify(user));
    }, [token, user]);

    const isAdmin = user?.role?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}