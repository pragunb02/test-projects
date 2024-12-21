try:
    import requests
except ImportError:
    print("Failed to import 'requests' module.")
    import os
    os.system("pip install requests")
import time

# List of URLs to refresh
urls = [
    "https://bookbazaar-duqs.onrender.com/",
    "https://nocapgaming.onrender.com/"
]

# Time interval (1 hour = 3600 seconds)
interval = 60

# Dictionary to track request counters for each URL
url_counters = {url: 0 for url in urls}

while True:
    for url in urls:
        try:
            url_counters[url] += 1  # Increment the counter for the current URL
            start_time = time.time()  # Record the start time
            # Send an HTTP GET request
            response = requests.get(url)
            end_time = time.time()  # Record the end time
            elapsed_time = end_time - start_time  # Calculate the elapsed time

            if response.status_code == 200:
                print(f"[{url_counters[url]}] Successfully refreshed: {url} (Time taken: {elapsed_time:.2f} seconds)")
            else:
                print(f"[{url_counters[url]}] Failed to refresh {url} - Status Code: {response.status_code} (Time taken: {elapsed_time:.2f} seconds)")
        except Exception as e:
            print(f"[{url_counters[url]}] Error refreshing {url}: {e}")
    
    # Wait for the next interval
    print(f"Waiting for {interval} seconds before refreshing again...")
    time.sleep(interval)
