import React, { useEffect, useRef, useState } from "react";

const RouletteWheel = ({sections, rotation, colors, isSpinning}) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const boardChacheRef = useRef(null); // ルーレット台のキャッシュ用

    useEffect(() => {
        const canvas = canvasRef.current;
        
        const { count, type, labels } = sections;
        
        const width = 330; const height = 330;
        const centerX = width / 2; const centerY = height / 2; const radius = width / 2 - 30;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width; offCanvas.height = height;
        const ctx = offCanvas.getContext('2d');
        
        // ルーレット描画
        const angle = (2 * Math.PI) / count; // count=8 なら angle = 0.785398163（ラジアン） で 一つの円弧の円周でもある
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 30, 0, 2 * Math.PI); // 外枠
        ctx.fillStyle = 'darkgreen';
        ctx.fill();
        ctx.closePath();
        ctx.strokeStyle = 'darkgreen';
        ctx.stroke();
        // セクション描画
        for (let i = 0; i < count; i++) {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 0.5;
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[i % colors.length] || '#000000';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
            
            // ラベル描画
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + angle / 2);
            ctx.translate(type === 'number' ? radius * 0.8 : radius * 0.7, 0);
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = 'white';
            ctx.font = type == 'number' ? '28px Arial' : '14px Arial';
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            const text = type == 'number' ? String(i + 1) : labels[i] || `セクション${i + 1}`;
            ctx.fillText(text, 0, 0);
            ctx.restore();  
        }
        boardChacheRef.current = offCanvas; // ルーレット台のキャッシュ
    }, [sections, colors]);
    // 毎フレーム描画
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width; const height = canvas.height;
        const centerX = width / 2; const centerY = height / 2; const radius = width / 2 - 30;
        
        const draw = (currentRotation, indicatorAngle) => {
            ctx.clearRect(0, 0, width,  height);
            if (boardChacheRef.current) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(currentRotation - 0.1 || 0);
                ctx.translate(-centerX, -centerY);
                ctx.drawImage(
                    boardChacheRef.current,
                    0, 0, boardChacheRef.current.width, boardChacheRef.current.height,
                    0, 0, width, height
                );
                ctx.restore();
            }
            // インジケータの描画
            ctx.save();
            
            ctx.translate(centerX, centerY - radius -5);
            ctx.rotate(indicatorAngle);
            ctx.beginPath();
            ctx.moveTo(-8, -8);
            ctx.lineTo(8, -8);
            ctx.lineTo(0, 20);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.strokeStyle = 'gray';
            ctx.stroke();
            ctx.restore();

            // 軸の描画
            ctx.beginPath();
            ctx.arc(centerX, centerY - radius - 20, 8, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();
        };
          
        if (isSpinning) {
            const animate = (timestamp) => {
                if (!startTimeRef.current) startTimeRef.current = timestamp;
                const elapsed = timestamp - startTimeRef.current;
                const progress = Math.sin(Math.min(elapsed / 5000, 1) ** 0.5 * (Math.PI / 2));
                const rotationSpeed = Math.cos(Math.min(elapsed / 5000, 1) ** 0.5 * (Math.PI / 2));
                const currentRotation = (rotation || 0) * progress;
                const indicatorAngle = Math.sin(timestamp / (100 / (rotationSpeed + 0.5))) * 0.15 * (1 - progress);
                draw(currentRotation, indicatorAngle);
                animationFrameRef.current = requestAnimationFrame(animate);
            };
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            startTimeRef.current = null;
            draw(rotation, 0);
        }
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [sections, colors, rotation, isSpinning]);
    return <canvas ref={canvasRef} className="mt-4 mx-auto" style={{ display: 'block' }}/>
};

export default RouletteWheel;