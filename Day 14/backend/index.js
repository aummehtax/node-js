import 'dotenv/config'
import express from 'express'
// import cors from 'cors'   used proxy in frontend
const app = express()

// app.use(cors())   used proxy in frontend   

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get('/api/jokes', (req, res) => {
    const jokes = [
    {
    "id": 1,
    "title": "Programmer’s Life",
    "content": "Why do programmers prefer dark mode? Because light attracts bugs!"
    },
    {
    "id": 2,
    "title": "Coffee Bug Fix",
    "content": "A programmer was found dead in the shower. The shampoo bottle said: Lather, Rinse, Repeat."
    },
    {
    "id": 3,
    "title": "Zero and One",
    "content": "There are only 10 types of people in the world: those who understand binary and those who don’t."
    },
    {
    "id": 4,
    "title": "AI Takeover",
    "content": "My AI told me a joke once… but I didn’t laugh. Now it won’t stop recommending stand-up tutorials."
    },
    {
    "id": 5,
    "title": "Stack Overflow",
    "content": "I told my friend I had a problem with recursion. He said, ‘Have you tried solving it recursively?’"
    }
    ]

    res.send(jokes)
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
