const auth = require("../controllers/auth.controller");
const notifController = require("../controllers/notif.controller");


var router				= require("express").Router();

router.post("/getall"   , auth.verifyToken , auth.updateLastConnected       , notifController.get_my_notifs    )
router.post("/getnew"   , auth.verifyToken , auth.updateLastConnected       , notifController.get_my_new_notifs_id)
router.post("/gettime"  , auth.verifyToken , auth.updateLastConnected       , notifController.get_current_time )
router.post("/getlastid", auth.verifyToken                                  , notifController.get_current_id )
router.post("/setseen"  , auth.verifyToken                                  , notifController.set_seen_notifs)
router.post("/delete"   , auth.verifyToken                                  , notifController.delete_notif   )

module.exports = router