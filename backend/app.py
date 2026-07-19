import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from processing import bp as processing_bp

load_dotenv()

app = Flask(__name__)

allowed_origins = [
    "https://zapply-cyan.vercel.app/",
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