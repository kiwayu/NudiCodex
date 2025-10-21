# Data Directory

This directory contains datasets and machine learning models for nudibranch species identification.

## Structure

```
data/
├── raw/              # Raw, unprocessed data
├── processed/        # Cleaned and preprocessed data
├── models/          # Trained ML models
│   ├── weights/     # Model weights
│   └── configs/     # Model configurations
└── README.md        # This file
```

## Dataset Organization

### Raw Data (`/raw`)
- Original images
- Species labels
- Metadata files

### Processed Data (`/processed`)
- Preprocessed images (resized, normalized)
- Train/validation/test splits
- Augmented datasets

### Models (`/models`)
- Trained model files (*.h5, *.pt, *.onnx)
- Model weights
- Configuration files
- Training logs

## Data Sources

[Document your data sources here]

## Model Information

### Current Models

1. **nudibranch_classifier_v1.h5**
   - Architecture: [e.g., ResNet50, EfficientNet]
   - Input size: [e.g., 224x224]
   - Number of classes: [e.g., 50 species]
   - Accuracy: [e.g., 92%]

## Data Privacy

⚠️ **Important**: Do not commit large files or sensitive data to the repository.

- Use Git LFS for large files
- Consider using DVC (Data Version Control)
- Store sensitive data securely

## Usage

### Loading a Model

```python
from tensorflow import keras

model = keras.models.load_model('data/models/nudibranch_classifier_v1.h5')
```

### Preprocessing Data

```python
# Example preprocessing pipeline
# Add your preprocessing code here
```

