import { LinkScraper } from './link-scraper.js'
import { CalendarChecker } from './calendar-check.js'
import { MovieChecker } from './movie-checker.js'

export class Application {
    #url

    #movieInfo

    #availableDays

    constructor(url) {
        this.#url = url
        this.#movieInfo = []
        this.#availableDays = undefined
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
        this.#availableDays = await calendarCheck.getFreeDays(calendar)

        console.log('Scraping available days...OK')
    }

    async #movieChecker () {
        const linkScrape = new LinkScraper()
        const links = await linkScrape.getLinks(this.#url)
        const movies = links[1]

        for (let i = 0; i < this.#availableDays.length; i++) {
            const movieCheck = new MovieChecker(movies, this.#availableDays[i])
            this.#movieInfo.push(await movieCheck.getMovieInformation())
        }
        console.log(this.#movieInfo)
    }

    async #reservationChecker () {
        
    }

    async run () {
        await this.#linkScraper()
        await this.#calendarChecker()
        await this.#movieChecker()
        this.#suggestions()
    }

    #suggestions () {
        console.log('\nSuggestions\n===========')
        console.log(this.#availableDays)
    }

}