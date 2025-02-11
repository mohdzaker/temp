import express from "express";
import authUser from "../middlewares/authUser.js";
import initiateGoogle from "../controllers/user/auth/google/initiate.js";
import verifyGoogle from "../controllers/user/auth/google/verify.js";
import initiateTrueCaller from "../controllers/user/auth/truecaller/initiate.js";
import initiateTrueCallerCall from "../controllers/user/auth/truecaller-call/initiate.js";
import withdraw from "../controllers/user/withdraw/index.js";
import getUserProfile from "../controllers/user/profile/index.js";
import getReferHistory from "../controllers/user/refer-history/index.js";
import clickHandler from "../controllers/user/click/index.js";
import handlePostback from "../controllers/user/postback/index.js";
import getTransactions from "../controllers/user/transaction-history/index.js";
import getWithdrawHistory from "../controllers/user/withdraw-history/index.js";
import getOfferHistory from "../controllers/user/offfer-history/index.js";
import getOffers from "../controllers/user/get-offers/index.js";
import checkAppInstallation from "../controllers/user/check-app-installation/index.js";
import claimPromoCode from "../controllers/user/claim-promo-code/index.js";
import checkDevice from "../controllers/user/check-device/index.js";

const userRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */
/**
 * @swagger
 * /api/user/auth/google:
 *   post:
 *     tags: [User]
 *     summary: Authenticate a user with Google and initiate the registration/login process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: The user's 10-digit mobile number
 *               google_token:
 *                 type: string
 *                 description: The token obtained from Google authentication
 *               referedBy:
 *                 type: string
 *                 description: Referral code provided by another user (optional)
 *               sms_hash:
 *                 type: string
 *                 description: SMS hash for OTP validation
 *             required:
 *               - mobileNumber
 *               - google_token
 *               - sms_hash
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Logged in successfully!
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       201:
 *         description: OTP sent for verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *                 request_id:
 *                   type: string
 *                   description: ID of the OTP request
 *       400:
 *         description: Bad request or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       401:
 *         description: Unauthorized or invalid Google token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Invalid Google token
 *       403:
 *         description: Self-referral is not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Self-referral is not allowed
 *       429:
 *         description: Rate limit exceeded for OTP requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Too many requests
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */

userRouter.post("/auth/google", initiateGoogle);
/**
 * @swagger
 * /api/user/auth/google/verify:
 *   post:
 *     tags: [User]
 *     summary: Verify the OTP and log in the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 description: The user's 10-digit mobile number
 *               otpCode:
 *                 type: string
 *                 description: The OTP sent to the user's mobile number
 *             required:
 *               - mobileNumber
 *               - otpCode
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged in successfully!
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *                 user:
 *                   type: object
 *                   description: Details of the logged-in user
 *       400:
 *         description: Invalid input or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Please enter a valid mobile number!
 *       401:
 *         description: OTP verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Invalid OTP!
 *       404:
 *         description: User not found with the given mobile number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: User not found with that mobile number!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */

userRouter.post("/auth/google/verify", verifyGoogle);
/**
 * @swagger
 * /api/user/auth/truecaller:
 *   post:
 *     tags: [Truecaller]
 *     summary: Authenticate and register/login a user using Truecaller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorizationCode:
 *                 type: string
 *                 description: Authorization code provided by Truecaller
 *               codeVerifier:
 *                 type: string
 *                 description: Code verifier for PKCE flow
 *               referedBy:
 *                 type: string
 *                 description: Referral code (optional, default is "huntcash")
 *             required:
 *               - authorizationCode
 *               - codeVerifier
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Logged in successfully!
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       201:
 *         description: Successfully registered and logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Registered successfully!
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       400:
 *         description: Bad request, such as missing parameters or invalid referral code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Authorization code is required!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */

userRouter.post("/auth/truecaller", initiateTrueCaller);
/**
 * @swagger
 * /api/user/auth/truecaller-call:
 *   post:
 *     tags: [Truecaller]
 *     summary: Authenticate and register/login a user using Truecaller and Google tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Access token from Truecaller
 *               google_token:
 *                 type: string
 *                 description: Token for verifying Google account
 *               referedBy:
 *                 type: string
 *                 description: Referral code (optional, default is "huntcash")
 *             required:
 *               - accessToken
 *               - google_token
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Logged in successfully!
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       201:
 *         description: Successfully registered and logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Account created successfully!
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       400:
 *         description: Bad request, such as missing parameters or invalid referral code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid referral code!
 *       401:
 *         description: Unauthorized, such as invalid tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to fetch phone number details!
 *       403:
 *         description: Forbidden, such as self-referral attempt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Self-referral is not allowed!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred.
 */

userRouter.post("/auth/truecaller-call", initiateTrueCallerCall);
/**
 * @swagger
 * /api/user/withdraw:
 *   post:
 *     tags: [Withdrawals]
 *     summary: Create a withdrawal request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               upi_id:
 *                 type: string
 *                 description: User's UPI ID for withdrawal
 *                 example: user@upi
 *               amount:
 *                 type: number
 *                 description: Amount to withdraw
 *                 example: 100.5
 *             required:
 *               - upi_id
 *               - amount
 *     responses:
 *       200:
 *         description: Withdrawal request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Withdrawal request created successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the withdrawal record
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       description: ID of the user who initiated the withdrawal
 *                       example: 123
 *                     upi_id:
 *                       type: string
 *                       description: UPI ID used for the withdrawal
 *                       example: user@upi
 *                     amount:
 *                       type: number
 *                       description: Withdrawal amount
 *                       example: 100.5
 *                     time:
 *                       type: string
 *                       format: date-time
 *                       description: Time of the withdrawal request
 *       400:
 *         description: Validation error or insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Insufficient balance in the wallet!
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Unauthorized access!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Something went wrong! Please try again.
 */

userRouter.post("/withdraw", authUser, withdraw);
/**
 * @swagger
 * /api/user/profile:
 *   post:
 *     tags: [User Profile]
 *     summary: Fetch the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User profile fetched successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: User ID
 *                       example: 1
 *                     username:
 *                       type: string
 *                       description: Username of the user
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       description: Email address of the user
 *                       example: john@example.com
 *                     mobileNumber:
 *                       type: string
 *                       description: Mobile number of the user
 *                       example: "+1234567890"
 *                     balance:
 *                       type: number
 *                       description: Wallet balance of the user
 *                       example: 150.5
 *                     profilePic:
 *                       type: string
 *                       description: URL of the user's profile picture
 *                       example: "https://example.com/profile.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Account creation date
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Last profile update date
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Unauthorized access!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Something went wrong!
 */

userRouter.post("/profile", authUser, getUserProfile);
/**
 * @swagger
 * /api/user/refer-history:
 *   post:
 *     summary: Retrieve the referral history and total commission for the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved referral history and total commission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 123
 *                       refer_commission:
 *                         type: number
 *                         example: 10.5
 *                       referred_user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 456
 *                           username:
 *                             type: string
 *                             example: "john_doe"
 *                           email:
 *                             type: string
 *                             example: "johndoe@example.com"
 *                           mobileNumber:
 *                             type: string
 *                             example: "1234567890"
 *                           profilePic:
 *                             type: string
 *                             example: "/path/to/profile-pic.jpg"
 *                 totalCommission:
 *                   type: number
 *                   example: 150.75
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Internal server error
 */

userRouter.post("/refer-history", authUser, getReferHistory);
/**
 * @swagger
 * /api/user/click:
 *   post:
 *     tags: [Clicks]
 *     summary: Record a click event for a campaign and event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: The body containing campaign ID and event ID
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             campaign_id:
 *               type: integer
 *               description: The ID of the campaign
 *               example: 123
 *             event_id:
 *               type: integer
 *               description: The ID of the event within the campaign
 *               example: 456
 *     responses:
 *       200:
 *         description: Click recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Click recorded successfully!
 *                 tracking_link:
 *                   type: string
 *                   description: The tracking link with the click ID
 *                   example: "https://example.com/campaign?click_id=some-unique-id"
 *       400:
 *         description: Bad request due to missing campaign ID or event ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Campaign ID is required!
 *       404:
 *         description: Campaign or event not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Campaign not found!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Internal server error!
 */

userRouter.post("/click", authUser, clickHandler);
/**
 * @swagger
 * /api/user/postback:
 *   get:
 *     tags: [Clicks]
 *     summary: Handle postback for click event completion
 *     parameters:
 *       - in: query
 *         name: click_id
 *         required: true
 *         description: The unique identifier for the click event
 *         schema:
 *           type: string
 *           example: "some-unique-click-id"
 *       - in: query
 *         name: event
 *         required: true
 *         description: The event related to the campaign
 *         schema:
 *           type: string
 *           example: "event-name"
 *     responses:
 *       200:
 *         description: Event or offer completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Offer completed successfully! All events completed."
 *       400:
 *         description: Bad request due to missing parameters or invalid state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: "Click ID is required"
 *       404:
 *         description: Resource not found, such as invalid click ID or event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: "Invalid click ID!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: "An error occurred while handling the postback"
 */

userRouter.get("/postback", handlePostback);
/**
 * @swagger
 * /api/user/transaction-history:
 *   get:
 *     summary: Get the transaction history for the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of transactions per page
 *     responses:
 *       200:
 *         description: Successfully retrieved transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 101
 *                       amount:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       type:
 *                         type: string
 *                         example: "credit"
 *                       status:
 *                         type: string
 *                         example: "completed"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-20T12:34:56Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-20T12:34:56Z"
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Internal server error
 */

userRouter.get("/transaction-history",authUser, getTransactions);
/**
 * @swagger
 * /api/user/withdraw-history:
 *   get:
 *     summary: Retrieve the withdrawal history of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of withdrawal records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved withdrawal history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 123
 *                       amount:
 *                         type: number
 *                         format: float
 *                         example: 150.00
 *                       status:
 *                         type: string
 *                         example: "completed"
 *                       time:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-21T10:15:30Z"
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalRecords:
 *                   type: integer
 *                   example: 50
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Internal server error
 */

userRouter.get("/withdraw-history",authUser, getWithdrawHistory);
/**
 * @swagger
 * /api/user/offer-history:
 *   get:
 *     summary: Retrieve the offer history for the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved offer history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 123
 *                       clickHash:
 *                         type: string
 *                         example: "abc123hash"
 *                       eventHistory:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 45
 *                             user_id:
 *                               type: integer
 *                               example: 123
 *                             clickHash:
 *                               type: string
 *                               example: "abc123hash"
 *                             eventDetail:
 *                               type: string
 *                               example: "Event completed"
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalRecords:
 *                   type: integer
 *                   example: 50
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Internal server error
 */

userRouter.get("/offer-history",authUser, getOfferHistory);
/**
 * @swagger
 * /api/user/get-offers:
 *   get:
 *     summary: Retrieve active offers with user-specific click status
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *     responses:
 *       200:
 *         description: Successfully retrieved active offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       campaign_name:
 *                         type: string
 *                         example: "Awesome Campaign"
 *                       short_description:
 *                         type: string
 *                         example: "This is a short description of the offer."
 *                       tracking_link:
 *                         type: string
 *                         example: "https://example.com/tracking-link/?click_id={click_id}"
 *                       campaign_logo:
 *                         type: string
 *                         example: "/path/to/logo.jpg"
 *                       status:
 *                         type: string
 *                         example: "active"
 *                       clicks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             user_id:
 *                               type: integer
 *                               example: 123
 *                             clickHash:
 *                               type: string
 *                               example: "abc123xyz"
 *                             status:
 *                               type: string
 *                               example: "pending"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       500:
 *         description: Internal server error
 */

userRouter.get("/get-offers",authUser, getOffers);

userRouter.post("/check-app-install", authUser, checkAppInstallation);

userRouter.post("/claim-promo-code",authUser, claimPromoCode);

userRouter.post("/check-device",authUser, checkDevice);

export default userRouter;