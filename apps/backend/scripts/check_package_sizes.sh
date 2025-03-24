#!/bin/bash

# activate virtual environment
source .venv/bin/activate

# list all installed packages
packages=$(pip freeze | cut -d'=' -f1)

# loop through each package and display its size
for package in $packages; do
    location=$(pip show $package | grep 'Location' | cut -d' ' -f2)
    package_path="$location/$package"
    if [ -d "$package_path" ]; then
        size=$(du -sh "$package_path" | cut -f1)
        echo "$package: $size"
    else
        echo "$package: Not found"
    fi
done

# check final size with du -sh
size=$(du -sh . | cut -f1)
echo "Total size: $size"