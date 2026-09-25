import { useEffect, useState } from 'react';

const CursorGlow = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = () => setActive(true);
        const handleMouseUp = () => setActive(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed top-0 left-0 w-full h-full z-50 overflow-hidden mix-blend-screen"
        >
            <div
                className="absolute rounded-full transition-transform duration-200 ease-out"
                style={{
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(226,180,189,0.15) 0%, rgba(226,180,189,0) 70%)',
                    left: position.x - 200,
                    top: position.y - 200,
                    transform: active ? 'scale(0.8)' : 'scale(1)',
                }}
            />
        </div>
    );
};

export default CursorGlow;
