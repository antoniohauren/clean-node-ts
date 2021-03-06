import { MongoHelper } from '../Infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log(`running on port ${env.port}...`))
  })
  .catch(console.error)
