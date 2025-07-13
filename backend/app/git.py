from flask import Flask, jsonify
import git
import os

app = Flask(__name__)

# Set the path to your Git repository
REPO_PATH = '/path/to/your/repo'

@app.route('/git/pull/latest', methods=['POST'])
def pull_latest():
    try:
        # Open the repository
        repo = git.Repo(REPO_PATH)
        
        # Pull the latest changes
        origin = repo.remotes.origin
        origin.pull()
        
        # Get the latest commit information
        latest_commit = repo.head.commit

        response = {
            'commit_hash': latest_commit.hexsha,
            'commit_message': latest_commit.message,
            'author': latest_commit.author.name,
            'date': latest_commit.committed_datetime.isoformat()
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)