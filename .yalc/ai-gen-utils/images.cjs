const request = require('request')
const fse = require('fs-extra');

const imgSyncFile = `images/db-${new Date().toLocaleDateString().replaceAll('/', '-')}.json`

async function unsplashImages(topic, cnt) {
    const topics = encodeURIComponent(topic || 'textures-patterns,business-work,arts-culture')
    // console.log('requesting... ', `https://api.unsplash.com/photos/random?client_id=-7cs7MfZzNNT_xMNHWc0TNUF0orDHlpzzOjRPJLJbyU&count=${cnt || 1}&topics=${topics}`)
    var options = {
        'method': 'GET',
        'url': `https://api.unsplash.com/photos/random?client_id=-7cs7MfZzNNT_xMNHWc0TNUF0orDHlpzzOjRPJLJbyU&count=${cnt || 1}&topics=${topics}`,
        'headers': {
                'Content-Type': 'application/json'
        },
        json:true
    };

    const images = await new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                reject(error)
                return;
            }
            const data = response.body

            console.log(typeof data, data?.length);
            let urlList = [];

            if (data.length > 0) {
                urlList.push(...data.map(item => item.urls))
            } else {
                urlList = [data.urls];
                data.tags?.forEach(tag => {
                    urlList.push(tag.source?.cover_photo?.urls)
                })
            }
 
            resolve(urlList.filter(item => !!item))
        })
    });

    const totalList = []
    try {
        const legacy = fse.readJsonSync(imgSyncFile)
        if (legacy) {
            if (legacy?.data?.length > 0) {
                totalList.push(...legacy.data)
            }
        }
    } catch (error) {
        console.error('read image db failed', error)
    }
    totalList.push(...images)
    fse.writeJsonSync(imgSyncFile, {data: totalList}, {spaces: 2})
    return totalList
}

async function unsplashSearchImages(keyword, cnt) {
    const encodeQuery = encodeURIComponent(keyword || 'industry-4.0')

    const searchOpt = {
        'method': 'GET',
        'url': `https://api.unsplash.com/search/photos?client_id=-7cs7MfZzNNT_xMNHWc0TNUF0orDHlpzzOjRPJLJbyU&page=1&query=${encodeQuery}&per_page=${cnt || 10}`,
        'headers': {
                'Content-Type': 'application/json'
        },
        json:true
    }

    const images = await new Promise((resolve, reject) => {
        request(searchOpt, function (error, response) {
            if (error) {
                reject(error)
                return;
            }
            const data = response.body?.results

            console.log(typeof data, data?.length);
            let urlList = [];

            if (data.length > 0) {
                urlList.push(...data.map(item => item.urls))
            } else {
                urlList = [data.urls];
                data.tags?.forEach(tag => {
                    urlList.push(tag.source?.cover_photo?.urls)
                })
            }
 
            resolve(urlList.filter(item => !!item))
        })
    });

    const totalList = []
    try {
        const legacy = fse.readJsonSync(imgSyncFile)
        if (legacy) {
            if (legacy?.data?.length > 0) {
                totalList.push(...legacy.data)
            }
        }
    } catch (error) {
        console.error('read image db failed', error)
    }
    totalList.push(...images)
    fse.writeJsonSync(imgSyncFile, {data: totalList}, {spaces: 2})
    return totalList
}

const getImages = async (cnt) => {
    if (!fse.existsSync(imgSyncFile)) {
        fse.ensureDirSync('images')
        fse.createFileSync(imgSyncFile)
    }
    const totalList = []
    try {
        const legacy = fse.readJsonSync(imgSyncFile)
        if (legacy) {
            totalList.push(...legacy.data || [])
        }
    } catch (error) {
        console.error('read image db failed', error)
    }
    if (totalList.length < cnt) {
        await unsplashSearchImages('industry-4.0', cnt)
    }
    const len = totalList.length
    const start = Math.floor(Math.random() * len - 1)
    const result = totalList.slice(start, start + cnt)
    if (result.length < cnt) {
        const missingCnt = cnt - result.length
        result.push(...totalList.slice(0, missingCnt))
    }
    return result;
}
async function auth() {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.webinfra.cloud/cms-admin-api/user/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
            body: {
                username:"cms_admin",
                password:"1234"
            }
        }, (error, resp) => {
            if (error) {
                reject(error)
            } else {
                resolve(resp?.body?.at?.token)
            }
        })
    })
}
async function getCacheImages(tag, cnt) {
    return auth().then(token => {
        console.log('getting images: ', tag, cnt)
        return new Promise((resolve, reject) => {
            request({
                url: `https://api.webinfra.cloud/cms-admin-api/apps/getRandomImages?tag=${tag}&count=${cnt}`, 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                json:true
            }, (error, resp) => {
                if (error) {
                    console.error('error: ', error);
                    reject(error)
                } else {
                    if (typeof resp.body?.forEach !== 'function') {
                        console.error('invalid data: ', resp)
                        reject('invalid data')
                        return;
                    }
                    resp.body?.forEach(item => {
                        const urls = item.urls;
                        Object.entries(urls).map(([key, value]) => {
                            let url = value;
                            if (!value.startsWith('http')) {
                                url = `https://${value}`
                            }
                            urls[key] = url.replace('assets-1306445775.cos.ap-shanghai.myqcloud.com', 'assets.greatermaker.cn')
                        })
                    })
                    resolve(resp.body)
                }
            })
        })
    })
}
// getCacheImages('industry-4.0', 1)

module.exports = {
    getImages,
    getCacheImages,
    unsplashImages
}