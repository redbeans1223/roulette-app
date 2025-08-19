import logo from './logo.svg';
import SectionForm from './components/SectionForm';
import './App.css';
import './index.css';

function App() {
  const handleFormSubmit = ({ sectionCount, sectionType}) => {
    console.log(`セクション数： ${sectionCount}, 形式： ${sectionType}`);
  };
  return (
    <div className='bg-gray-100 flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-3xl font-bold mb-4'>ルーレットアプリ</h1>
      <SectionForm onSubmit={handleFormSubmit}/>
    </div>
  );
}

export default App;
