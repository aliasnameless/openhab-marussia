import OpenAI from "openai"

const OPENROUTER_API_KEY = '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'

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,

})

async function main(xxx) {
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct",
    messages: [
      {
        "role": "user",
        "content": xxx

      }
    ]
  })

  console.log(completion.choices[0].message)
}

main('Запомни. Цвет черный')
main('Какой ты запомнила цвет?')



