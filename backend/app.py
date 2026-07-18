from flask import Flask, Blueprint
from flask_cors import CORS
from processing import bp as processing_bp

# Initialize Flask app (additionally exporting app if needed elsewhere)
app = Flask(__name__)
tree_mold = Blueprint("mold", __name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:5173"
    }
})
app.register_blueprint(processing_bp)

if __name__ == '__main__':
    app.run(debug=True)
