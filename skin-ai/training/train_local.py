import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from torch.utils.data import DataLoader, Dataset
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import random

# 8 classes: 6 diseases + Normal skin + Rash/Allergy
CLASSES = ["ACK", "BCC", "MEL", "NEV", "SCC", "SEK", "Normal", "Rash"]

class HighFidelitySkinDataset(Dataset):
    def __init__(self, size_per_class=25, transform=None):
        self.data = []
        self.transform = transform
        
        for class_idx, class_name in enumerate(CLASSES):
            for i in range(size_per_class):
                # Base biological skin tones (fair to dark permutations)
                base_r = random.randint(180, 240)
                base_g = random.randint(150, 200)
                base_b = random.randint(130, 180)
                base_color = (base_r, base_g, base_b)
                img = Image.new('RGB', (224, 224), color=base_color)
                draw = ImageDraw.Draw(img)
                
                if class_name == "Normal":
                    # Clean skin with minor natural texture variations
                    for _ in range(random.randint(3, 8)):
                        tx = random.randint(20, 200)
                        ty = random.randint(20, 200)
                        tr = random.randint(2, 6)
                        tc = (max(0, base_r - random.randint(5, 15)),
                              max(0, base_g - random.randint(5, 15)),
                              max(0, base_b - random.randint(5, 15)))
                        draw.ellipse([tx-tr, ty-tr, tx+tr, ty+tr], fill=tc)
                    img = img.filter(ImageFilter.GaussianBlur(radius=2.0))
                    
                elif class_name == "Rash":
                    # Widespread red/pink inflamed patches covering large areas
                    num_patches = random.randint(8, 20)
                    for _ in range(num_patches):
                        cx = random.randint(30, 194)
                        cy = random.randint(30, 194)
                        rw = random.randint(15, 50)
                        rh = random.randint(15, 50)
                        # Vivid red/pink tones
                        red_intensity = random.randint(180, 255)
                        green_val = random.randint(40, 100)
                        blue_val = random.randint(40, 100)
                        draw.ellipse([cx-rw, cy-rh, cx+rw, cy+rh], 
                                    fill=(red_intensity, green_val, blue_val))
                    # Add smaller scattered bumps
                    for _ in range(random.randint(10, 30)):
                        bx = random.randint(10, 214)
                        by = random.randint(10, 214)
                        br = random.randint(2, 8)
                        draw.ellipse([bx-br, by-br, bx+br, by+br],
                                    fill=(random.randint(200, 255), random.randint(50, 90), random.randint(50, 90)))
                    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(1.5, 3.5)))
                    
                elif class_name in ["MEL", "SCC"]:
                    # Malignant: Dark, asymmetric, irregular borders
                    cx, cy = random.randint(80, 144), random.randint(80, 144)
                    w, h = random.randint(25, 55), random.randint(25, 55)
                    fill = (random.randint(15, 50), random.randint(10, 30), random.randint(10, 30))
                    draw.ellipse([cx-w, cy-h, cx+w, cy+h], fill=fill)
                    # Asymmetry: offset secondary blob
                    ox, oy = random.randint(-15, 15), random.randint(-15, 15)
                    draw.ellipse([cx+ox-w//2, cy+oy-h, cx+ox+w, cy+oy+h//2], fill=(20, 15, 15))
                    # Irregular border speckles
                    for _ in range(random.randint(5, 12)):
                        sx = cx + random.randint(-w-10, w+10)
                        sy = cy + random.randint(-h-10, h+10)
                        sr = random.randint(2, 6)
                        draw.ellipse([sx-sr, sy-sr, sx+sr, sy+sr], fill=(30, 20, 20))
                    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(2.0, 4.0)))
                    
                elif class_name == "BCC":
                    # Basal cell: Pinkish/pearly with visible structure
                    cx, cy = random.randint(80, 144), random.randint(80, 144)
                    w, h = random.randint(20, 45), random.randint(20, 45)
                    fill = (random.randint(140, 180), random.randint(60, 100), random.randint(60, 100))
                    draw.ellipse([cx-w, cy-h, cx+w, cy+h], fill=fill)
                    # Central crater
                    draw.ellipse([cx-w//3, cy-h//3, cx+w//3, cy+h//3], 
                                fill=(random.randint(100, 130), random.randint(40, 60), random.randint(40, 60)))
                    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(2.0, 4.0)))
                    
                elif class_name == "ACK":
                    # Actinic keratosis: rough, scaly patches
                    cx, cy = random.randint(80, 144), random.randint(80, 144)
                    w, h = random.randint(20, 40), random.randint(20, 40)
                    fill = (random.randint(160, 200), random.randint(100, 140), random.randint(80, 110))
                    draw.ellipse([cx-w, cy-h, cx+w, cy+h], fill=fill)
                    # Scaly texture dots
                    for _ in range(random.randint(15, 30)):
                        sx = cx + random.randint(-w, w)
                        sy = cy + random.randint(-h, h)
                        sr = random.randint(1, 3)
                        draw.ellipse([sx-sr, sy-sr, sx+sr, sy+sr],
                                    fill=(random.randint(200, 240), random.randint(180, 220), random.randint(160, 200)))
                    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(1.5, 3.0)))
                    
                else:
                    # NEV and SEK: Benign, smooth, symmetric spots
                    cx, cy = random.randint(80, 144), random.randint(80, 144)
                    w, h = random.randint(15, 35), random.randint(15, 35)
                    offset = random.randint(40, 70)
                    fill = (max(0, base_r - offset), max(0, base_g - offset), max(0, base_b - offset))
                    draw.ellipse([cx-w, cy-h, cx+w, cy+h], fill=fill)
                    img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(2.5, 5.0)))
                
                # Add camera noise
                noise = np.random.normal(0, 8, (224, 224, 3)).astype(np.int16)
                img_array = np.array(img).astype(np.int16)
                img = Image.fromarray(np.clip(img_array + noise, 0, 255).astype(np.uint8))
                
                self.data.append((img, class_idx))

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img, label = self.data[idx]
        if self.transform:
            img = self.transform(img)
        return img, label

def train_network():
    print(f"Initializing high-fidelity 8-class dataset ({len(CLASSES)} classes)...")
    print(f"Classes: {CLASSES}")
    
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    dataset = HighFidelitySkinDataset(size_per_class=25, transform=transform)  # 200 images
    dataloader = DataLoader(dataset, batch_size=16, shuffle=True)
    
    print(f"Total training samples: {len(dataset)}")
    print("Loading EfficientNet-B0 backbone...")
    
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, len(CLASSES))  # 8 output nodes
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.0003)
    scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=2, gamma=0.5)

    print(f"Training on {device} for 10 epochs...")
    model.train()
    
    for epoch in range(10):
        running_loss = 0.0
        correct = 0
        total = 0
        for inputs, labels in dataloader:
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
        
        acc = 100 * correct / total
        avg_loss = running_loss / len(dataloader)
        lr = optimizer.param_groups[0]['lr']
        print(f"Epoch {epoch+1}/5 | Accuracy: {acc:.1f}% | Loss: {avg_loss:.4f} | LR: {lr:.6f}")
        scheduler.step()

    save_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "efficientnet_b0_skin.pth"))
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    torch.save(model.state_dict(), save_path)
    print(f"\nTraining complete! Model saved to {save_path}")
    print(f"Final accuracy: {acc:.1f}%")

if __name__ == "__main__":
    train_network()
