import { LinkScraper } from './link-scraper.js'

export class Application {
    #url

    constructor(url) {
        this.#url = url
    }

    async #linkScraper () {
        const linkScrape = new LinkScraper()
        const scrapedLinks = await linkScrape.getLinks(this.#url)
        return scrapedLinks
    }

    async run () {
        console.log(await this.#linkScraper())
    }


}