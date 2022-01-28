import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

/**
 * Represents the reservation class.
 */
export class ReservationChecker {
    #day
    #url
    #fetchCookie
    /**
     * Creates an instance of the reservation class.
     *
     * @param {string} url - string that represents the url of the dinner site.
     * @param {string} day - the day that is to be checked.
     */
    constructor (url, day) {
      this.#day = day
      this.#url = url
      this.#fetchCookie = undefined
    }

    /**
     * Gets the cookie from the response and puts it in the variable fetchCookie.
     *
     */
    async #getCookieFromResponse () {
      const response = await fetch(`${this.#url}login`, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: 'username=zeke&password=coys&submit=login',
        method: 'POST',
        redirect: 'manual'
      })
      this.#fetchCookie = response.headers.get('set-cookie').split(';')[0]
    }

    /**
     * Gets the intitial booking data from the site by accessing it with the cookie.
     *
     * @returns {string} returns the html as text.
     */
    async #getRestaurantBookingData () {
      const response = await fetch(`${this.#url}login/booking`, {
        headers: {
          cookie: `${this.#fetchCookie}`
        }
      })
      return response.text()
    }

    /**
     * Compiles the available times.
     *
     * @returns {object} consists of what day and what time is available.
     */
    async getBookingAlternatives () {
      await this.#getCookieFromResponse()
      const restaurantData = await this.#getRestaurantBookingData()

      const dom = new JSDOM(restaurantData)
      const bookingTimes = Array.from(dom.window.document.querySelectorAll(`input[name="group1"][value^="${this.#day.slice(0, 3)}"] ~ span`))
        .map(ele => ele.textContent.trim().split(' ')[0])

      const compiledTimes = {
        day: `${this.#day}`,
        available: bookingTimes
      }

      return compiledTimes
    }
}
