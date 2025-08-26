import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from './../types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: UserRole) => Promise<boolean>;
    register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
    {
        id: '1',
        email: 'client@demo.com',
        name: 'John Client',
        role: 'client',
        createdAt: new Date(),
    },
    {
        id: '2',
        email: 'agent@demo.com',
        name: 'Sarah Agent',
        role: 'agent',
        createdAt: new Date(),
    },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string, role: UserRole): Promise<{
        success: boolean,
        message: string
    }> => {
        const payload = JSON.stringify({
            email,
            password
        });
        const res = await fetch("/api/Auth/login", {
            method: 'POST', body: payload, headers: {
                'Content-Type': 'application/json'
            }
        });
        const { token, message } = await res.json();
        if (token) {
            localStorage.setItem('token', JSON.stringify(token));
            return {
                success: true,
                message: 'Login successful!',
            };
        }
        return {
            success: false,
            message,
        };
    };

    const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
        // Mock registration
        const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            role,
            createdAt: new Date(),
        };

        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};