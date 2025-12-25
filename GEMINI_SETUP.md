# Google Gemini 2.0 Flash API Setup Instructions

## Step 1: Get Your API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Configure the API Key
1. Open the `.env` file in the project root
2. Replace `your_api_key_here` with your actual API key:
   ```
   VITE_GOOGLE_GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
   ```
3. Save the file

## Step 3: Restart the Development Server
1. Stop the current server (Ctrl+C in terminal)
2. Start it again with `npm run dev`
3. The chatbot will now use Google Gemini 2.0 Flash AI

## Gemini 2.0 Flash Model Features
- **Next-generation AI model** with enhanced reasoning capabilities
- **Lightning-fast responses** optimized for interactive chat
- **Superior context understanding** for complex questions
- **More natural conversations** with improved coherence
- **Enhanced multimodal capabilities** and better accuracy
- **Efficient token usage** for cost-effective operation
- **Optimized for real-time interactions** in kiosk environments

## API Key Status
- Green dot (pulsing) = Gemini 2.0 active
- Yellow dot = Basic fallback mode (API key not configured)

## Security Note
- Never commit the `.env` file with real API keys to version control
- The `.env` file should be added to `.gitignore`
- API keys should be kept private and secure