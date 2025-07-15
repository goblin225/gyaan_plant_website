import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { markAttendance } from '../services/service';

const useAutoAttendance = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userId = user?.id || '';

  const mutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: (data) => {
      localStorage.setItem('attendance-marked', new Date().toDateString());
    },
    onError: (err) => {
      console.error('Attendance marking failed:', err);
    }
  });

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    const todayKey = new Date().toDateString();
    const markedDate = localStorage.getItem('attendance-marked');

    const alreadyMarkedToday = markedDate === todayKey;

    if (hour >= 10 && hour < 11 && !alreadyMarkedToday) {
      mutation.mutate(userId);
    }
  }, [mutation, userId]);

  return mutation;
};

export default useAutoAttendance;
