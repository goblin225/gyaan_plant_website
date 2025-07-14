import { useState, useEffect } from "react";
import { Textarea } from "../ui/Textarea";
import { Input } from "../ui/Input";
import { Upload, FileText } from "lucide-react";

interface Props {
  selectedOption: string | null;
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export const ResumeOptionContent = ({ selectedOption, onBack, onSubmit }: Props) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [existingFile, setExistingFile] = useState<File | null>(null);
  const [uploadedBefore, setUploadedBefore] = useState<boolean>(false);

  useEffect(() => {
    const previouslyUploaded = localStorage.getItem("resumeFileName");
    if (previouslyUploaded) {
      setUploadedBefore(true);
    }
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExistingFile(file);
      localStorage.setItem("resumeFileName", file.name);
      setUploadedBefore(true);
    }
  };

  return (
    <div className="space-y-4">
      {selectedOption === "AI" && (
        <>
          <h3 className="text-lg font-semibold">Write Your AI Prompt</h3>
          <p className="text-sm text-muted-foreground">
            We’ll try our best to create the resume based on your context.
          </p>
          <Textarea
            placeholder="Provide instructions for your resume here..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="h-32"
          />
        </>
      )}

      {selectedOption === "EXISTING" && (
        <>
          <h3 className="text-lg font-semibold">Upload Existing Resume</h3>
          <p className="text-sm text-muted-foreground">We’ll extract the data from your PDF resume.</p>

          <label className="flex items-center gap-3 border rounded-md p-3 cursor-pointer hover:shadow-sm">
            <Upload className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">
              {existingFile?.name || "Choose a PDF file"}
            </span>
            <Input type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
          </label>

          {uploadedBefore && (
            <p className="text-green-600 text-sm">✔ You have already uploaded a resume before.</p>
          )}
        </>
      )}

      <div className="flex justify-between pt-4">
        <button
          className="text-sm text-gray-700 font-medium border rounded px-4 py-2 hover:bg-gray-100"
          onClick={onBack}
        >
          ← Previous
        </button>
        <button
          onClick={() =>
            onSubmit({
              type: selectedOption,
              prompt: aiPrompt,
              file: existingFile,
            })
          }
          disabled={
            (selectedOption === "AI" && !aiPrompt) ||
            (selectedOption === "EXISTING" && !uploadedBefore && !existingFile)
          }
          className="text-white bg-blue-600 px-4 py-2 text-sm font-medium rounded disabled:opacity-50"
        >
          Create New →
        </button>
      </div>
    </div>
  );
};