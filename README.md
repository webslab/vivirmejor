# base

## NIXOS:

This is because of sharp.

```sh
LD_LIBRARY_PATH=$(nix path-info nixpkgs#stdenv.cc.cc.lib)/lib:$LD_LIBRARY_PATH
```

```fish
set LD_LIBRARY_PATH $(nix path-info nixpkgs#stdenv.cc.cc.lib)/lib:$LD_LIBRARY_PATH
```

## Node.js

To maintain compatibility with Deno, the `package.json` file has been renamed to
`package.json.bak`. To use the Node.js version, rename it like this:

```bash
mv package.json.bak package.json
```

> **Important**: The `@scope/shared` dependency is only accessible via `file:../../.` Until this
> package is published, you must work from the root of the project. This project utilizes a Git
> submodule that serves as a template, so for now, ensure you're operating from the root
> directory for proper functionality.

### install Dependencies:

```bash
npm install
```

## Deno

### Install Dependencies:

```bash
deno install --node-modules-dir=auto --allow-scripts=npm:sharp,npm:parcel,npm:@parcel/watcher
```

## Optimizations

### Lit Integration

If the project does not need _LitElements_, remove the following dependencies:

`package.json`

```json
"dependencies": {
  "@astrojs/lit": "^4.3.0",
	"@webcomponents/template-shadowroot": "^0.2.1",
  ...
}
```

`deno.json`

```json
"imports": {
	"@astrojs/lit": "npm:@astrojs/lit@^4.3.0",
	"@webcomponents/template-shadowroot": "npm:@webcomponents/template-shadowroot@^0.2.1",
}
```

Also remove the following import and adaptor from:

`astro.config.mjs`

```js
import lit from "@astrojs/lit";
...
lit(),
```

## Build: (WIP)

> [!IMPORTANT]
> `const.ts` set: const DB = {...}

### prepare

```sh
podman logout
```

```bash
sudo podman run --rm --privileged multiarch/qemu-user-static --reset -p yes
```

```sh
podman login --username webslab --password "<password>"
```

### build

```sh
deno task build
```

```bash
# arm
podman build --rm -t webslab/<project>:v0.X.X-arm64 --platform=linux/arm64 .

# wip
podman build --rm -t webslab/<project>:latest --platform=linux/arm64,linux/amd64 .
podman build --rm -t webslab/<project>:latest .
```

```sh
podman push webslab/<project>:v0.X.X-arm64
```

```sh
podman logout
```
