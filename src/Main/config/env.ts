export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-ts',
  port: process.env.PORT ?? 3000
}
