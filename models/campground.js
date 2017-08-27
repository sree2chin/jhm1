var mongoose = require("mongoose");

//schema start --------
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
})

//compile the above into model.
module.exports = mongoose.model("Campground", campgroundSchema);