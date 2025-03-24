#!bin/bash
chmod +x scripts/generate-requirements.sh
sh scripts/generate-requirements.sh
black .
mypy .