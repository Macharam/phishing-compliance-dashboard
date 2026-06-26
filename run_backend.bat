@echo off
title PhishGuard Backend Server
echo Starting Python Flask Server...
echo Opening PhishGuard Dashboard...
start "" http://127.0.0.1:5000
python app.py
pause
