import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const summary = [
  { label: 'Total Quantity Till Date', value: '0' },
  { label: 'Total Active Sources', value: '0' },
  { label: 'Total Emission', value: '0 kgCO2e' },
];

const tableData = [];

const Scope2Result = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Scope 2 Carbon Emission Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summary.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 text-sm mb-2 text-center">{s.label}</div>
            <div className="text-2xl font-bold text-green-900">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 font-semibold">Description Of Sources</th>
              <th className="py-2 px-3 font-semibold">Quantity Till Date</th>
              <th className="py-2 px-3 font-semibold">GHG Emission Factor</th>
              <th className="py-2 px-3 font-semibold">Co2 Carbon Emitted</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No data available</td>
              </tr>
            ) : (
              tableData.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">{row.source}</td>
                  <td className="py-2 px-3">{row.quantity}</td>
                  <td className="py-2 px-3">{row.factor}</td>
                  <td className="py-2 px-3">{row.co2}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mb-6 text-gray-700 text-sm">
        Emission Factor Source: <a href="#" className="text-green-700 underline">View Reference</a>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <Button className="bg-green-500 hover:bg-green-600 text-white" variant="default">Generate PDF</Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white" variant="default">Generate Excel</Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white" variant="default" onClick={() => navigate('/my-esg/environmental/scope-3')}>Next &rarr;</Button>
      </div>
    </div>
  );
};

export default Scope2Result; 