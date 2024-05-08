// Run the server first with `npm run server`
const { fetchEventSource } = require('@fortaine/fetch-event-source');
const request = require('request')

const clientId = 'IDS5mimX0w8G5K1hEcwP7eE4'
const clientSec = 'Hl070LYY74fvrSVGWLirX8j4sWzSlHKR'

async function yiyan() {
    var options = {
        'method': 'POST',
        'url': `https://aip.baidubce.com/oauth/2.0/token?client_id=${clientId}&client_secret=${clientSec}&grant_type=client_credentials`,
        'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
        }
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

let retryCnt = 0;
let maxRetryCnt = 3;
const DefaultHost = 'https://chat2.ms3.webinfra.cloud';



const callBridge = async (options) => {
    const { data, onmessage, onopen, onclose, onerror, debug } = options || {}
    if (!data?.message) {
        throw new Error('Empty Input Message');
    }
    let clientOptions = {};
    if (data.prompt) {
        clientOptions.promptPrefix = data.prompt;
        delete data.prompt;
    }
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...(data || {}),
            // Set stream to true to receive each token as it is generated.
            stream: true,
            clientOptions,
        }),
    };

    try {
        let reply = '';
        let msgId = '';
        let conversationId = '';
        const controller = new AbortController();
        let aborted = false;
        await fetchEventSource( debug ? 'http://localhost:3000/api/chat' : (`${DefaultHost}/api/chat`), {
            ...opts,
            signal: controller.signal,
            onopen(response) {
                console.log('start ai response... ');
                if (response.status === 200) {
                    onopen && onopen()
                    return;
                }
                const err = new Error(`Failed to send message. HTTP ${response.status} - ${response.statusText}`);
                if (retryCnt < maxRetryCnt) {
                    throw new Error('RetryRequest');
                }
                if (onerror) {
                    onerror(err)
                } else {
                    throw err;
                }
            },
            onclose() {
                console.warn('internal close')
                const error = new Error(`Failed to send message. Server closed the connection unexpectedly.`);
                if (onclose) {
                    onclose(error);
                } else {
                    throw error;
                }
            },
            onerror(err) {
                console.error('internal error: ', err);
                if (retryCnt < maxRetryCnt) {
                    throw new Error('RetryRequest');
                }
                if (onerror) {
                    onerror(err);
                } else {
                    throw err;
                }
            },
            onmessage(message) {
                // { data: 'Hello', event: '', id: '', retry: undefined }
                if (aborted) {
                    return;
                }
                if (message.data === '[DONE]') {
                    console.log('done: ', message);
                    controller.abort();
                    aborted = true;
                    return;
                }
                if (message.event === 'result') {
                    const result = JSON.parse(message.data);                            
                    console.log('result: ', result.response);
                    msgId = result.messageId;
                    conversationId = result.conversationId;
                    const finalResp = result.response;
                    if (finalResp?.length > reply?.length) {
                        console.log('use returned full response: ', finalResp);
                        reply = finalResp;
                    }
                    return;
                }
                if (message?.event === 'error') {
                    onerror && onerror(message.data);
                    return;
                }
                if (onmessage) {
                    onmessage(message);
                }
                // console.log('onmessage: ', message);
                reply += JSON.parse(message.data);
            },
        });
        console.log(reply);

        return {
            response: reply,
            messageId: msgId,
            conversationId: conversationId,
        };
    } catch (err) {
        console.error('ERROR ', err);
        throw err;
    }
}


module.exports = {
    callBridge
}