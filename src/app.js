// import { Application } from './application.js'
import { LinkScraper } from './link-scraper.js'

try {
  const linkTest = new LinkScraper()
  const test = await linkTest.getLinks('https://courselab.lnu.se/scraper-site-1')
  console.log(test)
} catch (error) {
  console.error(error.message)
}
