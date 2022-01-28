import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

/**
 * The class that gets links.
 */
export class LinkScraper {
  /**
   * Gets the links from the html.
   *
   * @param {string} url - The url that represents the site.
   * @returns {string} - returns an array with the links of the site.
   */
  async getLinks (url) {
    // Gets the initial raw data from the chosen URL.
    const initialData = await this.getInitialData(url)
    const dom = new JSDOM(initialData)

    // Returns an array with the links by getting all the a elements and then accessing the href on each element.
    const linkScrape = Array.from(dom.window.document.querySelectorAll('a'))
      .map(ele => ele.href)

    return linkScrape
  }

  /**
   * Gets the initial data, the html.
   *
   * @param {string} url - The url that the data is to be extracted from.
   * @returns {string} The data as text.
   */
  async getInitialData (url) {
    const response = await fetch(url)
    return response.text()
  }
}
