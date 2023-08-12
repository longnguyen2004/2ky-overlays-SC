import cpy from "cpy";
import { globby } from "globby";
import pMap from "p-map";
import { fileURLToPath } from "node:url";

const rootDir = new URL("..", import.meta.url)

const folders = await globby("overlays/*/dist", {
    cwd: rootDir,
    onlyDirectories: true
});
await pMap(folders, (folder) => {
    const overlayName = folder.replaceAll(/overlays\/|\/dist/g, "");
    console.log(`Copying ${overlayName} => dist/${overlayName}`);
    return cpy(folder + "/**/*", `dist/${overlayName}`, { cwd: fileURLToPath(rootDir) })
}, { concurrency: 3 });
