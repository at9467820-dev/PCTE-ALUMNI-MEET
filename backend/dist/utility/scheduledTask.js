import cron from 'node-cron';
import alumniMeetModel from '../model/alumniMeet.model';
const alumniTalkStatus = async () => {
    const now = new Date();
    console.log("Status updated at:", now);
    await alumniMeetModel.updateMany({ time: { $lte: now }, status: 'Upcoming' }, { $set: { status: 'Ongoing' } });
    await alumniMeetModel.updateMany({ time: { $lt: now }, status: 'Ongoing' }, { $set: { status: 'Completed' } });
    console.log("Status updated at:", now);
};
alumniTalkStatus();
const alumniMeetCron = cron.schedule("0 * * * *", alumniTalkStatus);
export default alumniMeetCron;
