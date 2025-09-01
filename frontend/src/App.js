  import logo from './logo.svg';
  import SectionForm from './components/SectionForm';
  import RouletteWheel from './components/RouletteWheel';
  import './App.css';
  import './index.css';
  import React, { useState, useRef, useEffect } from 'react';

  const App = () => {
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [sections, setSections] = useState({count: 8, type:"number", labels: null});
    const [rotation, setRotation] = useState(0);
    const rotationRef = useRef(rotation);
    const [colors, setColors] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
      const palette = [
        '#D32F2F', // 赤
        '#388E3C', // 緑
        '#0288D1', // 青
        '#FBC02D', // 黄
        '#7B1FA2', // 紫
        '#FF4081', // ピンク
        '#00ACC1', // シアン
        '#F57C00', // オレンジ
        '#6D4C41', // ブラウン
        '#689F38', // ライム
        '#1976D2', // 濃青
        '#FFA000', // アンバー
        '#512DA8', // 濃紫
        '#E91E63', // 濃ピンク
        '#26A69A', // ティール
        '#EF5350', // ライト赤
        '#2E7D32', // 濃緑
        '#039BE5', // ライト青
        '#FFB300', // ライト黄
        '#673AB7'  // ディープパープル
      ];
      
      setColors(Array(sections.count).fill().map(( _, i) => palette[i % palette.length]));
    }, [sections.count]);
    
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
      if (isSpinning) return;
      setIsSpinning(true);
      setResult(null);
      try {
        const response = await fetch("http://localhost:8080/api/spin", { method: 'GET' });
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error);
          return;
        }
        
        setResult(data.result);
        setError(null);
        // 回転アニメーション
        let start = null;
        const duration = 5000;
        const targetRotation = (-(parseInt(data.result) - 1) * (2 * Math.PI / sections.count)) - (Math.PI / 2) + (8 * Math.PI);
        const animate = (timestamp) => {
          if(!start) start = timestamp;
          const progress = Math.sin(Math.min((timestamp - start)  / duration, 1) ** 0.5 * (Math.PI / 2));
          rotationRef.current = progress * targetRotation;
          setRotation(rotationRef.current);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setResult(data.result);
            setIsSpinning(false);
          }
        };
        requestAnimationFrame(animate);
      } catch (e) {
        setError('サーバーエラー');
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
      } catch(e) {
        setError('サーバーエラー');
      }
    };
    return (
      <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen'>
        
        <div className='fixed top-0 w-full h-12 bg-red-100 text-red-700 flex items-center justify-center'>
          {error ? error: ' '}
        </div>
        <h1 className='text-3xl font-bold mb-4 mt-16'>ルーレットアプリ</h1>
        <SectionForm onSubmit={handleFormSubmit}/>
        <RouletteWheel sections={sections} rotation={rotation} colors={colors}/>
        <button onClick={handleSpin} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
          ルーレットを回す
        </button>
        <button onClick={handleReset} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4'>
          リセット
        </button>
        {result && <div className='mt-4 text-lg'>結果: {result}</div>}
      </div>
    );
  };

  export default App;
