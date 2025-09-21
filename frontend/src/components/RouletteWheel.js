import React, { useEffect, useRef } from "react";

const RIM = 30; // ルーレットの縁の太さ

const RouletteWheel = ({sections, rotation, colors, isSpinning}) => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const startTimeRef = useRef(null);
    const boardChacheRef = useRef(null); // ルーレット台のキャッシュ用
    const CANVAS_SIZE = Math.min(window.innerWidth * 0.9, 400); // キャンバスのサイズ
    useEffect(() => {        
        const { count, type, labels } = sections;
        const off = document.createElement('canvas');
        off.width = CANVAS_SIZE; off.height = CANVAS_SIZE;
        const offCtx = off.getContext('2d');
        const cx = CANVAS_SIZE / 2; const cy = CANVAS_SIZE / 2;
        const radius = CANVAS_SIZE / 2 - RIM;
        const angle = (2 * Math.PI) / count; // count=8 なら angle = 0.785398163（ラジアン） で 一つの円弧の円周でもある
        // ルーレット描画
        offCtx.beginPath();
        offCtx.arc(cx, cy, radius + RIM, 0, 2 * Math.PI); // 外枠
        offCtx.fillStyle = 'darkgreen';
        offCtx.fill();
        offCtx.strokeStyle = 'darkgreen';
        offCtx.stroke();
        // セクション描画
        for (let i = 0; i < count; i++) {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            offCtx.beginPath();
            offCtx.arc(cx, cy, radius, startAngle, endAngle);
            offCtx.lineWidth = 0.5;
            offCtx.lineTo(cx, cy);
            offCtx.fillStyle = colors[i % colors.length] || '#000000';
            offCtx.fill();
            offCtx.strokeStyle = 'black';
            offCtx.stroke();
            
            // ラベル描画
            offCtx.save();
            offCtx.translate(cx, cy);
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
        boardChacheRef.current = off; // ルーレット台のキャッシュ
    }, [sections, colors, CANVAS_SIZE]);
    // 毎フレーム描画
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // DPR対応
        const dpr = window.devicePixelRatio || 1;
        canvas.width = CANVAS_SIZE * dpr; canvas.height = CANVAS_SIZE * dpr;
        canvas.style.width = `${CANVAS_SIZE}px`; canvas.style.height = `${CANVAS_SIZE}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 座標系をDPR対応
        const cx = CANVAS_SIZE / 2; const cy = CANVAS_SIZE / 2;
        const radius = CANVAS_SIZE / 2 - RIM;
                
        const draw = (currentRotation, indicatorAngle) => {
            ctx.clearRect(0, 0, CANVAS_SIZE,  CANVAS_SIZE);
            const chache = boardChacheRef.current;
            if (chache) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(currentRotation || 0);
                // はみ出し防止
                ctx.drawImage(chache, -chache.width /2, -chache.height /2);
                ctx.restore();
            }
            // インジケータの描画
            ctx.save();
            ctx.translate(cx, cy - radius -5);
            ctx.rotate(indicatorAngle || 0);
            // 三角形
            ctx.beginPath();
            ctx.moveTo(-10, -5);
            ctx.lineTo(10, -5);
            ctx.lineTo(0, 22);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.strokeStyle = 'gray';
            ctx.stroke();

            // 軸の描画
            ctx.beginPath();
            ctx.arc(0, -5, 8, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.restore();
        };
          
        if (isSpinning) {
            const animate = (timestamp) => {
                if (!startTimeRef.current) startTimeRef.current = timestamp;
                const elapsed = timestamp - startTimeRef.current;
                const t = Math.min(elapsed / 5000, 1);
                const ease = Math.sin(Math.pow(t, 0.5) * (Math.PI / 2)); // easeOutSine
                const rotationSpeed = Math.cos(Math.pow(t, 0.5) * (Math.PI / 2)); // easeInSine
                const currentRotation = (rotation || 0) * ease;
                const indicatorAngle = Math.sin(timestamp / (80 / (rotationSpeed + 0.3))) * 0.3 * (1 - Math.pow(t, 1.5)); // インジケータの揺れ
                
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
    }, [sections, colors, rotation, isSpinning, CANVAS_SIZE]);
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default RouletteWheel;