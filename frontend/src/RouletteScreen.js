import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RouletteWheel from './components/RouletteWheel';
import { RoulettContext } from './context/RouletteContext';

const RouletteScreen = () => {
    const { error, result, sections, rotation, colors, isSpinning, handleSpin, handleReset } = useContext(RoulettContext);
    const navigate = useNavigate();
    const handleResetAndNavigate = async () => {
        await handleReset();
        navigate('/');
    }
    return (
        <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen'>
            <div className='fixed top-0 w-full h-12 bg-red-100 text-red-700 flex item-center justify-center'>
                {error ? error: ' '}
            </div>
            <h1 className='text-3xl font-bold mb-4 mt-16'>ルーレットアプリ</h1>
            <RouletteWheel sections={sections} rotation={rotation} colors={colors} isSpinning={isSpinning}/>
            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 disable:bg-gray-400'
            >
                ルーレットを回す
            </button>
            <button
                onClick={handleResetAndNavigate}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 disable:bg-gray-400'
            >
                リセット
            </button>
            <div className='mt-4 text-lg'>
                結果：{result && isSpinning === false && (
                    sections.type === 'number' ? ' ' + result : sections.labels ? ' ' + sections.labels[parseInt(result) - 1] : ' ' + result
                )}
            </div>
            
        </div>
    );
};

export default RouletteScreen;