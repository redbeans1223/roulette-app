import React, { useState } from "react";

const SectionForm = ({ onSubmit }) => {
    const [sectionCount, setSectionCount] = useState(8);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ sectionCount, sectionType: 'number'});
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <label className="block text-lg font-semibold">セクション数</label>
            <select
                value={sectionCount}
                onChange={(e) => setSectionCount(parseInt(e.target.value))}
                className="border rounded p-2"
            >
                {[4, 6, 8, 10, 12].map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
                ルーレットを更新
            </button>
        </form>
    );
};
export default SectionForm;