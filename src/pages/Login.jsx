import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef(null);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            alert("Bu web siteda bazi xatolar va kechikishlar mavjud! Biror xato topsangiz, shu chatApp ning ozidan barcha usersdan qidirib (_sherbek_off) ga yozing.");
            localStorage.setItem('hasVisited', 'true');
        }
    }, []);

    const clearMessage = () => {
        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const toggleForm = () => {
        setIsSignUp((prev) => !prev);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isSignUp) {
            await handleSignUp();
        } else {
            await handleLogin();
        }
        setLoading(false);
    };

    const handleLogin = async () => {
        try {
            const { data: users } = await axios.get('https://unversty-2.onrender.com/users');
            const user = users.find(v => v.email === email && v.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                navigate('/profile');
                return;
            }

            setMessage('Foydalanuvchi topilmadi.');
            clearMessage();
        } catch (error) {
            console.error('Error:', error);
            setMessage('Tarmoq xatosi. Iltimos qayta urinib ko‘ring.');
            clearMessage();
        }
    };

    

    return (
        <div ref={formRef} className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isSignUp ? 'Ro‘yxatdan o‘tish' : 'Kirish'}
                </h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {message && (
                    <p className={`block mb-4 ${message.includes('muvaffaqiyatli') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
                <button
                    type="submit"
                    className={`w-full ${isSignUp ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                >
                    {loading ? 'Loading...' : (isSignUp ? 'Ro‘yxatdan o‘tish' : 'Kirish')}
                </button>

          
            </form>
        </div>
    );
};

export default Login;
