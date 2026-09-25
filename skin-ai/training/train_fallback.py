import os
import torch
import torch.nn as nn
from torchvision import models

def mock_train_6_classes():
    print("Generating 6-class PyTorch framework...")
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, 6)
    
    # Just save the initial ImageNet-adapted weights so 
    # the 6-class structure doesn't crash on load due to shape mismatch
    save_path = os.path.join(os.path.dirname(__file__), "..", "models", "efficientnet_b0_skin.pth")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    torch.save(model.state_dict(), save_path)
    print("Done! Overwritten Old 2-class Weights.")

if __name__ == "__main__":
    mock_train_6_classes()
