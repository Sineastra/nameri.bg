const bcrypt = require("bcrypt")
const router = require("express").Router()
const { body, validationResult } = require("express-validator")
const { abstractDBRequest } = require("../helpers/abstractRequests.js")
const uploadImages = require("../helpers/uploadFilesS3.js")
const { createJWTToken, attachCookie } = require("../helpers/createJWTToken.js")
const processFormData = require("../middlewares/processFormData.js")
const { validateRegister, validateLogin, validateProfileEdit } = require("../middlewares/formsValidators.js")

const signIn = async (req, res) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const user = await req.dbServices.userServices.getByEmail(req.body.email)

		if (user && (await bcrypt.compare(req.body.password, user.hashedPassword))) {
			const token = createJWTToken(user)

			attachCookie(token, res)

			res.json({ ok: true, status: 200, statusCode: "OK", data: { token } })
		} else {
			res.json({
				ok: false,
				status: "Unauthorized",
				statusCode: 401,
				softError: true,
				errors: [{ msg: "Wrong user email and/or password." }],
			})
		}
	} else {
		res.json({
			ok: false,
			status: "Bad request",
			statusCode: 400,
			softError: true,
			errors,
		})
	}

	//TODO: add check for already logged in user.
}

const signUp = async (req, res, next) => {
	const errors = validationResult(req)

	if (errors.isEmpty()) {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)
		const isExsiting = await req.dbServices.userServices.getByEmail(req.body.email)

		if (isExsiting === null) {
			const newUser = {
				email: req.body.email,
				nameAndSurname: req.body.nameAndSurname,
				hashedPassword,
				profileImg: "",
				listings: [],
				reviews: [],
				conversations: [],
				premiumPlan: 0,
				phone: '',
				address: '',
				website: '',
				skills: [],
				diplomasAndCertifs: [],
				rating: 0,
				about: "",
			}

			await req.dbServices.userServices.createNew(newUser)

			next()
		} else {
			res.json({
				ok: false,
				status: "Conflict",
				statusCode: 409,
				softError: true,
				errors: [{ msg: "Existing user. Please sign in." }],
			})
		}
	} else {
		res.json({
			ok: false,
			status: "Bad request",
			statusCode: 400,
			softError: true,
			errors,
		})
	}
}

router.post("/sign-in", validateLogin(), signIn)

router.post("/sign-up", validateRegister(), signUp, signIn)

router.get("/:id/messages", async (req, res) => {
	const userId = req.params.id
	const dbService = req => req.dbServices.userServices.getAllUserMessages(userId)

	await abstractDBRequest(req, res, dbService)
})

router.get("/message/:id", async (req, res) => {
	const messageId = req.params.id
	const dbService = req => req.dbServices.userServices.getSingleMessage(messageId)

	await abstractDBRequest(req, res, dbService)
})

router.get("/profile/:id", async (req, res) => {
	const userId = req.params.id
	const dbService = async req => {
		const data = await req.dbServices.userServices.getUserForProfile(userId)

		return data
	}

	await abstractDBRequest(req, res, dbService)
})

router.put('/edit/:id',
	processFormData,
	validateProfileEdit(),
	async (req, res) => {
		const errors = validationResult(req)
		let image = ''

		if (errors.isEmpty()) {
			const profileImg = req.files.profileImg
			let token

			try {
				const user = await req.dbServices.userServices.getById(req.user._id)

				if (profileImg) {
					const [responseData] = await uploadImages([profileImg])
					image = responseData.Location
				} else {
					image = user.profileImg ? user.profileImg : ''
				}

				const skills = JSON.parse(req.body.skills)
				const phone = req.body.phone[0] === '+' ? req.body.phone.slice(4) : req.body.phone.slice(1)

				if (req.body.email !== user.email) {
					const emailTaken = await req.dbServices.userServices.getByEmail(req.body.email)

					if (emailTaken) {
						res.json({
							ok: false,
							status: 409,
							statusText: "Conflict",
							softError: true,
							errors: [{ msg: 'Email already taken.' }],
						})
					}
				}

				const newUserData = {
					email: req.body.email,
					nameAndSurname: req.body.nameAndSurname,
					profileImg: image,
					listings: user.listings,
					reviews: user.reviews,
					rating: user.rating,
					conversations: user.conversations,
					premiumPlan: user.premiumPlan,
					about: req.body.about,
					phone: phone,
					address: req.body.address,
					website: req.body.website,
					skills: skills,
					diplomasAndCertifs: req.body.diplomasAndCertifs,
				}

				if (req.body.password !== '') {
					newUserData.hashedPassword = await bcrypt.hash(req.body.password, 8)
				}

				token = createJWTToken({ _id: user._id, ...newUserData })
				attachCookie(token, res)

				const updatedUser = await req.dbServices.userServices.updateById(req.user._id, newUserData)

				res.json({ ok: true, status: 'Ok', statusCode: 200, data: { user: updatedUser, token } })
			} catch (e) {
				res.json({
					ok: false,
					status: 'Service Unavailable',
					statusCode: 503,
					msg: 'Invalid field names or error while connection to the Database. Please wait few moments and try again.',
				})
			}
		} else {
			res.json({ ok: false, status: 400, statusText: "Bad Request", softError: true, errors })
		}
	},
)

router.get("/search", async (req, res) => {
	const criteria = req.query.search
	const dbService = req => req.dbServices.userServices.searchUsers(criteria)

	await abstractDBRequest(req, res, dbService)
})

const addMsg = async (req, res) => {
	const receiverId = req.params.id
	const userId = req.user._id
	const msg = req.body.message

	if (msg === '') {
		res.json({
			ok: false,
			statusText: "Bad Request",
			status: 400,
			softError: true,
			errors: [{ msg: "Message cannot be empty." }],
		})
		return
	}

	try {
		const conversation = await req.dbServices.userServices.checkExistingConversation([userId, receiverId])

		if (conversation) {
			const newMsg = {
				sender: userId,
				text: msg,
			}
			conversation.messages.push(newMsg)

			await conversation.save()
			const data = await req.dbServices.userServices.getAllUserMessages(userId)

			res.json({
				ok: true,
				status: 200,
				statusText: "ok",
				data: { conversations: data.conversations, conversationId: conversation._id },
			})
		} else {
			const [user, receiver] = await Promise.all([
				req.dbServices.userServices.getById(userId),
				req.dbServices.userServices.getById(receiverId),
			])

			const data = {
				messages: [{
					sender: userId,
					text: msg,
				}],
				participants: [userId, receiverId],
				user: userId,
			}

			const newConversation = await req.dbServices.userServices.createNewConversation(data)

			user.conversations.push(newConversation._id)
			receiver.conversations.push(newConversation._id)

			await Promise.all([user.save(), receiver.save()])

			res.json({
					ok: true,
					statusText: "ok",
					status: 200,
					data: { conversations: user.conversations, conversationId: newConversation._id },
					token: req.newToken,
				},
			)
		}
	} catch (e) {
		res.json({ statusText: "Bad request", status: 400, ok: false, msg: e })
	}

}

router.post("/send-message/:id", addMsg)

router.post("/:id/add-review", async (req, res) => {

	//TODO: Add check if the user reviewed is the same as the user logged, throw error.
	const dbService = async (req) => {
		const newReview = {
			text: req.body.reviewText || '',
			rating: Number(req.body.reviewRating),
			user: req.params.id,
			reviewCreator: req.user._id,
		}
		const user = await req.dbServices.userServices.getByIdPopulateReviews(req.params.id)
		const isExistingReview = user.reviews.some(x => x.reviewCreator === `${ req.user._id }`)
		console.log(isExistingReview)
		const review = isExistingReview
			? await req.dbServices.userServices.getReviewByCreator(req.user._id)
			: await req.dbServices.userServices.createNewReview(newReview)

		const ratingsSum = user.reviews.filter(x => x.reviewCreator !== req.user._id).reduce((a, v) => a + v.rating, 0)
		const newRatingsLength = (user.reviews.length + (isExistingReview ? 0 : 1))

		user.rating = ((ratingsSum + newReview.rating) / newRatingsLength).toFixed(2)

		if (isExistingReview) {
			const [, , listing] = await Promise.all([
				req.dbServices.userServices.updateReview(review._id, newReview),
				user.save(),
				req.dbServices.listingsServices.getListingWithUserReviews(req.query.listingId),
			])

			return listing
		} else {
			user.reviews = [...user.reviews.map(x => `${ x._id }`), `${ review._id }`]

			const [, listing] = await Promise.all([
				user.save(),
				req.dbServices.listingsServices.getListingWithUserReviews(req.query.listingId),
			])

			return listing
		}
	}

	await abstractDBRequest(req, res, dbService)
})

router.get("/is-own-listing/:id", async (req, res) => {
	const dbService = async (req) => {
		const user = await req.dbServices.userServices.getById(req.user._id)

		return user.listings.some(x => x === req.params.id)
	}

	await abstractDBRequest(req, res, dbService)
})

router.get("/get-top", async (req, res) => {
	const dbService = (req) => {
		const count = req.query.count

		return req.dbServices.userServices.getTop(count)
	}

	await abstractDBRequest(req, res, dbService)
})

router.get("/logout", (req, res) => {
	res.clearCookie(process.env.COOKIE_NAME)

	res.json({ ok: true, status: 200, statusText: "ok", data: null })
})

module.exports = router
