import { useState } from 'react';
import { axiosInstance } from '../api/base';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';

const Login = () => {
    const [ accountId, setAccountId ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ errors, setErrors ] = useState<{ accountId?: string; password?: string }>( {} );
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: typeof errors = {};
        if ( !accountId.trim() ) newErrors.accountId = 'Account ID is required';
        if ( !password.trim() ) newErrors.password = 'Password is required';
        setErrors( newErrors );
        return Object.keys( newErrors ).length === 0;
    };

    const handleLogin = async () => {
        if ( !validate() ) return;

        try {
            const res = await axiosInstance.post( '/user/signin', { accountId, password } );
            localStorage.setItem( 'accountId', res.data.payload.accountId );
            localStorage.setItem( 'token', res.data.payload.token );
            toast.success( 'Login successful!' );
            navigate( '/' );
        } catch ( err ) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || 'Login failed';
            toast.error( message );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 text-green-400 font-mono">
            <Toaster position="top-center" />
            <div className="retro-panel w-full max-w-md">
                <h2 className="text-2xl mb-4 font-bold">LOGIN</h2>

                <input
                    type="text"
                    placeholder="Account ID"
                    value={accountId}
                    onChange={( e ) => setAccountId( e.target.value )}
                    className="retro-input w-full mb-1"
                />
                {errors.accountId && (
                    <p className="text-red-400 text-sm mb-2">{errors.accountId}</p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={( e ) => setPassword( e.target.value )}
                    className="retro-input w-full mb-1"
                />
                {errors.password && (
                    <p className="text-red-400 text-sm mb-4">{errors.password}</p>
                )}

                <button onClick={handleLogin} className="retro-button w-full mb-2">
                    LOGIN
                </button>

                <p className="text-sm mt-3">
                    No account?{' '}
                    <Link to="/signup" className="underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
