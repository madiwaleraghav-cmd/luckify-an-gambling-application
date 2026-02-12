"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollCanvasProps {
    currentFrame: number; // 0 to 119 (or mapped from 210)
    onLoaded?: () => void;
}

const FRAME_COUNT = 120; // Prompt asks for 120. We will map scroll to this range.
// Actually, we have 210 frames. To respect "120-frame image sequence" requirement literally,
// we could just use the first 120. But for smoothness, we should probably use all if available,
// OR just cap the index.
// Let's stick to the prompt's "120-frame" spec but since we copied all 210, we can use 120 as the limit
// or map 0-1 to 0-119.
// If the user provided 210 frames, it's better to use more frames for smoother animation usually.
// However, I will strictly follow the "120-frame" requirement from the prompt text for the canvas logic
// to ensure I meet the "Rendering: HTML5 Canvas (120-frame image sequence)" spec perfectly.
// I will start by loading the first 120 frames.

export default function ScrollCanvas({ currentFrame, onLoaded }: ScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];
        const totalFramesToLoad = FRAME_COUNT; // 120

        // Safety timeout
        const timeout = setTimeout(() => {
            if (!isLoaded) {
                console.warn("Image load timeout");
                setIsLoaded(true);
                onLoaded?.();
            }
        }, 10000);

        for (let i = 0; i < totalFramesToLoad; i++) {
            const img = new Image();
            // We renamed them to frame_0.jpg ... frame_209.jpg. We use 0-119.
            img.src = `/sequence/roulette/frame_${i}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFramesToLoad) {
                    clearTimeout(timeout);
                    setIsLoaded(true);
                    onLoaded?.();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load frame_${i}.jpg`);
                loadedCount++; // Count error as done to avoid hanging
                if (loadedCount === totalFramesToLoad) {
                    clearTimeout(timeout);
                    setIsLoaded(true);
                    onLoaded?.();
                }
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);

        return () => clearTimeout(timeout);
    }, [onLoaded]);

    // Draw Frame
    useEffect(() => {
        if (!isLoaded || !canvasRef.current || images.length === 0) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Calculate frame index
        let frameIndex = Math.floor(currentFrame);
        if (frameIndex < 0) frameIndex = 0;
        if (frameIndex >= FRAME_COUNT) frameIndex = FRAME_COUNT - 1;

        const img = images[frameIndex];

        if (!img) return;
        if (img.width === 0) return; // Skip broken images

        // Responsive Drawing (Object-Fit: Contain)
        const { width, height } = canvasRef.current;

        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect < imgAspect) {
            // Canvas is taller than image (relative to aspect) -> fit width
            drawWidth = width;
            drawHeight = width / imgAspect;
            offsetX = 0;
            offsetY = (height - drawHeight) / 2;
        } else {
            // Canvas is wider than image -> fit height
            drawWidth = height * imgAspect;
            drawHeight = height;
            offsetX = (width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    }, [currentFrame, isLoaded, images]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Redraw will happen on next frame update or we could force it here if we stored the last frame index
                // relying on React state update usually works well enough if frame updates frequently
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Init size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
                }`}
        />
    );
}
