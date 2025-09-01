import React, { useEffect, useRef, useState } from "react";

const RouletteWheel = ({sections, rotation, colors}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { count, type, labels } = sections;

        const width = 300; const height = 300;
        canvas.width = width; canvas.height = height;
        const centerX = width / 2; const centerY = height / 2; const radius = width / 2 - 10;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation || 0);
        ctx.translate(-centerX, -centerY);
        const angle = (2 * Math.PI) / count; // count=8 なら angle = 0.785398163（ラジアン） で 一つの円弧の円周でもある
        for (let i = 0; i < count; i++) {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            // セクション描画
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.restore();
            // テキスト描画
            ctx.save();
            ctx.translate(centerX, centerY);
            // ctx.rotate(startAngle + angle / 2);
            // ctx.rotate(-(startAngle + angle / 2));
            ctx.fillStyle = 'white';
            
            ctx.font = type == 'number' ? '22px Arial' : '14px Arial';
            ctx.textAlign = "center";
            const text = type == 'number' ? String(i + 1) : labels[i] || `セクション${i + 1}`;
            ctx.fillText(text, radius -90, 0);
            ctx.restore();  
        }
        // インジケータの描画
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(-10, -radius - 5);
        ctx.lineTo(10, -radius - 5);
        ctx.lineTo(0, -radius + 5);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        
    }, [sections, colors, rotation]);
    return <canvas ref={canvasRef} className="mt-4"/>
};

export default RouletteWheel;