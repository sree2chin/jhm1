var mongoose = require("mongoose");

//schema start --------
var campgroundSchema = new mongoose.Schema({
	name: String,
  price: String,
	image: String,
	description: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
})

//compile the above into model.
module.exports = mongoose.model("Campground", campgroundSchema);