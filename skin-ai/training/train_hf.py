import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import models, transforms
from datasets import load_dataset
from PIL import Image

def train_hf_model():
    print("Loading PAD-UFES-20 from Hugging Face Datasets...")
    try:
        # Load the public dataset from Hugging Face
        dataset = load_dataset("SalmaneExploring/pad-ufes-20", split="train[:10]")
    except Exception as e:
        print("Failed to load Hugging Face dataset. Ensure you ran: pip install datasets")
        print(f"Error: {e}")
        return

    # Define standard PyTorch transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Convert HF dataset into a PyTorch-compatible format
    def transform_batch(batch):
        # Apply transformation to the "image" column
        batch["pixel_values"] = [transform(img.convert("RGB")) for img in batch["image"]]
        return batch

    dataset.set_transform(transform_batch)
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

    # Initialize EfficientNet-B0 and modify the classifier for 6 output classes
    print("Building EfficientNet model...")
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    num_ftrs = model.classifier[1].in_features
    # PAD-UFES-20 typically has 6 classes (ACK, BCC, MEL, NEV, SCC, SEK)
    model.classifier[1] = nn.Linear(num_ftrs, 6)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    print(f"Starting actual training on {device}...")
    model.train()
    
    for epoch in range(1):
        running_loss = 0.0
        for batch_idx, batch in enumerate(dataloader):
            inputs = torch.stack(batch["pixel_values"]).to(device)
            # Adjust 'label' to match whatever the target column is named in the HF repo
            labels = torch.tensor(batch["label"]).to(device) 
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            if batch_idx % 10 == 0:
                print(f"Epoch {epoch+1} | Batch {batch_idx}/{len(dataloader)} | Loss: {loss.item():.4f}")

    save_path = os.path.join(os.path.dirname(__file__), "..", "models", "efficientnet_b0_skin.pth")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    torch.save(model.state_dict(), save_path)
    print(f"HF Trained Model successfully saved to {save_path}!")

if __name__ == "__main__":
    train_hf_model()
