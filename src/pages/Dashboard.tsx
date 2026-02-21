import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 lg:px-10">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-[28px]">accessibility_new</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">FizyoPoz</h2>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex flex-1 justify-center gap-8">
                            <span className="text-primary text-sm font-semibold leading-normal border-b-2 border-primary pb-0.5" >Ana Sayfa</span>
                            <Link to="/session" className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">Egzersizlerim (Test)</Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex gap-2">
                                <button className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                                </button>
                                <button className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                </button>
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>

                            <div className="flex items-center gap-3 group">
                                <div className="hidden lg:flex flex-col items-end mr-2">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.email || 'User'}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hasta</span>
                                </div>
                                <button onClick={handleSignOut} className="flex items-center justify-center gap-1 text-sm text-red-500 font-bold hover:text-red-700 transition-colors px-3 py-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Çıkış
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <div className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-10">
                        <div className="flex flex-col max-w-[1200px] flex-1 gap-8">
                            {/* Welcome Section */}
                            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Hoşgeldin, Ahmet 👋</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Bugünkü egzersiz programın senin için hazırlandı.</p>
                                </div>
                                <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-primary hover:bg-primary-dark text-white text-base font-bold shadow-lg shadow-primary/30 transition-all transform hover:scale-105 active:scale-95">
                                    <span className="material-symbols-outlined">play_circle</span>
                                    <span>Harekete Başla</span>
                                </button>
                            </section>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Stat Card 1 */}
                                <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[28px]">fitness_center</span>
                                        </div>
                                        <span className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm mr-1">trending_up</span> +2
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Toplam Egzersiz</p>
                                        <h3 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">24</h3>
                                    </div>
                                </div>

                                {/* Stat Card 2 */}
                                <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[28px]">donut_large</span>
                                        </div>
                                        <span className="flex items-center text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold">
                                            Hedef: 100%
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Tamamlanma Oranı</p>
                                        <h3 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">85%</h3>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                                    </div>
                                </div>

                                {/* Stat Card 3 */}
                                <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[28px]">calendar_month</span>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Sonraki Seans</p>
                                        <h3 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Yarın, 14:00</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-base">location_on</span>
                                        <span>Dr. Ayşe Yılmaz ile</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Dashboard Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Weekly Progress Chart */}
                                <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Haftalık İlerleme</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Aktivite Seviyesi</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg">
                                            <button className="px-3 py-1 bg-white dark:bg-slate-700 shadow-sm rounded-md text-xs font-bold text-slate-900 dark:text-white">Hafta</button>
                                            <button className="px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Ay</button>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 mb-4">
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Son 7 Gün</p>
                                        <p className="text-green-600 text-sm font-bold bg-green-50 dark:bg-green-900/20 px-1.5 rounded">+12%</p>
                                    </div>
                                    <div className="relative flex-1 min-h-[250px] w-full mt-4">
                                        {/* Placeholder for actual chart component later */}
                                        <div className="w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-400 font-medium">Chart visualization will be implemented here</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar / Upcoming Appointments */}
                                <div className="flex flex-col gap-6">
                                    {/* Upcoming Appointments Widget */}
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-6 h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Yaklaşan Randevular</h3>
                                            <a className="text-primary text-sm font-semibold hover:underline" href="#">Tümü</a>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {/* Appointment Item 1 */}
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                                <div className="flex flex-col items-center justify-center min-w-[50px] bg-blue-50 dark:bg-slate-800 rounded-lg py-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Haz</span>
                                                    <span className="text-lg font-black text-primary">12</span>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-slate-900 dark:text-white font-bold text-sm">Fizyoterapi Kontrolü</p>
                                                    <p className="text-slate-500 text-xs">Dr. Ayşe Yılmaz • 14:00</p>
                                                </div>
                                            </div>

                                            {/* Appointment Item 2 */}
                                            <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                                <div className="flex flex-col items-center justify-center min-w-[50px] bg-slate-50 dark:bg-slate-800 rounded-lg py-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase">Haz</span>
                                                    <span className="text-lg font-black text-slate-700 dark:text-slate-300">19</span>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-slate-900 dark:text-white font-bold text-sm">Online Danışmanlık</p>
                                                    <p className="text-slate-500 text-xs">Uzm. Fzt. Mehmet Demir • 10:30</p>
                                                </div>
                                            </div>

                                            {/* Info Box */}
                                            <div className="mt-4 bg-primary/5 rounded-xl p-4 border border-primary/10">
                                                <div className="flex items-start gap-3">
                                                    <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
                                                    <div>
                                                        <p className="text-slate-900 dark:text-white font-semibold text-sm">Hatırlatma</p>
                                                        <p className="text-slate-500 text-xs mt-1">Randevunuza gelmeden 15 dakika önce hazır bulunmanız önerilir.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
