export default (csvAttendance) => (
  csvAttendance.map((it) => ({ fullName: it[0], userAction: it[1], timestamp: it[2] }))
);
