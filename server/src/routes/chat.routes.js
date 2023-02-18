const auth = require("../controllers/auth.controller");
const chatController = require("../controllers/chat.controller");
const middlewares    = require("../controllers/middlewares");


var router = require("express").Router();

router.get ("/getall"          , auth.verifyToken, chatController.get_all_messages)
router.post("/getallnew"       , auth.verifyToken, chatController.get_all_new_messages)
router.post("/get_conversation", auth.verifyToken, chatController.get_conversation)
router.post("/send_message"    , auth.verifyToken, middlewares.check_profile_complete, chatController.send_message    )

module.exports = router
