import { Filter } from "lucide-react";
import { CreateResumeDialog } from "../../components/Resume/CreateResumeDialog";

export const ResumeDashboard = () => {

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white border-r p-4 space-y-4">
                <h2 className="text-xl font-bold mb-6">Gyaan Plant</h2>
                <nav className="space-y-2">
                    <a href="#" className="text-blue-600 font-semibold block">Resume Builder</a>
                </nav>
            </aside>

            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">All Resumes</h1>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1 border rounded px-3 py-2 text-sm bg-white hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center h-64 text-center text-gray-600">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-lg font-semibold mb-2">No Resumes Yet</p>
                    <p className="text-sm mb-4">Get started on crafting your first resume to kickstart your career journey.</p>
                    <CreateResumeDialog />
                </div>
            </div>
        </div>
    );
};