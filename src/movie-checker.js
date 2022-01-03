import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import { LinkScraper } from './link-scraper.js'

export class MovieChecker {
    #url
    #day
    constructor(url, day) {
        this.#url = url
        this.#day = day
    }

    async getAvailable () {
        const id = this.getDayId()
        for (let i = 0; i < 3; i++) {
            console.log(`${this.#url}/check?day=${id}&movie=0${i + 1}`)
            const response = await fetch(`${this.#url}/check?day=${id}&movie=0${i + 1}`)
            console.log(await response.json())
        }
    }

    // Clean
    async getMovie (movieId) {
        const linkScraper = new LinkScraper()
        const data = await linkScraper.getInitialData(this.#url)

        const dom = new JSDOM(data)

        const movieScrape = Array.from(dom.window.document.querySelectorAll(`option[value="${movieId}"]`))
        return movieScrape[0].textContent
    }

    // Better way?
    getDayId () {
        let id = ''
        if (this.#day === 'friday') {
            id = '05'
        } else if (this.#day === 'saturday') {
            id = '06'
        } else if (this.#day === 'sunday') {
            id = '07'
        }
        return id
    }
}