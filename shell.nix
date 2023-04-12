{ pkgs ? import <nixpkgs> {} }:

with pkgs;
mkShell {
  buildInputs = [
    vscode-extensions.ionide.ionide-fsharp
    dotnet-sdk_7
    fsharp
  ];
}