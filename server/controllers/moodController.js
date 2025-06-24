const { MoodLog, Profile } = require("../models/moodModel");
const OpenAI = require("openai");

class MoodController {
  static async createMood(req, res) {
    try {
      const mood = new Mood(req.body);
      await mood.save();
      res.status(201).json(mood);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllMoods(req, res) {
    try {
      const moods = await Mood.find();
      res.status(200).json(moods);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMoodById(req, res) {
    try {
      const mood = await Mood.findById(req.params.id);
      if (!mood) {
        return res.status(404).json({ error: "Mood not found" });
      }
      res.status(200).json(mood);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MoodController;
