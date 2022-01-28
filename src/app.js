import { Application } from './application.js'

try {
  const [,, url] = process.argv

  const application = new Application(url)
  await application.start()
} catch (error) {
  console.error(error.message)
}
