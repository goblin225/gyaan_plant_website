import { Controller, useForm } from 'react-hook-form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/Select"
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';

export const BasicInfoForm = ({
  onNext,
  onBack,
  onUpdate,
}: {
  onNext: () => void;
  onBack?: () => void;
  onUpdate: (data: any) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const resume = watch('resume');

  const onSubmit = (data: any) => {
    onUpdate({ ...data, resume: data.resume?.[0] ?? null });
    onNext();
  };

  const [resumeFileName, setResumeFileName] = useState<string>("");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800">Let’s add your Basic Information</h2>

      <div className="flex flex-col">
        <Controller
          name="country"
          control={control}
          rules={{ required: "Location is required" }}
          render={({ field }) => (
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>

              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select a Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectContent>
              </Select>

              {errors.country && (
                <span className="text-sm text-red-600 mt-1">{errors.country.message as string}</span>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold mb-1 text-gray-700">
          Phone Number <span className="text-gray-400 text-xs font-normal">(Optional)</span>
        </label>
        <input
          type="tel"
          {...register('phone')}
          placeholder="Enter only numbers"
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-400 mt-1">Enter a valid mobile number</span>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-semibold mb-2 text-gray-700">
          Resume <span className="text-gray-400 text-xs font-normal">(Optional)</span>
        </label>

        <div
          className="group relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
        >
          <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-blue-500 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">PDF only, max size 5MB</p>

          <input
            type="file"
            accept=".pdf"
            {...register("resume")}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setResumeFileName(e.target.files[0].name);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {resumeFileName && (
          <span className="text-sm text-gray-700 mt-2">Selected file: <strong>{resumeFileName}</strong></span>
        )}
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-gray-600 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </form>
  );
};