import { axiosClient } from "../api/axiosClient";

// Auth

export const login = async (authData: any) => {
  const response = await axiosClient.post("/auth/login", authData);
  return response.data;
};

// User

export const getUserById = async (userId: any) => {
  const response = await axiosClient.get(`/user/getbyid/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: any, updatedData: any) => {
  const response = await axiosClient.put(
    `/user/update-user/${userId}`,
    updatedData
  );
  return response.data;
};

// Courses

export const fetchCourses = async () => {
  const response = await axiosClient.get("/course/get-course");
  return response.data;
};

export const courseById = async (courseId: any, userId: any) => {
  const res = await axiosClient.get(`/course/${courseId}`, {
    params: { userId },
  });
  return res.data;
};

// Enrollments

export const enrollInCourse = async (courseId: string, userId: string) => {
  const response = await axiosClient.post(
    `/enroll/enroll-user-course/${courseId}`,
    { userId }
  );
  return response.data;
};

export const getEnrollCourse = async (userId: string) => {
  const response = await axiosClient.get(`/enroll/get-enrollment/${userId}`);
  return response.data;
};

// Lessons Progress

export const lessonStart = async (lessonData: any) => {
  const response = await axiosClient.post(
    `/lessonproress/lesson-start`,
    lessonData
  );
  return response.data;
};

export const lessonEnd = async (lessonData: any) => {
  const response = await axiosClient.post(
    `/lessonproress/lesson-end`,
    lessonData
  );
  return response.data;
};

// Attendance

export const markAttendance = async (userId: any) => {
  const response = await axiosClient.post(
    `/attendance/mark-attendance/${userId}`
  );
  return response.data;
};

//Question

export const getQuestion = async () => {
  const response = await axiosClient.get(`/assessment/get-questions`);
  return response.data;
};
export const getanswer = async (id: any, payload: any) => {
  const response = await axiosClient.post(`assessment/${id}/submit`, payload);
  return response.data;
};

// Code Execution
export const executeCode = async (
  code: string,
  language: string = "javascript"
) => {
  try {
    // For now, we'll use client-side execution
    // In production, this should be sent to a secure backend service
    const result = await clientSideCodeExecution(code, language);
    return result;
  } catch (error: any) {
    return {
      success: false,
      output: "",
      error: error.message,
    };
  }
};

const clientSideCodeExecution = (code: string, language: string) => {
  return new Promise((resolve) => {
    // Create a safe execution environment
    const originalConsole = console.log;
    let output = "";
    let lastResult: any;

    try {
      // Override console.log to capture output
      console.log = (...args) => {
        output += args.join(" ") + "\n";
      };

      // Execute the code based on language
      if (language === "javascript") {
        // Execute the original code first
        eval(code);

        // Extract function names from the code using regex
        const functionMatches = code.match(/function\s+(\w+)\s*\(\s*\)/g);

        if (functionMatches) {
          functionMatches.forEach((match) => {
            const functionName = match.replace(
              /function\s+(\w+)\s*\(\s*\)/,
              "$1"
            );

            try {
              // Use eval to check if function exists and call it
              const checkAndCallCode = `
                if (typeof ${functionName} === 'function' && ${functionName}.length === 0) {
                  const result = ${functionName}();
                  console.log('${functionName}() result:', result);
                }
              `;
              eval(checkAndCallCode);
            } catch (e) {
              // Function might have issues, skip silently
            }
          });
        }
      }

      // Restore console.log
      console.log = originalConsole;

      // If no console output but there's a result, show it
      if (!output && lastResult !== undefined) {
        output = `Result: ${lastResult}\n`;
      }

      resolve({
        success: true,
        output: output || "Code executed successfully (no output)",
        error: null,
      });
    } catch (error: any) {
      // Restore console.log
      console.log = originalConsole;

      resolve({
        success: false,
        output: "",
        error: error.message,
      });
    }
  });
};
export const getleaderboard = async () => {
  const response = await axiosClient.get(`leader/get-leader`);
  return response.data;
};
