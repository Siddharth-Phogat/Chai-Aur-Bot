# Chai Aur Bot – Dual Persona Chat

**Chai Aur Bot** is a web-based AI chat application that allows users to interact with multiple AI personas. Each persona has a unique teaching style, tone, and personality, designed to provide guidance, coding advice, and motivational insights in a conversational manner.

---

## Screenshots

### Talking to Hitesh Choudhary Sir
<img width="1572" height="849" alt="Screenshot (182)" src="https://github.com/user-attachments/assets/053d2cd4-f68e-4f7a-8fa8-04f9baf52b2d" />

### Talking to Piyush Garg Sir
<img width="1704" height="859" alt="Screenshot (183)" src="https://github.com/user-attachments/assets/f8a296e9-f7ba-41b8-ab3c-c66742ea6cd2" />

---

## Features

- **Dual Personas**:  
  - **Hitesh Choudhary** – Friendly, motivational, Hinglish, project-oriented, humorous.  
  - **Piyush Garg** – Energetic, practical, project-focused, emoji-rich, action-oriented.

- **Realistic Chat UI**: Smooth scrolling, timestamped messages, and visually appealing chat bubbles.

- **Markdown & Code Support**: AI responses can include formatted text, tables, and syntax-highlighted code blocks.

- **Persona Switching**: Easily switch between personas to get guidance in different styles.

- **Responsive Design**: Fully responsive layout for desktop and mobile.

---

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Markdown, Syntax Highlighter  
- **Backend**: Next.js API routes, Google Gemini AI  
- **State Management**: React `useState`, `useEffect`, `useRef`  
- **Other Packages**: `lucide-react` (icons), `remark-gfm` (Markdown support)  

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd chai-aur-bot

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set your environment variable:

   ```bash
   GEMINI_API_KEY=<your-google-gemini-api-key>
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`.

---

## File Structure

```
/app
  /data
    personas.js          # Persona definitions (Hitesh Choudhary & Piyush Garg)
  /api
    gemini-chat/route.js # Backend API to fetch AI responses
  /components
    DualPersonaChat.js   # Main chat component
```

---

## Usage

* Type a message in the input box and press **Enter** or click the **Send** button.
* Switch between personas to receive answers in different teaching styles.
* AI responses can include **code snippets**, **Markdown**, and **emojis**.

---

## Dependencies

```bash
npm install react-markdown remark-gfm react-syntax-highlighter lucide-react
```

---

## License

This project is open-source and available under the MIT License.

---

## Future Enhancements

* Real-time streaming responses from Gemini AI
* Stream Response
* Multiple additional personas
* Dark/Light theme toggle
* Voice input and output
* Chat history and export
