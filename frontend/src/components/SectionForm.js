import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const SectionForm = ({onSubmit}) => {
    const [sectionCount, setSectionCount] = useState(8);
    const [sectionType, setSectionType] = useState("number");
    const [labels, setLabels] = useState([]);
    const navigate = useNavigate();
    // onSubmitに結果を返す処理
    const handleSubmit = async (e) => {
        e.preventDefault(); // デフォルトでリロードするのを抑制
        try {
            await onSubmit({ sectionCount, sectionType, labels});
            navigate('/roulette');
        } catch (e) {
            console.e('フォーム送信エラー: ', e);
        }
        
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <label className="block text-lg font-semibold m-1">ルーレット形式</label>
            <div>
                <input 
                    type="radio"
                    name="sectionType"
                    value="number"
                    checked={sectionType === 'number'}
                    onChange={() => setSectionType('number')}
                    className="m-1"
                />数字
                <input
                    type="radio"
                    name="sectionType"
                    value="text"
                    checked={sectionType === 'text'}
                    onChange={() => setSectionType('text')}
                    className="m-1"
                />文字
            </div>
            <label className="block text-lg font-semibbold">セクション数</label>
            <select
                value={sectionCount}
                onChange={(e) => setSectionCount(parseInt(e.target.value))}
                className="border rounded p-2 mt-2"
            >
                {(sectionType === 'number' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
                    , 14, 15, 16, 17, 18, 19, 20]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map(n => (
                        <option key={n} value={n}>{n}</option>
                ))}
            </select>
            {sectionType === 'text' && (
                <div className="mt-4">
                    {Array.from({ length: sectionCount}).map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={10}
                            placeholder={`セクション ${i + 1}`}
                            onChange={(e) =>{
                                const newLabels = [...labels];
                                newLabels[i] = e.target.value.slice(0, 10);
                                setLabels(newLabels);
                            }}
                            className="border rounded p-2 mt-2 block"
                        />
                    ))}
                </div>
            )}
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
                設定
            </button>
        </form>
    );
};
export default SectionForm;