const moongose = require("mongoose");

const connectionSchema = new moongose.Schema(
  {
    fromUserId: {
      type: moongose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toUserId: {
      type: moongose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);

connectionSchema.index({fromUserId: 1, toUserId: 1});

connectionSchema.pre("save", function (next) {
  const connection = this;
  if (connection.fromUserId.equals(connection.toUserId))
    throw new Error("Can't send connection request to yourself");
  next();
});

module.exports = moongose.model("ConnectionRequest", connectionSchema);
