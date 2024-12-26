import { initChat } from "@mumulhl/duckduckgo-ai-chat";
import { promises as fs } from 'fs';
import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';

const server = express();
server.use(cors());

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms)); // Функция для создания паузы
}

function extractJSON(str) {
  const regex = /```json\s*(.+)\s*```/gmsi;
  let m;
  let json =  str;
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    json =m[1];
  }

  try {
    return JSON.parse(json);
  }  catch(e) {
    return json;
  }

    
}

async function main() {
  const chat = await initChat("gpt-4o-mini");

  // Читаем содержимое файла
  const initpromt = await fs.readFile('src/promt.txt', 'utf8');

  // Получаем полный ответ
  console.log(await chat.fetchFull(initpromt));

  server
    .use(bodyParser.json())
    .post("/webhook", async  (req, res) => {
      let { request, session, version } = req.body;
      let rawResponce = await chat.fetchFull(request['original_utterance'])
      console.log(rawResponce)

      let aiResponce = extractJSON(rawResponce);

      let {functionName, keyWords, message} = aiResponce;

      //message = message.replace(/[^\w.,-]/g, '');
      if(functionName && keyWords && message) {
        //все ок фцнкция сопоставлкена
      }
      
      //console.log(functionName, keyWords, message)
      let result = {
        response: {
          text: message,
          tts: message,
          end_session: false,
        },
        session: session,
        version,
      }

      res.json(result);
    })
    .listen(3000, () => {
      console.log("Server is running on port 3000");
    });
}

main().catch(console.error); // Запускаем основную функцию и обрабатываем ошибки 
