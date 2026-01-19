import json

with open("firebase-service-account.json") as f:
    data = json.load(f)

print(json.dumps(data))  # This prints JSON as a single line with escaped newlines
