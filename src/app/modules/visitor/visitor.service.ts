import { Visitor } from "./visitor.model";
import redis from "../../utils/redis";

const trackVisit = async () => {
  const today = new Date().toISOString().split("T")[0];
  const key = `visitor_count:${today}`;
  
  // Increment in Redis
  await redis.incr(key);
  
  // Sync to DB (simple approach: update every time or periodically)
  // For better performance, you could use a scheduled task.
  // Here we'll do an upsert to keep the DB updated.
  await Visitor.findOneAndUpdate(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
};

const getVisitorStats = async () => {
  const stats = await Visitor.find().sort({ date: -1 }).limit(30);
  return stats;
};

export const visitorServices = {
  trackVisit,
  getVisitorStats,
};
