// import { useState } from "react";
// import { Accordion, AccordionItem } from "../../components/ui/Accordion";
// import { Input } from "../../components/ui/Input";
// import { Textarea } from "../../components/ui/Textarea";

// const initialResumeData = {
//     personalInfo: { name: "", email: "", phone: "", address: "" },
//     professionalSummary: "",
//     workExperience: [],
//     projects: [],
//     education: [],
// };

// export const ResumeEditor = ({ parsedData }: { parsedData: string }) => {
//     const [resumeData, setResumeData] = useState(initialResumeData);

//     const handleChange = (section: string, field: string, value: any, index?: number) => {
//         const updated = { ...resumeData };
//         if (index !== undefined) {
//             updated[section][index][field] = value;
//         } else if (section === "personalInfo") {
//             updated[section][field] = value;
//         } else {
//             updated[section] = value;
//         }
//         setResumeData(updated);
//     };

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//             {/* Left Accordion UI */}
//             <div className="space-y-4">
//                 <Accordion>
//                     <AccordionItem title="Personal Information">
//                         <Input label="Name" value={resumeData.personalInfo.name} onChange={(e) => handleChange("personalInfo", "name", e.target.value)} />
//                         <Input label="Email" value={resumeData.personalInfo.email} onChange={(e) => handleChange("personalInfo", "email", e.target.value)} />
//                         <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(e) => handleChange("personalInfo", "phone", e.target.value)} />
//                         <Textarea label="Address" value={resumeData.personalInfo.address} onChange={(e) => handleChange("personalInfo", "address", e.target.value)} />
//                     </AccordionItem>

//                     <AccordionItem title="Professional Summary">
//                         <Textarea value={resumeData.professionalSummary} onChange={(e) => handleChange("professionalSummary", "", e.target.value)} />
//                     </AccordionItem>

//                     {/* Other sections like Projects, Work Experience, etc. */}
//                     {/* Map resumeData.projects and create input fields */}
//                 </Accordion>
//             </div>

//             {/* Right Preview UI */}
//             <div className="bg-white p-6 rounded shadow overflow-auto">
//                 <h2 className="text-xl font-bold">{resumeData.personalInfo.name}</h2>
//                 <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
//                 <p>{resumeData.personalInfo.address}</p>

//                 <h3 className="mt-4 font-semibold">Professional Summary</h3>
//                 <p>{resumeData.professionalSummary}</p>

//                 {/* Preview other sections */}
//             </div>
//         </div>
//     );
// };