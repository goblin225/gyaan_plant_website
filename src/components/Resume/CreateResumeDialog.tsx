import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";
import { Briefcase, FileText } from "lucide-react";
import { BaseResumeOptionsDialog } from "./BaseResumeOptionsDialog";
import { useState } from "react";

export const CreateResumeDialog = () => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [baseDialogOpen, setBaseDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="bg-primary text-white px-4 py-2 rounded">+ Create New Resume</button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>Go with the option that fits best for you</DialogDescription>

          <div className="space-y-4 mt-4">
            <div
              onClick={() => {
                setDialogOpen(false);
                setBaseDialogOpen(true);
              }}
              className="flex items-start gap-4 border rounded-lg p-4 hover:shadow-md cursor-pointer"
            >
              <FileText className="text-primary w-6 h-6 mt-1" />
              <div>
                <h3 className="text-sm font-semibold">Base Resume</h3>
                <p className="text-sm text-gray-500">
                  Your main document to keep all your professional information organized and up to date.
                </p>
              </div>
            </div>

            <div
              onClick={() => alert("Navigate to Job Tailored Resume")}
              className="flex items-start gap-4 border rounded-lg p-4 hover:shadow-md cursor-pointer"
            >
              <Briefcase className="text-primary w-6 h-6 mt-1" />
              <div>
                <h3 className="text-sm font-semibold">Job Tailored Resume</h3>
                <p className="text-sm text-gray-500">
                  This version highlights your most relevant skills and experience for a specific job.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <BaseResumeOptionsDialog open={baseDialogOpen} setOpen={setBaseDialogOpen} />
    </>
  );
};