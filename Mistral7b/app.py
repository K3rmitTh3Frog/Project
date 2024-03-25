# Example: reuse your existing OpenAI setup
from openai import OpenAI
from flask import Flask, request, jsonify

app = Flask(__name__)

# Point to the local server

client = OpenAI(base_url="http://localhost:1234/v1", api_key="not-needed")

prompts = [
    "You are a project manager that prioritizes tasks based on priority",
    "Base all your answers into summarized bullet points without new lines and without in depth explanation I only want the answer with no explanation",
    "Format your answer with each task on a new line", 
    "I want you to always format based on importance.",
    "Rank them according to their importance so just have the answers like Task1 Task2 where Task1 is more important than Task2",
    "Include the date and time for the task",
    "keep the date and time at the end of the message as iso format",
    "Be able to identify a task from a normal message",
    "Strictly keep one new line between each task",
]

@app.route("/api/chat",methods=["POST"])
def chat_with_AI():
    print(". ".join(prompts))
    data = request.json
    if data is None:
        return jsonify({"message":"Data must be JSON"}),400
    messages = data.get("messages")
    if not isinstance(messages, list):
        return jsonify({'error': 'Request body must contain a JSON array'}), 400
    if len(messages) == 0:
      response_data = {"message":"Messages can't be empty!"}
      return jsonify(response_data),400
    completion = client.chat.completions.create(
      model="local-model", # this field is currently unused
      messages = [
        {"role": "system", "content": " ".join(prompts)},
        {"role": "user", "content": ". ".join(messages)},
      ],
      temperature=0.7,
    ) 
    response_data = {"data":completion.choices[0].message.content}
    return jsonify(response_data),200 

if __name__ == '__main__':
    app.run(debug=True)
