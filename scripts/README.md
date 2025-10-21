# Scripts Directory

Automation and utility scripts for the NudibranchID.io project.

## Available Scripts

### Data Processing
- `preprocess_data.py` - Data preprocessing pipeline
- `augment_images.py` - Image augmentation
- `split_dataset.py` - Train/validation/test split

### Model Training
- `train_model.py` - Model training script
- `evaluate_model.py` - Model evaluation
- `export_model.py` - Export model for deployment

### Deployment
- `deploy.sh` - Deployment automation
- `backup_db.sh` - Database backup
- `migrate_db.py` - Database migrations

### Utilities
- `download_data.py` - Download datasets
- `clean_data.py` - Data cleaning utilities
- `check_health.py` - Health check script

## Usage

### Data Preprocessing

```bash
python scripts/preprocess_data.py --input data/raw --output data/processed
```

### Model Training

```bash
python scripts/train_model.py --config configs/model_config.yaml
```

### Deployment

```bash
bash scripts/deploy.sh production
```

## Development

### Creating New Scripts

1. Add your script to the appropriate category
2. Include docstrings and comments
3. Add command-line argument parsing
4. Update this README with usage instructions

### Best Practices

- Use argparse for command-line arguments
- Include error handling
- Log important operations
- Make scripts idempotent when possible
- Add progress indicators for long operations

