## 📚 Literary Character Interaction Analyzer

This web application analyzes character interactions in classic literature using an LLM. Users can enter a book ID, and the app will extract characters and map out their interactions.

### ✨ Features

* 🔍 Analyze character interactions from classic books
* 🤖 Powered by a large language model (LLM)
* 📊 Visual graph of interactions
* 💬 Clear textual output of character relationships
* ⚡ Fully deployed frontend and backend

---

### 🖥️ Live Demo

Frontend: \[your-frontend-url-here]
Backend API: \[your-backend-url-here]

---

### 🚀 Tech Stack

* **Frontend**: React, TypeScript, Axios, Vercel
* **Backend**: Express.js, Node.js, OpenRouter API, Railway
* **LLM**: OpenRouter-compatible model (e.g. GPT-4)

---

### 🧪 How to Use

1. Go to the frontend URL.
2. Enter a valid book ID (e.g., `1342` for *Pride and Prejudice* or `2265` for *Hamlet*).
3. View extracted characters and a visual map of their interactions.

---

### 🛠️ Local Development

#### 1. Clone the repo

```bash
git clone https://github.com/nada-adel-mohamady/literary-character-interactions.git
cd your-repo
```

#### 2. Set up backend

```bash
cd backend
npm install
# Create a .env file with:
# OPENROUTER_API_KEY=your-key-here
node index.js
```

#### 3. Set up frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 🌐 API Reference

**GET** `/api/book/:bookId`

Returns characters and their interactions from the given book.

```json
{
  "characters": ["Hamlet", "Ophelia"],
  "interactions": [
    { "source": "Hamlet", "target": "Ophelia", "weight": 3 }
  ]
}
```

---

### 📁 Project Structure

```
/frontend    # React app
/backend     # Express API
```

---

### 🛡️ Security

* `.env` files are excluded from version control using `.gitignore`.
* API keys are stored securely in Railway/Vercel project settings.

---

### 🧠 Future Improvements

* Support more text sources (e.g., PDFs)
* Improve accuracy with custom fine-tuned models
* Add named entity disambiguation

---

### 👤 Author

* Nada Adel
