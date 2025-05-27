import Redis from 'ioredis';

// Kết nối với Redis sử dụng URL từ biến môi trường
const redis = new Redis(process.env.REDIS_URL!);

// Kiểm tra kết nối
redis.ping().then(() => console.log("Connected to Redis!"));


export default redis;
