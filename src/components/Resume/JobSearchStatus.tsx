import { useState } from 'react';

const OPTIONS = [
  { value: 'active', title: 'Active Job Seeker', desc: 'Looking for opportunities in 6 months' },
  { value: 'passive', title: 'Passive Job Seeker', desc: 'Browsing for better options' },
  { value: 'none', title: 'Not a Job Seeker', desc: 'Not looking, just improving profile' },
];

export const JobSearchStatus = ({
  onNext,
  onBack,
  onUpdate,
}: {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: any) => void;
}) => {
  const [selected, setSelected] = useState('');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">Where are you in your job search?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OPTIONS.map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              setSelected(opt.value);
              onUpdate({ jobStatus: opt.value });
            }}
            className={`cursor-pointer p-4 border rounded-lg transition ${
              selected === opt.value ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
            <p className="text-sm text-gray-700">{opt.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded">
          Back
        </button>
        <button
          disabled={!selected}
          onClick={onNext}
          className={`px-4 py-2 rounded text-white ${selected ? 'bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};