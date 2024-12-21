try:
    import requests
except ImportError:
    print("Failed to import 'requests' module.")
    # Handle the error or exit the program
    import os
    os.system("pip install requests")
import time

# List of URLs to refresh
urls = [
    "https://bookbazaar-duqs.onrender.com/",
    "https://nocapgaming.onrender.com/"
]

# Time interval (1 hour = 3600 seconds)
interval = 12

while True:
    for url in urls:
        try:
            # Send an HTTP GET request
            response = requests.get(url)
            if response.status_code == 200:
                print(f"Successfully refreshed: {url}")
            else:
                print(f"Failed to refresh {url} - Status Code: {response.status_code}")
        except Exception as e:
            print(f"Error refreshing {url}: {e}")
    
    # Wait for the next interval
    print(f"Waiting for {interval} seconds before refreshing again...")
    time.sleep(interval)
