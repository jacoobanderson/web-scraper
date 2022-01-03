import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

export class ReservationChecker {
    #day
    #url
    #fetchCookie
    constructor(url, day) {
        this.#day = day
        this.#url = url
        this.#fetchCookie = undefined
    }

    async getCookieFromResponse () {
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

    async getRestaurantBookingData () {
        const response = await fetch(`${this.#url}login/booking`, {
            headers: {
                cookie: `${this.#fetchCookie}`
            }
        })
        return response.text()
    }

    async getBookingAlternatives() {
        await this.getCookieFromResponse()
        const restaurantData = await this.getRestaurantBookingData()
        
        //Clean
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
