#!/bin/bash

# PaDEL Descriptor calculation script
# Expects molecule.smi in data/processed directory
# Outputs descriptors_output.csv in data/processed directory

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATA_DIR="$PROJECT_ROOT/data/processed"

# Ensure data directory exists
mkdir -p "$DATA_DIR"

# Run PaDEL-Descriptor
java -Xms1G -Xmx1G -Djava.awt.headless=true -jar "$SCRIPT_DIR/PaDEL-Descriptor/PaDEL-Descriptor.jar" \
    -removesalt \
    -standardizenitro \
    -fingerprints \
    -descriptortypes "$SCRIPT_DIR/PaDEL-Descriptor/PubchemFingerprinter.xml" \
    -dir "$DATA_DIR" \
    -file "$DATA_DIR/descriptors_output.csv"
