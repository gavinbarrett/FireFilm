#!/usr/bin/env python3
import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from src.steg import decode

print(decode(sys.argv[1]))
