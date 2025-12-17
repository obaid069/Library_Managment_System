import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api.service';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        // Validate password strength
        const password = formData.newPassword;
        if (password.length < 8 || password.length > 15) {
            setError('Password must be between 8-15 characters');
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter');
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError('Password must contain at least one lowercase letter');
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError('Password must contain at least one number');
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            return;
        }

        setLoading(true);

        try {
            await apiService.post(
                '/auth/change-password',
                {
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }
            );

            alert('Password changed successfully!');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
                    <p className="text-gray-600 mt-2">Enter your details to change password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password *
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter current password"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password *
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter new password"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            8-15 characters, must include uppercase, lowercase, number & special character
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password *
                        </label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showPasswords"
                            checked={showPasswords}
                            onChange={(e) => setShowPasswords(e.target.checked)}
                            className="w-4 h-4 text-gray-900 border-gray-300 rounded"
                        />
                        <label htmlFor="showPasswords" className="ml-2 text-sm text-gray-700">
                            Show passwords
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50"
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>

                    <div className="text-center">
                        <Link to="/login" className="text-gray-900 hover:text-gray-700 font-medium">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
