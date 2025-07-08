import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getUserById, updateUserProfile } from '../../services/service';
import toast from 'react-hot-toast';

const Profile = () => {

    const queryClient = useQueryClient();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = user?.id || '';

    const { data: users, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId!),
    });

    const userData = users?.data || {};

    const [form, setForm] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        profile_pic: '',
    });

    useEffect(() => {
        if (userData) {
            setForm({
                name: userData?.name || '',
                email: userData?.email || '',
                phoneNumber: userData?.phoneNumber || '',
                profile_pic: userData?.profile_pic || '',
            });
        }
    }, [userData]);

    const mutation = useMutation({
        mutationFn: (updatedData: typeof form) => updateUserProfile(userId, updatedData),
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'profile_pic' && files?.[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, profile_pic: reader.result as string }));
            };
            reader.readAsDataURL(file);

            // Note: You can also upload this file to the server and get a URL
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        mutation.mutate(form);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>
            <p className="text-gray-600 mb-6">Add information about yourself</p>

            <div className="bg-white shadow-md rounded p-6">
                <div className="mb-6 text-center">
                    <img
                        src={form.profile_pic || ''}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                    />
                    <input
                        type="file"
                        name="profile_pic"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500"
                    />
                </div>

                <h3 className="text-lg font-semibold mb-4">Basics:</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        type="text"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        maxLength={60}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        name="phoneNumber"
                        type="text"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        maxLength={60}
                    />
                </div>

                <div className="text-right">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;