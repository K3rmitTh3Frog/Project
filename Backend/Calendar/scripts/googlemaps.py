import requests

def get_directions(origin, destination, mode):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "key": "AIzaSyCk5ym1cOlYf3-t3Feeddjq3QiFQhUSlTw"  # Replace with your actual API key
    }
    response = requests.get(url, params=params)
    directions = response.json()
    return directions

def get_duration(origin, destination, mode):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "key": "AIzaSyCk5ym1cOlYf3-t3Feeddjq3QiFQhUSlTw"  # Use the API key from the environment variable
    }
    response = requests.get(url, params=params)
    directions = response.json()

    # Check if the response status is "OK"
    if directions["status"] == "OK":
        # Ensure the expected path exists in the response to avoid KeyError
        if "routes" in directions and directions["routes"] and "legs" in directions["routes"][0]:
            duration = directions["routes"][0]["legs"][0]["duration"]["text"]
            return duration
        else:
            return "Valid response but missing expected data"
    else:
        # Return the error status or a generic error message
        return directions.get("error_message", "Error in fetching directions")