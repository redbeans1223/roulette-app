import React, { useEffect, useRef, useState } from "react";

const RouletteWheel = ({sections, rotation, colors}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { count, type, labels } = sections;

        const width = 300; const height = 300;
        const centerX = width / 2; const centerY = height / 2; const radius = width / 2 - 20;
        ctx.clearRect(0, 0, width,  height);
        canvas.width = width; canvas.height = height;
        // ルーレット描画
        const angle = (2 * Math.PI) / count; // count=8 なら angle = 0.785398163（ラジアン） で 一つの円弧の円周でもある
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation - 0.1 || 0);
        ctx.translate(-centerX, -centerY);
        
        for (let i = 0; i < count; i++) {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            // セクション描画
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.restore();
            // ctx.lineTo(centerX, centerY);
            
            // テキスト描画
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + angle / 2);
            // ctx.rotate(-(startAngle + angle / 2));
            ctx.fillStyle = 'white';
            ctx.font = type == 'number' ? '22px Arial' : '14px Arial';
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            const text = type == 'number' ? String(i + 1) : labels[i] || `セクション${i + 1}`;
            ctx.fillText(text, radius * 0.8, 0);
            ctx.restore();  
        }
        ctx.restore();
        // インジケータの描画
        ctx.beginPath();
        ctx.moveTo(centerX -10, -radius - 10);
        ctx.lineTo(centerX + 20, -radius - 20);
        ctx.lineTo(centerX, centerY -radius + 20);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.strokeStyle = 'gray';
        ctx.stroke();
    }, [sections, colors, rotation]);
    return <canvas ref={canvasRef} className="mt-4 mx-auto" style={{ display: 'block' }}/>
};

export default RouletteWheel;