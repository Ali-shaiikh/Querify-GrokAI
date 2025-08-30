from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
import os
import requests
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

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

@app.route('/api/generate-query', methods=['POST'])
def generate_query():
    try:
        data = request.get_json()
        question = data.get('question', '')
        csv_data = data.get('csvData', [])
        
        if not question or not csv_data:
            return jsonify({'error': 'Question and CSV data are required'}), 400
        
        # Convert CSV data to pandas DataFrame
        df = pd.DataFrame(csv_data)
        
        # Create CSV preview
        csv_preview = df.head().to_string(index=False)
        
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
            return jsonify({
                'error': sql_query,
                'success': False
            }), 500
        
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
        
        return jsonify({
            'sql': sql_query,
            'explanation': explanation,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sql-help', methods=['POST'])
def sql_help():
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
        
        # Create a prompt for SQL help
        help_prompt = f"Provide a clear explanation and examples for: {question}"
        
        # Get response from Groq
        answer = query_groq(help_prompt, "You are a SQL expert and educator. Provide clear, helpful explanations with examples.")
        
        return jsonify({
            'answer': answer,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and file.filename.endswith('.csv'):
            # Read CSV directly from memory
            df = pd.read_csv(file)
            preview = df.head(10).to_dict('records')
            
            return jsonify({
                'success': True,
                'preview': preview,
                'total_rows': len(df),
                'columns': df.columns.tolist()
            })
        else:
            return jsonify({'error': 'Invalid file type. Please upload a CSV file.'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'message': 'Backend is running',
        'provider': 'Groq API',
        'model': GROQ_MODEL,
        'api_key_set': bool(GROQ_API_KEY),
        'api_key_length': len(GROQ_API_KEY) if GROQ_API_KEY else 0
    })

# Vercel serverless function handler
def handler(request, context):
    return app(request, context)

# Local development server
if __name__ == '__main__':
    print("Starting Querify Backend with Groq API...")
    print("Make sure GROQ_API_KEY environment variable is set")
    print("API will be available at http://localhost:5000")
    app.run(debug=True, port=5000)
