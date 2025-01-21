import express from "express";
import adminRegister from "../controllers/admin/auth/register/index.js";
import adminLogin from "../controllers/admin/auth/login/index.js";
import authAdmin from "../middlewares/authAdmin.js";
import setConfig from "../controllers/admin/config/index.js";
import { addOffer, deleteOffer, editOffer, getAllOffers } from "../controllers/admin/offer/index.js";
import { addEvent, editEvent, getAllOffersWithEvents, getOfferByIdWithEvents } from "../controllers/admin/event/index.js";

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


export default adminRouter;