import { calculateAngle3D } from './geometry';
import type { Point } from './geometry';

export type BodyRegion =
    | 'Shoulder'
    | 'Thoracolumbar'
    | 'Elbow'
    | 'Hip'
    | 'Knee'
    | 'Wrist'
    | 'Ankle'
    | 'Cervical';

export interface RegionalTrackingResult {
    currentAngle: number;
    isValidForm: boolean;
    isRepCounted: boolean;
    feedbackLevel: 'Good' | 'Warning' | 'Critical';
    feedbackMessage: string;
}

// Map MediaPipe Landmark Indices
// See: https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
export const LandmarkIndices = {
    NOSE: 0,
    LEFT_EYE_INNER: 1,
    LEFT_EYE: 2,
    LEFT_EYE_OUTER: 3,
    RIGHT_EYE_INNER: 4,
    RIGHT_EYE: 5,
    RIGHT_EYE_OUTER: 6,
    LEFT_EAR: 7,
    RIGHT_EAR: 8,
    MOUTH_LEFT: 9,
    MOUTH_RIGHT: 10,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_PINKY: 17,
    RIGHT_PINKY: 18,
    LEFT_INDEX: 19,
    RIGHT_INDEX: 20,
    LEFT_THUMB: 21,
    RIGHT_THUMB: 22,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
    LEFT_HEEL: 29,
    RIGHT_HEEL: 30,
    LEFT_FOOT_INDEX: 31,
    RIGHT_FOOT_INDEX: 32
};

interface EvaluatorState {
    isDescending: boolean;
    bottomHoldTime: number;
    lastAngle: number;
}

let activeState: EvaluatorState = {
    isDescending: false,
    bottomHoldTime: 0,
    lastAngle: -1
};

export const resetEvaluatorState = () => {
    activeState = {
        isDescending: false,
        bottomHoldTime: 0,
        lastAngle: -1
    };
};

export const evaluateRegionForm = (
    landmarks: Point[],
    region: BodyRegion,
    targetAngleMin: number,
    targetAngleMax: number,
    isLeftSide: boolean = true
): RegionalTrackingResult => {
    if (!landmarks || landmarks.length !== 33) {
        return {
            currentAngle: 0,
            isValidForm: false,
            isRepCounted: false,
            feedbackLevel: 'Critical',
            feedbackMessage: 'Model loading or no skeleton detected'
        };
    }

    let currentAngle = 0;
    let isValidForm = true;
    let feedbackMessage = 'Excellent Form';
    let feedbackLevel: 'Good' | 'Warning' | 'Critical' = 'Good';

    // Extract points based on region and side
    const L = LandmarkIndices;
    let p1: Point, p2: Point, p3: Point;

    switch (region) {
        case 'Knee':
            // Knee Extension / Squat logic: Hip - Knee - Ankle
            p1 = isLeftSide ? landmarks[L.LEFT_HIP] : landmarks[L.RIGHT_HIP];
            p2 = isLeftSide ? landmarks[L.LEFT_KNEE] : landmarks[L.RIGHT_KNEE];
            p3 = isLeftSide ? landmarks[L.LEFT_ANKLE] : landmarks[L.RIGHT_ANKLE];
            currentAngle = calculateAngle3D(p1, p2, p3);

            if (currentAngle < targetAngleMin) {
                isValidForm = false;
                feedbackLevel = 'Warning';
                feedbackMessage = 'Go deeper';
            } else if (currentAngle > targetAngleMax) {
                isValidForm = false;
                feedbackLevel = 'Critical';
                feedbackMessage = 'Hyperextension warning. Lock knees carefully.';
            }
            break;

        case 'Elbow':
            // Bicep Curl / Extension: Shoulder - Elbow - Wrist
            p1 = isLeftSide ? landmarks[L.LEFT_SHOULDER] : landmarks[L.RIGHT_SHOULDER];
            p2 = isLeftSide ? landmarks[L.LEFT_ELBOW] : landmarks[L.RIGHT_ELBOW];
            p3 = isLeftSide ? landmarks[L.LEFT_WRIST] : landmarks[L.RIGHT_WRIST];
            currentAngle = calculateAngle3D(p1, p2, p3);

            if (currentAngle < targetAngleMin) {
                isValidForm = false;
                feedbackLevel = 'Warning';
                feedbackMessage = 'Increase range of motion (too closed)';
            } else if (currentAngle > targetAngleMax) {
                isValidForm = false;
                feedbackLevel = 'Critical';
                feedbackMessage = 'Do not hyperextend the elbow';
            }
            break;

        case 'Shoulder':
            // Abduction: Hip - Shoulder - Elbow
            p1 = isLeftSide ? landmarks[L.LEFT_HIP] : landmarks[L.RIGHT_HIP];
            p2 = isLeftSide ? landmarks[L.LEFT_SHOULDER] : landmarks[L.RIGHT_SHOULDER];
            p3 = isLeftSide ? landmarks[L.LEFT_ELBOW] : landmarks[L.RIGHT_ELBOW];
            currentAngle = calculateAngle3D(p1, p2, p3);

            if (currentAngle > targetAngleMax) {
                isValidForm = false;
                feedbackLevel = 'Warning';
                feedbackMessage = 'Arm raised too high. Keep it level with shoulder.';
            }
            break;

        case 'Hip':
            // Trunk flexion: Shoulder - Hip - Knee
            p1 = isLeftSide ? landmarks[L.LEFT_SHOULDER] : landmarks[L.RIGHT_SHOULDER];
            p2 = isLeftSide ? landmarks[L.LEFT_HIP] : landmarks[L.RIGHT_HIP];
            p3 = isLeftSide ? landmarks[L.LEFT_KNEE] : landmarks[L.RIGHT_KNEE];
            currentAngle = calculateAngle3D(p1, p2, p3);

            if (currentAngle < 150) {
                // Just an arbitrary check for bending too far forward
                isValidForm = false;
                feedbackLevel = 'Warning';
                feedbackMessage = 'Keep your back straight. Do not lean forward.';
            }
            break;

        default:
            currentAngle = 0;
            feedbackMessage = `Tracking for ${region} is not fully implemented yet`;
            feedbackLevel = 'Warning';
    }

    // Basic State Machine Rep Logic for Demonstration
    let isRepCounted = false;

    // Has initialized?
    if (activeState.lastAngle === -1) {
        activeState.lastAngle = currentAngle;
    } else {
        // Arbitrary Logic: Movement threshold
        if (!activeState.isDescending && currentAngle < activeState.lastAngle - 5 && currentAngle < targetAngleMax - 10) {
            activeState.isDescending = true;
        } else if (activeState.isDescending && currentAngle > activeState.lastAngle + 5) {
            // Transition to Ascending
            if (currentAngle > targetAngleMax - 20) {
                // Reached top ish
                isRepCounted = !!isValidForm;
                activeState.isDescending = false;
            }
        }
        activeState.lastAngle = currentAngle;
    }

    return {
        currentAngle: parseFloat(currentAngle.toFixed(1)),
        isValidForm,
        isRepCounted,
        feedbackLevel,
        feedbackMessage
    };
};
