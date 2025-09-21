import React, { useEffect, useRef, useState } from "react";

const RouletteWheel = ({sections, rotation, colors, isSpinning}) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const boardChacheRef = useRef(null); // ルーレット台のキャッシュ用

    useEffect(() => {        
        const { count, type, labels } = sections;
        const width = 330; const height = 330;
        const centerX = width / 2; const centerY = height / 2; const radius = width / 2 - 30;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = radius * 2 + 60; offCanvas.height = radius * 2 + 60;
        const offCtx = offCanvas.getContext('2d');
        const offWidth = offCanvas.width / 2; const offHeight = offCanvas.height / 2;
        const offCenterX = offWidth / 2; const offCenterY = offHeight / 2;
        // ルーレット描画
        const angle = (2 * Math.PI) / count; // count=8 なら angle = 0.785398163（ラジアン） で 一つの円弧の円周でもある
        offCtx.beginPath();
        offCtx.arc(offCenterX, offCenterY, radius + 30, 0, 2 * Math.PI); // 外枠
        offCtx.fillStyle = 'darkgreen';
        offCtx.fill();
        offCtx.strokeStyle = 'darkgreen';
        offCtx.stroke();
        // セクション描画
        for (let i = 0; i < count; i++) {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            offCtx.beginPath();
            offCtx.arc(offCenterX, offCenterY, radius, startAngle, endAngle);
            offCtx.lineWidth = 0.5;
            offCtx.lineTo(offCenterX, offCenterY);
            offCtx.fillStyle = colors[i % colors.length] || '#000000';
            offCtx.fill();
            offCtx.strokeStyle = 'black';
            offCtx.stroke();
            
            // ラベル描画
            offCtx.save();
            offCtx.translate(offCenterX, offCenterY);
            offCtx.rotate(startAngle + angle / 2);
            offCtx.translate(type === 'number' ? radius * 0.8 : radius * 0.7, 0);
            offCtx.rotate(Math.PI / 2);
            offCtx.fillStyle = 'white';
            offCtx.font = type == 'number' ? '28px Arial' : '14px Arial';
            offCtx.textAlign = "center";
            offCtx.textBaseline = 'middle';
            const text = type == 'number' ? String(i + 1) : labels[i] || `セクション${i + 1}`;
            offCtx.fillText(text, 0, 0);
            offCtx.restore();  
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
                ctx.rotate(currentRotation || 0);
                ctx.translate(-boardChacheRef.current.width / 2, -boardChacheRef.current.height / 2);
                ctx.drawImage(boardChacheRef.current,0, 0);
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