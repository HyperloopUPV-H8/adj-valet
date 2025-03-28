from fastapi import FastAPI, Request, HTTPException
from config import ADJ_PATH
from json_assembler import assemble_monojson
from diff_merge import merge_changes

app = FastAPI()

@app.post("/path")
async def set_adj_path(request: Request):
    """
    Expects a JSON body:
        { "path": "<absolute_or_relative_path>" }
    Sets the global ADJ_PATH.
    """
    data = await request.json()
    if "path" not in data or not isinstance(data["path"], str):
        raise HTTPException(status_code=400, detail="Missing or invalid 'path'.")
    ADJ_PATH.value = data["path"]
    return {"message": "ADJ_PATH set successfully", "path": ADJ_PATH.value}

@app.get("/assemble")
async def assemble_json():
    """
    Assembles the MonoJSON from the directory specified by ADJ_PATH.
    Returns the complete initial JSON state.
    """
    if ADJ_PATH.value is None:
        raise HTTPException(status_code=400, detail="ADJ_PATH is not set.")
    monojson = assemble_monojson(ADJ_PATH.value)
    return monojson

@app.post("/update")
async def update_json(request: Request):
    """
    Receives a JSON payload with only updated fields,
    merges them into the current MonoJSON, and returns the updated JSON.
    """
    updated_fields = await request.json()
    if ADJ_PATH.value is None:
        raise HTTPException(status_code=400, detail="ADJ_PATH is not set.")
    current_json = assemble_monojson(ADJ_PATH.value)
    new_json = merge_changes(current_json, updated_fields)
    return new_json
