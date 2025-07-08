import React from 'react';
import useAutoAttendance from '../../hooks/useAutoAttendance';

const AttendanceInitializer = () => {
  useAutoAttendance();
  return null;
};

export default AttendanceInitializer;