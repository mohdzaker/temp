import express from "express";
import adminRegister from "../controllers/admin/auth/register/index.js";
import adminLogin from "../controllers/admin/auth/login/index.js";
import authAdmin from "../middlewares/authAdmin.js";
import setConfig from "../controllers/admin/config/index.js";
import { addOffer, deleteOffer, editOffer, getAllOffers, setOfferStatus } from "../controllers/admin/offer/index.js";
import { addEvent, editEvent, getAllOffersWithEvents, getOfferByIdWithEvents } from "../controllers/admin/event/index.js";
import getPendingWithdraw from "../controllers/admin/payout/index.js";
import getConfig from "../controllers/admin/get-config/index.js";
import getUsers, { getUserById, updateUserBanStatus } from "../controllers/admin/get-users/index.js";
import sendReward from "../controllers/admin/send-reward.js";
import { setSecretKey } from "../controllers/admin/secret-key/index.js";
import { getDashboardData } from "../controllers/admin/dashboard/index.js";
import getReferHistory from "../controllers/admin/refer-history/index.js";
import getTransactions from "../controllers/admin/transaction-history/index.js";
import getOfferHistory, { getAllOfferHistory } from "../controllers/admin/offer-history/index.js";
import sendNotification from "../controllers/admin/send-notification/index.js";
import { approveWithdraw, payToUser, rejectWithdraw } from "../controllers/admin/withdraw/index.js";

const adminRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/auth/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the admin.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: The password for the admin.
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       409:
 *         description: Admin with this email already exists
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/auth/register", adminRegister);
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the admin.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: The password of the admin.
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
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
 *                   example: Admin logged in successfully!
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Please provide valid credentials (email/password).
 *       401:
 *         description: Invalid email or password.
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Internal server error.
 */

adminRouter.post("/auth/login", adminLogin);
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/config:
 *   post:
 *     summary: Set or update configuration settings for the platform
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invite_rules:
 *                 type: string
 *                 description: Rules for inviting new users.
 *                 example: "Invite 5 users to earn $10"
 *               withdraw_rules:
 *                 type: string
 *                 description: Rules for withdrawing funds.
 *                 example: "Withdraw only after reaching $50 balance"
 *               per_refer:
 *                 type: number
 *                 description: Amount to be earned per referral.
 *                 example: 10
 *               minimum_withdraw:
 *                 type: number
 *                 description: The minimum withdrawal amount.
 *                 example: 50
 *               policy_url:
 *                 type: string
 *                 description: policy_url
 *               teams_url:
 *                 type: string
 *                 description: teams_url
 *               banner_link:
 *                 type: string
 *                 description: banner_link
 *               banner_onclick_url:
 *                 type: string
 *                 description: banner_onclick_url
 *               contact_email:
 *                 type: string
 *                 description: contact_email
 *     responses:
 *       200:
 *         description: Config updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Config updated successfully!
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/config", authAdmin, setConfig);
/**
 * @swagger
 * /api/admin/offer/add:
 *   post:
 *     summary: Add a new offer to the platform
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaign_name:
 *                 type: string
 *                 description: Name of the campaign
 *                 example: "Spring Sale Campaign"
 *               short_description:
 *                 type: string
 *                 description: Brief description of the campaign
 *                 example: "Get 50% off on all items!"
 *               tracking_link:
 *                 type: string
 *                 description: URL to track the campaign
 *                 example: "https://example.com/track"
 *               campaign_logo:
 *                 type: string
 *                 description: URL or path to the campaign logo
 *                 example: "https://example.com/logo.png"
 *               status:
 *                 type: string
 *                 description: The status of the campaign (active/inactive)
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Offer added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Offer added successfully"
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/offer/add", authAdmin, addOffer);
/**
 * @swagger
 * /api/admin/offer/edit:
 *   post:
 *     summary: Edit an existing offer
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Offer ID to be edited
 *                 example: 1
 *               campaign_name:
 *                 type: string
 *                 description: Name of the campaign
 *                 example: "Spring Sale Campaign"
 *               short_description:
 *                 type: string
 *                 description: Brief description of the campaign
 *                 example: "Get 50% off on all items!"
 *               tracking_link:
 *                 type: string
 *                 description: URL to track the campaign
 *                 example: "https://example.com/track"
 *               campaign_logo:
 *                 type: string
 *                 description: URL or path to the campaign logo
 *                 example: "https://example.com/logo.png"
 *               status:
 *                 type: string
 *                 description: The status of the campaign (active/inactive)
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Offer edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Offer edited successfully"
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/offer/edit", authAdmin, editOffer);
/**
 * @swagger
 * /api/admin/offer/delete:
 *   post:
 *     summary: Delete an offer
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Offer ID to be deleted
 *                 example: 1
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Offer deleted successfully"
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/offer/delete", authAdmin, deleteOffer);
/**
 * @swagger
 * /api/admin/offer:
 *   post:
 *     summary: Get all offers with pagination
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of offers per page
 *     responses:
 *       200:
 *         description: Successfully fetched all offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalOffers:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: object
 *                   properties:
 *                     offers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           campaign_name:
 *                             type: string
 *                             example: "Spring Sale Campaign"
 *                           short_description:
 *                             type: string
 *                             example: "Get 50% off on all items!"
 *                           status:
 *                             type: string
 *                             example: "active"
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/offer", authAdmin, getAllOffers);
/**
 * @swagger
 * /api/admin/event/add:
 *   post:
 *     summary: Add a new event to a campaign
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaign_id:
 *                 type: integer
 *                 description: The ID of the campaign to associate the event with
 *                 example: 1
 *               event_title:
 *                 type: string
 *                 description: Title of the event
 *                 example: "New Year Sale"
 *               event_short_desc:
 *                 type: string
 *                 description: Short description of the event
 *                 example: "Get 20% off on all purchases!"
 *               event_amount:
 *                 type: integer
 *                 description: The reward amount associated with the event
 *                 example: 100
 *               status:
 *                 type: string
 *                 description: Status of the event (active/inactive)
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Event created successfully
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
 *                   example: "Event created successfully"
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/event/add", authAdmin, addEvent);
/**
 * @swagger
 * /api/admin/event/edit:
 *   post:
 *     summary: Edit an existing event
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the event to be updated
 *                 example: 1
 *               campaign_id:
 *                 type: integer
 *                 description: The ID of the campaign to associate the event with
 *                 example: 1
 *               event_title:
 *                 type: string
 *                 description: Title of the event
 *                 example: "Updated New Year Sale"
 *               event_short_desc:
 *                 type: string
 *                 description: Short description of the event
 *                 example: "Updated offer - 30% off on all purchases!"
 *               event_amount:
 *                 type: integer
 *                 description: The reward amount associated with the event
 *                 example: 150
 *               status:
 *                 type: string
 *                 description: Status of the event (active/inactive)
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: Event updated successfully
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
 *                   example: "Event updated successfully"
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Event or Campaign not found
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/event/edit", authAdmin, editEvent);
/**
 * @swagger
 * /api/admin/event/get-all-offers:
 *   post:
 *     summary: Get all offers with their associated events
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of offers per page
 *     responses:
 *       200:
 *         description: Successfully fetched all offers with events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     offers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           campaign_name:
 *                             type: string
 *                             example: "New Year Sale"
 *                           totalReward:
 *                             type: integer
 *                             example: 250
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/event/get-all-offers", getAllOffersWithEvents);
/**
 * @swagger
 * /api/admin/event/get-offer:
 *   post:
 *     summary: Get a specific offer by ID along with its associated events
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the offer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully fetched the offer with events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     campaign_name:
 *                       type: string
 *                       example: "New Year Sale"
 *                     events:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           event_title:
 *                             type: string
 *                             example: "Exclusive Deal"
 *                           event_amount:
 *                             type: integer
 *                             example: 50
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/event/get-offer", getOfferByIdWithEvents);
/**
 * @swagger
 * /api/admin/manual-payout:
 *   post:
 *     summary: Get the pending withdrawals for manual payout
 *     tags: [Admin]
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
 *         description: The number of withdrawals per page
 *     responses:
 *       200:
 *         description: Successfully retrieved pending withdrawals
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
 *                         example: 200.00
 *                       status:
 *                         type: string
 *                         example: "processing"
 *                       time:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-20T12:34:56Z"
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *       401:
 *         description: Unauthorized - Admin is not authenticated
 *       500:
 *         description: Internal server error
 */

adminRouter.post("/manual-payout", authAdmin, getPendingWithdraw);
/**
 * @swagger
 * /api/admin/get-config:
 *   get:
 *     summary: Retrieve application configuration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved configuration
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
 *                   example: Configuration fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       invite_rules:
 *                         type: string
 *                         example: "Invite your friends and earn rewards"
 *                       withdraw_rules:
 *                         type: string
 *                         example: "Minimum withdrawal amount is $100"
 *                       per_refer:
 *                         type: integer
 *                         example: 10
 *                       minimum_withdraw:
 *                         type: integer
 *                         example: 100
 *                       invite_link_template:
 *                         type: string
 *                         example: "https://example.com/invite?code={code}"
 *                       policy_url:
 *                         type: string
 *                         example: "https://example.com/policy"
 *                       teams_url:
 *                         type: string
 *                         example: "https://example.com/teams"
 *                       banner_link:
 *                         type: string
 *                         example: "/assets/banners/banner1.jpg"
 *                       banner_onclick_url:
 *                         type: string
 *                         example: "https://example.com/banner"
 *                       contact_email:
 *                         type: string
 *                         example: "support@example.com"
 *       401:
 *         description: Unauthorized - Admin authentication required
 *       500:
 *         description: Failed to fetch configuration
 */

adminRouter.get("/get-config", authAdmin, getConfig);
/**
 * @swagger
 * /api/admin/set-offer-status:
 *   post:
 *     summary: Update the status of an offer
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the offer
 *                 example: 123
 *               status:
 *                 type: string
 *                 description: The new status of the offer (e.g., "active", "inactive")
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Offer status updated successfully
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
 *                   example: Offer status updated successfully
 *       400:
 *         description: Missing required parameters
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
 *                   example: "Offer ID is required"
 *       404:
 *         description: Offer not found
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
 *                   example: "Offer not found"
 *       500:
 *         description: Failed to set offer status
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
 *                   example: "Failed to set offer status"
 */

adminRouter.post("/set-offer-status", authAdmin, setOfferStatus);
/**
 * @swagger
 * /api/admin/get-users:
 *   get:
 *     summary: Fetch all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
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
 *                   example: Users fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                       isBanned:
 *                         type: boolean
 *                         example: false
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

adminRouter.get("/get-users", authAdmin, getUsers);
/**
 * @swagger
 * /api/admin/update-user-ban-status:
 *   post:
 *     summary: Update a user's ban status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - isBanned
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 1
 *               isBanned:
 *                 type: boolean
 *                 description: Ban status (true to ban, false to unban)
 *                 example: true
 *     responses:
 *       200:
 *         description: User ban status updated successfully
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
 *                   example: User has been banned successfully
 *       404:
 *         description: User not found
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
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

adminRouter.post("/update-user-ban-status", authAdmin, updateUserBanStatus);
/**
 * @swagger
 * /api/admin/get-user-by-id:
 *   get:
 *     summary: Get details of a user by their ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to fetch
 *         example: 1
 *     responses:
 *       200:
 *         description: User details fetched successfully
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
 *                   example: User fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     mobileNumber:
 *                       type: string
 *                       example: +1234567890
 *                     isBanned:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-26T10:00:00Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2025-01-26T12:00:00Z
 *       400:
 *         description: Missing or invalid user ID
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
 *                   example: User ID is required
 *       404:
 *         description: User not found
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
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

adminRouter.get("/get-user-by-id", authAdmin, getUserById);
/**
 * @swagger
 * /api/admin/send-reward:
 *   post:
 *     summary: Send a reward to a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - amount
 *               - description
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user to receive the reward
 *                 example: 1
 *               amount:
 *                 type: number
 *                 description: Reward amount
 *                 example: 100.50
 *               description:
 *                 type: string
 *                 description: Reason or description for the reward
 *                 example: Referral Bonus
 *     responses:
 *       200:
 *         description: Reward sent successfully
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
 *                   example: Reward sent successfully
 *       400:
 *         description: Bad Request (missing or invalid input)
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
 *                   example: Amount is required
 *       404:
 *         description: User not found
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
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

adminRouter.post("/send-reward", authAdmin, sendReward);
/**
 * @swagger
 * /api/admin/set-secret-key:
 *   post:
 *     summary: Set or update the secret key
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - secret_key
 *             properties:
 *               secret_key:
 *                 type: string
 *                 example: "my-secure-secret-key"
 *     responses:
 *       200:
 *         description: Secret key set successfully
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
 *                   example: Secret key set successfully
 *       400:
 *         description: Secret key is required
 *       500:
 *         description: Failed to set secret key
 */

adminRouter.post("/set-secret-key",authAdmin, setSecretKey);
/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
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
 *                   example: Dashboard data fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 1000
 *                     totalBannedUsers:
 *                       type: integer
 *                       example: 50
 *                     totalOffers:
 *                       type: integer
 *                       example: 200
 *                     totalDisabledOffers:
 *                       type: integer
 *                       example: 20
 *                     totalWithdraw:
 *                       type: integer
 *                       example: 500
 *                     totalWithdrawAmout:
 *                       type: number
 *                       format: float
 *                       example: 25000.75
 *                     totalSuccessWithdraw:
 *                       type: integer
 *                       example: 300
 *                     totalSuccessWithdrawAmout:
 *                       type: number
 *                       format: float
 *                       example: 15000.50
 *       500:
 *         description: Internal Server Error
 */

adminRouter.get("/dashboard", authAdmin, getDashboardData);
/**
 * @swagger
 * /api/admin/refer-history:
 *   get:
 *     summary: Get referral history for a user
 *     tags: [Referral]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Referral history fetched successfully
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
 *                         format: float
 *                         example: 50.75
 *                       ReferredUser:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 456
 *                           username:
 *                             type: string
 *                             example: johndoe
 *                           email:
 *                             type: string
 *                             example: johndoe@example.com
 *                           mobileNumber:
 *                             type: string
 *                             example: "9876543210"
 *                           profilePic:
 *                             type: string
 *                             example: "https://example.com/profile.jpg"
 *                 totalCommission:
 *                   type: number
 *                   format: float
 *                   example: 500.00
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
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

adminRouter.get("/refer-history", authAdmin, getReferHistory);
/**
 * @swagger
 * /api/admin/transaction-history:
 *   get:
 *     summary: Get transaction history for a user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Transaction history fetched successfully
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
 *                         example: 150.75
 *                       type:
 *                         type: string
 *                         example: deposit
 *                       status:
 *                         type: string
 *                         example: completed
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-30T12:34:56.789Z"
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

adminRouter.get("/transaction-history", authAdmin, getTransactions);

adminRouter.get("/offer-history", authAdmin, getOfferHistory);

adminRouter.post("/send-notification", authAdmin, sendNotification);

adminRouter.get("/get-all-offer-history", authAdmin, getAllOfferHistory);

adminRouter.post("/approve-withdraw", authAdmin, approveWithdraw);

adminRouter.post("/reject-withdraw", authAdmin, rejectWithdraw);

adminRouter.post("/pay-withdraw", authAdmin, payToUser);
export default adminRouter;