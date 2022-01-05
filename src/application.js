import { LinkScraper } from './link-scraper.js'
import { CalendarChecker } from './calendar-check.js'
import { MovieChecker } from './movie-checker.js'
import { ReservationChecker } from './reservation-checker.js'

/**
 * The application class that runs holds everything it needs to run.
 *
 */
export class Application {
    #url

    #movieInfo

    #availableDays

    #reservationAlternatives

    /**
     * Creates the application.
     *
     * @param {string} url - The input url that is given at the start of the application.
     */
    constructor (url) {
      this.#url = url
      this.#movieInfo = []
      this.#availableDays = undefined
      this.#reservationAlternatives = []
    }

    /**
     * Scrapes the url that has been given and then logs it when done.
     *
     */
    async #linkScraper () {
      const linkScrape = new LinkScraper()
      await linkScrape.getLinks(this.#url)
      console.log('Scraping links...OK')
    }

    /**
     * Checks the calendar for available days.
     *
     */
    async #calendarChecker () {
      const linkScrape = new LinkScraper()
      const links = await linkScrape.getLinks(this.#url)
      const calendar = links[0]

      const calendarCheck = new CalendarChecker()
      this.#availableDays = await calendarCheck.getFreeDays(calendar)

      console.log('Scraping available days...OK')
    }

    /**
     * Checks which movies are available.
     *
     */
    async #movieChecker () {
      const linkScrape = new LinkScraper()
      const links = await linkScrape.getLinks(this.#url)
      const movies = links[1]

      for (let i = 0; i < this.#availableDays.length; i++) {
        const movieCheck = new MovieChecker(movies, this.#availableDays[i])
        this.#movieInfo.push(await movieCheck.getMovieInformation())
      }
      console.log('Scraping showtimes...OK')
    }

    /**
     * Checks which times reservations are available.
     *
     */
    async #reservationChecker () {
      const linkScrape = new LinkScraper()
      const links = await linkScrape.getLinks(this.#url)
      const bar = links[2]

      for (let i = 0; i < this.#availableDays.length; i++) {
        const reservationCheck = new ReservationChecker(bar, this.#availableDays[i])
        this.#reservationAlternatives.push(await reservationCheck.getBookingAlternatives())
      }
      console.log('Scraping possible reservations...OK')
    }

    /**
     * The method that starts the application.
     *
     */
    async start () {
      await this.#linkScraper()
      await this.#calendarChecker()
      await this.#movieChecker()
      await this.#reservationChecker()
      this.#suggestions()
    }

    /**
     * Checks which times, movies and reservations are available for all of the friends.
     *
     */
    #suggestions () {
      console.log('\nSuggestions\n===========')
      const movieInfo = this.#movieInfo.flat()
      const reservation = this.#reservationAlternatives

      for (const element of movieInfo) {
        for (const ele of reservation) {
          if (element.day === ele.day) {
            const movieStart = element.time.split(':')[0]

            const reservationStart = ele.available

            const reservStartFirstTwo = reservationStart.map(x => x.substring(0, 2))
            for (let i = 0; i < reservStartFirstTwo.length; i++) {
              if (Number(movieStart) + 2 === Number(reservStartFirstTwo[i])) {
                const splitResTime = ele.available[i].split('-')
                const addMinutesFirst = splitResTime[0] + ':00'
                const addMinutesSecond = splitResTime[1] + ':00'
                const timeJoin = addMinutesFirst.concat('-', addMinutesSecond)

                this.#print(element.day, element.title, element.time, timeJoin)
              }
            }
          }
        }
      }
    }

    /**
     * Prints the suggestions of day, movie, time and reservation.
     *
     * @param {string} day - The day that works for everyone.
     * @param {string} name - The name of the movie that works.
     * @param {string} movieTime - The time of the movie that works with the other variables.
     * @param {string} restaurantTime - The time that works for everyone.
     */
    #print (day, name, movieTime, restaurantTime) {
      console.log(`* On ${day.charAt(0).toUpperCase() + day.slice(1)}, "${name}" begins at ${movieTime}, and there is a free table to book between ${restaurantTime}.`)
    }
}
