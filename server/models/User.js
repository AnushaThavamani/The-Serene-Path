const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Make sure these match what your Register.js sends exactly!
    fullName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    
    // Additional fields
    profession: String,
    phone: String,
    dob: String,
    age: Number,
    country: String,
    state: String,
    city: String,
    joinedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
