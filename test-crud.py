import requests
import logging
import time

# Configure logging to save to a file (with UTF-8 encoding) and output to the console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("api_test.log", encoding="utf-8"),
        logging.StreamHandler()
    ]
)

BASE_URL = "https://cse341-0zfq.onrender.com/contacts"


def test_api():
    logging.info("--- STARTING CRUD API TESTS ---")
    contact_id = None

    # 1. CREATE (POST)
    logging.info("Testing POST (Create)...")
    new_contact = {
        "firstName": "Test",
        "lastName": "User",
        "email": "test.user@example.com",
        "favoriteColor": "blue",
        "birthday": "1990-01-01"
    }

    try:
        post_response = requests.post(BASE_URL, json=new_contact)
        if post_response.status_code in [200, 201]:
            response_data = post_response.json()
            logging.info(f"✅ POST successful: {response_data}")
            # Extract the ID depending on how your API returns it (e.g., {"id": "..."} or {"_id": "..."})
            contact_id = response_data.get("_id") or response_data.get("id")
        else:
            logging.error(
                f"❌ POST failed. Status: {post_response.status_code}")
            logging.error(f"Response: {post_response.text}")
            return  # Stop execution if we can't create a record
    except Exception as e:
        logging.error(f"POST request encountered an error: {e}")
        return

    time.sleep(1)  # Small delay to ensure database consistency

    # 2. READ (GET Single)
    if contact_id:
        logging.info(f"Testing GET (Read Single) for ID: {contact_id}...")
        get_response = requests.get(f"{BASE_URL}/{contact_id}")
        if get_response.ok:
            logging.info(f"✅ GET Single successful: {get_response.json()}")
        else:
            logging.error(
                f"❌ GET Single failed. Status: {get_response.status_code}")

    time.sleep(1)

    # 3. UPDATE (PUT)
    if contact_id:
        logging.info(f"Testing PUT (Update) for ID: {contact_id}...")
        updated_contact = {
            "firstName": "Test Updated",
            "lastName": "User",
            "email": "updated.user@example.com",
            "favoriteColor": "red",
            "birthday": "1990-01-01"
        }
        put_response = requests.put(
            f"{BASE_URL}/{contact_id}", json=updated_contact)
        if put_response.ok:
            logging.info("✅ PUT successful.")
        else:
            logging.error(f"❌ PUT failed. Status: {put_response.status_code}")

    time.sleep(1)

    # 4. DELETE
    if contact_id:
        logging.info(f"Testing DELETE for ID: {contact_id}...")
        delete_response = requests.delete(f"{BASE_URL}/{contact_id}")
        if delete_response.ok:
            logging.info("✅ DELETE successful.")
        else:
            logging.error(
                f"❌ DELETE failed. Status: {delete_response.status_code}")

    logging.info("--- CRUD API TESTS COMPLETE ---")


if __name__ == "__main__":
    test_api()
