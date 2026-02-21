export interface Point {
    x: number;
    y: number;
    z?: number;
    visibility?: number;
}

export interface AngleMeasurement {
    angle: number;
    isValid: boolean;
}

/**
 * Calculates the 2D angle between three points (A, B, C) where B is the vertex.
 */
export const calculateAngle2D = (a: Point, b: Point, c: Point): number => {
    // Vector 1 (B to A)
    const v1 = {
        x: a.x - b.x,
        y: a.y - b.y,
    };

    // Vector 2 (B to C)
    const v2 = {
        x: c.x - b.x,
        y: c.y - b.y,
    };

    // Calculate dot product
    const dotProduct = v1.x * v2.x + v1.y * v2.y;

    // Calculate magnitudes
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    // Calculate angle in radians
    const cosAngle = dotProduct / (mag1 * mag2);

    // Ensure value is within valid acos range [-1, 1] due to floating point errors
    const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));

    const angleRad = Math.acos(clampedCosAngle);

    // Convert to degrees
    let angleDeg = (angleRad * 180.0) / Math.PI;

    // Keep angle <= 180
    if (angleDeg > 180.0) {
        angleDeg = 360.0 - angleDeg;
    }

    return angleDeg;
};

/**
 * Calculates the 3D angle between three points (A, B, C) where B is the vertex.
 * MediaPipe provides Z coordinates which can improve accuracy for movements not strictly parallel to the camera.
 */
export const calculateAngle3D = (a: Point, b: Point, c: Point): number => {
    if (a.z === undefined || b.z === undefined || c.z === undefined) {
        return calculateAngle2D(a, b, c); // Fallback to 2D
    }

    // Vector 1 (B to A)
    const v1 = {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
    };

    // Vector 2 (B to C)
    const v2 = {
        x: c.x - b.x,
        y: c.y - b.y,
        z: c.z - b.z,
    };

    // Calculate dot product
    const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

    // Calculate magnitudes
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

    // Calculate angle in radians
    const cosAngle = dotProduct / (mag1 * mag2);
    const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));
    const angleRad = Math.acos(clampedCosAngle);

    // Convert to degrees
    let angleDeg = (angleRad * 180.0) / Math.PI;

    if (angleDeg > 180.0) {
        angleDeg = 360.0 - angleDeg;
    }

    return angleDeg;
};
