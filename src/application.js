import { LinkScraper } from './link-scraper.js'
import { CalendarChecker } from './calendar-check.js'
import { MovieChecker } from './movie-checker.js'
import { ReservationChecker } from './reservation-checker.js'

export class Application {
    #url

    #movieInfo

    #availableDays

    #reservationAlternatives

    constructor(url) {
        this.#url = url
        this.#movieInfo = []
        this.#availableDays = undefined
        this.#reservationAlternatives = []
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
    }

    async #reservationChecker () {
        const linkScrape = new LinkScraper()
        const links = await linkScrape.getLinks(this.#url)
        const bar = links[2]

        for (let i = 0; i < this.#availableDays.length; i++) {
            const reservationCheck = new ReservationChecker(bar, this.#availableDays[i])
            this.#reservationAlternatives.push(await reservationCheck.getBookingAlternatives())
        }
    }

    async run () {
        await this.#linkScraper()
        await this.#calendarChecker()
        await this.#movieChecker()
        await this.#reservationChecker()
        this.#suggestions()
    }

    #suggestions () {
        console.log('\nSuggestions\n===========')
        const availableDays = this.#availableDays
        const movieInfo = this.#movieInfo.flat()
        const reservation = this.#reservationAlternatives

        for (const element of movieInfo) {
            for (const ele of reservation) {
                if (element.day === ele.day) {
                    const movieStart = element.time.split(':')[0]
                    
                    const reservationStart = ele.available
                    
                    const reservStartFirstTwo = reservationStart.map(x => x.substring(0, 2))
                    for (let i = 0; i < reservStartFirstTwo.length; i++) {

                        // console.log(Number(movieStart) + 2)
                        // console.log(Number(reservStartFirstTwo[i]))
                        if (Number(movieStart) + 2 === Number(reservStartFirstTwo[i])) {
                            console.log('works')
                        }
                    }
                }
            }
        }

          console.log(availableDays)
          console.log(movieInfo)
          console.log(reservation)

    }

}