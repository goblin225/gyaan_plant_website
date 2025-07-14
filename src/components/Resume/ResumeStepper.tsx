export const ResumeStepper = ({ step }: { step: number }) => {
  const steps = ['Basic Info', 'Job Status', 'Challenges'];

  return (
    <div className="flex justify-between items-center mb-6">
      {steps.map((label, index) => (
        <div key={index} className="flex-1 text-center">
          <div className={`text-sm font-semibold ${step === index ? 'text-blue-600' : step > index ? 'text-green-600' : 'text-gray-400'}`}>
            {label}
          </div>
          <div className="h-1 mt-1 bg-gray-200 relative rounded">
            <div
              className={`absolute top-0 left-0 h-1 rounded transition-all duration-300 ${
                step > index ? 'bg-green-600 w-full' : step === index ? 'bg-gray-300 w-full' : 'w-0'
              }`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};