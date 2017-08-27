var mongoose = require("mongoose");

//schema start --------
var commentSchema = new mongoose.Schema({
	text: String,
	author: String
})

//compile the above into model.
module.exports = mongoose.model("Comment", commentSchema);