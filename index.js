const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const dirpath = path.join(__dirname, 'files')
const body = fs.readFileSync(__dirname + '/hi.html')
const $ = cheerio.load(body)

if (!fs.existsSync(dirpath)) {
  fs.mkdirSync(dirpath)
}

const download = url => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => {
        const filepath = path.join(dirpath, url.split('/').pop())
        const stream = fs.createWriteStream(filepath)

        res.body.pipe(stream)
          .on('error', error => {
            reject(error)
          })
        stream.on('finish', () => {
            resolve()
          })
      })
  })
}

const links = []

$('a')
  .each((idx, el) => {
    const url = $(el).attr('href')

    links.push(url)
  })

const main = async () => {
  for (let i = 0, l = links.length; i < l; i++) {
    console.log(`downloading ${i + 1}/${l} items: ${links[i]}`)

    try {
      await download(links[i])
    } catch (error) {
      console.error(error)

      continue
    }
  }
}

main()
