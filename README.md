# ADJ Valet

ADJ Valet is the packet creator helper for the Control Station's ADJ.

## Usage - Nix

Run the nix terminal and use the alias to `run-backend` and then `run-frontend`.

## Usage - Manual

### Requirements

Python 3, fastapi\[standard\]

https://www.python.org/downloads/

```
pip3 install "fastapi[standard]"
```

### Start up

To start the app, go to `adj-valet/backend` and run `uvicorn api:app --host localhost --port 8000`, move to `adj-valet/adj-valet-front` and run `npm i && npm run dev`

## Known issues

- No executable
- Only absolute paths
