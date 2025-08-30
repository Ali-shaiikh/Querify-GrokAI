from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from urllib.parse import parse_qs, urlparse

# Groq API Configuration
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

def query_groq(prompt, system_message="You are a helpful AI assistant."):
    """
    Query Groq API for text generation
    """
    try:
        if not GROQ_API_KEY:
            return "Error: GROQ_API_KEY environment variable is not set. Please configure your API key in Vercel."
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 1000,
            "top_p": 1,
            "stream": False
        }
        
        response = requests.post(GROQ_API_URL, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        elif response.status_code == 401:
            return "Error: Invalid GROQ API key. Please check your API key configuration."
        elif response.status_code == 429:
            return "Error: Rate limit exceeded. Please try again later."
        else:
            return f"Error: {response.status_code} - {response.text}"
            
    except Exception as e:
        return f"An exception occurred: {str(e)}"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if self.path == '/api/health':
            response = {
                'status': 'healthy', 
                'message': 'Backend is running',
                'provider': 'Groq API',
                'model': GROQ_MODEL,
                'api_key_set': bool(GROQ_API_KEY),
                'api_key_length': len(GROQ_API_KEY) if GROQ_API_KEY else 0
            }
        else:
            response = {
                'status': 'success',
                'message': 'API is working!',
                'path': self.path
            }
        
        self.wfile.write(json.dumps(response).encode())
        return

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            if self.path == '/api/generate-query':
                response = self.handle_generate_query(data)
            elif self.path == '/api/sql-help':
                response = self.handle_sql_help(data)
            else:
                response = {
                    'error': 'Unknown endpoint',
                    'path': self.path
                }
                
        except Exception as e:
            response = {
                'error': 'Request processing error',
                'details': str(e)
            }
        
        self.wfile.write(json.dumps(response).encode())
        return

    def handle_generate_query(self, data):
        try:
            question = data.get('question', '')
            csv_data = data.get('csvData', [])
            
            if not question or not csv_data:
                return {'error': 'Question and CSV data are required', 'success': False}
            
            # Create CSV preview without pandas
            if csv_data:
                preview_rows = csv_data[:3]  # First 3 rows
                csv_preview = "\n".join([str(row) for row in preview_rows])
            else:
                csv_preview = "No data available"
            
            # Create prompt with better instructions
            prompt = f"""You are a SQL expert. Generate ONLY the SQL query that directly answers the user's question.

CSV Data Sample:
{csv_preview}

User Question: {question}

Instructions:
1. Generate ONLY the SQL query - no explanations or extra text
2. Use the exact column names from the CSV data
3. Answer ONLY what the user asked for - don't add extra conditions
4. Keep it simple and direct
5. Return ONLY the SQL query, nothing else

SQL Query:"""
            
            # Get response from Groq
            sql_query = query_groq(prompt, "You are a SQL expert. Generate only SQL queries without any explanations.")
            
            # Check if there was an error with the API call
            if sql_query.startswith("Error:"):
                return {'error': sql_query, 'success': False}
            
            # Generate explanation
            explanation_prompt = f"""Explain this SQL query in a simple, structured way:

Query: {sql_query}

Format your response exactly like this:

What it does: [One sentence explaining what the query does]

How it works:
1. SELECT: [Explain what columns are being selected and why]
2. FROM: [Explain which table the data comes from]
3. WHERE: [Explain any filtering conditions, if present]

Keep explanations simple and clear."""
            
            explanation = query_groq(explanation_prompt, "You are a SQL educator. Explain SQL queries in simple, structured terms.")
            
            # Check if there was an error with the explanation
            if explanation.startswith("Error:"):
                explanation = "Query generated successfully, but explanation could not be generated."
            
            return {
                'sql': sql_query,
                'explanation': explanation,
                'success': True
            }
            
        except Exception as e:
            return {'error': str(e), 'success': False}

    def handle_sql_help(self, data):
        try:
            question = data.get('question', '')
            
            if not question:
                return {'error': 'Question is required', 'success': False}
            
            # Create a prompt for SQL help
            help_prompt = f"Provide a clear explanation and examples for: {question}"
            
            # Get response from Groq
            answer = query_groq(help_prompt, "You are a SQL expert and educator. Provide clear, helpful explanations with examples.")
            
            return {
                'answer': answer,
                'success': True
            }
            
        except Exception as e:
            return {'error': str(e), 'success': False}
