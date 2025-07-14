import { useState } from 'react';
import { BasicInfoForm } from '../../components/Resume/BasicInfoForm';
import { ChallengesForm } from '../../components/Resume/ChallengesForm';
import { JobSearchStatus } from '../../components/Resume/JobSearchStatus';
import { ResumeStepper } from '../../components/Resume/ResumeStepper';
import logo from '../../assets/images/gyaan_logo.png'

export const ResumeWalkthrough = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const updateForm = (data: any) => setFormData((prev: any) => ({ ...prev, ...data }));
  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-white items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <img src={logo} alt="Gyaan Plant Logo" className="mx-auto w-28 h-28 rounded-full bg-white object-contain" />
          <h2 className="text-3xl font-semibold">Build Your Resume With Gyaan Plant</h2>
        </div>
      </div>

      <div className="w-full lg:w-1/2 px-6 py-8">
        <ResumeStepper step={step} />
        {step === 0 && <BasicInfoForm onNext={goNext} onUpdate={updateForm} />}
        {step === 1 && <JobSearchStatus onNext={goNext} onBack={goBack} onUpdate={updateForm} />}
        {step === 2 && <ChallengesForm onNext={() => console.log('✅ Final:', formData)} onBack={goBack} onUpdate={updateForm} />}
      </div>
    </div>
  );
};
