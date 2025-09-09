  import logo from './logo.svg';
  import SectionForm from './components/SectionForm';
  import RouletteWheel from './components/RouletteWheel';
  import './App.css';
  import './index.css';
  import React from 'react';
  import { Routes, Route} from 'react-router-dom';
  import { RoulettProvider } from './context/RouletteContext';
  import RouletteScreen from './RouletteScreen';
  import SettingsScreen from './SettingsScreen';

  const App = () => {
    return (
      <RoulettProvider>
        <Routes>
          <Route path="/" element={<SettingsScreen />} />
          <Route path="/roulette" element={<RouletteScreen />} />
          
        </Routes>
      </RoulettProvider>
    );
  };

  export default App;
