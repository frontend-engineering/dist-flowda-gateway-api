const request = require('request')
const AK = "IDS5mimX0w8G5K1hEcwP7eE4"
const SK = "Hl070LYY74fvrSVGWLirX8j4sWzSlHKR"

async function formatJSON(msg) {
    var options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + await getAccessToken(),
        'headers': {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                "messages": [
                        {
                                "role": "user",
                                "content": "请将以下信息中的json部分抽取出来，并重新格式化成为一个合理的json并输出，确保输出的json格式正确性，保证能够被JSON.parse()正确识别,不需要额外解释，输出结果即可\\n：" + msg
                        }
                ],
                "top_p": 0.90
        })

    };

    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                reject(error)
                return;
            }
            console.log(typeof response.body, response.body);
            const jsonStr = JSON.parse(response.body).result.match(/```json(.*)```/s)[1];

            console.log('\n')
            console.log('got json str: ', typeof jsonStr, jsonStr)
            try {
                const data = JSON.parse(jsonStr);
                resolve(data)
            } catch (error) {
                console.error('wrong for 2nd times')
                throw error
            }
            
        })
    }); 
}

async function chat(prompt, msg) {
    var options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + await getAccessToken(),
        'headers': {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                "messages": [
                        {
                                "role": "user",
                                "content": prompt + "\\n以下是公司信息：" + msg
                        }
                ],
                "top_p": 0.99
        })

    };

    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                reject(error)
                return;
            }
            console.log(typeof response.body, response.body);
            const jsonStr = JSON.parse(response.body).result.match(/```json(.*)```/s)[1];

            console.log('\n')
            console.log('got json str: ', typeof jsonStr, jsonStr)
            try {
                const data = JSON.parse(jsonStr);
                resolve(data)
            } catch (error) {
                console.log('重新parse json中。。。')
                resolve(formatJSON(jsonStr))
            }
        })
    });
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
let cached = null;
function getAccessToken() {
    if (cached) return cached;
    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    const resp = new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) { reject(error) }
            else { resolve(JSON.parse(response.body).access_token) }
        })
    })
    cached = resp;
    return cached;
}
module.exports = {
    chat
}