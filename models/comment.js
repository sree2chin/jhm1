var mongoose = require("mongoose");

//schema start --------
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})

//compile the above into model.
module.exports = mongoose.model("Comment", commentSchema);