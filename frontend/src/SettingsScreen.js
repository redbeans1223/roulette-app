import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SectionForm from './components/SectionForm';
import { RoulettContext } from './context/RouletteContext';

const SettingsScreen = () => {
    const { handleFormSubmit } = useContext(RoulettContext);

    return (
        <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen'>
            <h1 className='text-3xl font-bold mb-4 mt-16'>設定画面</h1>
            <SectionForm onSubmit={handleFormSubmit} />
            <Link to="/" className='mt-4 text-blue-500'>ルーレット画面へ</Link>
        </div>
    );
};

export default SettingsScreen;