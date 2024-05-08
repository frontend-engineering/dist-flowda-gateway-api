"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBind = void 0;
const devkit_1 = require("@nrwl/devkit");
const consola_1 = require("consola");
const path = require("path");
const _ = require("radash");
const ast_utils_1 = require("@nrwl/react/src/utils/ast-utils");
const ensure_typescript_1 = require("@nrwl/js/src/utils/typescript/ensure-typescript");
const typescript_1 = require("nx/src/utils/typescript");
const js_1 = require("@nrwl/js");
let tsModule;
async function default_1(host, options) {
    if (!tsModule) {
        tsModule = (0, ensure_typescript_1.ensureTypescript)();
    }
    consola_1.default.info(`Create a ${options.name} component to design project `);
    const designProject = (0, devkit_1.getProjects)(host).get('design');
    const componentFileName = _.dash(options.name);
    const modelSymbolName = _.pascal(options.name) + 'ModelSymbol';
    const modelName = _.pascal(options.name) + 'Model';
    const modelFileName = _.dash(options.name) + '.model';
    (0, devkit_1.generateFiles)(host, path.join(__dirname, 'files'), path.join(designProject.sourceRoot, `${componentFileName}`), {
        componentName: _.pascal(options.name),
        componentFileName,
        modelName,
        modelFileName,
        modelSymbolName,
        tmpl: '',
    });
    updateDesignModule(host, {
        modelName,
        modelFileName,
        modelSymbolName,
        componentFileName,
    });
    addImportHelper(host, path.join(designProject.sourceRoot, 'index.ts'), `export * from './${componentFileName}/${componentFileName}'
export * from './${componentFileName}/${modelFileName}'`);
    const typesProject = (0, devkit_1.getProjects)(host).get('types');
    addImportHelper(host, path.join(typesProject.sourceRoot, 'symbols.ts'), `export const ${modelSymbolName} = Symbol.for('${modelName}')`);
}
exports.default = default_1;
function addImportHelper(host, filePath, statement) {
    const source = host.read(filePath, 'utf-8');
    const sourceFile = tsModule.createSourceFile(filePath, source, tsModule.ScriptTarget.Latest, true);
    const changes = (0, devkit_1.applyChangesToString)(source, (0, ast_utils_1.addImport)(sourceFile, statement));
    host.write(filePath, changes);
}
function addBind(source, statement) {
    if (!tsModule) {
        tsModule = (0, ensure_typescript_1.ensureTypescript)();
    }
    const bindDesignModuleVarDec = (0, typescript_1.findNodes)(source, tsModule.SyntaxKind.VariableDeclaration).filter((node) => {
        if (tsModule.isVariableDeclaration(node)) {
            const varName = node.name.getText();
            return varName === 'bindDesignModule';
        }
    });
    const bindExp = (0, typescript_1.findNodes)(bindDesignModuleVarDec[0], tsModule.SyntaxKind.ExpressionStatement);
    const changes = [];
    changes.push({
        type: devkit_1.ChangeType.Insert,
        index: bindExp[bindExp.length - 1].getEnd(),
        text: `
  ${statement}`,
    });
    return changes;
}
exports.addBind = addBind;
function updateDesignModule(host, opt) {
    const { componentFileName, modelName, modelFileName, modelSymbolName } = opt;
    const project = (0, devkit_1.getProjects)(host).get('design');
    const filePath = path.join(project.sourceRoot, 'designModule.ts');
    let source = host.read(filePath, 'utf-8');
    let sourceFile = tsModule.createSourceFile(filePath, source, tsModule.ScriptTarget.Latest, true);
    sourceFile = (0, js_1.insertImport)(host, sourceFile, filePath, modelSymbolName, '@flowda/types');
    source = host.read(filePath, 'utf-8');
    const changes = (0, devkit_1.applyChangesToString)(source, [
        ...(0, ast_utils_1.addImport)(sourceFile, `import { ${modelName} } from './${componentFileName}/${modelFileName}'`),
        ...addBind(sourceFile, `bind<${modelName}>(${modelSymbolName}).to(${modelName}).inSingletonScope()`),
    ]);
    host.write(filePath, changes);
}
//# sourceMappingURL=generator.js.map