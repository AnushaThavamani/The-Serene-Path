const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    encryptedConfig: { type: String, required: true }, 
    encryptedData: { type: String, required: true },   
    entryCount: { type: Number, default: 0 },
    lastEntryAt: { type: Date, default: null },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', JournalSchema);
