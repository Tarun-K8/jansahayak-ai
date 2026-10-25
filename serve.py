#!/usr/bin/env python3
"""
JanSahayak AI - Python Static Server
Run with: python3 serve.py
"""
import http.server
import socketserver
import os

PORT = int(os.environ.get("PORT", 3000))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🇮🇳 JanSahayak AI Server running at: http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
