const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const config = require('../config');

function hash(text) {
	var h = crypto.createHmac('sha256', config.HASH_SECRET).update(text);
	return h.digest('hex');
}

// create a schema
var statusSchema = new Schema({
	name: String,
	powered: Boolean
});

var Status = mongoose.model('Status', statusSchema);

module.exports = Status; // make the model available 

