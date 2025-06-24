const { MoodLog, Profile, Sequelize } = require("../models");

const { SaveChat } = require("../models");

const OpenAI = require("openai");

class ChatController {
  static async generateChat(req, res) {
    try {
      const { mood, message } = req.body; // Validate mood and message

      if (!mood || !message) {
        return res.status(400).json({ error: "Mood and message are required" });
      }

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

      if (!allowedMoods.includes(mood)) {
        return res.status(400).json({ error: "Invalid mood" });
      }

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const [updated] = await MoodLog.update(
        { [mood]: Sequelize.literal(`\"${mood}\" + 1`) },

        {
          where: {
            UserId: 1,

            // dateOnly: today,
          },
        }
      );

      if (updated === 0) {
        await MoodLog.create({
          [mood]: 1,

          UserId: 1,

          // dateOnly: today,
        });
      }

      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENAI_API_KEY,
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:5173", // Typo diperbaiki
          "X-Title": "WeiMood", // Typo diperbaiki
        },
      }); // const profile = await Profile.findOne({ //   where: { userId: 1 }, // }); // if (!profile) { //   return res.status(404).json({ error: "Profile not found" }); // }

      const profile = {
        name: "wei",
        personality: "ambivert",
        gender: "female",
        hobby: "game, watching",
        favSong: "no idea but bedroom-pop",
        currentMood: "very bored",
        age: 25,
      };

      const prompt = {
        userProfiile: profile,
        whatDoesUserChat: message,
        userCurrentMood: mood,
        notesForAI: `You are a friendly AI assistant. This is a one-time chat with no memory, so make it count. Based on the user's current mood and profile, suggest some meaningful or enjoyable things they can do right now and in the long term; like suggest new hobbies or suggest new game if their hobby is game and etc, and recommend songs that fits their vibe. Keep your tone warm, chill, and relatable. Keep the whole response under 1000 characters (including spaces). Respond only once.`,
      };

      const promptString = `
---
[CONTEXT FOR AI]

You are WeiMood created by Hizkia Jonathan Budiana, don't mention any other ai brands or names.
You are a friendly, warm, and relatable AI assistant giving a *one-time*, personalized response. This chat has no memory, so make it count and dont give any questions for user. Your response must be under 3000 characters and above 2000 character.

[USER PROFILE]
name: ${profile.name}
personality: ${profile.personality}
gender: ${profile.gender}
hobby: ${profile.hobby}
favSong: ${profile.favSong}
currentMood: ${profile.currentMood}
age: ${profile.age}

[USER'S CURRENT SITUATION]
- Current Mood: ${mood}
- User's Message: "${message}"

[YOUR TASK]
Your top priority is to fully understand and fulfill the user's message/request. If they ask something specific, focus on that first — this is your main mission.
Then, if there's room to add value:
1. Acknowledge their mood/message with empathy.
2. If relevant, suggest 1–2 things they could do *right now*, based on their hobbies or vibe.
3. If it fits, recommend a few songs that match their current mood. 

Keep your tone chill, comforting, and human — like you're a good friend who gets them.

Remove greetings, introductions, and sign-offs. Just get straight to the point.
`;

      console.log("response");

      const response = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-0528:free",

        messages: [
          {
            role: "user", // profile: profile,

            content: JSON.stringify(promptString),
          },
        ],
      });

      console.log(response);

      const moodText = response.choices[0].message.content;

      const newMood = {
        mood: moodText,

        date: today,

        userId: 1,
      };

      res.status(201).json(newMood);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ChatController;
