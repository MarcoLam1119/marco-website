import openai
  
client = openai.OpenAI(
    api_key="YOUR_POE_API_KEY", # or os.getenv("POE_API_KEY")
    base_url="https://api.poe.com/v1",
)
  
chat = client.chat.completions.create(
    model="Assistant",
    messages=[{"role": "user", "content": "Hello world"}],
)
print(chat.choices[0].message.content)