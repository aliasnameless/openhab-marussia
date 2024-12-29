import { initChat } from "@mumulhl/duckduckgo-ai-chat";
import { promises as fs } from 'fs';
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import nodeEval from 'eval';
import handlers from "./handlers.js";
import startDebugMessages from "./debug.js";

const server = express();

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
  
  let rawResponce = await chat.fetchFull(`${new Date()} >> ${request['original_utterance']}`)
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

  
  const initpromt = await fs.readFile('src/promt.txt', 'utf8');

  console.log(await chat.fetchFull(initpromt));

  //startDebugMessages(chat);

  server
    .use(bodyParser.json()) 
    .use(cors())
    .post("/webhook",  (req, res) => handleRequest(req, res, chat))
    .listen(3000, () => {
      console.log("https://skill-debugger.marusia.mail.ru");
      console.log("http://localhost:3000/webhook");
    });
}

main().catch(console.error); // Запускаем основную функцию и обрабатываем ошибки 
