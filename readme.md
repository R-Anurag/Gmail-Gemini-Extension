# Gemini in Gmail ✨

A lightweight **browser extension + Spring Boot backend** that turns Google Gemini into your personal Gmail sidekick. It helps you draft replies directly in Gmail with one click, in the tone you choose — **Formal, Casual, Friendly, or even Custom**.

---

## Features
- **AI Reply Button** inside Gmail’s compose toolbar  
- **Animated gradient button** with dropdown tone selector  
- **Custom tone support** — define your own style of reply  
- **Spring Boot backend** that securely connects to the Gemini API  
- Real-time drafting based on the original email content  
- Identity guardrails — replies are always written as *you*, never roleplay  

---

## Project Structure
```
gemini-in-gmail/
 ├── extension/              # Browser extension (content script, manifest, assets)
 │   ├── content-script.js
 │   ├── manifest.json
 │   ├── icons/
 │   └── ...
 ├── server/                 # Spring Boot backend
 │   ├── src/main/java/com/email/writer/
 │   │   ├── EmailWriterSbApplication.java
 │   │   ├── EmailGeneratorController.java
 │   │   ├── EmailGeneratorService.java
 │   │   └── EmailRequest.java
 │   └── src/main/resources/
 │       └── application.properties
 ├── pom.xml                 # Maven configuration for backend
 └── README.md
```

---

## Setup Instructions

### 1. Backend (Spring Boot)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gemini-in-gmail.git
   cd gemini-in-gmail/server
   ```
2. Configure `src/main/resources/application.properties`:
   ```properties
   gemini.api.url=https://generativelanguage.googleapis.com
   gemini.api.key=YOUR_API_KEY
   gemini.api.model=gemini-2.0-flash
   ```
3. Run the backend:
   ```bash
   mvn spring-boot:run
   ```
   By default it runs on `http://localhost:8080`.

---

### 2. Browser Extension
1. Navigate to `gemini-in-gmail/extension/`.  
2. Open **Chrome** → go to `chrome://extensions/`.  
3. Enable **Developer Mode** (toggle in top-right).  
4. Click **Load Unpacked** → select the `extension/` folder.  
5. Open Gmail, start a reply, and click the ✨ **AI Reply** button.

---

## API Reference
### Endpoint
`POST /api/email/generate`

### Request Body
```json
{
  "emailContent": "The original email you are replying to...",
  "tone": "Formal"
}
```

### Response
```json
"Generated reply text here..."
```

---

## Security Notes
- Do **not** commit your Gemini API key to version control.  
- Restrict `@CrossOrigin` in production to only your extension domain.  
- For deployments, configure environment variables instead of hardcoding keys.

---

## Future Improvements
- Error-handling UI in the extension (show fallback messages).  
- Support for multiple languages.  
- Optional Gmail compose integration (new drafts, not just replies).  
- Settings page for API endpoint configuration.

---

## Working Screenshots
<img width="1911" height="861" alt="image" src="https://github.com/user-attachments/assets/d14f560f-c5de-4152-a915-575c811c39fe" /> 
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/42d2dc2a-c701-44f5-800b-85be8b016037" /> 
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/925074cd-5223-48f7-9e62-0a5110dc3ca0" /> 
<img width="1918" height="868" alt="image" src="https://github.com/user-attachments/assets/3ce5c98f-9f05-4cb0-8f17-24636fee1a8e" /> 
<img width="1813" height="856" alt="image" src="https://github.com/user-attachments/assets/24ebc17e-415d-493e-9f02-4453e4abefb8" />

---
