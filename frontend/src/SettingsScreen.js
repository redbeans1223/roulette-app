import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionForm from './components/SectionForm';
import { RoulettContext } from './context/RouletteContext';

const SettingsScreen = () => {
    const { handleFormSubmit } = useContext(RoulettContext);
    const navigate = useNavigate();
    
    return (
        <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen'>
            <h1 className='text-3xl font-bold mb-4 mt-16'>設定画面</h1>
            <SectionForm onSubmit={handleFormSubmit} />
        </div>
    );
};

export default SettingsScreen;