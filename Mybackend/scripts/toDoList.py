import openai

# Initialize your OpenAI API key
openai.api_key = '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'

def process_email_with_chatgpt(email_content):
    # Crafting a detailed prompt for the AI
    detailed_prompt = (
        "You are a highly efficient assistant. From the following email, "
        "extract any tasks mentioned, including their priority, which should be inferred from the urgency in the text. "
        "Estimate the time needed to complete each task based on the details provided. "
        "Format the output with the following fields for each task: Priority (High, Medium, Low), "
        "Due Date, Description, Category, Notes, Time Estimate, Reminders, and set the Status as 'Not Started'.\n\n"
        f"Email Content:\n{email_content}\n\n"
        "Extracted Tasks:"
    )

    response = openai.Completion.create(
    engine="gpt-3.5-turbo-16k",  # Update this to the latest model version
    prompt=detailed_prompt,
    temperature=0.5,
    max_tokens=1500,
    n=1,
    stop=None
)

    return response['choices'][0]['text'].strip()



# Example email content
email_content = """
Dear team,
Please remember to update the project plan and review the latest client feedback by next Monday.
Also, schedule a team meeting for Thursday to discuss the project milestones. It's crucial we meet the Q3 release date without further delays.
"""

# Process the email and extract to-do list
to_do_list = process_email_with_chatgpt(email_content)

print("Extracted To-Do List:")
print(to_do_list)
