const { JSDOM } = require('jsdom')

async function crawlPage(currentURL) {
    console.log(`Actively crawling: ${currentURL}`)
    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399) {
            console.log(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return
        }
        const contentType = resp.headers.get("content-type")
        if (!contentType.includes('text/html')) {
            console.log(`Non html response, content type: ${contentType} on page: ${currentURL}`)
            return
        }
        console.log(await resp.text())
    } catch (error) {
        console.log(`Error in fetch: ${error.message}, on page: ${currentURL}`)
    }
}


function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody)
    const linkElements = Array.from(dom.window.document.querySelectorAll('a'))
    const urls = linkElements.map(link => {
        if (link.href.startsWith('/')) {
            try {
                const urlObj = new URL(`${baseURL}${link.href}`)
                return urlObj.href
            } catch (error) {
                console.log(`error with relative url: ${error.message}`)
            }
        }
        try {
            const urlObj = new URL(`${link.href}`)
            return urlObj.href
        } catch (error) {
            console.log(`error with absolute url: ${error.message}`)
        }
        
    })
    return urls
}


function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}