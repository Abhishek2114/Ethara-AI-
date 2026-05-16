const attendanceService = require("./attendance.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const list = catchAsync(async (req, res) => {
  const records = await attendanceService.listAttendance(req.user, req.query);
  sendSuccess(res, { records });
});

const checkIn = catchAsync(async (req, res) => {
  const record = await attendanceService.markPresent(req.user);
  sendSuccess(res, { record });
});

module.exports = { list, checkIn };
