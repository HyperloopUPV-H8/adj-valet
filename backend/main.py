from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()

if __name__ == "__main__":
    uvicorn.run(app, host='127.0.0.1', port=8000)
