# 🚀 Querify - AI-Powered SQL Query Generator

A modern, professional React application that transforms your data questions into SQL queries using AI. Built with React, Tailwind CSS, and powered by Ollama.

![Querify](https://img.shields.io/badge/Querify-AI%20SQL%20Generator-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.2-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality
- **📁 Drag & Drop File Upload** - Upload CSV files with beautiful drag-and-drop interface
- **🤖 AI-Powered Query Generation** - Ask questions in natural language, get SQL queries
- **📊 Interactive Data Preview** - View and analyze your data with sorting and filtering
- **📚 Query Templates** - Pre-built SQL templates for common operations
- **📈 Real-time Statistics** - Comprehensive data analysis and insights
- **💾 Query History** - Save and manage all generated queries
- **🔍 SQL Help System** - Get explanations and help with SQL concepts

### 🎨 Professional UI/UX
- **🌈 Beautiful Gradient Design** - Modern glassmorphism effects
- **📱 Fully Responsive** - Works perfectly on all devices
- **⚡ Smooth Animations** - Framer Motion powered transitions
- **🎯 Intuitive Navigation** - Tab-based interface with sidebar
- **🔔 Toast Notifications** - Real-time feedback and alerts
- **🌙 Dark/Light Theme Ready** - Easy theme customization

### 🔧 Advanced Features
- **📋 Copy to Clipboard** - One-click SQL query copying
- **💾 Export Functionality** - Download queries as SQL files
- **🔍 Search & Filter** - Find queries quickly in history
- **⚙️ Settings Management** - Customize app behavior
- **📊 Data Analytics** - Column type detection and statistics
- **🔄 Auto-save** - Never lose your work

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Dropzone** - File upload functionality
- **React Hot Toast** - Toast notifications
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Beautiful icons

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Requests** - HTTP client for API calls
- **Pandas** - Data manipulation and analysis
- **Groq API** - Fast cloud-based LLM service

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Groq API Key (for AI functionality)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Querify-main
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Groq API (Required for AI features)
```bash
# Set your Groq API key as environment variable
export GROQ_API_KEY=your_groq_api_key_here

# Or add it to your .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
```

### 5. Start the Backend
```bash
python backend_api.py
```

### 6. Start the Frontend
```bash
npm start
```

### 7. Open Your Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
Querify-main/
├── src/
│   ├── components/
│   │   ├── Header.js          # Main header component
│   │   ├── Sidebar.js         # Navigation sidebar
│   │   ├── MainContent.js     # Main content area
│   │   ├── FileUpload.js      # File upload component
│   │   ├── DataPreview.js     # Data preview table
│   │   ├── QueryGenerator.js  # AI query generation
│   │   ├── QueryHistory.js    # Query history management
│   │   └── StatsDashboard.js  # Data statistics
│   ├── context/
│   │   └── AppContext.js      # Global state management
│   ├── App.js                 # Main app component
│   ├── index.js               # App entry point
│   └── index.css              # Global styles
├── public/
│   └── index.html             # HTML template
├── backend_api.py             # Flask backend API
├── package.json               # Frontend dependencies
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

## 🎯 Usage Guide

### 1. Upload Your Data
- Drag and drop a CSV file onto the upload area
- Or click to browse and select a file
- View data statistics and preview

### 2. Generate SQL Queries
- Navigate to the "Generate Queries" tab
- Ask questions about your data in natural language
- Get AI-generated SQL queries with explanations
- Use sample questions for inspiration

### 3. Explore Your Data
- Use the "Data Preview" tab to explore your data
- Sort and filter columns
- Search through your data
- Export data as needed

### 4. Manage Query History
- View all generated queries in the "Query History" tab
- Search and filter through your query history
- Copy or download individual queries
- Export all queries as a single file

### 5. Use Query Templates
- Access pre-built SQL templates from the sidebar
- Templates for common operations like:
  - Show top 10 records
  - Count total records
  - Find duplicates
  - Calculate averages
  - Filter by date

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_OLLAMA_URL=http://localhost:11434
```

### Customization
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Animations**: Adjust Framer Motion settings in components
- **API Endpoints**: Update API calls in components
- **Styling**: Customize CSS classes in `src/index.css`

## 🚀 Deployment

### Frontend (React)
```bash
# Build for production
npm run build

# Serve with a static server
npx serve -s build
```

### Backend (Flask)
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend_api:app
```

### Docker Deployment
```dockerfile
# Frontend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** - For providing the local LLM runtime
- **LangChain** - For AI/LLM integration tools
- **React Community** - For the amazing ecosystem
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Made with ❤️ by the Querify Team**

*Transform your data questions into powerful SQL queries with AI!*
