import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CHALLENGES = [
  "Writing/Tailoring my Resume", "Optimizing my LinkedIn", "Application Tracking & Management",
  "Cover Letter Writing", "Not getting interview calls", "Skill Development", "Networking",
  "Filling out job applications", "Career Transition Support", "Dealing with Rejections", "Negotiation", "Other",
];

export const ChallengesForm = ({
  onBack,
  onUpdate,
}: {
  onBack: () => void;
  onUpdate: (data: any) => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const handleFinish = () => {
    onUpdate({ challenges: selected });
    navigate('/resumedashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">What challenges are you facing in your journey?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHALLENGES.map((ch) => (
          <label
            key={ch}
            className={`flex items-center gap-2 border rounded px-3 py-2 cursor-pointer transition ${
              selected.includes(ch) ? 'bg-blue-50 border-blue-500' : 'hover:border-blue-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(ch)}
              onChange={() => toggle(ch)}
            />
            <span>{ch}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded">Back</button>
        <button
          disabled={selected.length === 0}
          onClick={handleFinish}
          className="px-4 py-2 rounded text-white disabled:opacity-50 bg-blue-600"
        >
          Finish
        </button>
      </div>
    </div>
  );
};