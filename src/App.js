import logo from './logo.svg';
import SectionForm from './components/SectionForm';
import RouletteWheel from './components/RouletteWheel';
import './App.css';
import './index.css';
import React, { useState} from 'react';

const App = () => {
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [sections, setSections] = useState({count: 8, type:"number", labels: null});

  const handleFormSubmit = async ({ sectionCount, sectionType, labels}) => {
    try {
      const response = await fetch("http://localhost:8080/api/sections", {
        method: "POST",
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
      // TODO ルーレットUI更新(canvas）
    } catch(e) {
      setError("サーバーエラー");
    }
    console.log(`セクション数： ${sectionCount}, 形式： ${sectionType}, ラベル： ${labels}`);
  };
  const handleSpin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/spin");
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      setResult(data.result);
      setError(null);
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
      <h1 className='text-3xl font-bold mb-4'>ルーレットアプリ</h1>
      <div className='fixed top-0 w-full h-12 bg-red-100 text-red-700 flex items-center justify-center'>
        {error ? error: ' '}
      </div>
      <SectionForm onSubmit={handleFormSubmit}/>
      <RouletteWheel sections={sections}/>
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
