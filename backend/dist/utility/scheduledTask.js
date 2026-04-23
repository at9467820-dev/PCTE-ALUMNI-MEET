"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alumniTalkStatus = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const alumniMeet_dao_1 = require("../dao/alumniMeet.dao");
const alumniTalkStatus = async () => {
    try {
        const now = new Date();
        console.log("Status update check at:", now);
        await (0, alumniMeet_dao_1.updateMeetStatusesDao)();
        console.log("Status updated at:", now);
    }
    catch (err) {
        console.log("Scheduled task error:", err.message);
    }
};
exports.alumniTalkStatus = alumniTalkStatus;
const alumniMeetCron = node_cron_1.default.schedule("0 * * * *", alumniTalkStatus);
alumniMeetCron.stop();
exports.default = alumniMeetCron;
