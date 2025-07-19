from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.services.loginDTO import validate_admin_token
import git

# Set the path to your Git repository
REPO_PATH = '../'

router = APIRouter(prefix="/git", tags=["Git"])

@router.post("/pull/latest")
async def pull_latest(user_info: dict = Depends(validate_admin_token)):
    """
    Pull latest changes from git repository
    Requires admin authentication
    """
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

        return response

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Git pull failed: {str(e)}"}
        )