import { initChat } from "@mumulhl/duckduckgo-ai-chat";
//import promises from 'fs';

import fs from 'fs';
import express from "express";
import https from 'https';
import http  from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodeEval from 'eval';
import handlers from "./handlers.js";
import initPromt from "./promt.js"

import startDebugMessages from "./debug.js";

const PORT = 3000;

const devMode = process.argv[2] === 'dev';

const app = express();

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms)); // Функция для создания паузы
}



function extractTS(input) {
  const regex = /```\w+\s*(.+)\s*```/gmsi;
  let m;
  let data = input;
  while ((m = regex.exec(input)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    data = m[1];
  }

  return data;

}

async function handleRequest(req, res, chat) {
  let { request, session, version } = req.body;


  console.log('>>>', request['original_utterance'])

  let rawResponce = await chat.fetchFull(`${new Date().toLocaleString()} >> ${request['original_utterance']}`)
  let tsCode = 'module.exports = ' + extractTS(rawResponce)
  console.log('<<<', tsCode)

  let message;
  try {
    message = nodeEval(tsCode, 'filename', handlers, false);
  } catch (e) {
    message = tsCode;
  }
  let result = {
    response: {
      text: message,
      tts: message,
      end_session: false,
      debug: tsCode,
    },
    session: session,
    version,
  }

  res.json(result);

}


async function main() {
  // Initialize, optional models are gpt-4o-mini, claude-3-haiku, llama, 
  const chat = await initChat('llama');
  //const chat = await initChat('gpt-4o-mini');




  console.log(await chat.fetchFull(initPromt));

  //startDebugMessages(chat);


  app
    .use(bodyParser.json())
    .use(cors())
    .post("/webhook", (req, res) => handleRequest(req, res, chat))

  let server;
  if (devMode) {
    server = http.createServer(app);
  } else {
    const options = {
      key: fs.readFileSync('/etc/letsencrypt/live/ebrownie.duckdns.org/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/ebrownie.duckdns.org/fullchain.pem')
    };
    server = https.createServer(options, app);
  }

  server.listen(PORT, () => {
    console.log("https://skill-debugger.marusia.mail.ru");
    console.log(devMode ? `http://localhost:${PORT}/webhook`:`https://ebrownie.duckdns.org:${PORT}/webhook`);
  });

}

main().catch(console.error); // Запускаем основную функцию и обрабатываем ошибки 
