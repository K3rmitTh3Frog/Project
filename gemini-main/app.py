import json
import google.generativeai as genai
from flask import Flask,request,jsonify
# import requests
genai.configure(api_key = "")

model = genai.GenerativeModel('gemini-pro')

safety_settings = [
    {
        "category":"HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold":"BLOCK_NONE"
    }, 
    {
        "category":"HARM_CATEGORY_HATE_SPEECH",
        "threshold":"BLOCK_NONE"
    }, 
    {
        "category":"HARM_CATEGORY_HARASSMENT",
        "threshold":"BLOCK_NONE"
    }, 
    {
        "category":"HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold":"BLOCK_NONE"
    }
]

app = Flask(__name__)

@app.route("/api/chat",methods=["POST"])
def chat_ai():
    

    data = request.json

    if data is None:
        return jsonify({"message":"Data must be JSON"}),400

    message = data.get("message")

    if message is None:
        return jsonify({"message":"Message must exist"}),400

    if not isinstance(message,str):
        return jsonify({'error': 'Message must be of type string'}), 400

    if len(message) == 0:
        return jsonify({'error': 'Message must not be empty'}), 400    

    response = model.generate_content(message,
    safety_settings=safety_settings,
        generation_config = genai.types.GenerationConfig(
        candidate_count = 1,
        stop_sequences = ['.'],
        max_output_tokens = 40,
        top_p = 0.6,
        top_k = 5,
        temperature = 0.8)
    )

    if response is None:
        return jsonify({"message":"An error has occured, please try again later!"}),500
   
    text = response.text

    if text is None or len(text) == 0:
        return jsonify({"message":"An error has occured, please try again later!"}),500
    
    return jsonify({"data":text}),201

if __name__ == '__main__':
    app.run(debug=True,port=5000)
