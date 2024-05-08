const request = require('request')

function jsonParser(input, retry) {
  let str = input;
  try {
    if (retry) {
      str = input.replaceAll('\'', '"')
    }
    return JSON.parse(str)
  } catch (error) {
    if (!retry) {
      return jsonParser(input.retry)
    }
    throw error;
  }
}

async function chat(msgs) {
  const contents = [];
  if (typeof msgs === 'string') {
    contents.push({
      parts: [{
        text: msgs
      }]
    })
  } else if (Array.isArray(msgs)) {
    msgs.forEach(msg => {
      if (typeof msg === 'string') {
        contents.push({
          parts: [{
            text: msg
          }]
        })
      } else {
        contents.push(msg)
      }
    })
  }

  if (process.env.DEV === '1') {
    console.log('chat...', JSON.stringify(contents))
  }
  var url 
  if (process.env.PROXY === 'y') {
    url = 'http://127.0.0.1:12345'
  } else {
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDwV1r0F6rFyOQcG54H374gKlQvS_BcyqI'
  }
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 8192,
  };
  var options = {
      'method': 'POST',
      'url': url,
      'headers': {
              'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig
      })
  };

  return new Promise((resolve, reject) => {
      request(options, function (error, response) {
          if (error) {
              reject(error)
              return;
          }
          console.log(typeof response.body);
          let respJson;
          try {
            respJson = JSON.parse(response.body);
          } catch(e) {
            reject(e)
            return;
          }

          if (process.env.DEV === '1') {
            console.log('gemini response : ', respJson)
            console.log(' - ', respJson?.candidates[0]?.content?.parts[0]?.text)
          }
          const contentsTxt = respJson.candidates[0].content.parts[0].text
          const matches = contentsTxt.match(/```(?:json)?(.*)```/s);
          let jsonStr = contentsTxt
          if (matches) {
            jsonStr = matches[1]
          }

          console.log('\n')
          console.log('got json str: ', typeof jsonStr)
          if (process.env.DEV === '1') {
            console.log('gemini json str: : ', jsonStr)
          }
          try {
              const data = jsonParser(jsonStr);
              if (process.env.DEV === '1') {
                console.log('gemini response data: ', data)
              }
              resolve(data)
          } catch (error) {
              // console.log('重新parse json中。。。')
              // resolve(format(jsonStr))
              reject(error)
          }
      })
  });
}


async function format(msgString) {
  const contents = [];
  if (typeof msgString === 'string') {
    contents.push({
      parts: [{
        text: '重新format该字符串，确保可以被js中的JSON.parse正确解析：' + msgString
      }]
    })
  } else {
    console.error('invalid input', msgString)
    return;
  }

  if (process.env.DEV === '1') {
    console.log('format...', JSON.stringify(contents))
  }
  var options = {
      'method': 'POST',
      'url': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDwV1r0F6rFyOQcG54H374gKlQvS_BcyqI',
      'headers': {
              'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents": contents
      })
  };

  return new Promise((resolve, reject) => {
      request(options, function (error, response) {
          if (error) {
              reject(error)
              return;
          }
          console.log(typeof response.body);
          const respJson = JSON.parse(response.body);
          if (process.env.DEV === '1') {
            console.log('gemini response : ', respJson)
            console.log(' - ', respJson?.candidates[0]?.content?.parts[0]?.text)
          }
          const contentsTxt = respJson.candidates[0].content.parts[0].text
          const matches = contentsTxt.match(/```json(.*)```/s);
          let jsonStr = contentsTxt
          if (matches) {
            jsonStr = matches[1]
          }

          console.log('\n')
          console.log('got json str: ', typeof jsonStr)
          if (process.env.DEV === '1') {
            console.log('gemini format json str: : ', jsonStr)
          }
          try {
              const data = JSON.parse(jsonStr);
              if (process.env.DEV === '1') {
                console.log('gemini format response data: ', data)
              }
              resolve(data)
          } catch (error) {
              console.log('重新parse json失败。。。')
              // resolve(formatJSON(jsonStr))
              reject(error)
          }
      })
  });
}

async function run() {
  // For text-only input, use the gemini-pro model
  const model = await chat(base + companyInfo)

  console.log(model);
}

module.exports = {
  chat
}