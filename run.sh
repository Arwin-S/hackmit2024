#!/bin/bash
cd backend
python server.py
sleep 5
cd ../frontend
npm run dev
