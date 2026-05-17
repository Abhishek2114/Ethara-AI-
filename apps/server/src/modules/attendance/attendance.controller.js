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

const checkOut = catchAsync(async (req, res) => {
  const record = await attendanceService.markCheckOut(req.user);
  sendSuccess(res, { record });
});

const history = catchAsync(async (req, res) => {
  const days = req.query.days ? parseInt(req.query.days) : 30;
  const history = await attendanceService.getAttendanceHistory(req.user.id, days);
  sendSuccess(res, { history });
});

const dailyReport = catchAsync(async (req, res) => {
  const date = req.query.date ? new Date(req.query.date) : new Date();
  const report = await attendanceService.getDailyReport(date);
  sendSuccess(res, { report });
});

const autoUpdate = catchAsync(async (req, res) => {
  const updatedCount = await attendanceService.updateAttendanceStatus();
  sendSuccess(res, { updatedCount });
});

const initializeDaily = catchAsync(async (req, res) => {
  const date = req.body.date ? new Date(req.body.date) : new Date();
  const records = await attendanceService.initializeDailyAttendance(date);
  sendSuccess(res, { records });
});

module.exports = {
  list,
  checkIn,
  checkOut,
  history,
  dailyReport,
  autoUpdate,
  initializeDaily,
};
