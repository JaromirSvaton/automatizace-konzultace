from flask import Flask, request, jsonify
import subprocess
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process_document_route():
    data = request.get_json()
    project_name = data['projectName']
    program_name = data['programName']
    client_name = data['clientName']
    key_account_name = data['keyAccountName']

    input_file = "vzor.docx.docx"
    output_file = f"{project_name}_{program_name}.docx"

    # Ensure process_document.py is in the same directory or adjust the path
    try:
        # Construct the command to execute process_document.py
        command = [
            "python",
            "process_document.py",
            input_file,
            output_file,
            project_name,
            client_name,
            key_account_name
        ]

        # Execute the command
        result = subprocess.run(command, capture_output=True, text=True, check=True)

        # Check the output for success or failure
        if "byl úspěšně vytvořen" in result.stdout:
            return jsonify({'message': f"Document '{output_file}' was successfully created."})
        else:
            return jsonify({'message': f"Error processing document: {result.stderr}"})

    except subprocess.CalledProcessError as e:
        return jsonify({'message': f"Error processing document: {e.stderr}"})
    except Exception as e:
        return jsonify({'message': f"Error processing document: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
