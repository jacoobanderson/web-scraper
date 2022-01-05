import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

export class LinkScraper {
    async getLinks (url) {
        // Gets the initial raw data from the chosen URL.
        const initialData = await this.getInitialData(url)
        const dom = new JSDOM(initialData)

        // Returns an array with the links by getting all the a elements and then accessing the href on each element.
        const linkScrape = Array.from(dom.window.document.querySelectorAll('a'))
        .map(ele => ele.href)

        return linkScrape
    }

    async getInitialData (url) {
        const response = await fetch(url)
        return response.text()
      }
}