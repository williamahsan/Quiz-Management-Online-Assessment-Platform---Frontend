import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', formData);
      const { token, user } = res.data;
      login(user, token);

      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-fuchsia-100 p-4 sm:p-8">
      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 w-full max-w-md border border-white">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm font-semibold text-gray-500 mt-2">Please sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold text-center mb-6 border border-red-100 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-6"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-4 transition-all">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
