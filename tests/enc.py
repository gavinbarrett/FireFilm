#!/usr/bin/env python3
import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from src.steg import init_encoding

jpg = './pulpfiction.png'
init_encoding(jpg)
