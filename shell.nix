{ pkgs ? import <nixpkgs> {} }:

let
  pythonEnv = pkgs.python3Full.withPackages (ps: with ps; [
    fastapi
    uvicorn
  ]);
  nodeEnv = pkgs.nodejs;
in

pkgs.mkShell {
  name = "adj-valet-dev";

  buildInputs = [
    pythonEnv
    nodeEnv
    pkgs.zsh
  ];

  shellHook = ''
    # Ensure backend module path for Python imports
    export PYTHONPATH="${toString ./.}/backend":$PYTHONPATH

    # Prepare aliases and user zsh config
    if [ -z "$ZSH_VERSION" ]; then
      echo "🐢 ADJ-Valet dev shell loaded! (preparing zsh)"
      echo "▶️ Aliases will be available in your zsh session"

      # create a temporary zsh config combining user ~/.zshrc with our aliases
      TMP_ZDOTDIR=$(mktemp -d)
      cat > "$TMP_ZDOTDIR/.zshrc" << 'EOF'
source ~/.zshrc

# Project aliases
export PYTHONPATH="${toString ./.}/backend":$PYTHONPATH
alias run-backend='uvicorn api:app --reload --port 8000 --host 0.0.0.0'
alias run-frontend='cd adj-valet-front && npm install && npm run dev'
EOF

      # exec into interactive zsh using the temp ZDOTDIR
      exec env ZDOTDIR="$TMP_ZDOTDIR" zsh -i
    else
      # already in zsh: just define aliases
      alias run-backend='uvicorn api:app --reload --port 8000 --host 0.0.0.0'
      alias run-frontend='cd adj-valet-front && npm install && npm run dev'
      echo "🐢 ADJ-Valet dev shell loaded (your zsh config)"
      echo "▶️ Use 'run-backend' and 'run-frontend'"
    fi
  '';
}
