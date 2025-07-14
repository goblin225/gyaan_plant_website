import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "../ui/Dialog";
import { FileText, Sparkles, UploadCloud } from "lucide-react";
import { Textarea } from "../ui/Textarea";
import html2pdf from "html2pdf.js";

export const BaseResumeOptionsDialog = ({ open, setOpen }: any) => {

    const [selected, setSelected] = useState<null | "EXISTING" | "AI">(null);
    const [aiPrompt, setAiPrompt] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState(null);
    const [parsedResume, setParsedResume] = useState<string | null>(null);

    const handleBack = () => {
        if (selected) setSelected(null);
        else setOpen(false);
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            setResumeFileName(file.name);
        }
    };

    // const parsePDF = async (file: any) => {
    //     const arrayBuffer = await file.arrayBuffer();
    //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    //     let fullText = "";
    //     for (let i = 1; i <= pdf.numPages; i++) {
    //         const page = await pdf.getPage(i);
    //         const content = await page.getTextContent();
    //         const text = content.items
    //             .map((item) => {
    //                 if ('str' in item) {
    //                     return (item as { str: string }).str;
    //                 }
    //                 return '';
    //             })
    //             .join(" ");
    //         fullText += text + "\n";
    //     }
    //     return fullText;
    // };

    // const handleParsedSubmit = async () => {
    //     if (!resumeFile) return;
    //     const text = await parsePDF(resumeFile);
    //     setParsedResume(text);
    //     setOpen(false);
    // };

    const downloadAsPDF = () => {
        const element = document.getElementById("resume-output");
        if (element) html2pdf().from(element).save("resume.pdf");
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    {!selected && (
                        <>
                            <DialogTitle>Options To Create New Base Resume</DialogTitle>
                            <DialogDescription>
                                Go with the option that fits best for you
                            </DialogDescription>
                            <div className="space-y-3 mt-4">
                                <div
                                    className="flex items-start gap-3 border rounded-lg p-3 hover:shadow cursor-pointer"
                                    onClick={() => setSelected("EXISTING")}
                                >
                                    <FileText className="w-5 h-5 text-primary mt-1" />
                                    <div className="text-sm">
                                        <div className="font-medium">Select An Existing Resume</div>
                                        <div className="text-gray-500">
                                            Pick a resume from your Careerflow or device.
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex items-start gap-3 border rounded-lg p-3 hover:shadow cursor-pointer"
                                    onClick={() => setSelected("AI")}
                                >
                                    <Sparkles className="w-5 h-5 text-primary mt-1" />
                                    <div className="text-sm">
                                        <div className="font-medium">Start With AI Prompt</div>
                                        <div className="text-gray-500">
                                            Provide the instructions to the AI for your resume.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {selected === "AI" && (
                        <>
                            <DialogTitle>Write Your AI Prompt</DialogTitle>
                            <DialogDescription>
                                We’ll try our best to create the resume based on your context
                            </DialogDescription>
                            <Textarea
                                className="mt-4"
                                rows={6}
                                placeholder="Provide instructions for your resume here..."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                            <button
                                disabled={!aiPrompt}
                                className="mt-4 bg-primary text-white text-sm px-4 py-2 rounded disabled:opacity-50"
                                onClick={() => alert("Creating resume with AI")}
                            >
                                Create New →
                            </button>
                        </>
                    )}

                    {selected === "EXISTING" && (
                        <>
                            <DialogTitle>Upload Your Resume</DialogTitle>
                            <DialogDescription>
                                We’ll extract your resume details and prefill it for you
                            </DialogDescription>

                            <div className="mt-4 flex flex-col">
                                <label className="text-sm font-semibold mb-2 text-gray-700">
                                    Resume
                                </label>
                                <div className="group relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                                    <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-blue-500 mb-2" />
                                    <p className="text-sm text-gray-600 text-center">
                                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">PDF only, max size 5MB</p>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                {resumeFileName && (
                                    <span className="text-sm text-gray-700 mt-2">
                                        Selected file: <strong>{resumeFileName}</strong>
                                    </span>
                                )}
                            </div>
                            <button
                                disabled={!resumeFile}
                                className="mt-4 bg-primary text-white text-sm px-4 py-2 rounded disabled:opacity-50"
                                // onClick={handleParsedSubmit}
                            >
                                Continue →
                            </button>
                        </>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            ← Previous
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {parsedResume && (
                <div className="max-w-3xl mx-auto mt-10" id="resume-output">
                    <div className="p-6 bg-white rounded shadow">
                        <h2 className="text-xl font-bold">My Resume</h2>
                        <pre className="whitespace-pre-wrap mt-4">{parsedResume}</pre>
                        <button
                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                            onClick={downloadAsPDF}
                        >
                            Download as PDF
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
