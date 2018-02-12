/**
 * @module OneSessionPerUser
 */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  _id: String,
});

/**
 * Find all sessions not equal to the current session of the same user
 * @param  {String} username - User name
 * @param  {String} sessionId - Session id
 * @return {Object} - All invalid sessions
 */
SessionSchema.statics.findInvalidSessionsByUsername = function(username, sessionId) {
  return this.find({
    // Session property is stores as a stringified json object
    // ending with passport user property
    session: new RegExp(`{"user":"${username}"}}$`),
    _id: {$ne: sessionId},
  }).exec();
};

const Session = mongoose.model('Session', SessionSchema);

/**
 * Find all sessions not equal to the current session of a single user
 * Delete those sessions to ensure only one session is valid
 * @param  {Object}   req  - Connect request object
 * @param  {Object}   res  - Connect response object
 * @param  {Function} next - Call next function in the middleware
 * @return {Object} - Whatever next function in the middleware returns
 */
export default function() {
  return async function oneSessionPerUser(req, res, next) {
    // Find all invalid sessions
    const sessions = await Session.findInvalidSessionsByUsername(req.user.username, req.session.id);

    if (sessions.length !== 0) { // Delete invalid sessions
      sessions.forEach((session) => {
        session.remove();
      });
    }

    return next();
  };
}
