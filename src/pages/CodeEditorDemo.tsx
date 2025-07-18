import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { executeCode } from "../services/service";

const CodeEditorDemo = () => {
  const [code, setCode] = useState(`// Welcome to the Code Editor!
// Try running some JavaScript code:

console.log("Hello, World!");

// Example: Function that returns current time in ISO format
function getCurrentTime() {
  const now = new Date();
  return now.toISOString(); // e.g., "2025-07-18T15:20:30.123Z"
}

// Example: Calculate the sum of two numbers
function add(a, b) {
  return a + b;
}

console.log("5 + 3 =", add(5, 3));

// Example: Create an array and loop through it
const fruits = ["apple", "banana", "orange"];
fruits.forEach(fruit => {
  console.log("I like", fruit);
});`);

  const [result, setResult] = useState<{
    output: string;
    error?: string;
    success: boolean;
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    try {
      const executionResult = (await executeCode(code, "javascript")) as {
        success: boolean;
        output: string;
        error?: string;
      };

      setResult({
        output: executionResult.success ? executionResult.output : "",
        error: executionResult.success ? undefined : executionResult.error,
        success: executionResult.success,
      });
    } catch (error: any) {
      setResult({
        output: "",
        error: error.message,
        success: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Code Editor Demo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">
                JavaScript Code Editor
              </h2>

              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="400px"
                  language="javascript"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="mt-4">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  <span>{isRunning ? "Running..." : "Run Code"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Output</h2>

              {result ? (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    {result.success
                      ? "Execution Successful"
                      : "Execution Failed"}
                  </h4>

                  <div
                    className={`p-4 rounded-lg border text-sm font-mono whitespace-pre-wrap ${
                      result.success
                        ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                        : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                    }`}
                  >
                    {result.success ? result.output : result.error}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Click "Run Code" to see the output here
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                How to use:
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Write JavaScript code in the editor</li>
                <li>• Use console.log() to output results</li>
                <li>• Click "Run Code" to execute</li>
                <li>• View output and errors in the right panel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorDemo;
