from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask
from flask_cors import CORS
from processing import bp as processing_bp

app = Flask(__name__)

allowed_origins = [
    "https://zapply-cyan.vercel.app",
    # "http://localhost:5173/",
    os.environ.get("FRONTEND_URL", ""),
]

CORS(app, resources={
    r"/api/*": {
        "origins": allowed_origins
    }
})

app.register_blueprint(processing_bp)

if __name__ == '__main__':
    app.run(debug=True)