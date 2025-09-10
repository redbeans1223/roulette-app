  import React, { createContext, useState, useEffect, useRef } from "react";

  export const RoulettContext = createContext();

  export const RoulettProvider = ({ children }) => {
      const [error, setError] = useState(null);
      const [result, setResult] = useState(null);
      const [sections, setSections] = useState({ count: 8, type: "number", labels: null});
      const [rotation, setRotation] = useState(0);
      const [colors, setColors] = useState([]);
      const [isSpinning, setIsSpinning] = useState(false);
      // const lastProgressRef = useRef(0);
      const lastRotationRef = useRef(0);

      useEffect(() => {
          const palette = [
              '#D32F2F', '#388E3C', '#0288D1', '#FBC02D', '#7B1FA2', '#FF4081',
              '#00ACC1', '#F57C00', '#6D4C41', '#689F38', '#1976D2', '#FFA000',
              '#512DA8', '#E91E63', '#26A69A', '#EF5350', '#2E7D32', '#039BE5',
              '#FFB300', '#673AB7'
          ];
          setColors(Array(sections.count).fill().map((_, i) => palette[i % palette.length]));
    }, [sections.count]);
      const playClickSound = () => {
        const audio = new Audio('/sounds/click.mp3');
        audio.play().catch(e => console.error('音声エラー：', e));
      }
      const handleFormSubmit = async ({ sectionCount, sectionType, labels}) => {
        try {
          const response = await fetch("http://localhost:8080/api/sections", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({count: sectionCount, type: sectionType, labels})
          });
          const data = await response.json();
          if (!response.ok) {
            setError(data.error);
            return;
          }
          setError(null);
          setSections({count: sectionCount, type: sectionType, labels});
        } catch(e) {
          setError("サーバーエラー");
        }
        console.log(`セクション数： ${sectionCount}, 形式： ${sectionType}, ラベル： ${labels}`);
      };
      
      const handleSpin = async () => {
        const spinCounts = 16;
        playClickSound();
        if (isSpinning) return;
        setIsSpinning(true);
        setResult(null);
        try {
          const response = await fetch("http://localhost:8080/api/spin", { method: 'GET' });
          const data = await response.json();
          
          if (!response.ok) {
            setError(data.error);
            setIsSpinning(false);
            return;
          }
          const index = Number(data.result);
          if (isNaN(index) || index < 1 || index > sections.count) {
            setError('無効な結果：', index);
            setIsSpinning(false);
            return;
          }
          setError(null);
          // 回転アニメーション
          let start = null;
          const duration = 5000;
          const overRun = 500;
          const targetRotation = (-(index - 1) * (2 * Math.PI / sections.count)) - (Math.PI / 2) + (spinCounts * Math.PI);
          const sectionAngle = 2 * Math.PI / sections.count;
          // const clickFrequency = sections.count * spinCounts;
          // const baseInterval = duration / clickFrequency; // 音の基本間隔
          lastRotationRef.current = 0;
          playClickSound();
          const animate = (timestamp) => {
            if(!start) {
              start = timestamp;
            } 
            const elapsed = timestamp - start;
            let progress = Math.sin(Math.min(elapsed / duration, 1) ** 0.5 * (Math.PI / 2));
            if (elapsed > duration) {
              progress = 1;
              if (elapsed - duration > overRun) {
                setResult(index);
                setIsSpinning(false);
                return;
              }
            }
            const currentRotation = progress * targetRotation;
            setRotation(currentRotation);
            // 回転音（セクション通過に連動）
            const passedSections = Math.floor(Math.abs(currentRotation) / sectionAngle);
            const lastPassedSections = Math.floor(Math.abs(lastRotationRef.current) / sectionAngle);

            // 回転音（セクション通過ごと）
            if (passedSections > lastPassedSections ) {
              playClickSound();
              lastRotationRef.current = currentRotation;
            }
            requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        } catch (e) {
          setError('サーバーエラー');
          setIsSpinning(false);
        }
      };
      const handleReset = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/reset", {
            method: "DELETE"
          });
          const data = await response.json();
          if(!response.ok) {
            setError(data.error);
            return;
          }
          setError(null);
          setSections({ count: 8, type: 'number', labels: null});
          setRotation(0);
          setResult(null);
          setIsSpinning(false);
        } catch(e) {
          setError('サーバーエラー');
          setIsSpinning(false);
        }
      };
      return (
          <RoulettContext.Provider value={{
              error, setError, result, setResult, sections, setSections,
              rotation, setRotation, colors, isSpinning, setIsSpinning,
              handleFormSubmit, handleSpin, handleReset
          }}>
              {children}
          </RoulettContext.Provider>
      );
  };