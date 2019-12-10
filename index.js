const _ = require('lodash')
const events = require('events')
const em = new events.EventEmitter()
const fs = require('fs')
const puppeteer = require('puppeteer')
const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
    '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
];
let gList =[];
let looping = false;
const options = {
    args,    
    ignoreHTTPSErrors: true,
    headless: true,
    ignoreDefaultArgs: ["--enable-automation"], 
    userDataDir: './tmp'
};

(async () => {
    
    const browser = await puppeteer.launch(options )
    // const preloadFile = fs.readFileSync('./preload.js', 'utf8');
    // const context = await browser.createIncognitoBrowserContext();

    const page = await browser.newPage()
    // await page.setRequestInterception(true)
  
    // await page.evaluateOnNewDocument(preloadFile);

    await page.setViewport({ width: 1080 , height: 800  })
    await page.goto('https://live.ixigua.com/279110/')

    page.on('response', async rep => {
        if(rep.url().indexOf('live.ixigua.com/api/msg/list') >= 0){
          em.emit('newMsgArr',await rep.json());
        }
      });
  
    em.on('newMsgArr', function (data) {
          if(data.data ){
              (data.data.LiveMsgs || []).forEach((item)=>{
                  em.emit(item.Method,item)
              })   
          }
    });
    em.on('VideoLiveChatMessage', function (data) {
        
    });
    em.on('VideoLivePresentMessage', function (data) {
        console.log(` 待回复${gList.length}`)
        if(data.Msg.present_info){
            gList.push(`感谢 @${data.Msg.user.name} 的礼物 `)
            !looping && loop()
        }
    });
    
    em.on('VideoLiveMemberMessage', (data)=>{
        gList.push(`@${data.Msg.user.name} 欢迎来到直播间`)
        !looping && loop()
    })
    
    const loginPanel = await page.$('.UserPanel__logout')

    if(!loginPanel ){

        await page.waitForSelector('#App > div > div.header.white > div > div.header-inner__user-info > a', { timeout: 3000 })
        await page.click('#App > div > div.header.white > div > div.header-inner__user-info > a')
        await page.waitForSelector('#login-mobile-box')
        await page.click('#login-platform-footer > div:nth-child(4)')
        await page.screenshot({path: `${Date.now()}-qr.png`})
    }

    async function loop(){
        
        looping = true

        if(gList.length>0){

            await page.type('.chatroom__input > div > textarea', gList.pop())
            await page.keyboard.press('Enter')  
            if(gList.length>0){
                await loop()
            }     
        }
        looping = false
    }

})()
