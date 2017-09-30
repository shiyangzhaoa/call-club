const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const message = new Schema({
  type: { type: String },
  author_id: { type: Schema.Types.ObjectId },
  topic_author_id: { type: Schema.Types.ObjectId },
  topic_id: { type: Schema.Types.ObjectId },
  reply_id: { type: Schema.Types.ObjectId },
  has_read: { type: Boolean, default: false },
  create_at: { type: Date, default: new Date() },
});

const Message = mongoose.model('Message', message);

module.exports = Message;