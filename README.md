# Mini Diary

A secure, private journaling web application with AI insights built using React and Firebase.

## Features

- 📝 Rich text diary entries
- 🔒 End-to-end encryption
- 🤖 AI-powered insights (using WebLLM)
- 🌙 Dark/Light mode
- 📅 Calendar view
- 🔍 Search functionality
- 📱 Responsive design

## Security Features

- AES-GCM encryption with 256-bit keys
- Client-side encryption/decryption
- Local AI processing
- No tracking or analytics
- Open source for transparency

## Tech Stack

- React
- TypeScript
- Firebase (Authentication & Storage)
- Tailwind CSS
- Lucide Icons
- WebLLM

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mini-diary-webapp.git
   cd mini-diary-webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[Quentin Romero Lauro](https://quentinromerolauro.com) 