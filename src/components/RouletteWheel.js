import React, { useEffect, useRef } from "react";

const RouletteWheel = ({sections}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { count, type, labels } = sections;

        const width = 300;
        const height = 300;
        canvas.width = width;
        canvas.height = height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = width / 2 - 10;

        const angle = (2 * Math.PI) / count;
        for (let i = 0; i < count; i++) {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;

            // セクション描画
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
            ctx.fill();

            // テキスト描画
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + angle / 2);
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = "center";
            const text = type == 'number' ? String(i + 1) : labels[i] || `セクション${i + 1}`;
            ctx.fillText(text, radius -30, 0);
            ctx.restore();
        }
    }, [sections]);
    return <canvas ref={canvasRef} className="mt-4"/>
};

export default RouletteWheel;