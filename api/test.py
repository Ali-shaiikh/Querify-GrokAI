from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'success',
        'message': 'Test API is working!'
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running'
    })

# Vercel serverless function handler
def handler(request, context):
    return app(request, context)

# Local development server
if __name__ == '__main__':
    app.run(debug=True, port=5000)
