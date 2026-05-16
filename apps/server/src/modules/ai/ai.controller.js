const aiService = require("./ai.service");
const { catchAsync, sendSuccess } = require("../../core/http");

const getInsights = catchAsync(async (req, res) => {
  const data = await aiService.getInsights();
  sendSuccess(res, { data });
});

const generateInsights = catchAsync(async (req, res) => {
  const data = await aiService.generateInsights();
  sendSuccess(res, { data });
});

module.exports = {
  getInsights,
  generateInsights
};
