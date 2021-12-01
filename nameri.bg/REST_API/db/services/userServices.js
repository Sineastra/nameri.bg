const ConversationModel = require("../models/ConversationModel")
const UserModel = require("../models/UserModel")

const userServices = {
    createNew: async userData => await new UserModel(userData).save(),
    getByEmail: async email => await UserModel.findOne({ email }).lean(),
    getAllUserMessages: async userId =>
        await UserModel.findById(userId)
            .populate({
                path: "conversations",
                populate: "user participants",
            })
            .select("conversations")
            .select("-_id")
            .exec(),
    getSingleMessage: async messageId =>
        await ConversationModel.findById(messageId).exec(),
    getUser: async userId => await UserModel.findById(userId).populate("listings").exec(),
}

module.exports = userServices