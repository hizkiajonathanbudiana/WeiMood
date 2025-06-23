const { Mood } = require("../models/moodModel");
const OpenAI = require("openai");

class MoodController {
  static async generateMood(req, res) {
    try {
      const { mood } = req.body;
      const allowedMoods = [
        "happy",
        "sad",
        "overwhelmed",
        "fear",
        "calm",
        "bored",
        "excited",
        "lonely",
      ];

      if (!mood || !allowedMoods.includes(mood)) {
        return res.status(400).json({ error: "Invalid or missing mood" });
      }

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const [updated] = await MoodLog.update(
        { [mood]: Sequelize.literal(`\`${mood}\` + 1`) },
        {
          where: {
            UserId: req.user.id,
            dateOnly: today,
          },
        }
      );

      if (updated === 0) {
        await MoodLog.create({
          [mood]: 1,
          UserId: req.user.id,
          dateOnly: today,
        });
      }

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are a mood generator.",
          },
          {
            role: "user",
            content: "Generate a random mood.",
          },
        ],
      });

      const moodText = response.choices[0].message.content;
      const newMood = {
        mood: moodText,
        date: today,
        userId: req.user.id,
      };

      res.status(201).json(newMood);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

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
