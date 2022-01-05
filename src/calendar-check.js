import { JSDOM } from 'jsdom'
import { LinkScraper } from './link-scraper.js'

/**
 * Checks the calendar for days that work for everyone.
 */
export class CalendarChecker {
  /**
   * Checks the calendar for available days.
   *
   * @param {string} url - The calendar url.
   * @returns {string[]} - List of available days.
   */
  async getFreeDays (url) {
    const freeDays = []
    const countDays = {}
    const availableDays = []
    const days = await this.#scrapeDays(url)

    // Get all days that are OK.
    for (let i = 0; i < days.length; i++) {
      if (days[i][0] === 'ok') {
        freeDays.push('friday')
      }
      if (days[i][1] === 'ok') {
        freeDays.push('saturday')
      }
      if (days[i][2] === 'ok') {
        freeDays.push('sunday')
      }
    }

    // Count each day
    freeDays.forEach((x) => {
      countDays[x] = (countDays[x] || 0) + 1
    })

    // Get the days that all friends are available
    for (const key in countDays) {
      if (countDays[key] === 3) {
        availableDays.push(key)
      }
    }
    return availableDays
  }

  /**
   * Gets the days that are OK.
   *
   * @param {string} url - The calendar url.
   * @returns {string[]} - List of days that are OK.
   */
  async #scrapeDays (url) {
    // Stores the information about which days are OK.
    const data = []

    // Gets the calendar links.
    const links = await this.#getCalendarLinks(url)
    const linkScraper = new LinkScraper()

    // Loops through the links and gets the days which are OK.
    for (let i = 0; i < links.length; i++) {
      const dom = new JSDOM(await linkScraper.getInitialData(links[i]))
      const days = Array.from(dom.window.document.querySelectorAll('td'))
        .map(ele => ele.textContent.toLowerCase())
      data.push(days)
    }
    return data
  }

  /**
   * Gets the initial links.
   *
   * @param {string} url - the url that represents the calendar.
   * @returns {string} The links.
   */
  async #getCalendarLinks (url) {
    const linkScraper = new LinkScraper()
    const calendars = await linkScraper.getLinks(url)

    // Stores the links
    const links = []

    // Loops through each person's calendar and then adds the original URL with the specific calendar.
    for (let i = 0; i < calendars.length; i++) {
      const removeTwoLetters = calendars[i].substring(2)
      links.push(url + removeTwoLetters)
    }
    return links
  }
}
