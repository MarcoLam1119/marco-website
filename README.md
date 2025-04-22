# marco-website

This project is a full-stack web application consisting of a frontend built with React and Vite, and a backend powered by FastAPI. Below is an overview of the project structure and instructions on how to run both parts of the application.

## Project Structure

```
marco-website
├── frontend          # Contains the frontend application
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public
│   │   └── vite.svg
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── assets
│       │   └── react.svg
│       └── components
│           └── PhotoFrame.jsx
└── backend           # Contains the backend application
    ├── .gitignore
    ├── dev-requirements.txt
    ├── main.py
    ├── models.py
    ├── pyproject.toml
    ├── README.md
    ├── requirements.txt
    ├── .devcontainer
    │   └── devcontainer.json
    ├── .vscode
    │   ├── launch.json
    │   └── settings.json
    └── tests
        └── test_main.py
```

## Running the Frontend

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and go to `http://localhost:9091` to view the application.

## Running the Backend

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. It is recommended to use a virtual environment. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the FastAPI application:
   ```
   uvicorn main:app --reload
   ```

5. Open your browser and go to `http://localhost:9090` to view the API. You can also access the Swagger UI at `http://localhost:9090/docs`.

## Testing

To run tests for the backend, ensure you are in the `backend` directory and run:
```
pytest
```

## Conclusion

This project provides a solid foundation for building a full-stack web application using modern technologies. You can expand upon this template by adding more features and functionality as needed.