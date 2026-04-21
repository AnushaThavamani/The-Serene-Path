const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your blueprints
const UserModel = require('./models/User'); 
const JournalModel = require('./models/Journal'); 
const FeedbackModel = require('./models/Feedback');
const MoodModel = require('./models/Mood');
const LoginEventModel = require('./models/LoginEvent');

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

// --- CONNECT TO MONGODB ---
mongoose.connect("mongodb://127.0.0.1:27017/serenepath")
    .then(() => console.log("✅ MongoDB Connected: The Serene Path"))
    .catch(err => console.log("❌ DB Error:", err));

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.json({ status: "Error", msg: "Email already exists" });
        }
        const newUser = await UserModel.create(req.body);
        res.json({ status: "Success", user: newUser });
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(async user => {
            if (user && user.password === password) {
                await LoginEventModel.create({
                    userEmail: user.email,
                    fullName: user.fullName,
                    role: user.role || 'user',
                    loggedInAt: new Date()
                });
                res.json({ status: "Success", user: user });
            } else {
                res.json({ status: "Error", msg: "Incorrect Password or No User Found" });
            }
        })
        .catch(err => res.json({ status: "Error", error: err.message }));
});


// ==========================================
// JOURNAL ROUTES
// ==========================================

// 1. SAVE/UPDATE Journal data (FOOLPROOF METHOD)
app.post('/api/journal/sync', async (req, res) => {
    try {
        const { userEmail, encryptedConfig, encryptedData, entryCount, lastEntryAt } = req.body;
        
        if (!userEmail || !encryptedConfig || !encryptedData) {
            return res.json({ status: "Error", msg: "Missing data payload from frontend" });
        }

        // Search for the existing journal manually
        let journal = await JournalModel.findOne({ userEmail: userEmail });
        
        if (journal) {
            // Overwrite old data and FORCE save
            journal.encryptedConfig = encryptedConfig;
            journal.encryptedData = encryptedData;
            journal.entryCount = Number.isFinite(entryCount) ? entryCount : journal.entryCount;
            journal.lastEntryAt = lastEntryAt ? new Date(lastEntryAt) : journal.lastEntryAt;
            journal.lastUpdated = Date.now();
            await journal.save();
        } else {
            // Brand new journal vault
            journal = new JournalModel({
                userEmail: userEmail,
                encryptedConfig: encryptedConfig,
                encryptedData: encryptedData,
                entryCount: Number.isFinite(entryCount) ? entryCount : 0,
                lastEntryAt: lastEntryAt ? new Date(lastEntryAt) : null,
                lastUpdated: Date.now()
            });
            await journal.save();
        }
        
        res.json({ status: "Success", journal: journal });
    } catch (err) {
        console.error("Backend Save Error:", err);
        res.json({ status: "Error", msg: err.message });
    }
});

// 2. FETCH Journal data for a specific user
app.get('/api/journal/load/:email', async (req, res) => {
    try {
        const journal = await JournalModel.findOne({ userEmail: req.params.email });
        if (journal) {
            res.json({ status: "Success", journal: journal });
        } else {
            res.json({ status: "None", msg: "No existing journal found" });
        }
    } catch (err) {
        res.status(500).json({ status: "Error", error: err.message });
    }
});

// ==========================================
// MOOD ROUTES
// ==========================================

app.post('/api/mood', async (req, res) => {
    try {
        const { userEmail, mood, date, timestamp } = req.body;

        if (!userEmail || !mood || !date || !timestamp) {
            return res.json({ status: "Error", msg: "Incomplete mood payload" });
        }

        const moodLog = await MoodModel.create({ userEmail, mood, date, timestamp });
        res.json({ status: "Success", mood: moodLog });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

// ==========================================
// FEEDBACK ROUTES
// ==========================================

app.post('/api/feedback', async (req, res) => {
    try {
        const { subject, category, message, rating, userEmail, userName } = req.body;

        if (!message) {
            return res.json({ status: "Error", msg: "Message is required" });
        }

        const feedback = await FeedbackModel.create({
            subject: subject || 'General feedback',
            category,
            message,
            rating,
            userEmail,
            userName
        });

        res.json({ status: "Success", feedback });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

const isAdminRequest = async (email) => {
    if (!email) return false;
    const user = await UserModel.findOne({ email });
    return user?.role === 'admin';
};

app.get('/api/admin/overview', async (req, res) => {
    try {
        const email = req.query.email;

        if (!(await isAdminRequest(email))) {
            return res.status(403).json({ status: "Error", msg: "Admin access required" });
        }

        const [totalUsers, totalJournals, totalFeedback, totalMoodLogs, totalLogins] = await Promise.all([
            UserModel.countDocuments({ role: { $ne: 'admin' } }),
            JournalModel.countDocuments(),
            FeedbackModel.countDocuments(),
            MoodModel.countDocuments(),
            LoginEventModel.countDocuments()
        ]);

        const avgRatingResult = await FeedbackModel.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);

        const moodDistribution = await MoodModel.aggregate([
            { $group: { _id: '$mood', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            status: "Success",
            overview: {
                totalUsers,
                totalJournals,
                totalFeedback,
                totalMoodLogs,
                totalLogins,
                avgRating: avgRatingResult[0]?.avgRating ? Number(avgRatingResult[0].avgRating.toFixed(1)) : null,
                moodDistribution
            }
        });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

app.get('/api/admin/feedback', async (req, res) => {
    try {
        const email = req.query.email;

        if (!(await isAdminRequest(email))) {
            return res.status(403).json({ status: "Error", msg: "Admin access required" });
        }

        const feedback = await FeedbackModel.find().sort({ createdAt: -1 }).limit(50);
        res.json({ status: "Success", feedback });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

app.get('/api/admin/activity', async (req, res) => {
    try {
        const email = req.query.email;

        if (!(await isAdminRequest(email))) {
            return res.status(403).json({ status: "Error", msg: "Admin access required" });
        }

        const users = await UserModel.find({ role: { $ne: 'admin' } })
            .select('fullName email joinedDate profession')
            .sort({ joinedDate: -1 })
            .lean();

        const [journals, moods, feedback, logins] = await Promise.all([
            JournalModel.find().select('userEmail entryCount lastUpdated lastEntryAt').lean(),
            MoodModel.find().select('userEmail mood timestamp').lean(),
            FeedbackModel.find().select('userEmail rating createdAt').lean(),
            LoginEventModel.find().select('userEmail loggedInAt').lean()
        ]);

        const journalMap = new Map(journals.map((journal) => [journal.userEmail, journal]));
        const moodMap = new Map();
        const feedbackMap = new Map();
        const loginMap = new Map();

        moods.forEach((mood) => {
            const current = moodMap.get(mood.userEmail) || { total: 0, latest: null, distribution: {} };
            current.total += 1;
            current.latest = !current.latest || mood.timestamp > current.latest ? mood.timestamp : current.latest;
            current.distribution[mood.mood] = (current.distribution[mood.mood] || 0) + 1;
            moodMap.set(mood.userEmail, current);
        });

        feedback.forEach((item) => {
            const current = feedbackMap.get(item.userEmail) || { total: 0, avgRating: null, ratingSum: 0, latest: null };
            current.total += 1;
            current.ratingSum += item.rating || 0;
            current.avgRating = Number((current.ratingSum / current.total).toFixed(1));
            current.latest = !current.latest || new Date(item.createdAt) > new Date(current.latest) ? item.createdAt : current.latest;
            feedbackMap.set(item.userEmail, current);
        });

        logins.forEach((item) => {
            const current = loginMap.get(item.userEmail) || { total: 0, latest: null };
            current.total += 1;
            current.latest = !current.latest || new Date(item.loggedInAt) > new Date(current.latest) ? item.loggedInAt : current.latest;
            loginMap.set(item.userEmail, current);
        });

        const activity = users.map((user) => {
            const journal = journalMap.get(user.email);
            const mood = moodMap.get(user.email);
            const feedbackStats = feedbackMap.get(user.email);
            const loginStats = loginMap.get(user.email);

            return {
                fullName: user.fullName,
                email: user.email,
                profession: user.profession || '',
                joinedDate: user.joinedDate,
                loginCount: loginStats?.total || 0,
                lastLoginAt: loginStats?.latest || null,
                journalEntryCount: journal?.entryCount || 0,
                lastJournalAt: journal?.lastEntryAt || journal?.lastUpdated || null,
                totalMoodLogs: mood?.total || 0,
                lastMoodAt: mood?.latest ? new Date(mood.latest) : null,
                moodDistribution: mood?.distribution || {},
                feedbackCount: feedbackStats?.total || 0,
                avgFeedbackRating: feedbackStats?.avgRating || null,
                lastFeedbackAt: feedbackStats?.latest || null
            };
        });

        res.json({ status: "Success", activity });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

// ==========================================
// ADMIN USER MANAGEMENT ROUTES
// ==========================================

app.get('/api/admin/users', async (req, res) => {
    try {
        const email = req.query.email;

        if (!(await isAdminRequest(email))) {
            return res.status(403).json({ status: "Error", msg: "Admin access required" });
        }

        const users = await UserModel.find({ role: { $ne: 'admin' } })
            .select('-password') // Exclude password from response
            .sort({ joinedDate: -1 });
        res.json({ status: "Success", users });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

app.post('/api/admin/users', async (req, res) => {
    try {
        const email = req.query.email;

        if (!(await isAdminRequest(email))) {
            return res.status(403).json({ status: "Error", msg: "Admin access required" });
        }

        const { fullName, email: userEmail, password, role, profession, phone, dob, age, country, state, city } = req.body;

        if (!fullName || !userEmail || !password) {
            return res.json({ status: "Error", msg: "Full name, email, and password are required" });
        }

        const existingUser = await UserModel.findOne({ email: userEmail });
        if (existingUser) {
            return res.json({ status: "Error", msg: "Email already exists" });
        }

        const newUser = await UserModel.create({
            fullName,
            email: userEmail,
            password,
            role: role || 'user',
            profession,
            phone,
            dob,
            age,
            country,
            state,
            city
        });

        res.json({ status: "Success", user: { ...newUser.toObject(), password: undefined } });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

app.put('/api/admin/users/:id', async (req, res) => {
    try {
        const email = req.query.email;

        if (!(await isAdminRequest(email))) {
            return res.status(403).json({ status: "Error", msg: "Admin access required" });
        }

        const { id } = req.params;
        const updates = req.body;

        // Prevent updating password through this route for security
        delete updates.password;
        delete updates.email; // Email should not be changed

        const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!updatedUser) {
            return res.json({ status: "Error", msg: "User not found" });
        }

        res.json({ status: "Success", user: updatedUser });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const email = req.query.email;

        if (!(await isAdminRequest(email))) {
            return res.status(403).json({ status: "Error", msg: "Admin access required" });
        }

        const { id } = req.params;

        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.json({ status: "Error", msg: "User not found" });
        }

        // Optionally delete associated data
        await Promise.all([
            JournalModel.deleteMany({ userEmail: deletedUser.email }),
            MoodModel.deleteMany({ userEmail: deletedUser.email }),
            FeedbackModel.deleteMany({ userEmail: deletedUser.email }),
            LoginEventModel.deleteMany({ userEmail: deletedUser.email })
        ]);

        res.json({ status: "Success", msg: "User and associated data deleted" });
    } catch (err) {
        res.json({ status: "Error", msg: err.message });
    }
});

// ==========================================
// EMOTION REGULATION AI ROUTES
// ==========================================

const pickHeuristicGuide = (message) => {
    const text = (message || '').toLowerCase();

    if (text.includes('race') || text.includes('panic') || text.includes('anxious') || text.includes('overthink')) {
        return {
            reflection: "Your system sounds activated, not broken. When the mind starts racing, calming the body first usually works better than arguing with every thought.",
            recommendedPractice: "Start with Progressive Body Scan in Techniques, then return to Cognitive Reframing if your thoughts still feel loud.",
            nextStep: "Take 5 slow breaths with a longer exhale than inhale, then choose one small thing you can feel physically right now."
        };
    }

    if (text.includes('heavy') || text.includes('sad') || text.includes('empty') || text.includes('low')) {
        return {
            reflection: "This sounds like emotional heaviness rather than a lack of effort. You may need gentleness and steadiness more than productivity right now.",
            recommendedPractice: "Try Gratitude and Affirmations or the Positivity Builder for a softer reset without demanding too much energy.",
            nextStep: "Write one kind sentence to yourself and do one very easy restorative action in the next ten minutes."
        };
    }

    if (text.includes('angry') || text.includes('fight') || text.includes('argument') || text.includes('upset')) {
        return {
            reflection: "Your emotions may still be carrying the charge of a difficult interaction. Regulation first can help you respond later with more clarity.",
            recommendedPractice: "Use Progressive Body Scan for downshifting, then explore the attachment or stress-trigger quiz if you want insight afterward.",
            nextStep: "Step away from the conversation for a moment, relax your jaw and shoulders, and name what feeling is strongest right now."
        };
    }

    return {
        reflection: "You sound like you need something calm, clear, and immediate. The best next step is usually the one that lowers inner noise before asking for deeper reflection.",
        recommendedPractice: "Begin with Techniques for regulation, then use Self Discovery if you want to understand the pattern underneath.",
        nextStep: "Choose one practice you can complete in under ten minutes and let that be enough for now."
    };
};

app.post('/api/emotion-regulation/guide', async (req, res) => {
    try {
        const { message } = req.body || {};

        if (!message || !message.trim()) {
            return res.status(400).json({ status: "Error", msg: "Message is required" });
        }

        if (!OPENAI_API_KEY) {
            return res.json({
                status: "Success",
                source: "fallback",
                guide: pickHeuristicGuide(message)
            });
        }

        const aiResponse = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                input: [
                    {
                        role: 'system',
                        content: [
                            {
                                type: 'input_text',
                                text: 'You are a calm emotional regulation guide inside a wellbeing app. Respond briefly, warmly, and safely. Do not diagnose. Recommend only one best-fit next practice. Output JSON with keys reflection, recommendedPractice, nextStep.'
                            }
                        ]
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'input_text',
                                text: message
                            }
                        ]
                    }
                ],
                text: {
                    format: {
                        type: 'json_schema',
                        name: 'emotion_regulation_guide',
                        strict: true,
                        schema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                reflection: { type: 'string' },
                                recommendedPractice: { type: 'string' },
                                nextStep: { type: 'string' }
                            },
                            required: ['reflection', 'recommendedPractice', 'nextStep']
                        }
                    }
                }
            })
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            console.error('OpenAI error:', errorText);
            return res.json({
                status: "Success",
                source: "fallback",
                guide: pickHeuristicGuide(message)
            });
        }

        const data = await aiResponse.json();
        const outputText = data.output_text || '{}';
        const guide = JSON.parse(outputText);

        res.json({
            status: "Success",
            source: "openai",
            guide
        });
    } catch (err) {
        console.error('Emotion regulation guide error:', err);
        res.json({
            status: "Success",
            source: "fallback",
            guide: pickHeuristicGuide(req.body?.message)
        });
    }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
