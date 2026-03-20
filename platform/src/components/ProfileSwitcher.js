"use client";

import React, { useState, useEffect } from "react";
import { UserCircle, ChevronDown, Check } from "lucide-react";

const ProfileSwitcher = ({ role, onProfileChange }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/users?role=${role}`);
                const data = await res.json();
                if (data.success) {
                    setUsers(data.users);
                    
                    // Try to restore from localStorage or pick first
                    const savedId = localStorage.getItem(`selected_user_${role}`);
                    const initialUser = data.users.find(u => u.id === savedId) || data.users[0];
                    
                    if (initialUser) {
                        setSelectedUser(initialUser);
                        onProfileChange(initialUser.id);
                        localStorage.setItem(`selected_user_${role}`, initialUser.id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [role]);

    const handleSelect = (user) => {
        setSelectedUser(user);
        setIsOpen(false);
        onProfileChange(user.id);
        localStorage.setItem(`selected_user_${role}`, user.id);
    };

    if (isLoading) return <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-xl" />;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-400 transition shadow-sm group"
            >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Switch Profile</p>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">{selectedUser?.name || "Select Profile"}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Available {role}s</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleSelect(user)}
                                className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${selectedUser?.id === user.id ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                    <div className="text-left">
                                        <p className={`text-sm font-bold ${selectedUser?.id === user.id ? 'text-blue-600' : 'text-slate-700'}`}>{user.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                                    </div>
                                </div>
                                {selectedUser?.id === user.id && <Check className="w-4 h-4 text-blue-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSwitcher;
