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

    async getMovieInformation () {
        const id = this.getDayId()
        const compiledInfo = []
        let movieInformation

        for (let i = 0; i < 3; i++) {
            const response = await fetch(`${this.#url}/check?day=${id}&movie=0${i + 1}`)
            movieInformation = await response.json()

            for (let j = 0; j < movieInformation.length; j++) {
                if (movieInformation[j].status === 1) {
                    const movieName = await this.getMovie(movieInformation[j].movie)
                    compiledInfo.push({
                        day: `${this.#day}`,
                        time: `${movieInformation[j].time}`,
                        title: `${movieName}`
                    })
                }
            }
        }
        return compiledInfo
    }

    // Clean
    async getMovie (movieId) {
        const linkScraper = new LinkScraper()
        const data = await linkScraper.getInitialData(this.#url)

        const dom = new JSDOM(data)

        const movieScrape = Array.from(dom.window.document.querySelectorAll(`option[value="${movieId}"]`))
        return movieScrape[0].textContent
    }

    getDayId () {
        let id

        switch (this.#day) {
            case 'friday':
                id = '05'
                break
            case 'saturday':
                id = '06'
                break
            case 'sunday':
                id = '07'
                break
        }
        return id
    }
}