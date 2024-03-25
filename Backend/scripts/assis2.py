import sys
import openai

# Initialize the OpenAI client with your API key
openai.api_key = "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"

def submit_message(user_message):
    """
    Submit a message to the assistant.
    """
    response = openai.ChatCompletion.create(
        model="text-davinci-002",
        messages=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": user_message}],
        max_tokens=100
    )
    return response.choices[0].message["content"]

if __name__ == "__main__":
    # Check if command-line arguments are provided
    if len(sys.argv) < 3:
        print("Usage: python assis.py <email_body> <received_date>")
        sys.exit(1)

    # Extract email body and received date from command-line arguments
    email_body = sys.argv[1]
    received_date = sys.argv[2]

    # Submit the email body to the assistant
    response = submit_message(email_body)

    # Output the response
    print(response)
