const usersService = require("./users.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const updateMe = catchAsync(async (req, res) => {
  const user = await usersService.updateProfile(req.user.id, req.body);
  sendSuccess(res, { data: { user } });
});

const updatePassword = catchAsync(async (req, res) => {
  await usersService.updatePassword(req.user.id, req.body);
  sendSuccess(res, { data: { message: "Password updated" } });
});

module.exports = { updateMe, updatePassword };
