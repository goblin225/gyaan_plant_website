import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login as loginService } from '../services/service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    role: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (authData: { email: string; password: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const storedUser = sessionStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const { mutate: loginMutation } = useMutation({
        mutationFn: loginService,
        onSuccess: (data) => {
            const userData: User = {
                id: data.data._id,
                name: data.data.name || '',
                email: data.data.email || '',
                phoneNumber: data.data.phoneNumber,
                role: data.data.roleName,
                avatar: '',
            };

            sessionStorage.setItem('token', data?.data?.accessToken);
            sessionStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setToken(data?.data?.accessToken);
            setIsAuthenticated(true);
            toast.success('Welcome back!');
            navigate('/');
        },
        onError: () => {
            toast.error('Invalid email or password');
        },
    });

    const login = (authData: { email: string; password: string }) => {
        loginMutation(authData);
    };

    const logout = () => {
        sessionStorage.clear(); 
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};