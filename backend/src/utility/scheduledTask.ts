import cron from 'node-cron'
import { updateMeetStatusesDao } from '../dao/alumniMeet.dao'

const alumniTalkStatus = async () => {
  try {
    const now = new Date()
    console.log("Status update check at:", now);
    await updateMeetStatusesDao()
    console.log("Status updated at:", now);
  } catch (err) {
    console.log("Scheduled task error:", (err as Error).message);
  }
}

const alumniMeetCron = cron.schedule("0 * * * *", alumniTalkStatus)
alumniMeetCron.stop()

export { alumniTalkStatus }
export default alumniMeetCron