#!/usr/bin/env bash
set -o errexit

# Install latest pip first
pip install --upgrade pip

# Force install numpy & cython first
pip install numpy==1.26.4 Cython

# Then install everything else
pip install -r Backend/requirements.txt
