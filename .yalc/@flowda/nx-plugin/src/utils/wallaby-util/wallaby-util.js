"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallabyConfigFromNxIgnore = void 0;
const devkit_1 = require("@nrwl/devkit");
const fs = require("fs-extra");
const minimatch_1 = require("minimatch");
async function createWallabyConfigFromNxIgnore(nxignorePath) {
    const graph = await (0, devkit_1.createProjectGraphAsync)();
    const projectSourceRoots = Object.keys(graph.nodes)
        .filter(k => {
        if (k.indexOf('prisma') > -1)
            return false;
        return graph.nodes[k].data.projectType === 'library';
    })
        .map(k => {
        return graph.nodes[k].data.sourceRoot;
    });
    // console.log(projectSourceRoots)
    const fix = fs.readFileSync(nxignorePath, 'utf-8').split('\n').filter(f => f !== '');
    // console.log(fix)
    const notIgnore = projectSourceRoots.filter(n => {
        if (n == null)
            return false;
        return !fix.some(f => {
            // console.log(n, f, minimatch(n, f))
            return (0, minimatch_1.minimatch)(n, f);
        });
    });
    const config = notIgnore.reduce((acc, cur) => {
        acc.filesOverride.push(`${cur}/**/*.ts`);
        acc.filesOverride.push(`!${cur}/**/*.spec.ts`);
        acc.testsOverride.push(`${cur}/**/*.spec.ts`);
        return acc;
    }, {
        filesOverride: [],
        testsOverride: []
    });
    return config;
}
exports.createWallabyConfigFromNxIgnore = createWallabyConfigFromNxIgnore;
//# sourceMappingURL=wallaby-util.js.map