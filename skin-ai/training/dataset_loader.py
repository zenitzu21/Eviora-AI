import os
import requests

BASE_URL = "https://api.isic-archive.com/api/v2"

def fetch_image_metadata(limit=20):
    url = f"{BASE_URL}/images/"
    params = {
        "collections": "212",
        "limit": limit
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    return None

def download_images(output_dir="dataset", num_images=20):
    print(f"Downloading {num_images} images from ISIC for real training demo...")
    os.makedirs(output_dir, exist_ok=True)
    data = fetch_image_metadata(limit=num_images)
    
    if not data or 'results' not in data:
        print("Failed to fetch ISIC Data")
        return
        
    for index, item in enumerate(data['results']):
        image_id = item.get('isic_id')
        img_url = f"{BASE_URL}/images/{image_id}/download/"
        
        file_path = os.path.join(output_dir, f"{image_id}.jpg")
        if os.path.exists(file_path):
            continue
            
        print(f"Downloading {image_id}...")
        img_resp = requests.get(img_url)
        
        if img_resp.status_code == 200:
            with open(file_path, "wb") as f:
                f.write(img_resp.content)
        else:
            print(f"Failed {image_id}")

if __name__ == "__main__":
    download_images(num_images=20)
