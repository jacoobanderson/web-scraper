import { LinkScraper } from './link-scraper.js'
import { CalendarChecker } from './calendar-check.js'

export class Application {
    #url

    constructor(url) {
        this.#url = url
    }

    async #linkScraper () {
        const linkScrape = new LinkScraper()
        await linkScrape.getLinks(this.#url)
        console.log('Scraping links...OK')
    }

    async #calendarChecker () {
        const linkScrape = new LinkScraper()
        const links = await linkScrape.getLinks(this.#url)
        const calendar = links[0]

        const calendarCheck = new CalendarChecker()
        await calendarCheck.getFreeDays(calendar)

        console.log('Scraping available days...OK')
    }

    async run () {
        await this.#linkScraper()
        await this.#calendarChecker()
    }

}