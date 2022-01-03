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
        this.getRestaurantBookingData()
    }

    async getRestaurantBookingData () {
        const response = await fetch(`${this.#url}login/booking`, {
            headers: {
                cookie: `${this.#fetchCookie}`
            }
        })
        console.log(response)
    }
}