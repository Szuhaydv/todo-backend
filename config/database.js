import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

const User = mongoose.connection.model('User', UserSchema);