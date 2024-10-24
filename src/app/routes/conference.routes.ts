import { Router } from "express";
import { changeSeats, organizeConference, changeDates } from "../controllers/conference.controllers";
import { isAuthenticated } from "../middlewares/authenticator.middleware";


const router = Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference)
router.patch('/conference/:conferenceId', changeSeats)
// test e2e change-dates
router.patch('/conference/:conferenceId/dates', changeDates)

export { router as ConferenceRoutes };
