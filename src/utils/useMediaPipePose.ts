import { useEffect, useRef, useState, useCallback } from 'react';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

interface UsePoseProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useMediaPipePose = ({ videoRef, canvasRef }: UsePoseProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>([]);

    const poseLandmarker = useRef<PoseLandmarker | null>(null);
    const drawingUtils = useRef<DrawingUtils | null>(null);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        let active = true;

        const initMediaPipe = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const landmarker = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numPoses: 1,
                });

                if (!active) {
                    landmarker.close();
                    return;
                }

                poseLandmarker.current = landmarker;
                setIsLoaded(true);

            } catch (err) {
                console.error("Failed to initialize MediaPipe", err);
            }
        };

        initMediaPipe();

        return () => {
            active = false;
            if (poseLandmarker.current) {
                poseLandmarker.current.close();
                poseLandmarker.current = null;
            }
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    const startTracking = useCallback(() => {
        if (!poseLandmarker.current || !videoRef.current || !canvasRef.current || !isLoaded) return;

        if (!drawingUtils.current) {
            const canvasCtx = canvasRef.current.getContext('2d');
            if (canvasCtx) {
                drawingUtils.current = new DrawingUtils(canvasCtx);
            }
        }

        const video = videoRef.current;
        let lastVideoTime = -1;

        const renderLoop = () => {
            if (video.currentTime !== lastVideoTime && poseLandmarker.current) {
                lastVideoTime = video.currentTime;

                const result = poseLandmarker.current.detectForVideo(video, performance.now());

                if (result.landmarks && result.landmarks.length > 0) {
                    setLandmarks(result.landmarks[0]);

                    // Clear canvas & draw
                    const ctx = canvasRef.current?.getContext('2d');
                    if (ctx && canvasRef.current && drawingUtils.current) {
                        ctx.save();
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                        // In a real implementation we would draw connections using drawingUtils
                        // We can customize the color (green for correct, red for incorrect) later based on state
                        drawingUtils.current.drawLandmarks(result.landmarks[0], {
                            radius: (data) => DrawingUtils.lerp(data.from?.z || 0, -0.15, 0.1, 5, 1),
                            color: '#1392ec'
                        });
                        drawingUtils.current.drawConnectors(result.landmarks[0], PoseLandmarker.POSE_CONNECTIONS, {
                            color: 'white',
                            lineWidth: 2
                        });

                        ctx.restore();
                    }
                }
            }

            animationFrameId.current = requestAnimationFrame(renderLoop);
        };

        // Make sure dimensions match before running
        if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
        }

        renderLoop();

    }, [isLoaded, videoRef, canvasRef]);

    const stopTracking = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        setLandmarks([]);
    }, [canvasRef]);

    return { isLoaded, landmarks, startTracking, stopTracking };
};
