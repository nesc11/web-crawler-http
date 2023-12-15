const { JSDOM } = require('jsdom')


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
    getURLsFromHTML
}