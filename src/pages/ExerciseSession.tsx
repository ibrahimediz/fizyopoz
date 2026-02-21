import React, { useRef, useEffect } from 'react';
import { useMediaPipePose } from '../utils/useMediaPipePose';
import { evaluateRegionForm } from '../utils/regionLogic';
import type { BodyRegion } from '../utils/regionLogic';

export default function ExerciseSession() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { isLoaded, landmarks, startTracking, stopTracking } = useMediaPipePose({
        videoRef: videoRef as React.RefObject<HTMLVideoElement>,
        canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>
    });

    // Hardcode 'Knee' for this demo session
    const activeRegion: BodyRegion = 'Knee';
    const formEvaluation = evaluateRegionForm(landmarks, activeRegion, 60, 160, false); // Right side knee

    useEffect(() => {
        const enableStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, facingMode: "user" }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        startTracking();
                    }
                }
            } catch (err) {
                console.error("Camera error:", err);
            }
        };

        if (isLoaded) {
            enableStream();
        }

        return () => {
            stopTracking();
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [isLoaded, startTracking, stopTracking]);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 shrink-0 h-16 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-3xl">accessibility_new</span>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">FizyoPoz</h2>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Patient</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white leading-none">John Doe</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <span className="material-symbols-outlined text-primary text-xl">timer</span>
                        <span className="text-slate-900 dark:text-white font-mono font-bold text-lg">04:23</span>
                    </div>
                    <button className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">stop_circle</span>
                        <span className="truncate">End Session</span>
                    </button>
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-slate-200 dark:border-slate-700" aria-label="Therapist profile picture" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGn0CKxTTzEI7y2Ox4ORmC6Lfibkp85FLGjlwF1sunbNoPfK1dnewqSZFJZlTWcEHq6UJjZR7PqHqWEjsLIgJmY6KswN8V0imsG0taXtvSx6rK1Oj0JJ_9xWv73sdJ7MJdlyIW30niNz-0e2MFoQ4Tj4rElzaWbkIoduaYQAhuMQj1P-U4A3W5wIlQI3MNwDxEhLvTIwdiEGbdxjxpQ-eLcFxwPqtoxqiypS-iX5ZiNA5tvDdW6a9GOd_CQSEJa7_JZEOrO1_IgEE')" }}></div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Video Feed */}
                <div className="flex-1 bg-black relative flex flex-col justify-center items-center overflow-hidden group">

                    {!isLoaded && <div className="absolute z-50 text-white font-bold text-xl animate-pulse">Loading AI Model...</div>}

                    {/* Live Video element replacing placeholder */}
                    <video
                        ref={videoRef}
                        className={`absolute w-full h-full object-cover ${(!isLoaded) ? 'opacity-0' : 'opacity-80'}`}
                        playsInline
                    />

                    {/* Canvas for MediaPipe overlays replacing raw SVG */}
                    <canvas
                        ref={canvasRef}
                        className="absolute w-full h-full object-cover z-20 pointer-events-none"
                    />

                    {/* Live Badge */}
                    <div className="absolute z-30 top-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                        <div className={`size-2.5 rounded-full ${isLoaded ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Live AI Tracking</span>
                    </div>

                    {/* On-Video Feedback Overlay */}
                    <div className="absolute z-30 top-6 right-6 max-w-xs transition-opacity duration-300" style={{ opacity: landmarks.length > 0 ? 1 : 0 }}>
                        <div className={`bg-black/60 backdrop-blur-md border-l-4 p-4 rounded-r-lg shadow-lg ${formEvaluation.feedbackLevel === 'Good' ? 'border-success' :
                            formEvaluation.feedbackLevel === 'Warning' ? 'border-yellow-400' : 'border-red-500'
                            }`}>
                            <div className="flex items-start gap-3">
                                <span className={`material-symbols-outlined ${formEvaluation.feedbackLevel === 'Good' ? 'text-success' :
                                    formEvaluation.feedbackLevel === 'Warning' ? 'text-yellow-400' : 'text-red-500'
                                    }`}>
                                    {formEvaluation.feedbackLevel === 'Good' ? 'check_circle' : 'warning'}
                                </span>
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        {formEvaluation.feedbackLevel === 'Good' ? 'Excellent Form' : 'Adjust Form'}
                                    </p>
                                    <p className="text-white/80 text-xs mt-1">{formEvaluation.feedbackMessage}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Controls */}
                    <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="text-white hover:text-primary transition-colors"><span className="material-symbols-outlined">mic</span></button>
                        <button className="text-white hover:text-primary transition-colors"><span className="material-symbols-outlined text-4xl">pause_circle</span></button>
                        <button className="text-white hover:text-primary transition-colors"><span className="material-symbols-outlined">videocam</span></button>
                    </div>
                </div>

                {/* Right Panel: Data Dashboard */}
                <aside className="w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto shrink-0 relative custom-scrollbar">
                    <div className="p-6 flex flex-col gap-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Knee Rehabilitation</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Active Session • Squat Analysis</p>
                        </div>

                        {/* Repetition Counter */}
                        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 flex items-center justify-between border border-primary/20">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Repetitions</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-primary">8</span>
                                    <span className="text-xl font-medium text-slate-400">/12</span>
                                </div>
                                <div className="flex items-center gap-1 text-success text-sm font-medium mt-1">
                                    <span className="material-symbols-outlined text-base">trending_up</span>
                                    <span>On Target</span>
                                </div>
                            </div>
                            {/* Circular Progress Visual */}
                            <div className="relative size-20">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                    <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="66, 100" strokeWidth="3"></path>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">66%</span>
                                </div>
                            </div>
                        </div>

                        {/* Joint Angles Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Card 1 */}
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">L. Knee Angle</span>
                                    <span className="material-symbols-outlined text-slate-400 text-base">straighten</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">110°</div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: "80%" }}></div>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                                    <span>0°</span>
                                    <span>140°</span>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                                <div className="absolute inset-0 border-2 border-success/30 rounded-lg pointer-events-none"></div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">R. Knee Angle</span>
                                    <span className="material-symbols-outlined text-success text-base">check</span>
                                </div>
                                <div className="text-2xl font-bold text-success">112°</div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-success h-full rounded-full" style={{ width: "82%" }}></div>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                                    <span>0°</span>
                                    <span>Target: 110°</span>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hip Flexion</span>
                                    <span className="material-symbols-outlined text-slate-400 text-base">accessibility</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">85°</div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: "60%" }}></div>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sets</span>
                                    <span className="material-symbols-outlined text-slate-400 text-base">repeat</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">2 <span className="text-sm font-normal text-slate-400">/ 3</span></div>
                                <div className="text-[10px] text-slate-500 mt-2">Next set in 2 mins</div>
                            </div>
                        </div>

                        {/* Therapist Notes */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Therapist's Notes</h3>
                                <button className="text-primary text-xs font-medium hover:underline">Edit</button>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-lg shrink-0 mt-0.5">lightbulb</span>
                                        <span>Focus on slow eccentric movement (3s down).</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-lg shrink-0 mt-0.5">warning</span>
                                        <span>Do not let the right knee collapse inward during the squat.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* History Graph Mini */}
                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Session Velocity</span>
                                <span className="text-xs font-bold text-success">+12% vs last</span>
                            </div>
                            <div className="flex items-end gap-1 h-16">
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[40%]"></div>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[60%]"></div>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[50%]"></div>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[30%]"></div>
                                <div className="flex-1 bg-primary/20 rounded-t-sm h-[70%]"></div>
                                <div className="flex-1 bg-primary/40 rounded-t-sm h-[85%]"></div>
                                <div className="flex-1 bg-primary rounded-t-sm h-[60%]"></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #334155;
        }
      `}</style>
        </div>
    );
}
