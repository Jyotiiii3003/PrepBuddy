require('dotenv').config()

console.log('Key exists:', !!process.env.GEMINI_API_KEY)
console.log('Key starts with:', process.env.GEMINI_API_KEY?.slice(0, 15))

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: 'say hello in one word' }] }] })
})
.then(r => r.json())
.then(d => console.log('Response:', JSON.stringify(d).slice(0, 300)))
.catch(e => console.log('Error:', e.message))