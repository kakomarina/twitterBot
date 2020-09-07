const puppeteer = require('puppeteer')
const fs = require('fs')
const { count } = require('console')

let getUrlsFromLetras = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.letras.mus.br/mais-acessadas/indie/')  
  
  const result = await page.evaluate(() => {
    let urls = []
    document.querySelectorAll('.g-2-3 > ol > li > a')
            .forEach((url) => urls.push(url.getAttribute('href')))
    return urls
  })  
  
  browser.close()
  return result
}

let getLyricsFromLetras = async () => {
    let urls = await getUrlsFromLetras();
    const browser = await puppeteer.launch()
    let count = 0


    for await (url of urls) {
        count++
        console.log('https://www.letras.mus.br' + url)
        const page = await browser.newPage()
        await page.goto('https://www.letras.mus.br' + url)

        let result = await page.evaluate(() => {
            let lyrics = ""
            document.querySelectorAll('article > div > .cnt-letra > p')
                .forEach((paragraph) => {
                    lyrics = lyrics + "\n" + paragraph.innerText;
                })
            return lyrics
        })

        fs.writeFile("lyrics/lyrics" + count, result, "UTF-8", (err) => {
            if (err) console.log(err)
            else console.log("file saved as lyrics" + count)
        })
    }
}

let getUrlsFromPlaylist = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.vagalume.com.br/playlisteiros/os-melhores-indies-lancados-nessa-decada/')  
  
  const result = await page.evaluate(() => {
    let urls = []
    document.querySelectorAll('.lyric')
            .forEach((url) => urls.push(url.getAttribute('href')))
    return urls
  })  
  
  browser.close()

  return result
}

let getLyricsFromVagalume = async () => {
  let urls = await getUrlsFromPlaylist();
  let count = 0
  const browser = await puppeteer.launch()


  for await (url of urls) {
      count++
      console.log('https://www.vagalume.com.br' + url)
      const page = await browser.newPage()
      await page.goto('https://www.vagalume.com.br' + url, {
        waitUntil: 'load',
        timeout: 0
      })

      let result = await page.evaluate(() => {
          let lyrics = ""
          document.querySelectorAll('#lyrics')
              .forEach((paragraph) => {
                  lyrics = lyrics + "\n" + paragraph.innerText;
              })
          return lyrics
      })

      fs.writeFile("playlist1/lyrics" + count, result, "UTF-8", (err) => {
          if (err) console.log(err)
          else console.log("file saved as lyrics" + count)
      })
  }

  browser.close()
}


// getLyricsFromLetras().then(() => {
//   console.log("Finished")
// })

getLyricsFromVagalume().then(() => {
  console.log("Finished")
})