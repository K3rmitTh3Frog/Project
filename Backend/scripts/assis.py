from openai import OpenAI
import time

# Initialize the OpenAI client with your API key
client = OpenAI(api_key="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")  # Replace YOUR_API_KEY_HERE with your actual API key

assistant_id = "asst_S508t24Tz9JLYmIs5TrnP7m4"  # The ID of your Assistant

def submit_message(assistant_id, thread_id, user_message):
    """
    Submit a message to the assistant and start a new Run.
    """
    # Create a message in the thread
    client.beta.threads.messages.create(
        thread_id=thread_id, role="user", content=user_message
    )
    # Start a new run with the assistant
    return client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id,
    )

def get_response(thread_id):
    """
    Get the list of messages in a thread.
    """
    return client.beta.threads.messages.list(thread_id=thread_id, order="asc")

def create_thread_and_run(user_input):
    """
    Create a new thread and submit the user input to it.
    """
    # Create a new thread
    thread = client.beta.threads.create()
    # Submit the user message and start a new run
    run = submit_message(assistant_id, thread.id, user_input)
    return thread, run

def wait_on_run(run, thread):
    """
    Wait for a run to complete and then get the response.
    """
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.1)
    return run
def pretty_print(messages):
    """
    Pretty print the messages from a thread, correctly accessing message attributes.
    """
    print("# Messages")
    for m in messages:
        # Check if there is content and it's a non-empty list
        if m.content and len(m.content) > 0:
            # Access the 'text' attribute of the first item in the 'content' list, then 'value'
            message_text = m.content[0].text.value
        else:
            message_text = "No content found"
        
        print(f"{m.role}: {message_text}")
    print()


# Input for testing
email_content = input("Enter the email content to create a to-do list: ")

# Create a thread and run with the given input
thread, run = create_thread_and_run(email_content)

# Wait for the run to complete
run = wait_on_run(run, thread)

# Retrieve and print the messages
messages = get_response(thread.id)
pretty_print(messages)
