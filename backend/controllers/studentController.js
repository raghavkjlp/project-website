const Student = require('../models/Student');
const Settings = require('../models/Settings');
const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'email role');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const s = await Student.findById(req.params.id).populate('user', 'email role');
    if (!s) return res.status(404).json({ error: 'Student not found' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateScores = async (req, res) => {
  try {
    const { exam1, exam2, cvScore, interview } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (exam1 !== undefined) student.exam1 = Number(exam1);
    if (exam2 !== undefined) student.exam2 = Number(exam2);
    if (cvScore !== undefined) student.cvScore = Number(cvScore);
    if (interview !== undefined) student.interview = Number(interview);

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.calculateFinal = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const w1 = settings.weightExam1;
    const w2 = settings.weightExam2;
    const wcv = settings.weightCV;
    const winter = settings.weightInterview;

    const finalScore = (student.exam1 * w1) + (student.exam2 * w2) + (student.cvScore * wcv) + (student.interview * winter);
    student.finalScore = Math.round(finalScore * 100) / 100;

    student.status = student.finalScore >= settings.cutoff ? 'Selected' : 'Not Selected';

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadDocs = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (!req.files || !req.files.length) return res.status(400).json({ error: 'No files uploaded' });

    const paths = req.files.map(f => f.path.replace(/\\/g, '/'));
    student.documents.push(...paths);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
