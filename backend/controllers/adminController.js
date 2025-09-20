const Settings = require('../models/Settings');
const Student = require('../models/Student');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { weightExam1, weightExam2, weightCV, weightInterview, cutoff } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    if (weightExam1 !== undefined) settings.weightExam1 = Number(weightExam1);
    if (weightExam2 !== undefined) settings.weightExam2 = Number(weightExam2);
    if (weightCV !== undefined) settings.weightCV = Number(weightCV);
    if (weightInterview !== undefined) settings.weightInterview = Number(weightInterview);
    if (cutoff !== undefined) settings.cutoff = Number(cutoff);
    settings.updatedAt = new Date();
    await settings.save();

    const recalc = req.query.recalc === 'true';
    if (recalc) {
      const students = await Student.find();
      for (const s of students) {
        s.finalScore = (s.exam1 * settings.weightExam1) + (s.exam2 * settings.weightExam2) + (s.cvScore * settings.weightCV) + (s.interview * settings.weightInterview);
        s.status = s.finalScore >= settings.cutoff ? 'Selected' : 'Not Selected';
        await s.save();
      }
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
