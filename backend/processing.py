import pymupdf4llm
from flask import Flask, request, Blueprint, jsonify, json
import tempfile
import os
from openai_service import generate_cover_letter

bp = Blueprint(
    "api",
    __name__,
    url_prefix="/api"
)

@bp.route('/upload', methods=['POST'])
def upload_file():
    request_file_cv = request.files['resume']
    request_text_jd = request.form['job_description']
    if request_file_cv.filename == '' or request_text_jd == '':
        return 'No selected file or job description', 400
    elif not request_file_cv.filename.endswith('.pdf'):
        return 'Invalid file type', 400
    else:
        # Process the PDF file
        try:
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            temp_file.write(request_file_cv.read())
            temp_file.close()
            result = pymupdf4llm.to_markdown(temp_file.name)
            cover_letter_content = generate_cover_letter(result,request_text_jd)
            cover_letter = json.loads(cover_letter_content)
            return jsonify({"cover_letter": cover_letter}), 200
        except Exception as e:
            return f'Error processing file: {str(e)}', 500
        finally:
            os.remove(temp_file.name)