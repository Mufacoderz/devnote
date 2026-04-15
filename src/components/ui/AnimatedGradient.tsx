"use client"

import { useEffect, useRef } from "react"
import { NeatGradient } from "@firecms/neat"

export default function AnimatedGradient() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const gradient = new NeatGradient({
            ref: canvasRef.current,

            colors: [
                { color: "#50FB64", enabled: true },
                { color: "#02FF00", enabled: true },
                { color: "#06350D", enabled: true },
                { color: "#6AE69A", enabled: true },
                { color: "#07430B", enabled: true },
                { color: "#00FF0E", enabled: true },
            ],

            speed: 2,
            horizontalPressure: 3,
            verticalPressure: 3,
            waveFrequencyX: 1,
            waveAmplitude: 2,

            highlights: 6,
            shadows: 2,

            colorBrightness: 1.05,
            colorSaturation: 3,

            backgroundColor: "#161616",

            grainIntensity: 0.25,
            flowEnabled: true,
        })

        const handleScroll = () => {
            gradient.yOffset = window.scrollY
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
            gradient.destroy?.()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
        />
    )
}