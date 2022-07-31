const { assert }                  = require('chai');

const BlockController           = require('../src/controllers/block.controller')
const LikeController              = require('../src/controllers/like.controller')
const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const { step } = require('mocha-steps');

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

describe('Test likes', () => {
	let res = mockResponse()
	step("Init db", async () => {
		let res = mockResponse()
		return (Promise.all([
			test_con.clear_db(),
			UserController.create_user_test(mockRequest(users.Jhonny), res),
			UserController.create_user_test(mockRequest(users.Bella), res),
			UserController.create_user_test(mockRequest(users.Mark), res)
		]))
	})
	describe("Create Lonely Mark", () => {
		step('mark   => jhonny Code SUCCESS', async (done) => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
			done()
		})
		step('mark   => bella Code Success', async (done)  => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Bella.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
			done()
		})
		step('bella  => jhonny Code Success', async (done) => {
			await LikeController.like_user(mockRequest({liker: users.Bella.username, liked: users.Jhonny.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
			done()
		})
		step('jhonny => bella Code Success', async (done)  => {
			await LikeController.like_user(mockRequest({liker: users.Jhonny.username, liked: users.Bella.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
			done()
		})
	})
	describe("Like Error Handling", () => {
		step('duplicate like: Code SUCCESS', async (done) => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username, test:true}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step('Missing liked: Code LIKE_MISS', async (done) => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: 'lol'}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			done()
		})
		step('Missing liker: Code LIKE_MISS', async (done) => {
			await LikeController.like_user(mockRequest({liker: 'lol', liked: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			done()
		})
	})
	describe("Get Liked Users", () => {
		step("Marks liked users:  bella and jhonny", async (done) => {
			await LikeController.get_users_that_i_liked(mockRequest({liker_username: users.Mark.username}), res)
			yusers = res.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
			done()
		})
		step("After a block: just bella ", async (done) => {
			await BlockController.block_user(mockRequest({blocker: users.Mark.username, blocked: users.Jhonny.username}), res)
			await LikeController.get_users_that_i_liked(mockRequest({liker_username: users.Mark.username}), res)
			yusers = res.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isFalse(yusers.includes(users.Jhonny.username))
			await BlockController.un_block_user(mockRequest({unblocker: users.Mark.username, unblocked: users.Jhonny.username}), res)
			done()
		})
		step("users that like bella: Mard and jhonny", async (done) => {
			await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), res)
			yusers = res.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Mark.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
			done()
		})
	})
	describe("Get Matches", () => {
		step("Bella's matches: jhonny", async (done) => {
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isTrue(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			await LikeController.get_matches(mockRequest({username: users.Jhonny.username}), res)
			assert.isTrue(res.send.lastCall.firstArg.data.includes(users.Bella.username))
			done()
		})
		step("Marks's matches: All Alone HAHA", async (done) => {
			await LikeController.get_matches(mockRequest({username: users.Mark.username}), res)
			// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			assert.equal(res.send.lastCall.firstArg.data.length, 0)
			done()
		})
		step("After a block: bella's alone ", async (done) => {
			await BlockController.block_user(mockRequest({blocker: users.Jhonny.username, blocked: users.Bella.username}), res)
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))

			await LikeController.get_matches(mockRequest({username: users.Jhonny.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Bella.username))

			await BlockController.un_block_user(mockRequest({unblocker: users.Jhonny.username, unblocked: users.Bella.username}), res)
			done()
		})
	})
	describe("Unliking", () => {
		step("Jhonny unlike bella: affects 1 row", async (done) => {
			await LikeController.un_like_user(mockRequest({unliker: users.Jhonny.username, unliked: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
			done()
		})
		step("Bella's likers: Jhonny's gone !", async (done) => {
			await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			done()
		})
		step("Bella's matches: Bye Bye Jhonny", async (done) => {
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			done()
		})
	})
})

// MISSING_LIKE