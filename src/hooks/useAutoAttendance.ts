import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { markAttendance } from '../services/service';

const useAutoAttendance = () => {
    
  const alreadyMarked = useRef(false);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userId = user?.id || '';

  const mutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: (data) => {
      // console.log('Attendance marked:', data);
    },
    onError: (err) => {
      // console.error('Attendance marking failed:', err);
    }
  });

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 10 && hour < 11 && !alreadyMarked.current) {
      mutation.mutate(userId);
      alreadyMarked.current = true;
    }
  }, []);

  return mutation;
};

export default useAutoAttendance;