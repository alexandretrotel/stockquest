#!/bin/bash
uv pip compile pyproject.toml -o requirements.txt
echo "Requirements file generated successfully"