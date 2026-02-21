import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/dashboard');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/dashboard');
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased h-screen w-full overflow-hidden flex flex-col md:flex-row">
            {/* Left Side: Hero Image Section */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-slate-900 h-full overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80 mix-blend-overlay"
                    aria-label="Physiotherapist assisting patient with arm exercise in modern clinic"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMBN2lZkeAJo7dMGJji7yGJkbeLkbKkQD-j1_2qlupbbue0DiVN8CaPjbxJ1QcheoHe4GZZBQrfIaPjPguPVh71XUtva_09Y62dvyTMT1dYjpbL_8F1k04wwFKNEFxnq_A6SMjmeS9RZ4JXr9AqEp18ZYxqfpVNENmeah2SuS_RLyZmfghh5WCBJV08qlxMzawr5hLPw8yKLxS7QZlTAKAhT9iPIrink4K7ybmxfy5iHe4BuwvSjQhnxyXJdoL45WMf4kmi0t4Qkg')" }}
                ></div>
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/90 to-blue-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>

                {/* Content on Image */}
                <div className="relative z-20 flex flex-col justify-end p-12 lg:p-20 text-white h-full max-w-2xl">
                    <div className="mb-8 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 inline-block w-fit">
                        <span className="material-symbols-outlined text-4xl">vital_signs</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight">
                        Empowering your recovery, <br />one movement at a time.
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-200 font-medium max-w-lg leading-relaxed">
                        Join thousands of professionals and patients tracking their physiotherapy progress with FizyoPoz. Precision data for better health outcomes.
                    </p>
                    <div className="mt-10 flex gap-4">
                        <div className="flex -space-x-4">
                            <img alt="Portrait of a female user" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBahwcBQzYV52M4RF-CE71v9oaNFxFz8s_ZiRE95qoWufdUkcRWAeo8nDepKGXTymBFpnfUJkkO1unG2_3FSdFkFDYse3T_oL7d8pfyp8qRs6xaXJZ_G7fKjtgF3gy659FsLJpBBFLdXEiTOQn_evLB2xQ9rQU3hbccw9MjAm6DACPlCXy-QSYi4dq01BLP4GdrZlj_sstCkTnIA-qAEeAxsbc7BtrQrFQPSX6smtZnRmIfxxe80DW9cYcAzkWdbTspTGHhufv7fpw" />
                            <img alt="Portrait of a male user" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9XcV-AMVpiYAhx76vakXcuCSR1RYzOhwGwnkRVGZPrlL0hKXAgUDkspy3ghnSlEYt6De_rmLYQFhhi-VsUHNATHxq1S-jTzXDB0A1eeXCnenzYVw2tkSed94KGyJCs33iisp2Y4mv9aP7xLu6wrfwpI6A3Er4Qum0LKuYlTOoINChrUYubC0MnltheBsDATwWTI6T9L4AgQTo0qW1sJXcOK1nRvPIklELWGHk1s2fynCnIoNjjeONHxgITOqRmo_98n9Er6cnZyA" />
                            <img alt="Portrait of a male user" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7z4LK4KWfrY-ztwdpgEwFMOTyYO7wRdFZxFpbo8d6AmRxuSN7PsvtFlpRfc6_n0f0pWZPF3rc0fcWg7sUZXnFUEenYuZ000qFAh0EbxcwnKrNHdMTV_cP69HM7MVJ4EeDrv1I9Qb1VC2gKSH4kRShbz6sO4ADNnPsMCDxtZivvlWK5dMFYMJLn8bV8SHKafaoBjZ1xSMHbguTYLLLYfVaqZvYOn8VBgWr5UfYX4E_Kf96tEFKTHC9boONpZ-0lHA4YJaxitZ-hoE" />
                            <div className="w-10 h-10 rounded-full border-2 border-primary bg-white text-primary text-xs font-bold flex items-center justify-center relative z-10">
                                +2k
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex text-yellow-400 text-sm">
                                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                            </div>
                            <span className="text-xs text-slate-300 font-medium">Trusted by top clinics</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col bg-white dark:bg-background-dark overflow-y-auto">
                <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12">
                    {/* Mobile Header Logo */}
                    <div className="md:hidden mb-8 flex items-center gap-2 text-primary">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">accessibility_new</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">FizyoPoz</span>
                    </div>

                    {/* Desktop Logo Area */}
                    <div className="hidden md:flex mb-12 items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined text-2xl">accessibility_new</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">FizyoPoz</h2>
                    </div>

                    <div className="max-w-[440px] w-full mx-auto md:mx-0">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                                {isSignUp ? 'Create an account' : 'Welcome back'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                {isSignUp
                                    ? 'Start your recovery journey and track your progress daily.'
                                    : 'Manage your recovery journey efficiently and access your professional dashboard.'}
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
                                {errorMsg}
                            </div>
                        )}

                        {/* Social Login 
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-800/50">
                                <span className="text-sm">Google</span>
                            </button>
                            ...
                        </div>
                        */}

                        {/* Form */}
                        <form className="flex flex-col gap-5" onSubmit={handleAuth}>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="email">Email address</label>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 h-12 pl-11 pr-4 text-base transition-all"
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="password">Password</label>
                                    {!isSignUp && (
                                        <a className="text-sm font-medium text-primary hover:text-primary-dark transition-colors" href="#">Forgot password?</a>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 h-12 pl-11 pr-4 text-base transition-all"
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">lock</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white h-12 px-6 text-base font-bold tracking-wide shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </form>
                        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="font-bold text-primary hover:text-primary-dark hover:underline transition-colors ml-1 focus:outline-none"
                            >
                                {isSignUp ? 'Sign in' : 'Sign up for free'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="py-6 px-8 flex justify-center md:justify-start gap-6 text-xs text-slate-400 dark:text-slate-500 mt-auto">
                    <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" href="#">Terms of Service</a>
                    <span className="ml-auto hidden md:block">© 2026 FizyoPoz</span>
                </div>
            </div>
        </div>
    );
}
