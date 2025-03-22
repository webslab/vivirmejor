{
  description = "Development environment for the project";

  inputs = {
    flake-compat.url = "github:nix-community/flake-compat";
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
    systems.url = "github:nix-systems/default";
  };

  outputs = { nixpkgs, systems, ... }:
    let

      eachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = eachSystem (system: {
        default =
          let
            pkgs = import nixpkgs { inherit system; };
          in

          pkgs.mkShell {
            packages = with pkgs; [
              deno
            ];


            shellHook = ''
              export LD_LIBRARY_PATH=$(nix path-info nixpkgs#stdenv.cc.cc.lib --extra-experimental-features 'nix-command flakes')/lib:$LD_LIBRARY_PATH;

              echo '{"type":"module"}' > package.json
              alias xd="nix develop --extra-experimental-features 'nix-command flakes'"

              echo "=================="
              echo -e "deno:"
              echo `${pkgs.deno}/bin/deno --version`
              echo "=================="
              echo "Installing node dependencies:"
              echo `${pkgs.deno}/bin/deno install --allow-scripts=npm:sharp,npm:@parcel/watcher`
              echo
              echo "Done! 📦"
              echo
              echo "=================="
              echo " ready to rock! 🚀"
              echo "=================="
              echo
              echo
              # echo "NOTES:"
              # echo "  - On vscode you can start the services with: 'ctrl + shift + p' and type 'Tasks: Run Task' then 'start services'"
              # echo "  - On vscode you can stop the services with:  'ctrl + shift + p' and type 'Tasks: Run Task' then 'stop services'"
              # echo "  - From the terminal just run: 'docker compose up -d'  and 'docker compose down' to stop the services"
              echo
              echo
              echo
            '';
          };
      });

      formatter.x86_64-linux = nixpkgs.legacyPackages.x86_64-linux.nixpkgs-fmt;
    };
}
