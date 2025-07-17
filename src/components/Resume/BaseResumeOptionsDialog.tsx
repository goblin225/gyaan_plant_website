import { useState, useEffect, useRef, useCallback } from "react";
import {
    FileText,
    Sparkles,
    UploadCloud,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Textarea } from "../ui/Textarea";
import { PDFDocument, rgb } from "pdf-lib";
import * as pdfjsLib from 'pdfjs-dist';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/Accordion";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Define the structure of resume fields
interface ResumeFields {
    name: string;
    title: string;
    contact: string;
    email: string;
    linkedin: string;
    github: string;
    summary: string;
    experience: string;
    skills: string;
    projects: string;
    education: string;
}

export const BaseResumeOptionsDialog = ({ onClose }: { onClose: () => void }) => {
    const [selected, setSelected] = useState<null | "EXISTING" | "AI">(null);
    const [aiPrompt, setAiPrompt] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [originalPdfBytes, setOriginalPdfBytes] = useState<Uint8Array | null>(null);
    const [resumeFields, setResumeFields] = useState<ResumeFields>({
        name: "",
        title: "",
        contact: "",
        email: "",
        linkedin: "",
        github: "",
        summary: "",
        experience: "",
        skills: "",
        projects: "",
        education: ""
    });
    const pdfPreviewRef = useRef<HTMLIFrameElement>(null);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            // Clean up URL objects when component unmounts
            if (pdfPreviewUrl) {
                URL.revokeObjectURL(pdfPreviewUrl);
            }
        };
    }, [pdfPreviewUrl]);

    // Real-time PDF update effect
    useEffect(() => {
        if (editMode && originalPdfBytes) {
            // Clear existing timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            // Set new timeout for debounced update
            updateTimeoutRef.current = setTimeout(() => {
                updatePdfWithEdits();
            }, 300); // 300ms debounce

            // Cleanup function
            return () => {
                if (updateTimeoutRef.current) {
                    clearTimeout(updateTimeoutRef.current);
                }
            };
        }
    }, [resumeFields, editMode, originalPdfBytes]);

    const resetState = () => {
        setSelected(null);
        setResumeFile(null);
        setResumeFileName(null);
        setAiPrompt("");
        setEditMode(false);
        setPdfPreviewUrl(null);
        setOriginalPdfBytes(null);
        setResumeFields({
            name: "",
            title: "",
            contact: "",
            email: "",
            linkedin: "",
            github: "",
            summary: "",
            experience: "",
            skills: "",
            projects: "",
            education: ""
        });
        // Clear any pending timeouts
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
            updateTimeoutRef.current = null;
        }
    };

    const handleBack = () => {
        if (editMode) {
            setEditMode(false);
        } else if (selected) {
            setSelected(null);
        } else {
            onClose();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
            setResumeFileName(file.name);
            
            const arrayBuffer = await file.arrayBuffer();
            setOriginalPdfBytes(new Uint8Array(arrayBuffer));
            setPdfPreviewUrl(URL.createObjectURL(file));
            
            // Parse the PDF and extract fields
            await parsePDF(file);
        }
    };

    const parsePDF = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const text = content.items
                    .map((item) => ('str' in item) ? (item as { str: string }).str : '')
                    .join(" ");
                fullText += text + "\n";
            }

            // Extract fields from the text (simplified example)
            const extractedFields: ResumeFields = {
                name: extractField(fullText, /^(.*?)\n/) || "Your Name",
                title: extractField(fullText, /PYTHON FULL STACK DEVELOPER/i) || "Job Title",
                contact: extractField(fullText, /Connect:? (\d+)/i) || "Contact Number",
                email: extractField(fullText, /Mail id:? ([\w\.-]+@[\w\.-]+)/i) || "email@example.com",
                linkedin: extractField(fullText, /LinkedIn:? ([\w\.-]+\/[\w\.-]+)/i) || "linkedin.com/in/profile",
                github: extractField(fullText, /GitHub:? ([\w\.-]+\/[\w\.-]+)/i) || "github.com/username",
                summary: extractField(fullText, /SUMMARY([\s\S]*?)EXPERIENCE/i) || "Professional summary here...",
                experience: extractField(fullText, /EXPERIENCE([\s\S]*?)EDUCATION/i) || "Work experience details...",
                education: extractField(fullText, /EDUCATION([\s\S]*?)SKILLS/i) || "Education details...",
                skills: extractField(fullText, /SKILLS([\s\S]*?)PROJECTS/i) || "Technical skills...",
                projects: extractField(fullText, /PROJECTS([\s\S]*?)$/i) || "Project details..."
            };

            setResumeFields(extractedFields);
        } catch (error) {
            console.error("Error parsing PDF:", error);
        }
    };

    const extractField = (text: string, regex: RegExp): string => {
        const match = text.match(regex);
        return match ? match[1]?.trim() || "" : "";
    };

    const updatePdfWithEdits = useCallback(async () => {
        if (!originalPdfBytes) return;
        
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage([595, 842]); // A4 size
            
            const fontSize = 12;
            const titleFontSize = 16;
            const headerFontSize = 14;
            const margin = 50;
            let yPosition = 792; // Start from top
            
            // Helper function to sanitize text for PDF encoding
            const sanitizeText = (text: string): string => {
                if (!text) return '';
                return text
                    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
                    .replace(/•/g, '-') // Replace bullets with dashes
                    .replace(/'/g, "'") // Replace smart quotes
                    .replace(/"/g, '"') // Replace smart quotes
                    .replace(/–/g, '-') // Replace en dash
                    .replace(/—/g, '-') // Replace em dash
                    .replace(/…/g, '...') // Replace ellipsis
                    .trim();
            };
            
            // Helper function to draw text with word wrapping and error handling
            const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, size: number) => {
                const sanitizedText = sanitizeText(text);
                if (!sanitizedText) return y - size - 2;
                
                const words = sanitizedText.split(' ');
                let line = '';
                let currentY = y;
                
                for (const word of words) {
                    const testLine = line + (line ? ' ' : '') + word;
                    const textWidth = testLine.length * size * 0.6; // Approximate width
                    
                    if (textWidth > maxWidth && line) {
                        try {
                            page.drawText(line, { x, y: currentY, size });
                        } catch (error) {
                            console.warn('Error drawing text:', line, error);
                        }
                        line = word;
                        currentY -= size + 4;
                    } else {
                        line = testLine;
                    }
                }
                
                if (line) {
                    try {
                        page.drawText(line, { x, y: currentY, size });
                    } catch (error) {
                        console.warn('Error drawing text:', line, error);
                    }
                    currentY -= size + 4;
                }
                
                return currentY;
            };
            
            // Helper function to safely draw single line text
            const drawSafeText = (text: string, x: number, y: number, size: number, color = rgb(0, 0, 0)) => {
                const sanitizedText = sanitizeText(text);
                if (!sanitizedText) return;
                
                try {
                    page.drawText(sanitizedText, { x, y, size, color });
                } catch (error) {
                    console.warn('Error drawing text:', sanitizedText, error);
                    // Try drawing without special characters as fallback
                    try {
                        const fallbackText = sanitizedText.replace(/[^\w\s@.-]/g, '');
                        page.drawText(fallbackText, { x, y, size, color });
                    } catch (fallbackError) {
                        console.warn('Fallback text drawing also failed:', fallbackError);
                    }
                }
            };
            
            // Name (Title)
            drawSafeText(resumeFields.name, margin, yPosition, titleFontSize, rgb(0, 0, 0));
            yPosition -= 25;
            
            // Title/Position
            drawSafeText(resumeFields.title, margin, yPosition, headerFontSize, rgb(0.3, 0.3, 0.3));
            yPosition -= 30;
            
            // Contact Information
            drawSafeText(`Contact: ${resumeFields.contact}`, margin, yPosition, fontSize);
            yPosition -= 16;
            drawSafeText(`Email: ${resumeFields.email}`, margin, yPosition, fontSize);
            yPosition -= 16;
            drawSafeText(`LinkedIn: ${resumeFields.linkedin}`, margin, yPosition, fontSize);
            yPosition -= 16;
            drawSafeText(`GitHub: ${resumeFields.github}`, margin, yPosition, fontSize);
            yPosition -= 30;
            
            // Summary
            drawSafeText('SUMMARY', margin, yPosition, headerFontSize, rgb(0, 0, 0));
            yPosition -= 20;
            yPosition = drawWrappedText(resumeFields.summary, margin, yPosition, 500, fontSize);
            yPosition -= 20;
            
            // Experience
            drawSafeText('EXPERIENCE', margin, yPosition, headerFontSize, rgb(0, 0, 0));
            yPosition -= 20;
            yPosition = drawWrappedText(resumeFields.experience, margin, yPosition, 500, fontSize);
            yPosition -= 20;
            
            // Education
            drawSafeText('EDUCATION', margin, yPosition, headerFontSize, rgb(0, 0, 0));
            yPosition -= 20;
            yPosition = drawWrappedText(resumeFields.education, margin, yPosition, 500, fontSize);
            yPosition -= 20;
            
            // Skills
            drawSafeText('SKILLS', margin, yPosition, headerFontSize, rgb(0, 0, 0));
            yPosition -= 20;
            yPosition = drawWrappedText(resumeFields.skills, margin, yPosition, 500, fontSize);
            yPosition -= 20;
            
            // Projects
            drawSafeText('PROJECTS', margin, yPosition, headerFontSize, rgb(0, 0, 0));
            yPosition -= 20;
            yPosition = drawWrappedText(resumeFields.projects, margin, yPosition, 500, fontSize);
            
            const modifiedPdfBytes = await pdfDoc.save();
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
            const newUrl = URL.createObjectURL(blob);
            
            setPdfPreviewUrl(prevUrl => {
                if (prevUrl) URL.revokeObjectURL(prevUrl);
                return newUrl;
            });
            
            return modifiedPdfBytes;
        } catch (error) {
            console.error("Error updating PDF:", error);
            return null;
        }
    }, [originalPdfBytes, resumeFields]);

    const handleFieldChange = (field: keyof ResumeFields, value: string) => {
        setResumeFields(prev => ({
            ...prev,
            [field]: value
        }));
        // The useEffect hook will handle the PDF update with debouncing
    };

    const downloadEditedPdf = async () => {
        const modifiedPdfBytes = await updatePdfWithEdits();
        if (!modifiedPdfBytes) return;
        
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = resumeFileName ? `edited_${resumeFileName}` : 'edited_resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="border-b p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Resume Editor</h1>
                
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {!selected && !editMode && (
                    <div className="flex-1 p-6 overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Options To Create New Base Resume</h2>
                        <p className="text-gray-600 mb-6">Go with the option that fits best for you</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <div
                                className="flex flex-col items-center p-8 border rounded-lg hover:shadow cursor-pointer transition-all"
                                onClick={() => setSelected("EXISTING")}
                            >
                                <FileText className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-lg font-medium mb-2">Select An Existing Resume</h3>
                                <p className="text-gray-500 text-center">
                                    Pick a resume from your Careerflow or device.
                                </p>
                            </div>
                            <div
                                className="flex flex-col items-center p-8 border rounded-lg hover:shadow cursor-pointer transition-all"
                                onClick={() => setSelected("AI")}
                            >
                                <Sparkles className="w-10 h-10 text-primary mb-4" />
                                <h3 className="text-lg font-medium mb-2">Start With AI Prompt</h3>
                                <p className="text-gray-500 text-center">
                                    Provide the instructions to the AI for your resume.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {selected === "AI" && !editMode && (
                    <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto w-full">
                        <h2 className="text-2xl font-bold mb-4">Write Your AI Prompt</h2>
                        <p className="text-gray-600 mb-6">
                            We'll try our best to create the resume based on your context
                        </p>
                        
                        <Textarea
                            className="w-full mb-6"
                            rows={8}
                            placeholder="Provide instructions for your resume here. For example:
                            'Create a professional resume for a senior software engineer with 5 years of experience in React and Node.js. Include 3 work experiences, education from Stanford University, and relevant skills.'"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        
                        <div className="flex justify-between">
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                disabled={!aiPrompt}
                                className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary-dark"
                                onClick={() => alert("Creating resume with AI")}
                            >
                                Create New Resume →
                            </button>
                        </div>
                    </div>
                )}

                {selected === "EXISTING" && !editMode && (
                    <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto w-full">
                        <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
                        <p className="text-gray-600 mb-6">
                            We'll extract your resume details and prefill it for you
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resume (PDF only)
                            </label>
                            <div className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                                <UploadCloud className="w-10 h-10 text-gray-500 group-hover:text-blue-500 mb-3" />
                                <p className="text-sm text-gray-600 text-center mb-1">
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
                                <div className="mt-3 text-sm text-gray-700">
                                    Selected file: <strong>{resumeFileName}</strong>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-between">
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                ← Back
                            </button>
                            <button
                                disabled={!resumeFile}
                                className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary-dark"
                                onClick={() => setEditMode(true)}
                            >
                                Continue to Edit →
                            </button>
                        </div>
                    </div>
                )}

                {editMode && (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left side - Editable fields with Accordion */}
                        <div className="w-1/2 border-r overflow-y-auto p-4">
                            <h2 className="text-xl font-bold mb-4">Edit Resume Content</h2>
                            
                            <Accordion type="multiple" className="w-full">
                                {/* Basic Information */}
                                {/* <AccordionItem value="basic-info grid-2 grid-cols-2">
                                    <AccordionTrigger className="font-medium">
                                        Basic Information
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-2 ">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={resumeFields.name}
                                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={resumeFields.title}
                                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={resumeFields.contact}
                                                onChange={(e) => handleFieldChange('contact', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={resumeFields.email}
                                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={resumeFields.linkedin}
                                                onChange={(e) => handleFieldChange('linkedin', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                value={resumeFields.github}
                                                onChange={(e) => handleFieldChange('github', e.target.value)}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem> */}
                                <AccordionItem value="basic-info">
  <AccordionTrigger className="font-medium">
    Basic Information
  </AccordionTrigger>
  <AccordionContent className="pt-2">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={resumeFields.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={resumeFields.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={resumeFields.contact}
          onChange={(e) => handleFieldChange('contact', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={resumeFields.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={resumeFields.linkedin}
          onChange={(e) => handleFieldChange('linkedin', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={resumeFields.github}
          onChange={(e) => handleFieldChange('github', e.target.value)}
        />
      </div>
    </div>
  </AccordionContent>
</AccordionItem>

                                
                                {/* Professional Summary */}
                                <AccordionItem value="summary">
                                    <AccordionTrigger className="font-medium">
                                        Professional Summary
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <Textarea
                                            className="w-full min-h-[120px]"
                                            value={resumeFields.summary}
                                            onChange={(e) => handleFieldChange('summary', e.target.value)}
                                            placeholder="Write a brief summary highlighting your key qualifications and experience..."
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                                
                                {/* Work Experience */}
                                <AccordionItem value="experience">
                                    <AccordionTrigger className="font-medium">
                                        Work Experience
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <Textarea
                                            className="w-full min-h-[180px]"
                                            value={resumeFields.experience}
                                            onChange={(e) => handleFieldChange('experience', e.target.value)}
                                            placeholder="List your work experience in reverse chronological order. Include company name, job title, dates, and key responsibilities/achievements."
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                                
                                {/* Education */}
                                <AccordionItem value="education">
                                    <AccordionTrigger className="font-medium">
                                        Education
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <Textarea
                                            className="w-full min-h-[120px]"
                                            value={resumeFields.education}
                                            onChange={(e) => handleFieldChange('education', e.target.value)}
                                            placeholder="List your educational background including degrees, institutions, and graduation years."
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                                
                                {/* Skills */}
                                <AccordionItem value="skills">
                                    <AccordionTrigger className="font-medium">
                                        Skills
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <Textarea
                                            className="w-full min-h-[120px]"
                                            value={resumeFields.skills}
                                            onChange={(e) => handleFieldChange('skills', e.target.value)}
                                            placeholder="List your technical and professional skills. You can categorize them if needed (e.g., Programming Languages, Tools, etc.)."
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                                
                                {/* Projects */}
                                <AccordionItem value="projects">
                                    <AccordionTrigger className="font-medium">
                                        Projects
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <Textarea
                                            className="w-full min-h-[120px]"
                                            value={resumeFields.projects}
                                            onChange={(e) => handleFieldChange('projects', e.target.value)}
                                            placeholder="Describe relevant projects you've worked on. Include project name, technologies used, and your contributions."
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        
                        {/* Right side - PDF preview */}
                        <div className="w-1/2 bg-gray-100 flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="font-medium">Resume Preview</h3>
                                <button
                                    onClick={downloadEditedPdf}
                                    className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary-dark"
                                >
                                    Download PDF
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                {pdfPreviewUrl ? (
                                    <iframe
                                        ref={pdfPreviewRef}
                                        src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                        className="w-full h-full"
                                        title="PDF Preview"
                                       
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500">PDF preview will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with back button when needed */}
            {(selected || editMode) && (
                <div className="border-t p-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >
                        ← Back
                    </button>
                </div>
            )}
        </div>
    );
};