import { axiosClient } from "../api/axiosClient"

// Auth

export const login = async (authData: any) => {
    const response = await axiosClient.post('/auth/admin-login', authData);
    return response.data;
};

// User

export const getUserById = async (userId: any) => {
    const response = await axiosClient.get(`/user/getbyid/${userId}`);
    return response.data;
};

export const updateUserProfile = async (userId:any, updatedData : any) => {
    const response = await axiosClient.put(`/user/update-user/${userId}`, updatedData);
    return response.data;
};

// Courses

export const fetchCourses = async () => {
    const response = await axiosClient.get('/course/get-course');
    return response.data;
};

export const courseById = async (courseId: any, userId: any) => {
    const res = await axiosClient.get(`/course/${courseId}`, { params: { userId } });
    return res.data;
};

// Enrollments

export const enrollInCourse = async (courseId: string, userId: string) => {
    const response = await axiosClient.post(`/enroll/enroll-user-course/${courseId}`, { userId });
    return response.data;
};

export const getEnrollCourse = async (userId: string) => {
    const response = await axiosClient.get(`/enroll/get-enrollment/${userId}`);
    return response.data;
};

// Lessons Progress

export const lessonStart = async (lessonData: any) => {
    const response = await axiosClient.post(`/lessonproress/lesson-start`, lessonData);
    return response.data;
};

export const lessonEnd = async (lessonData: any) => {
    const response = await axiosClient.post(`/lessonproress/lesson-end`, lessonData);
    return response.data;
};

// Attendance

export const markAttendance = async (userId: any) => {
    const response = await axiosClient.post(`/attendance/mark-attendance/${userId}`);
    return response.data;
};