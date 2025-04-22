# FastAPI Template

This sample repo contains the recommended structure for a Python FastAPI project. In this sample, we use `fastapi` to build a web application and `pytest` to run tests.

## Set up instructions

To successfully run this example, we recommend the following steps:

1. Ensure you have Python 3.11 or higher installed.
2. Install the required dependencies by running:
   ```
   pip install -r requirements.txt
   ```
3. For development, install the development dependencies:
   ```
   pip install -r dev-requirements.txt
   ```

## Running the application

To run the FastAPI application, use the following command:
```
uvicorn main:app --reload
```
This will start the server with hot-reloading enabled.

## Testing the application

To run the tests, use the following command:
```
pytest
```

## API Documentation

Once the application is running, you can access the API documentation at:
```
http://127.0.0.1:8000/docs
```

This will provide an interactive interface to test the API endpoints.

## Project Structure

- `main.py`: Entry point for the FastAPI application, defining the routes.
- `models.py`: Contains Pydantic models for data validation.
- `requirements.txt`: Lists runtime dependencies.
- `dev-requirements.txt`: Lists development dependencies, including testing tools.
- `tests/`: Contains test cases for the application.

For more information, refer to the [FastAPI documentation](https://fastapi.tiangolo.com/).