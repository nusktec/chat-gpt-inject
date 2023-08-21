import childProcess from "child_process"
//code ready to text
import fs from "fs"
import {ChatGPTAPI} from "chatgpt"
//questions
const queBuffer = "Write an article on how to become a software engineer" //question to chat-gpt, you can replace this with audio bytes passed to deepgram for transcribing
//init chat gpt
const api = new ChatGPTAPI({
    apiKey: "chat-gpt-api-key-here",
    completionParams: {
        model: 'gpt-3.5-turbo-16k',
        temperature: 0.5,
        top_p: 0.8
    }
})
let counter = 0;
let raw = [];

(async function voiceToGPT() {
    //init here
    // send a message and wait for the response
    let res = await api.sendMessage(queBuffer)
    raw = res.text.split("\n")
    start()
})()

//load content
fs.readFile("code.js", "utf-8", function (err, data) {
    raw = data.split("\n")
    //start scanning to focus app
    //start() //if you want to handled local files re-writing then enabled this and disable chat-gpt
})

//function start
function start() {
    if (raw.length > counter) {
        setTimeout(function () {
            commander(raw[counter])
        }, 1000) //time to pick new line of the next text to be writing
    }
}

/**
 * Before calling this method, you must have cliclick install via homebrew @brew install cliclick
 * @param str
 */

//command writer
function commander(str) {
    const bash_run = childProcess.spawn('/opt/homebrew/bin/cliclick', [`t:${str}`]);
    bash_run.stdout.on('data', function (data) {
        //console.log('Output: ' + data);

    });
    bash_run.on("close", function (data) {
        //trigger next notes
        counter++
        //enter new line
        controlsCmd("return")
    })
    bash_run.stderr.on('data', function (data) {
        console.log('Error: ' + data);
    });
}

/**
 * Every successful typed line, they must be a new line enter into the text, this method tell the timer to pick the next line as it gonna hit last
 * @param str
 */
function controlsCmd(str) {
    const bash_run = childProcess.spawn('/opt/homebrew/bin/cliclick', ["kp:return", ""]);
    bash_run.on("close", function (data) {
        //trigger next notes
        //loop again
        start()
    })
    bash_run.stderr.on('data', function (data) {
        console.log('Error: ' + data);
    });
}

//start applications
// setTimeout(function () {
//     //start()
// }, 5000)