'use client'

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
            {/* Glass layer */}
            <div className="absolute inset-0 backdrop-blur-xl bg-white/10 dark:bg-black/10" />

            {/* Animated blobs */}
            <div className="absolute w-[60vmax] h-[60vmax] bg-purple-500 rounded-full blur-[120px] opacity-20 top-[-20vmax] left-[-20vmax] animate-blob1" />
            <div className="absolute w-[50vmax] h-[50vmax] bg-pink-500 rounded-full blur-[100px] opacity-20 top-[40%] left-[60%] transform -translate-x-1/2 animate-blob2" />
            <div className="absolute w-[60vmax] h-[60vmax] bg-blue-500 rounded-full blur-[120px] opacity-20 bottom-[-20vmax] right-[-20vmax] animate-blob3" />
        </div>
    )
}
