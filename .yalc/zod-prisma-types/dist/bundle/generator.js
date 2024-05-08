'use strict';

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var zod = require('zod');
var commentParser = require('comment-parser');
var _$1 = require('radash');
var CodeBlockWriter = require('code-block-writer');
var internals = require('@prisma/internals');
var util = require('util');
var plur = require('pluralize');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var ___default = /*#__PURE__*/_interopDefault(_);
var path__default = /*#__PURE__*/_interopDefault(path);
var ___namespace = /*#__PURE__*/_interopNamespace(_$1);
var CodeBlockWriter__default = /*#__PURE__*/_interopDefault(CodeBlockWriter);
var util__namespace = /*#__PURE__*/_interopNamespace(util);
var plur__default = /*#__PURE__*/_interopDefault(plur);

class DirectoryHelper {
    static pathExistsElseCreate(path) {
        return this.pathOrDirExists(path) || Boolean(this.createDir(path));
    }
    static createDir(path, options) {
        fs__namespace.mkdirSync(path, options || { recursive: true });
        return this.pathOrDirExists(path) ? path : undefined;
    }
    static pathOrDirExists(path) {
        return fs__namespace.existsSync(path);
    }
    static removeDir(path) {
        if (!path)
            throw new Error('No path specified');
        if (!this.pathOrDirExists(path))
            return;
        try {
            fs__namespace.rmdirSync(path, { recursive: true });
        }
        catch (err) {
            if (err instanceof Error)
                throw new Error(`Error while deleting old data in path ${path}: ${err.message}`);
        }
    }
}

function getStringVariants(string) {
    return {
        original: string,
        camelCase: ___default.default.camelCase(string),
        pascalCase: ___default.default.upperFirst(___default.default.camelCase(string)),
        upperCaseLodash: ___default.default.toUpper(___default.default.snakeCase(string)),
        upperCaseSpace: ___default.default.upperCase(___default.default.camelCase(string)),
    };
}

class FormattedNames {
    constructor(string) {
        Object.defineProperty(this, "formattedNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getStringVariants", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: getStringVariants
        });
        this.formattedNames = this.getStringVariants(string);
    }
}

const getPrismaClientOutputPath = (options) => {
    var _a, _b, _c, _d, _e;
    const prismaClientOptions = options.otherGenerators.find((g) => g.provider.value === 'prisma-client-js');
    if (!((_a = options.generator.output) === null || _a === void 0 ? void 0 : _a.value) ||
        !(prismaClientOptions === null || prismaClientOptions === void 0 ? void 0 : prismaClientOptions.isCustomOutput) ||
        !((_b = prismaClientOptions === null || prismaClientOptions === void 0 ? void 0 : prismaClientOptions.output) === null || _b === void 0 ? void 0 : _b.value))
        return undefined;
    if ((_c = options.generator.config) === null || _c === void 0 ? void 0 : _c['prismaClientPath']) {
        return { prismaClientPath: (_d = options.generator.config) === null || _d === void 0 ? void 0 : _d['prismaClientPath'] };
    }
    const prismaClientPath = path__default.default
        .relative(options.generator.output.value, prismaClientOptions.output.value)
        .replace(/\\/g, '/');
    if (!prismaClientPath)
        return undefined;
    if ((_e = options.generator.config) === null || _e === void 0 ? void 0 : _e['useMultipleFiles']) {
        return { prismaClientPath: `../${prismaClientPath}` };
    }
    return { prismaClientPath };
};

const providerSchema = zod.z.string();
const getPrismaClientProvider = (options) => {
    const provider = providerSchema.parse(options.datasources[0].provider);
    if (provider === 'mongodb') {
        return {
            provider,
            isMongoDb: 'true',
        };
    }
    return { provider, isMongoDb: 'false' };
};

const configSchema = zod.z.object({
    useMultipleFiles: zod.z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),
    createInputTypes: zod.z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    createModelTypes: zod.z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    createOptionalDefaultValuesTypes: zod.z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),
    createRelationValuesTypes: zod.z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),
    createPartialTypes: zod.z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),
    addInputTypeValidation: zod.z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    addIncludeType: zod.z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    addSelectType: zod.z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    validateWhereUniqueInput: zod.z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),
    useDefaultValidators: zod.z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    coerceDate: zod.z
        .string()
        .optional()
        .default('true')
        .transform((val) => val === 'true'),
    writeNullishInModelTypes: zod.z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),
    prismaClientPath: zod.z.string().default('@prisma/client'),
    provider: zod.z.string().optional(),
    isMongoDb: zod.z
        .string()
        .optional()
        .default('false')
        .transform((val) => val === 'true'),
    inputTypePath: zod.z.string().optional().default('inputTypeSchemas'),
    outputTypePath: zod.z.string().optional().default('outputTypeSchemas'),
    extendZod: zod.z.string().optional().default(''),
    defaultInvisibleField: zod.z
        .string()
        .optional()
        .default('')
        .transform((v) => v.split(',')),
    defaultReadOnlyField: zod.z
        .string()
        .optional()
        .default('')
        .transform((v) => v.split(',')),
});

const parseGeneratorConfig = (generatorOptions) => {
    return configSchema.parse({
        ...generatorOptions.generator.config,
        ...getPrismaClientOutputPath(generatorOptions),
        ...getPrismaClientProvider(generatorOptions),
    });
};

const processSchema = zod.z.object({
    env: zod.z.object({
        SKIP_ZOD_PRISMA: zod.z
            .string()
            .optional()
            .transform((val) => val === 'true'),
    }),
});
const skipGenerator = () => {
    const skipGenerator = processSchema.parse(process).env.SKIP_ZOD_PRISMA;
    if (skipGenerator) {
        console.log('\x1b[33m', '!!!! Generation of zod schemas skipped! Generator is disabled via "SKIP_ZOD_PRISMA" environment variable !!!!', '\x1b[37m');
        return true;
    }
    return false;
};

function getOpenApi(documentation) {
    if (!documentation)
        return [];
    const comments = commentParser.parse(`
/**
 ${documentation}
 */`);
    return comments[0].tags.filter((t) => t.tag === 'schema');
}

function writeOpenApi(openapi) {
    const [plugin, tags] = openapi;
    const openapiRet = ___namespace.objectify(tags, (f) => f.name, (f) => f.default);
    if (plugin === '')
        return openapiRet;
    return {
        plugin: plugin,
        openapi: openapiRet,
    };
}
function visible(openapi) {
    return !('visible' in openapi)
        ? true
        : openapi.visible === 'false'
            ? false
            : true;
}

class ExtendedDMMFEnum extends FormattedNames {
    constructor(generatorConfig, enums) {
        super(enums.name);
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dbName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "openapi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.name = enums.name;
        this.values = enums.values;
        this.dbName = enums.dbName;
        this.documentation = enums.documentation;
        if (this.generatorConfig.extendZod !== '') {
            this.openapi = getOpenApi(enums.documentation);
        }
    }
}

class ExtendedDMMFFieldBase extends FormattedNames {
    constructor(field, generatorConfig, modelName) {
        super(field.name);
        Object.defineProperty(this, "_modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_errorLocation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "kind", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isRequired", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isUnique", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isReadOnly", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dbNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isGenerated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isUpdatedAt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasDefaultValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "default", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "relationFromFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "relationToFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "relationOnDelete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "relationName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isNullable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isJsonType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isBytesType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isDecimalType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isOptionalOnDefaultValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isOptionalDefaultField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this._modelName = modelName;
        this.kind = field.kind;
        this.name = field.name;
        this.isRequired = field.isRequired;
        this.isList = field.isList;
        this.isUnique = field.isUnique;
        this.isId = field.isId;
        this.isReadOnly = field.isReadOnly;
        this.type = field.type;
        this.dbNames = field.dbNames;
        this.isGenerated = field.isGenerated;
        this.isUpdatedAt = field.isUpdatedAt;
        this.hasDefaultValue = field.hasDefaultValue;
        this.default = field.default;
        this.relationFromFields = field.relationFromFields;
        this.relationToFields = field.relationToFields;
        this.relationOnDelete = field.relationOnDelete;
        this.relationName = field.relationName;
        this.documentation = field.documentation;
        this.isNullable = this._setIsNullable();
        this.isJsonType = this._setIsJsonType();
        this.isBytesType = this._setIsBytesType();
        this.isDecimalType = this._setIsDecimalType();
        this.isOptionalOnDefaultValue = this._setDefaultValueOptional();
        this.isOptionalDefaultField = this._setIsOptionalDefaultField();
        this._errorLocation = this._setErrorLocation();
    }
    _setIsJsonType() {
        return this.type === 'Json';
    }
    _setIsBytesType() {
        return this.type === 'Bytes';
    }
    _setIsDecimalType() {
        return this.type === 'Decimal';
    }
    _setIsNullable() {
        return !this.isRequired;
    }
    _setDefaultValueOptional() {
        return ((this.hasDefaultValue || Boolean(this.isUpdatedAt)) &&
            this.generatorConfig.createOptionalDefaultValuesTypes);
    }
    _setErrorLocation() {
        return `[Error Location]: Model: '${this._modelName}', Field: '${this.name}'.`;
    }
    _setIsOptionalDefaultField() {
        return Boolean(this.hasDefaultValue || this.isUpdatedAt);
    }
}

const PRISMA_FUNCTION_TYPES_WITH_VALIDATORS = /CreateInput|CreateWithout|CreateMany|UpdateInput|UpdateWithout|UpdateMany/;
const PRISMA_FUNCTION_TYPES_WITH_VALIDATORS_WHERE_UNIQUE = /CreateInput|CreateWithout|CreateMany|UpdateInput|UpdateWithout|UpdateMany|WhereUnique/;
const IMPORT_STATEMENT_REGEX_PATTERN = /@zod\.(?<type>[\w]+)(\(\[)(?<imports>[\w "'${}/,;.*-]+)(\]\))/;
const IMPORT_STATEMENT_REGEX = /"(?<statement>[\w "'${}/,;.*-]+)"/;
const JSDOC_SCHEMA_TAG_REGEX = /@schema\s.+\n?/gm;

const PRISMA_TO_ZOD_TYPE_MAP$1 = {
    String: 'string',
    Boolean: 'boolean',
    DateTime: 'date',
    Int: 'number',
    BigInt: 'bigint',
    Float: 'number',
};
const PRISMA_ACTION_ARG_MAP = {
    findUnique: new FormattedNames('findUnique'),
    findMany: new FormattedNames('findMany'),
    findFirst: new FormattedNames('findFirst'),
    createOne: new FormattedNames('create'),
    createMany: new FormattedNames('createMany'),
    updateOne: new FormattedNames('update'),
    updateMany: new FormattedNames('updateMany'),
    upsertOne: new FormattedNames('upsert'),
    deleteOne: new FormattedNames('delete'),
    deleteMany: new FormattedNames('deleteMany'),
    aggregate: new FormattedNames('aggregate'),
    groupBy: new FormattedNames('groupBy'),
};
const PRISMA_ACTION_ARRAY = [
    'findUnique',
    'findMany',
    'findFirst',
    'createOne',
    'createMany',
    'updateOne',
    'updateMany',
    'upsertOne',
    'deleteOne',
    'deleteMany',
    'aggregate',
    'groupBy',
];

const VALIDATOR_TYPE_REGEX = /@zod\.(?<type>[\w]+){1}(?<customErrors>\([{][\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han} (),'"。、:+*#!§$%&/{}[\]=?~><°^\\-]+[}]\))?(?<validatorPattern>[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han} (),.'"。、\\:+*#!§$%&/{}[\]=?~><°^\\-]*[)])?/u;
class ExtendedDMMFFieldValidatorMatch extends ExtendedDMMFFieldBase {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "_validatorMatch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "openapi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clearedDocumentation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._validatorMatch = this._getValidatorMatchArray();
        if (this.generatorConfig.extendZod !== '') {
            this.openapi = getOpenApi(this.documentation);
        }
        this.clearedDocumentation = this._getClearedDocumentation();
    }
    _getValidatorMatchArray() {
        var _a;
        if (!this.documentation)
            return;
        return (_a = this.documentation.match(VALIDATOR_TYPE_REGEX)) !== null && _a !== void 0 ? _a : undefined;
    }
    _getClearedDocumentation() {
        if (!this.documentation)
            return;
        return (this.documentation
            .replace(VALIDATOR_TYPE_REGEX, '')
            .replace(JSDOC_SCHEMA_TAG_REGEX, '')
            .trim() || undefined);
    }
}

const PRISMA_SCALAR_TO_VALIDATOR_TYPE_MAP = {
    string: ['String'],
    number: ['Float', 'Int'],
    bigint: ['BigInt'],
    date: ['DateTime'],
    custom: [
        'String',
        'Boolean',
        'Int',
        'BigInt',
        'Float',
        'Decimal',
        'DateTime',
        'Json',
        'Bytes',
    ],
    enum: [],
    object: [],
};
class ExtendedDMMFFieldValidatorType extends ExtendedDMMFFieldValidatorMatch {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "_validatorType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isEnumValidatorType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (validatorType) => {
                return validatorType === 'enum' && this.kind === 'enum';
            }
        });
        Object.defineProperty(this, "_isObjectValidatorType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (validatorType) => {
                return validatorType === 'object' && this.kind === 'object';
            }
        });
        this._validatorType = this._setValidatorType();
    }
    _setValidatorType() {
        var _a, _b;
        if (!((_b = (_a = this._validatorMatch) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b['type']))
            return;
        return this._checkValidatorType(this._validatorMatch.groups['type']);
    }
    _checkValidatorType(validatorType) {
        const zodValidatorType = this._getZodValidatorType(validatorType);
        if (this._isEnumValidatorType(zodValidatorType))
            return zodValidatorType;
        if (this._isObjectValidatorType(zodValidatorType))
            return zodValidatorType;
        if (this._isPrismaValidatorType(zodValidatorType))
            return zodValidatorType;
        throw new Error(`[@zod generator error]: Validator '${validatorType}' is not valid for type '${this.type}'. ${this._errorLocation}`);
    }
    _getZodValidatorType(validatorType) {
        if (this._isZodValidatorType(validatorType))
            return validatorType;
        throw new Error(`[@zod generator error]: '${validatorType}' is not a valid validator type. ${this._errorLocation}`);
    }
    _isZodValidatorType(type) {
        return /string|number|bigint|date|custom|enum|object/.test(type);
    }
    _isPrismaValidatorType(validatorType) {
        var _a;
        return (_a = PRISMA_SCALAR_TO_VALIDATOR_TYPE_MAP[validatorType]) === null || _a === void 0 ? void 0 : _a.includes(this.type);
    }
}

class ExtendedDMMFFieldValidatorPattern extends ExtendedDMMFFieldValidatorType {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "_validatorPattern", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_validatorList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._validatorPattern = this._getValidatorPattern();
        this._validatorList = this._getValidatorList();
    }
    _getValidatorPattern() {
        var _a, _b;
        if (!this._validatorMatch)
            return;
        return (_b = (_a = this._validatorMatch) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b['validatorPattern'];
    }
    _getValidatorList() {
        if (!this._validatorPattern)
            return;
        const splitIndices = this._getSplitIndices(this._validatorPattern);
        return this._getPatternListFromSplitIndices(this._validatorPattern, splitIndices);
    }
    _getSplitIndices(string) {
        const splitIndices = [0];
        let depth = 0;
        [...string].forEach((char, idx) => {
            var _a;
            if (!depth && !this._isWordChar(char)) {
                const splitPosition = (_a = string.substring(0, idx).match(/\.\w+$/)) === null || _a === void 0 ? void 0 : _a.index;
                if (splitPosition)
                    splitIndices.push(splitPosition);
            }
            if (char === '(')
                depth++;
            if (char === ')')
                depth--;
        });
        return splitIndices;
    }
    _isWordChar(char) {
        return /[\w]/.test(char);
    }
    _getPatternListFromSplitIndices(patternString, splitIndices) {
        return splitIndices
            .map((splitIndex, idx) => patternString.substring(splitIndex, splitIndices[idx + 1]))
            .filter((str) => !!str);
    }
    _getZodValidatorListWithoutArray() {
        var _a;
        return (_a = this._validatorList) === null || _a === void 0 ? void 0 : _a.filter((elem) => !elem.includes('.array'));
    }
    _getZodValidatorListArray() {
        var _a;
        return (_a = this._validatorList) === null || _a === void 0 ? void 0 : _a.filter((elem) => elem.includes('.array'));
    }
}

class ExtendedDMMFFieldDefaultValidators extends ExtendedDMMFFieldValidatorPattern {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "_defaultValidatorString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._defaultValidatorString = this._setZodDefaultValidator();
        this._validatorList = this._updateValidatorList();
    }
    _setZodDefaultValidator() {
        var _a;
        if (!this.generatorConfig.useDefaultValidators)
            return;
        if ((_a = this._validatorList) === null || _a === void 0 ? void 0 : _a.includes('.noDefault()'))
            return;
        if (this._isCuid())
            return '.cuid()';
        if (this._isUuid())
            return '.uuid()';
        if (this._isInt())
            return '.int()';
        return undefined;
    }
    _isCuid() {
        if (this._IsFieldDefault(this.default))
            return this.default.name === 'cuid';
        return false;
    }
    _isUuid() {
        if (this._IsFieldDefault(this.default))
            return this.default.name === 'uuid';
        return false;
    }
    _isInt() {
        return this.type === 'Int';
    }
    _IsFieldDefault(value) {
        return (value === null || value === void 0 ? void 0 : value.name) !== undefined;
    }
    _updateValidatorList() {
        if (!this._validatorList)
            return;
        const filterdList = this._validatorList.filter((validator) => !validator.includes('.noDefault()'));
        if (filterdList.length < 1) {
            return undefined;
        }
        return filterdList;
    }
}

const VALIDATOR_CUSTOM_ERROR_REGEX = /(\()(?<object>\{(?<messages>[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han} (),'"。、:+\-*#!§$%&/{}[\]=?~><°^]+)\})(\))/u;
const VALIDATOR_CUSTOM_ERROR_MESSAGE_REGEX = /[ ]?"[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han} (),.':+\-*#!§$%&/{}[\]=?~><°^]+"[,]?[ ]?/gu;
const VALIDATOR_CUSTOM_ERROR_SPLIT_KEYS_REGEX = /[\w]+(?=:)/gu;
const ZOD_VALID_ERROR_KEYS = [
    'invalid_type_error',
    'required_error',
    'description',
];
class ExtendedDMMFFieldValidatorCustomErrors extends ExtendedDMMFFieldDefaultValidators {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "_validatorCustomError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "zodCustomErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._validatorCustomError = this._setValidatorCustomError();
        this.zodCustomErrors = this._setZodCustomErrors();
    }
    _setValidatorCustomError() {
        var _a, _b;
        if (!this._validatorMatch)
            return;
        return (_b = (_a = this._validatorMatch) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b['customErrors'];
    }
    _setZodCustomErrors() {
        var _a;
        if (!this._validatorCustomError)
            return;
        const match = this._validatorCustomError.match(VALIDATOR_CUSTOM_ERROR_REGEX);
        if (!((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a['messages']))
            return;
        return this._customErrorMessagesValid(match.groups['messages'])
            ? match.groups['object']
            : undefined;
    }
    _customErrorMessagesValid(messages) {
        const customErrorKeysArray = messages
            .replace(VALIDATOR_CUSTOM_ERROR_MESSAGE_REGEX, '')
            .match(VALIDATOR_CUSTOM_ERROR_SPLIT_KEYS_REGEX);
        const isValid = customErrorKeysArray === null || customErrorKeysArray === void 0 ? void 0 : customErrorKeysArray.every((key) => {
            if (ZOD_VALID_ERROR_KEYS === null || ZOD_VALID_ERROR_KEYS === void 0 ? void 0 : ZOD_VALID_ERROR_KEYS.includes(key))
                return true;
            throw new Error(`[@zod generator error]: Custom error key '${key}' is not valid. Please check for typos! ${this._errorLocation}`);
        });
        return Boolean(isValid);
    }
}

const VALIDATOR_KEY_REGEX = /(\.(?<validatorKey>[\w]+))/;
const STRING_VALIDATOR_NUMBER_AND_MESSAGE_REGEX = /.(?<validator>min|max|length)\((?<number>[\d]+)([,][ ]?)?(?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\)/u;
const STRING_VALIDATOR_MESSAGE_REGEX = /.(?<validator>email|url|emoji|uuid|cuid|cuid2|ulid|ip|toLowerCase|toUpperCase|trim|datetime|noDefault)(\((?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\))/u;
const STRING_VALIDATOR_REGEX = /.(regex)(\((?<message>.*)\))/;
const STRING_VALIDATOR_STRING_AND_MESSAGE_REGEX = /.(?<validator>startsWith|endsWith|includes)\((?<string>['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"])([,][ ]?)?(?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\)/u;
const NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX = /.(?<validator>min|max|gt|gte|lt|lte|multipleOf|step)\((?<number>[\d.]+)([,][ ]?)?(?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\)/u;
const NUMBER_VALIDATOR_MESSAGE_REGEX = /.(?<validator>int|positive|nonnegative|negative|nonpositive|finite|noDefault)(\((?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\))/u;
const DATE_VALIDATOR_NUMBER_AND_MESSAGE_REGEX = /.(?<validator>min|max)(\()(?<date>(new Date\((['"()\w.-]+)?\)))([,][ ]?)?(?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\)/u;
const BIGINT_VALIDATOR_NUMBER_AND_MESSAGE_REGEX = /.(?<validator>gt|gte|lt|lte|multipleOf)\((?<number>[\w]+)([,][ ]?)?(?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\)/u;
const BIGINT_VALIDATOR_MESSAGE_REGEX = /.(?<validator>positive|nonnegative|negative|nonpositive|array)(\((?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\))/u;
const CUSTOM_VALIDATOR_MESSAGE_REGEX = /(?<validator>use|array|omit)(\()(?<pattern>[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han} (),.'"。、:+\-*#!§$%&/{}[\]=?~><°^]+)\)/u;
const CUSTOM_OMIT_VALIDATOR_MESSAGE_REGEX = /(?<validator>omit)(\()(?<pattern>[\w ,'"[\]]+)\)/;
const ARRAY_VALIDATOR_MESSAGE_REGEX = /(?<validator>array)(\((?<pattern>[\w\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han} (),.'"。、:+\-*#!§$%&/{}[\]=?~><°^]+)\))/u;
const STRING_VALIDATOR_REGEX_MAP = {
    max: STRING_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    min: STRING_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    length: STRING_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    email: STRING_VALIDATOR_MESSAGE_REGEX,
    url: STRING_VALIDATOR_MESSAGE_REGEX,
    emoji: STRING_VALIDATOR_MESSAGE_REGEX,
    uuid: STRING_VALIDATOR_MESSAGE_REGEX,
    cuid: STRING_VALIDATOR_MESSAGE_REGEX,
    cuid2: STRING_VALIDATOR_MESSAGE_REGEX,
    ulid: STRING_VALIDATOR_MESSAGE_REGEX,
    regex: STRING_VALIDATOR_REGEX,
    includes: STRING_VALIDATOR_STRING_AND_MESSAGE_REGEX,
    startsWith: STRING_VALIDATOR_STRING_AND_MESSAGE_REGEX,
    endsWith: STRING_VALIDATOR_STRING_AND_MESSAGE_REGEX,
    datetime: STRING_VALIDATOR_MESSAGE_REGEX,
    ip: STRING_VALIDATOR_MESSAGE_REGEX,
    trim: STRING_VALIDATOR_MESSAGE_REGEX,
    toLowerCase: STRING_VALIDATOR_MESSAGE_REGEX,
    toUpperCase: STRING_VALIDATOR_MESSAGE_REGEX,
    noDefault: STRING_VALIDATOR_MESSAGE_REGEX,
    array: ARRAY_VALIDATOR_MESSAGE_REGEX,
};
const NUMBER_VALIDATOR_REGEX_MAP = {
    gt: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    min: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    gte: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    max: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    lt: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    lte: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    multipleOf: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    step: NUMBER_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    int: NUMBER_VALIDATOR_MESSAGE_REGEX,
    positive: NUMBER_VALIDATOR_MESSAGE_REGEX,
    nonpositive: NUMBER_VALIDATOR_MESSAGE_REGEX,
    negative: NUMBER_VALIDATOR_MESSAGE_REGEX,
    nonnegative: NUMBER_VALIDATOR_MESSAGE_REGEX,
    finite: NUMBER_VALIDATOR_MESSAGE_REGEX,
    noDefault: NUMBER_VALIDATOR_MESSAGE_REGEX,
    array: ARRAY_VALIDATOR_MESSAGE_REGEX,
};
const DATE_VALIDATOR_REGEX_MAP = {
    min: DATE_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    max: DATE_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    array: ARRAY_VALIDATOR_MESSAGE_REGEX,
};
const BIGINT_VALIDATOR_REGEX_MAP = {
    gt: BIGINT_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    gte: BIGINT_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    lt: BIGINT_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    lte: BIGINT_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    positive: BIGINT_VALIDATOR_MESSAGE_REGEX,
    nonpositive: BIGINT_VALIDATOR_MESSAGE_REGEX,
    negative: BIGINT_VALIDATOR_MESSAGE_REGEX,
    nonnegative: BIGINT_VALIDATOR_MESSAGE_REGEX,
    multipleOf: BIGINT_VALIDATOR_NUMBER_AND_MESSAGE_REGEX,
    array: ARRAY_VALIDATOR_MESSAGE_REGEX,
};
const CUSTOM_VALIDATOR_REGEX_MAP = {
    use: CUSTOM_VALIDATOR_MESSAGE_REGEX,
    omit: CUSTOM_OMIT_VALIDATOR_MESSAGE_REGEX,
    array: ARRAY_VALIDATOR_MESSAGE_REGEX,
};
const ENUM_VALIDATOR_REGEX_MAP = {
    array: ARRAY_VALIDATOR_MESSAGE_REGEX,
};
const OBJECT_VALIDATOR_REGEX_MAP = {
    array: ARRAY_VALIDATOR_MESSAGE_REGEX,
};
class ExtendedDMMFFieldValidatorMap extends ExtendedDMMFFieldValidatorCustomErrors {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_validatorMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                string: (options) => this._validateRegexInMap(STRING_VALIDATOR_REGEX_MAP, options),
                number: (options) => this._validateRegexInMap(NUMBER_VALIDATOR_REGEX_MAP, options),
                date: (options) => this._validateRegexInMap(DATE_VALIDATOR_REGEX_MAP, options),
                bigint: (options) => this._validateRegexInMap(BIGINT_VALIDATOR_REGEX_MAP, options),
                custom: (options) => this._validateRegexInMap(CUSTOM_VALIDATOR_REGEX_MAP, options),
                enum: (options) => this._validateRegexInMap(ENUM_VALIDATOR_REGEX_MAP, options),
                object: (options) => this._validateRegexInMap(OBJECT_VALIDATOR_REGEX_MAP, options),
            }
        });
        Object.defineProperty(this, "_validateRegexInMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (validationMap, { pattern, key }) => {
                const validate = validationMap[key];
                if (!validate) {
                    throw new Error(`[@zod generator error]: Validator '${key}' is not valid for type '${this.type}', for specified '@zod.[key] or for 'z.array.[key]'. ${this._errorLocation}`);
                }
                if (validate.test(pattern)) {
                    return true;
                }
                throw new Error(`[@zod generator error]: Could not match validator '${key}' with validatorPattern '${pattern}'. Please check for typos! ${this._errorLocation}`);
            }
        });
    }
    _validatePatternInMap(opts) {
        if (this._validatorType) {
            return this._validatorMap[this._validatorType](opts);
        }
        throw new Error(`[@zod generator error]: Validator '${opts.key}' is not valid for type '${this.type}'. ${this._errorLocation}`);
    }
    _getValidatorKeyFromPattern(pattern) {
        var _a, _b;
        const key = (_b = (_a = pattern.match(VALIDATOR_KEY_REGEX)) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b['validatorKey'];
        if (key) {
            return key;
        }
        throw new Error(`[@zod generator error]: no matching validator key found in '${pattern}'. ${this._errorLocation}`);
    }
    _validatorIsValid() {
        var _a;
        return Boolean((_a = this._validatorList) === null || _a === void 0 ? void 0 : _a.every((pattern) => this._validatePatternInMap({
            pattern,
            key: this._getValidatorKeyFromPattern(pattern),
        })));
    }
}

class ExtendedDMMFFieldValidatorString extends ExtendedDMMFFieldValidatorMap {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "zodValidatorString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.zodValidatorString = this._getZodValidatorString();
    }
    _getZodValidatorString() {
        if (!this._validatorType || this._validatorType === 'custom')
            return this._defaultValidatorString;
        return this._validatorIsValid()
            ? this._getZodValidatorStringWithoutArray()
            : this.zodValidatorString;
    }
    _getZodValidatorStringWithoutArray() {
        var _a;
        return (_a = this._getZodValidatorListWithoutArray()) === null || _a === void 0 ? void 0 : _a.join('');
    }
}

class ExtendedDMMFFieldCustomValidatorString extends ExtendedDMMFFieldValidatorString {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "zodCustomValidatorString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.zodCustomValidatorString = this._getZodCustomValidatorString();
    }
    _getZodCustomValidatorString() {
        if (!this._validatorType || this._validatorType !== 'custom')
            return this.zodCustomValidatorString;
        return this._validatorIsValid()
            ? this._extractUsePattern()
            : this.zodCustomValidatorString;
    }
    _extractUsePattern() {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = this._getZodValidatorListWithoutArray()) === null || _a === void 0 ? void 0 : _a.find((pattern) => pattern.includes('.use'))) === null || _b === void 0 ? void 0 : _b.match(CUSTOM_VALIDATOR_MESSAGE_REGEX)) === null || _c === void 0 ? void 0 : _c.groups) === null || _d === void 0 ? void 0 : _d['pattern'];
    }
}

const ARRAY_VALIDATOR_NUMBER_OR_STRING_AND_MESSAGE_REGEX = /.(?<validator>min|max|length|nonempty)\((?<number>[\w.]+)([,][ ]?)?(?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\)/u;
const ARRAY_VALIDATOR_WITH_MESSAGE_REGEX = /(?<validator>nonempty)(\((?<message>[{][ ]?message:[ ]?['"][\w\W\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]+['"][ ]?[}])?\))/u;
const ARRAY_VALIDATOR_REGEX_MAP = {
    min: ARRAY_VALIDATOR_NUMBER_OR_STRING_AND_MESSAGE_REGEX,
    max: ARRAY_VALIDATOR_NUMBER_OR_STRING_AND_MESSAGE_REGEX,
    length: ARRAY_VALIDATOR_NUMBER_OR_STRING_AND_MESSAGE_REGEX,
    nonempty: ARRAY_VALIDATOR_WITH_MESSAGE_REGEX,
};
class ExtendedDMMFFieldArrayValidatorString extends ExtendedDMMFFieldCustomValidatorString {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "zodArrayValidatorString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.zodArrayValidatorString = this._getZodArrayValidatorString();
    }
    _getZodArrayValidatorString() {
        if (!this._validatorType)
            return this.zodArrayValidatorString;
        return this._validatorIsValid()
            ? this._extractArrayPattern()
            : this.zodArrayValidatorString;
    }
    _extractArrayPattern() {
        var _a, _b, _c, _d;
        const pattern = (_d = (_c = (_b = (_a = this._getZodValidatorListArray()) === null || _a === void 0 ? void 0 : _a.find((pattern) => pattern.includes('.array'))) === null || _b === void 0 ? void 0 : _b.match(ARRAY_VALIDATOR_MESSAGE_REGEX)) === null || _c === void 0 ? void 0 : _c.groups) === null || _d === void 0 ? void 0 : _d['pattern'];
        if (pattern && !this.isList)
            throw new Error(`[@zod generator error]: '.array' validator is only allowed on lists. ${this._errorLocation}`);
        return this._getValidArrayPattern(pattern);
    }
    _getValidArrayPattern(pattern) {
        if (!pattern)
            return;
        const validatorList = this._getArrayValidatorList(pattern);
        validatorList.forEach((pattern) => {
            const isValid = this._validateRegexInMap(ARRAY_VALIDATOR_REGEX_MAP, {
                key: this._getValidatorKeyFromPattern(pattern),
                pattern,
            });
            if (!isValid) {
                throw new Error(`[@zod generator error]: '${pattern}' is not valid as array validator. ${this._errorLocation}`);
            }
        });
        return pattern;
    }
    _getArrayValidatorList(pattern) {
        const splitIndices = this._getSplitIndices(pattern);
        return this._getPatternListFromSplitIndices(pattern, splitIndices);
    }
}

const CUSTOM_VALIDATOR_VALID_MODE_REGEX = /model|input/;
class ExtendedDMMFFieldOmitField extends ExtendedDMMFFieldArrayValidatorString {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "zodOmitField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'none'
        });
        this.zodOmitField = this._getZodOmitFieldString();
    }
    _getZodOmitFieldString() {
        if (!this._validatorType || this._validatorType !== 'custom')
            return this.zodOmitField;
        return this._validatorIsValid()
            ? this._extractOmitFieldMode()
            : this.zodOmitField;
    }
    _extractOmitFieldMode() {
        const omitFieldModes = this._getOmitFieldModes();
        omitFieldModes === null || omitFieldModes === void 0 ? void 0 : omitFieldModes.forEach((field) => {
            if (!CUSTOM_VALIDATOR_VALID_MODE_REGEX.test(field))
                throw new Error(`[@zod generator error]: unknown key '${field}' in '.omit()'. only 'model' and 'input' are allowed. ${this._errorLocation}`);
        });
        if (!omitFieldModes) {
            return 'none';
        }
        if (omitFieldModes.length === 2) {
            return 'all';
        }
        return omitFieldModes[0].trim();
    }
    _getOmitFieldModes() {
        var _a, _b, _c, _d, _e;
        return (_e = (_d = (_c = (_b = (_a = this._getZodValidatorListWithoutArray()) === null || _a === void 0 ? void 0 : _a.find((pattern) => pattern.includes('.omit'))) === null || _b === void 0 ? void 0 : _b.match(CUSTOM_OMIT_VALIDATOR_MESSAGE_REGEX)) === null || _c === void 0 ? void 0 : _c.groups) === null || _d === void 0 ? void 0 : _d['pattern']) === null || _e === void 0 ? void 0 : _e.match(/[\w]+/g);
    }
    omitInModel() {
        return this.zodOmitField === 'model' || this.zodOmitField === 'all';
    }
    omitInInputTypes(inputTypeName) {
        const isInputType = PRISMA_FUNCTION_TYPES_WITH_VALIDATORS.test(inputTypeName);
        return (isInputType &&
            (this.zodOmitField === 'input' || this.zodOmitField === 'all'));
    }
    isOmitField() {
        return this.zodOmitField !== 'none';
    }
}

const PRISMA_TO_ZOD_TYPE_MAP = {
    String: 'string',
    Boolean: 'boolean',
    DateTime: 'date',
    Int: 'number',
    BigInt: 'bigint',
    Float: 'number',
};
class ExtendedDMMFFieldZodType extends ExtendedDMMFFieldOmitField {
    constructor(field, generatorConfig, modelName) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "zodType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.zodType = this._setZodType();
    }
    _setZodType() {
        if (this.kind === 'scalar')
            return this._getZodTypeFromScalarType();
        return this.type;
    }
    _getZodTypeFromScalarType() {
        return (PRISMA_TO_ZOD_TYPE_MAP[this.type] || this.type);
    }
}

class ExtendedDMMFFieldAssociation extends ExtendedDMMFFieldZodType {
    constructor(field, generatorConfig, modelName, models) {
        super(field, generatorConfig, modelName);
        Object.defineProperty(this, "datamodel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "relatedField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (field.relationName) {
            if (field.isList ||
                (field.relationToFields &&
                    field.relationToFields.length === 0)) {
                this.relatedField = this._setRelatedField(field, modelName, models);
            }
        }
    }
    _setRelatedField(field, modelName, models) {
        if (!models)
            throw new Error(`No parameter datamodel, ${modelName}#${field.name}`);
        const relatedModel = models.find((m) => m.name === field.type);
        if (!relatedModel)
            throw new Error(`No related model, ${modelName}#${field.name}`);
        const relatedField = relatedModel.fields.find((f) => f.relationName === field.relationName);
        if (!relatedField)
            throw new Error(`No related field, ${modelName}#${field.name}`);
        return relatedField;
    }
}

class ExtendedDMMFFieldClass extends ExtendedDMMFFieldAssociation {
}

class ExtendedDMMFModel extends FormattedNames {
    constructor(generatorConfig, model, models) {
        super(model.name);
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dbName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "uniqueFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "uniqueIndexes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "primaryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scalarFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "relationFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "filterdRelationFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "enumFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasRelationFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasRequiredJsonFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasOptionalJsonFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasOmitFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasDecimalFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasOptionalDefaultFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "imports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customImports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errorLocation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clearedDocumentation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "openapi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "optionalJsonFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "optionalJsonFieldUnion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeOptionalDefaultValuesTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeRelationValueTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeOptionalDefaultsRelationValueTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writePartialTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writePartialRelationValueTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.name = model.name;
        this.dbName = model.dbName;
        this.fields = this._getExtendedFields(model, models);
        this.uniqueFields = model.uniqueFields;
        this.uniqueIndexes = model.uniqueIndexes;
        this.documentation = model.documentation;
        this.primaryKey = model.primaryKey;
        this.scalarFields = this._setScalarFields();
        this.relationFields = this._setRelationFields();
        this.filterdRelationFields = this._setFilteredRelationFields();
        this.enumFields = this._setEnumfields();
        this.hasRelationFields = this._setHasRelationFields();
        this.hasRequiredJsonFields = this._setHasRequiredJsonFields();
        this.hasOptionalJsonFields = this._setHasOptionalJsonFields();
        this.hasDecimalFields = this._setHasDecimalFields();
        this.hasOptionalDefaultFields = this._setHasOptionalDefaultFields();
        this.hasOmitFields = this._setHasOmitFields();
        this.errorLocation = this._setErrorLocation();
        const docsContent = this._getDocumentationContent();
        this.imports = docsContent.imports;
        this.customImports = docsContent.customImports;
        this.clearedDocumentation = docsContent === null || docsContent === void 0 ? void 0 : docsContent.documentation;
        if (this.generatorConfig.extendZod !== '') {
            this.openapi = getOpenApi(model.documentation);
        }
        this.optionalJsonFields = this._setOptionalJsonFields();
        this.optionalJsonFieldUnion = this._setOptionalJsonFieldUnion();
        this.writeOptionalDefaultValuesTypes =
            this._setWriteOptionalDefaultValuesTypes();
        this.writeRelationValueTypes = this._setWriteRelationValueTypes();
        this.writeOptionalDefaultsRelationValueTypes =
            this._setWriteOptionalDefaultsRelationValueTypes();
        this.writePartialTypes = this._setWritePartialTypes();
        this.writePartialRelationValueTypes =
            this._writePartialRelationValueTypes();
    }
    _setErrorLocation() {
        return `[Error Location]: Model: '${this.name}'.`;
    }
    _getExtendedFields(model, models) {
        return model.fields.map((field) => new ExtendedDMMFFieldClass(field, this.generatorConfig, this.name, models));
    }
    _setScalarFields() {
        return this.fields.filter((field) => field.kind === 'scalar');
    }
    _setRelationFields() {
        return this.fields.filter((field) => field.kind === 'object');
    }
    _setFilteredRelationFields() {
        return this.relationFields.filter((field) => !field.type.includes(this.name));
    }
    _setHasRequiredJsonFields() {
        return this.fields.some((field) => field.isJsonType && field.isRequired);
    }
    _setHasOptionalJsonFields() {
        return this.fields.some((field) => field.isJsonType && !field.isRequired);
    }
    _setEnumfields() {
        return this.fields.filter((field) => field.kind === 'enum');
    }
    _setHasRelationFields() {
        return this.relationFields.length > 0;
    }
    _setHasOmitFields() {
        return this.fields.some((field) => field.isOmitField());
    }
    _setWriteOptionalDefaultValuesTypes() {
        return (this.generatorConfig.createOptionalDefaultValuesTypes);
    }
    _setWritePartialTypes() {
        return this.generatorConfig.createPartialTypes;
    }
    _setWriteRelationValueTypes() {
        return (this.hasRelationFields && this.generatorConfig.createRelationValuesTypes);
    }
    _setWriteOptionalDefaultsRelationValueTypes() {
        return this.writeRelationValueTypes && this.writeOptionalDefaultValuesTypes;
    }
    _writePartialRelationValueTypes() {
        return this.writeRelationValueTypes && this.writePartialTypes;
    }
    _setHasOptionalDefaultFields() {
        return this.fields.some((field) => field.isOptionalDefaultField);
    }
    _setHasDecimalFields() {
        return this.fields.some((field) => field.isDecimalType);
    }
    _setOptionalJsonFields() {
        return this.fields.filter((field) => field.isJsonType && !field.isRequired);
    }
    _setOptionalJsonFieldUnion() {
        return this.optionalJsonFields
            .map((field) => `"${field.name}"`)
            .join(' | ');
    }
    _getDocumentationContent() {
        const zodDirectives = this._extractZodDirectives();
        const automaticImports = this._getAutomaticImports();
        if (!zodDirectives)
            return {
                imports: new Set(automaticImports),
                customImports: new Set([]),
            };
        return {
            imports: new Set([...zodDirectives.customImports, ...automaticImports]),
            documentation: zodDirectives.clearedDocumentation,
            customImports: new Set(zodDirectives.customImports),
        };
    }
    _extractZodDirectives() {
        var _a, _b, _c, _d;
        if (!this.documentation)
            return;
        const importStatements = (_a = this.documentation) === null || _a === void 0 ? void 0 : _a.match(IMPORT_STATEMENT_REGEX_PATTERN);
        if (!importStatements) {
            return {
                customImports: [],
                clearedDocumentation: this.documentation
                    .replace(JSDOC_SCHEMA_TAG_REGEX, '')
                    .trim(),
            };
        }
        const type = (_b = importStatements.groups) === null || _b === void 0 ? void 0 : _b['type'];
        if (type !== 'import') {
            throw new Error(`[@zod generator error]: '${type}' is not a valid validator key. ${this.errorLocation}`);
        }
        const importsList = (_d = (_c = importStatements.groups) === null || _c === void 0 ? void 0 : _c['imports']) === null || _d === void 0 ? void 0 : _d.split(/(?<="),/g).map((statement) => statement.trim());
        if (!importsList) {
            return {
                customImports: [],
                clearedDocumentation: this.documentation,
            };
        }
        return {
            customImports: importsList
                .map((statement) => {
                var _a, _b;
                return (_b = (_a = statement
                    .match(IMPORT_STATEMENT_REGEX)) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b['statement'].replace(/["']/g, "'");
            })
                .filter((statement) => typeof statement === 'string'),
            clearedDocumentation: this.documentation
                .replace(IMPORT_STATEMENT_REGEX_PATTERN, '')
                .trim(),
        };
    }
    _getAutomaticImports() {
        const statements = [];
        const { inputTypePath } = this.generatorConfig;
        if (this.hasOptionalJsonFields) {
            statements.push(`import { NullableJsonValue } from "../${inputTypePath}/NullableJsonValue"`);
        }
        if (this.hasRequiredJsonFields) {
            statements.push(`import { InputJsonValue } from "../${inputTypePath}/InputJsonValue"`);
        }
        if (this.hasDecimalFields) {
            statements.push(`import { DecimalJSLikeSchema } from "../${inputTypePath}/DecimalJsLikeSchema"`, `import { isValidDecimalInput } from "../${inputTypePath}/isValidDecimalInput"`);
        }
        this.enumFields.forEach((field) => {
            statements.push(`import { ${field.type}Schema } from '../${inputTypePath}/${field.type}Schema'`);
        });
        return statements;
    }
}

class ExtendedDMMFDatamodel {
    constructor(generatorConfig, datamodel) {
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "enums", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "models", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "types", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.enums = this._getExtendedEnums(datamodel.enums);
        this.models = this._getExtendedModels(datamodel.models);
        this.types = this._getExtendedModels(datamodel.types);
    }
    _getExtendedModels(models) {
        return models.map((model) => new ExtendedDMMFModel(this.generatorConfig, model, models));
    }
    _getExtendedEnums(enums) {
        return enums.map((elem) => new ExtendedDMMFEnum(this.generatorConfig, elem));
    }
}

class ExtendedDMMFMappings {
    constructor(generatorConfig, mappings) {
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "modelOperations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "otherOperations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelOperations = mappings.modelOperations;
        this.otherOperations = mappings.otherOperations;
    }
}

class ExtendedDMMFSchema {
    constructor(generatorConfig, schema, datamodel) {
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "rootQueryType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rootMutationType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputObjectTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputObjectTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "enumTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fieldRefTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasJsonTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasBytesTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasDecimalTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.rootQueryType = schema.rootQueryType;
        this.rootMutationType = schema.rootMutationType;
        this.enumTypes = this._setExtendedEnumTypes(schema);
        this.inputObjectTypes = this._setExtendedInputObjectTypes(schema, datamodel);
        this.outputObjectTypes = this._setExtendedOutputObjectTypes(schema, datamodel);
        this.fieldRefTypes = schema.fieldRefTypes;
        this.hasJsonTypes = this._setHasJsonTypes();
        this.hasBytesTypes = this._setHasBytesTypes();
        this.hasDecimalTypes = this._setHasDecimalTypes();
    }
    _setExtendedInputObjectTypes(schema, datamodel) {
        return {
            ...schema.inputObjectTypes,
            prisma: schema.inputObjectTypes.prisma.map((type) => new ExtendedDMMFInputType(this.generatorConfig, type, datamodel)),
        };
    }
    _setExtendedOutputObjectTypes(schema, datamodel) {
        return {
            model: schema.outputObjectTypes.model.map((type) => {
                return new ExtendedDMMFOutputType(this.generatorConfig, type, datamodel);
            }),
            prisma: schema.outputObjectTypes.prisma.map((type) => {
                return new ExtendedDMMFOutputType(this.generatorConfig, type, datamodel);
            }),
            aggregateAndCountTypes: schema.outputObjectTypes.prisma
                .filter((type) => type.name !== 'Query' &&
                type.name !== 'Mutation' &&
                !type.name.includes('AffectedRows') &&
                !type.name.includes('RawAggregate'))
                .map((type) => new ExtendedDMMFOutputType(this.generatorConfig, type, datamodel)),
            argTypes: schema.outputObjectTypes.prisma
                .filter((type) => type.name === 'Query' || type.name === 'Mutation')
                .map((type) => new ExtendedDMMFOutputType(this.generatorConfig, type, datamodel)),
        };
    }
    _setExtendedEnumTypes(schema) {
        return {
            ...schema.enumTypes,
            prisma: schema.enumTypes.prisma.map((type) => new ExtendedDMMFSchemaEnum(this.generatorConfig, type)),
        };
    }
    _setHasJsonTypes() {
        return this.inputObjectTypes.prisma.some((type) => type.isJsonField);
    }
    _setHasBytesTypes() {
        return this.inputObjectTypes.prisma.some((type) => type.isBytesField);
    }
    _setHasDecimalTypes() {
        return this.inputObjectTypes.prisma.some((type) => type.isDecimalField);
    }
    getModelWithIncludeAndSelect(field) {
        return this.outputObjectTypes.model.find((model) => field.modelType === model.name && field.writeSelectAndIncludeArgs);
    }
}

class ExtendedDMMF {
    constructor(dmmf, config) {
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "datamodel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "schema", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mappings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "imports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customImports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = this._setGeneratorConfig(config);
        this.datamodel = this._getExtendedDatamodel(dmmf);
        this.schema = this._getExtendedSchema(dmmf);
        this.mappings = this._getExtendedMappings(dmmf);
        this.imports = this._getImports();
        this.customImports = this._getCustomImports();
    }
    _getExtendedDatamodel({ datamodel }) {
        return new ExtendedDMMFDatamodel(this.generatorConfig, datamodel);
    }
    _getExtendedSchema(dmmf) {
        return new ExtendedDMMFSchema(this.generatorConfig, dmmf.schema, this.datamodel);
    }
    _getImports() {
        return new Set(this.datamodel.models.map((model) => [...model.imports]).flat());
    }
    _getCustomImports() {
        return new Set(this.datamodel.models.map((model) => [...model.customImports]).flat());
    }
    _getExtendedMappings(dmmf) {
        return new ExtendedDMMFMappings(this.generatorConfig, dmmf.mappings);
    }
    _setGeneratorConfig(config) {
        return config;
    }
}

class ExtendedDMMFSchemaArg extends FormattedNames {
    constructor(generatorConfig, arg, linkedField) {
        super(arg.name);
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "comment", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isNullable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isRequired", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inputTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "deprecation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "zodValidatorString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "zodCustomErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "zodCustomValidatorString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "zodOmitField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasSingleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasMultipleTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isOptional", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isJsonType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isBytesType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isDecimalType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "linkedField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_setInputTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (inputTypes) => {
                const nonNullTypes = inputTypes.filter(({ type }) => type !== 'Null');
                if (this.name === 'by') {
                    return nonNullTypes
                        .filter((inputType) => inputType.isList === true)
                        .map((inputType) => {
                        return new ExtendedDMMFSchemaArgInputType(this.generatorConfig, inputType);
                    });
                }
                return nonNullTypes.map((inputType) => {
                    return new ExtendedDMMFSchemaArgInputType(this.generatorConfig, inputType);
                });
            }
        });
        this.generatorConfig = generatorConfig;
        this.name = arg.name;
        this.comment = arg.comment;
        this.isNullable = arg.isNullable;
        this.isRequired = arg.isRequired;
        this.inputTypes = this._setInputTypes(arg.inputTypes);
        this.deprecation = arg.deprecation;
        this.zodValidatorString = arg.zodValidatorString;
        this.zodCustomErrors = arg.zodCustomErrors;
        this.zodCustomValidatorString = arg.zodCustomValidatorString;
        this.zodOmitField = arg.zodOmitField;
        this.hasSingleType = this._setHasSingleType();
        this.hasMultipleTypes = this._setHasMultipleTypes();
        this.isOptional = this._setIsOptional();
        this.isJsonType = this._setIsJsonType();
        this.isBytesType = this._setIsBytesType();
        this.isDecimalType = this._setIsDecimalType();
        this.linkedField = linkedField;
    }
    _setHasSingleType() {
        return this.inputTypes.length === 1;
    }
    _setHasMultipleTypes() {
        return this.inputTypes.length > 1;
    }
    _setIsOptional() {
        return !this.isRequired;
    }
    _setIsJsonType() {
        return this.inputTypes.some((inputType) => inputType.isJsonType);
    }
    _setIsBytesType() {
        return this.inputTypes.some((inputType) => inputType.isBytesType);
    }
    _setIsDecimalType() {
        return this.inputTypes.some((inputType) => inputType.isDecimalType);
    }
    rewriteArgWithNewType() {
        return /create|update|upsert|delete|data/.test(this.name);
    }
    getImports(fieldName) {
        const imports = this.inputTypes
            .map((type) => {
            const importType = type.getZodNonScalarType();
            const stringImportType = importType === null || importType === void 0 ? void 0 : importType.toString();
            if (stringImportType === fieldName) {
                return;
            }
            if (type.isJsonType) {
                return `import { InputJsonValue } from './InputJsonValue';`;
            }
            if (type.isDecimalType) {
                const decimalImports = [
                    `import { isValidDecimalInput } from './isValidDecimalInput';`,
                ];
                if (type.isList) {
                    decimalImports.push(`import { DecimalJSLikeListSchema } from './DecimalJsLikeListSchema';`);
                }
                if (!type.isList) {
                    decimalImports.push(`import { DecimalJSLikeSchema } from './DecimalJsLikeSchema';`);
                }
                return decimalImports;
            }
            if (importType) {
                return `import { ${importType}Schema } from './${importType}Schema';`;
            }
            return undefined;
        })
            .flat()
            .filter((importString) => importString !== undefined);
        return imports;
    }
}

const SPLIT_NAME_REGEX = /Unchecked|Create|Update|CreateMany|UpdateMany|Upsert|Where|WhereUnique|OrderBy|ScalarWhere|Aggregate|GroupBy/g;
class ExtendedDMMFInputType extends FormattedNames {
    constructor(generatorConfig, type, datamodel) {
        super(type.name);
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "constraints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "meta", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fieldMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "linkedModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isJsonField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isBytesField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isDecimalField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "omitFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "imports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isWhereUniqueInput", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "extendedWhereUniqueFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.name = type.name;
        this.linkedModel = this._setLinkedModel(datamodel);
        this.constraints = type.constraints;
        this.meta = type.meta;
        this.fields = this._setFields(type.fields);
        this.fieldMap = type.fieldMap;
        this.isJsonField = this._setIsJsonField();
        this.isBytesField = this._setIsBytesField();
        this.isDecimalField = this._setIsDecimalField();
        this.omitFields = this._setOmitFields();
        this.imports = this._setImports();
        this.extendedWhereUniqueFields = this._setExtendedWhereUniqueFields(type.fields);
    }
    _setLinkedModel(datamodel) {
        return datamodel.models.find((model) => {
            return model.name === this.name.split(SPLIT_NAME_REGEX)[0];
        });
    }
    _setFields(fields) {
        return fields.map((field) => {
            var _a;
            const linkedField = (_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.fields.find((modelField) => modelField.name === field.name);
            const optionalValidators = this._fieldIsPrismaFunctionType()
                ? {
                    zodValidatorString: this._getZodValidatorString(field.name),
                    zodCustomErrors: this._getZodCustomErrorsString(field.name),
                    zodCustomValidatorString: this._getZodCustomValidatorString(field.name),
                    zodOmitField: this._getZodOmitField(linkedField),
                }
                : undefined;
            return new ExtendedDMMFSchemaArg(this.generatorConfig, { ...field, ...optionalValidators }, linkedField);
        });
    }
    _fieldIsPrismaFunctionType() {
        if (!this.generatorConfig.useMultipleFiles ||
            this.generatorConfig.validateWhereUniqueInput) {
            return PRISMA_FUNCTION_TYPES_WITH_VALIDATORS_WHERE_UNIQUE.test(this.name);
        }
        return PRISMA_FUNCTION_TYPES_WITH_VALIDATORS.test(this.name);
    }
    _getZodValidatorString(fieldName) {
        var _a, _b;
        return (_b = (_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.fields.find((field) => field.name === fieldName)) === null || _b === void 0 ? void 0 : _b.zodValidatorString;
    }
    _getZodCustomErrorsString(fieldName) {
        var _a, _b;
        return (_b = (_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.fields.find((field) => field.name === fieldName)) === null || _b === void 0 ? void 0 : _b.zodCustomErrors;
    }
    _getZodCustomValidatorString(fieldName) {
        var _a, _b;
        return (_b = (_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.fields.find((field) => field.name === fieldName)) === null || _b === void 0 ? void 0 : _b.zodCustomValidatorString;
    }
    _getZodOmitField(linkedField) {
        if (!linkedField)
            return undefined;
        const shouldOmitField = linkedField.zodOmitField === 'input' ||
            linkedField.zodOmitField === 'all';
        return shouldOmitField;
    }
    _setIsJsonField() {
        return this.fields.some((field) => field.isJsonType);
    }
    _setIsBytesField() {
        return this.fields.some((field) => field.isBytesType);
    }
    _setIsDecimalField() {
        return this.fields.some((field) => field.isDecimalType);
    }
    _setOmitFields() {
        return this.fields
            .filter((field) => field.zodOmitField)
            .map((field) => field.name);
    }
    _setImports() {
        var _a;
        const { prismaClientPath } = this.generatorConfig;
        const prismaImport = `import type { Prisma } from '${prismaClientPath}';`;
        const zodImport = "import { z } from 'zod';";
        const fieldImports = [
            prismaImport,
            zodImport,
            ...this.fields.map((field) => field.getImports(this.name)).flat(),
        ];
        if (this._fieldIsPrismaFunctionType() && ((_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.customImports)) {
            fieldImports.push(...this.linkedModel.customImports);
        }
        return new Set(fieldImports);
    }
    _getExtendedWhereUniqueFieldCombinations(arr) {
        const result = [];
        function combine(start, soFar) {
            if (soFar.length === arr.length) {
                result.push(soFar.slice());
                return;
            }
            combine(start + 1, [...soFar, { ...arr[start], isRequired: true }]);
            combine(start + 1, [...soFar, { ...arr[start], isRequired: false }]);
        }
        combine(0, []);
        return result;
    }
    _setExtendedWhereUniqueFields(fields) {
        if (!this.constraints.fields || !this.name.includes('WhereUniqueInput')) {
            return undefined;
        }
        const extendedWhereUniqueFields = this.constraints.fields
            .map((fieldName) => {
            return fields.find((field) => field.name === fieldName);
        })
            .filter((field) => field !== undefined);
        const combinations = this._getExtendedWhereUniqueFieldCombinations(extendedWhereUniqueFields);
        const filteredCombinations = combinations.filter((combination) => !combination.every((field) => !field.isRequired));
        const extendedFilterdCombinations = filteredCombinations.map((combination) => {
            return combination.filter((field) => field.isRequired);
        });
        return extendedFilterdCombinations.map((combination) => {
            return this._setFields(combination);
        });
    }
    hasOmitFields() {
        return this.omitFields.length > 0;
    }
    getOmitFieldsUnion() {
        return this.omitFields.map((field) => `"${field}"`).join(' | ');
    }
}

const OMIT_FIELDS_REGEX = /create|upsert|update|delete/;
const OMIT_FIELDS_UNION_REGEX = /create|update|upsert|delete|data/;
const WRITE_INCLUDE_SELECT_FIELDS_REGEX = /findUnique|findUniqueOrThrow|findFirst|findFirstOrThrow|findMany|create|update|upsert|delete/;
const WRITE_NO_INCLUDE_SELECT_FIELDS_REGEX = /createMany|updateMany|deleteMany/;
class ExtendedDMMFSchemaField extends FormattedNames {
    constructor(generatorConfig, field, datamodel) {
        super(field.name);
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isNullable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "deprecation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "documentation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "prismaAction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "argName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modelType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "linkedModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hasOmitFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "argTypeImports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeSelectFindManyField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeSelectField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeIncludeFindManyField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeIncludeField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeSelectAndIncludeArgs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customArgType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeSelectArg", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writeIncludeArg", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.name = field.name;
        this.isNullable = field.isNullable;
        this.outputType = field.outputType;
        this.deprecation = field.deprecation;
        this.documentation = field.documentation;
        this.writeSelectAndIncludeArgs = this._setWriteSelectAndIncludeArgs();
        this.writeSelectFindManyField = this._setWriteSelectFindManyField();
        this.writeSelectField = this._setWriteSelectField();
        this.writeIncludeFindManyField = this._setWriteIncludeFindManyField();
        this.writeIncludeField = this._setWriteIncludeField();
        this.prismaAction = this._setMatchedPrismaAction();
        this.modelType = this._setModelType();
        this.argName = this._setArgName();
        this.linkedModel = this._setLinkedModel(datamodel);
        this.args = this._setArgs(field);
        this.hasOmitFields = this._setHasOmitFields();
        this.writeSelectArg = this._setWriteSelectArg();
        this.writeIncludeArg = this._setWriteIncludeArg();
        this.argTypeImports = this._setArgTypeImports();
        this.customArgType = this._setCustomArgType();
    }
    testOutputType() {
        return this.outputType.namespace === 'model';
    }
    _setArgs({ args }) {
        return args.map((arg) => {
            var _a;
            const linkedField = (_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.fields.find((field) => (field === null || field === void 0 ? void 0 : field.name) === (arg === null || arg === void 0 ? void 0 : arg.name));
            return new ExtendedDMMFSchemaArg(this.generatorConfig, arg, linkedField);
        });
    }
    _setMatchedPrismaAction() {
        return PRISMA_ACTION_ARRAY.find((elem) => this.name.includes(elem));
    }
    _setModelType() {
        return this.name
            .replace(this.prismaAction, '')
            .replace('OrThrow', '');
    }
    _setArgName() {
        const argName = PRISMA_ACTION_ARG_MAP[this.prismaAction];
        if (this.name.includes('OrThrow')) {
            return `${this.modelType}${argName === null || argName === void 0 ? void 0 : argName.formattedNames.pascalCase}OrThrowArgs`;
        }
        if (!argName)
            return;
        return `${this.modelType}${argName.formattedNames.pascalCase}Args`;
    }
    _setLinkedModel(datamodel) {
        return datamodel.models.find((model) => {
            return typeof this.modelType === 'string'
                ? this.modelType === model.name
                : false;
        });
    }
    _setHasOmitFields() {
        var _a;
        const writeOmit = OMIT_FIELDS_REGEX.test(this.name);
        if (writeOmit)
            return Boolean((_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.hasOmitFields);
        return false;
    }
    _setArgTypeImports() {
        const { prismaClientPath } = this.generatorConfig;
        const prismaImport = `import type { Prisma } from '${prismaClientPath}';`;
        const imports = ["import { z } from 'zod';", prismaImport];
        if (this.writeIncludeArg) {
            imports.push(`import { ${this.modelType}IncludeSchema } from '../${this.generatorConfig.inputTypePath}/${this.modelType}IncludeSchema'`);
        }
        this.args.forEach((arg) => {
            if (arg.hasMultipleTypes) {
                return arg.inputTypes.forEach((inputType) => {
                    imports.push(`import { ${inputType.type}Schema } from '../${this.generatorConfig.inputTypePath}/${inputType.type}Schema'`);
                });
            }
            return imports.push(`import { ${arg.inputTypes[0].type}Schema } from '../${this.generatorConfig.inputTypePath}/${arg.inputTypes[0].type}Schema'`);
        });
        return new Set(imports.filter((imp) => !imp.includes('IntSchema') && !imp.includes('BooleanSchema')));
    }
    _setWriteSelectFindManyField() {
        return (this.isObjectOutputType() &&
            this.isListOutputType() &&
            !this.generatorConfig.isMongoDb);
    }
    _setWriteSelectField() {
        return this.isObjectOutputType();
    }
    _setWriteIncludeFindManyField() {
        return (this.isObjectOutputType() &&
            this.isListOutputType() &&
            !this.generatorConfig.isMongoDb);
    }
    _setWriteIncludeField() {
        return this.isObjectOutputType() && !this.generatorConfig.isMongoDb;
    }
    _setWriteSelectAndIncludeArgs() {
        return (WRITE_INCLUDE_SELECT_FIELDS_REGEX.test(this.name) &&
            !WRITE_NO_INCLUDE_SELECT_FIELDS_REGEX.test(this.name));
    }
    _setWriteSelectArg() {
        return (this._setWriteSelectAndIncludeArgs() && this.generatorConfig.addSelectType);
    }
    _setWriteIncludeArg() {
        var _a;
        return (this._setWriteSelectAndIncludeArgs() &&
            Boolean((_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.hasRelationFields) &&
            this.generatorConfig.addIncludeType);
    }
    _shouldAddOmittedFieldsToOmitUnionArray() {
        return (this.hasOmitFields &&
            this.args.some((arg) => OMIT_FIELDS_UNION_REGEX.test(arg.name)));
    }
    _shouldAddIncludeOrSelectToOmitUnion() {
        return (this._setWriteSelectAndIncludeArgs() &&
            (!this.generatorConfig.addIncludeType ||
                !this.generatorConfig.addSelectType));
    }
    _shouldAddIncludeToOmitUnionArray() {
        var _a;
        return (this._setWriteSelectAndIncludeArgs() &&
            this._setWriteIncludeField() &&
            !this.generatorConfig.addIncludeType &&
            ((_a = this.linkedModel) === null || _a === void 0 ? void 0 : _a.hasRelationFields));
    }
    _shouldAddSelectToOmitUnionArray() {
        return (this._setWriteSelectAndIncludeArgs() &&
            this._setWriteSelectField() &&
            !this.generatorConfig.addSelectType);
    }
    _getOmitFieldsUnion(omitUnionArray) {
        return omitUnionArray.join(' | ');
    }
    _addOmittedFieldsToOmitUnionArray(omitUnionArray) {
        this.args.forEach((arg) => {
            if (OMIT_FIELDS_UNION_REGEX.test(arg.name))
                omitUnionArray.push(`"${arg.name}"`);
        });
    }
    _setCustomArgType() {
        const omitUnionArray = [];
        if (this._shouldAddSelectToOmitUnionArray()) {
            omitUnionArray.push('"select"');
        }
        if (this._shouldAddIncludeToOmitUnionArray()) {
            omitUnionArray.push('"include"');
        }
        if (this._shouldAddOmittedFieldsToOmitUnionArray()) {
            this._addOmittedFieldsToOmitUnionArray(omitUnionArray);
            return `z.ZodType<Omit<Prisma.${this.argName}, ${this._getOmitFieldsUnion(omitUnionArray)}> & { ${this._getTypeForCustomArgsType()} }>`;
        }
        if (this._shouldAddIncludeOrSelectToOmitUnion()) {
            return `z.ZodType<Omit<Prisma.${this.argName}, ${this._getOmitFieldsUnion(omitUnionArray)}>>`;
        }
        return `z.ZodType<Prisma.${this.argName}>`;
    }
    _getTypeForCustomArgsType() {
        return this.args
            .map((arg) => {
            if (arg.rewriteArgWithNewType()) {
                return (this._getCustomArgsFieldName(arg) + this._getCustomArgsType(arg));
            }
            return undefined;
        })
            .filter((arg) => arg !== undefined)
            .join(', ');
    }
    _getCustomArgsFieldName(arg) {
        return `${arg.name}${arg.isRequired ? '' : '?'}: `;
    }
    _getCustomArgsType(arg) {
        return arg.hasMultipleTypes
            ? this._getCustomArgsMultipleTypes(arg)
            : this._getCustomArgsSingleType(arg);
    }
    _getCustomArgsMultipleTypes(arg) {
        return arg.inputTypes
            .map((inputType) => {
            return `z.infer<typeof ${inputType.type}Schema>${inputType.isList ? '[]' : ''}`;
        })
            .join(' | ');
    }
    _getCustomArgsSingleType(arg) {
        if (arg.inputTypes[0].isList) {
            return `z.infer<typeof ${arg.inputTypes[0].type}Schema>[]`;
        }
        return `z.infer<typeof ${arg.inputTypes[0].type}Schema>`;
    }
    isEnumOutputType() {
        var _a;
        return ((_a = this.outputType) === null || _a === void 0 ? void 0 : _a.location) === 'enumTypes';
    }
    isListOutputType() {
        return this.outputType.isList;
    }
    isObjectOutputType() {
        var _a;
        return ((_a = this.outputType) === null || _a === void 0 ? void 0 : _a.location) === 'outputObjectTypes';
    }
    isScalarOutputType() {
        var _a;
        return ((_a = this.outputType) === null || _a === void 0 ? void 0 : _a.location) === 'scalar';
    }
    isCountField() {
        return this.name.includes('_count');
    }
}

class ExtendedDMMFOutputType extends FormattedNames {
    constructor(generatorConfig, type, datamodel) {
        super(type.name);
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fieldMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "prismaActionFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "prismaOtherFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "linkedModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "selectImports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "includeImports", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.name = type.name;
        this.fieldMap = type.fieldMap;
        this.fields = this._setFields(type.fields, datamodel);
        this.prismaActionFields = this._setFields(type.fields, datamodel, 'PRISMA_ACTION');
        this.prismaOtherFields = this._setFields(type.fields, datamodel, 'OTHER_FIELDS');
        this.linkedModel = this._setLinkedModel(datamodel);
        this.selectImports = this._setSelectImports();
        this.includeImports = this._setIncludeImports();
    }
    _setLinkedModel(datamodel) {
        return datamodel.models.find((model) => {
            return this.name.match(model.name);
        });
    }
    _setFields(fields, datamodel, fieldCategory) {
        if (fieldCategory === 'PRISMA_ACTION') {
            return fields
                .filter((field) => !field.name.includes('Raw') &&
                PRISMA_ACTION_ARRAY.some((elem) => field.name.includes(elem)))
                .map((field) => new ExtendedDMMFSchemaField(this.generatorConfig, field, datamodel));
        }
        if (fieldCategory === 'OTHER_FIELDS') {
            return fields
                .filter((field) => !PRISMA_ACTION_ARRAY.some((elem) => field.name.includes(elem)))
                .map((field) => new ExtendedDMMFSchemaField(this.generatorConfig, field, datamodel));
        }
        return fields.map((field) => {
            return new ExtendedDMMFSchemaField(this.generatorConfig, field, datamodel);
        });
    }
    _setSelectImports() {
        const imports = new Set();
        const { outputTypePath } = this.generatorConfig;
        this.fields.forEach((field) => {
            if (field.writeSelectFindManyField) {
                return imports.add(`import { ${field.outputType.type}FindManyArgsSchema } from "../${outputTypePath}/${field.outputType.type}FindManyArgsSchema"`);
            }
            if (field.writeSelectField) {
                return imports.add(`import { ${field.outputType.type}ArgsSchema } from "../${outputTypePath}/${field.outputType.type}ArgsSchema"`);
            }
            return undefined;
        });
        return imports;
    }
    _setIncludeImports() {
        const imports = new Set();
        const { outputTypePath } = this.generatorConfig;
        this.fields.forEach((field) => {
            if (field.writeIncludeFindManyField) {
                return imports.add(`import { ${field.outputType.type}FindManyArgsSchema } from "../${outputTypePath}/${field.outputType.type}FindManyArgsSchema"`);
            }
            if (field.writeIncludeField) {
                return imports.add(`import { ${field.outputType.type}ArgsSchema } from "../${outputTypePath}/${field.outputType.type}ArgsSchema"`);
            }
            return undefined;
        });
        return imports;
    }
    hasCountField() {
        return this.fields.some((field) => field.name === '_count');
    }
    hasRelationField() {
        return this.fields.some((field) => field.outputType.location === 'outputObjectTypes');
    }
    writeMongoDbInclude() {
        return (this.generatorConfig.isMongoDb &&
            this.fields.some((field) => field.isObjectOutputType()));
    }
    writeInclude() {
        return this.hasRelationField() || this.writeMongoDbInclude();
    }
    writeIncludeArgs() {
        return this.hasRelationField() || this.generatorConfig.isMongoDb;
    }
    writeCountArgs() {
        return this.hasCountField();
    }
}

class ExtendedDMMFSchemaArgInputType {
    constructor(generatorConfig, arg) {
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "isJsonType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isBytesType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isDecimalType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isNullType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isList", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "location", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "getZodScalarType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (!this.isStringType())
                    return;
                const zodType = PRISMA_TO_ZOD_TYPE_MAP$1[this.type];
                if (!zodType)
                    return;
                return zodType;
            }
        });
        Object.defineProperty(this, "getZodNonScalarType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (!this.isStringType())
                    return;
                const zodScalarType = PRISMA_TO_ZOD_TYPE_MAP$1[this.type];
                if (zodScalarType || this.isSpecialType())
                    return;
                return this.type;
            }
        });
        Object.defineProperty(this, "getZodNullType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (!this.isStringType())
                    return;
                if (!(this.type === 'Null'))
                    return;
                return 'null';
            }
        });
        Object.defineProperty(this, "isStringType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (type = this.type) => {
                return typeof type === 'string';
            }
        });
        Object.defineProperty(this, "isSchemaEnum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (type = this.type) => {
                return type.values !== undefined;
            }
        });
        Object.defineProperty(this, "isInputType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (type = this.type) => {
                return type.fields !== undefined;
            }
        });
        Object.defineProperty(this, "isSpecialType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return (this.isJsonType ||
                    this.isBytesType ||
                    this.isNullType ||
                    this.isDecimalType);
            }
        });
        this.generatorConfig = generatorConfig;
        this.isJsonType = this._setIsJsonType(arg);
        this.isBytesType = this._setIsBytesType(arg);
        this.isDecimalType = this._setIsDecimalType(arg);
        this.isNullType = this._setIsNullType(arg);
        this.isList = arg.isList;
        this.type = arg.type;
        this.location = arg.location;
        this.namespace = arg.namespace;
    }
    _setIsJsonType(arg) {
        return arg.type === 'Json';
    }
    _setIsBytesType(arg) {
        return arg.type === 'Bytes';
    }
    _setIsDecimalType(arg) {
        return arg.type === 'Decimal';
    }
    _setIsNullType(arg) {
        return arg.type === 'Null';
    }
}

class ExtendedDMMFSchemaEnum extends FormattedNames {
    constructor(generatorConfig, enumType) {
        super(enumType.name);
        Object.defineProperty(this, "generatorConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: generatorConfig
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "useNativeEnum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.generatorConfig = generatorConfig;
        this.name = enumType.name;
        this.values = enumType.values;
        this.useNativeEnum = this._setUseNativeEnum();
    }
    _setUseNativeEnum() {
        return !this.name.includes('JsonNullValue');
    }
}

class FileWriter {
    constructor(options) {
        Object.defineProperty(this, "writer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.writer = new CodeBlockWriter__default.default((options === null || options === void 0 ? void 0 : options.writerOptions) || {
            indentNumberOfSpaces: 2,
            useSingleQuote: true,
        });
    }
    createPath(path) {
        if (DirectoryHelper.pathOrDirExists(path)) {
            return path;
        }
        return DirectoryHelper.createDir(path);
    }
    createFile(path, writerFn) {
        writerFn({
            writer: this.writer,
            writeImport: this.writeImport.bind(this),
            writeImportSet: this.writeImportSet.bind(this),
            writeExport: this.writeExport.bind(this),
            writeImports: this.writeImports.bind(this),
            writeHeading: this.writeHeading.bind(this),
            writeJSDoc: this.writeJSDoc.bind(this),
        });
        fs__namespace.writeFileSync(path, this.writer.toString());
    }
    writeImport(importName, importPath) {
        this.writer.writeLine(`import ${importName} from '${importPath}';`);
    }
    writeImportSet(strings) {
        if (strings.size > 0) {
            strings.forEach((importString) => {
                this.writer.writeLine(importString);
            });
        }
    }
    writeHeading(heading, type = 'SLIM') {
        if (type === 'SLIM') {
            return (this.writer
                .writeLine(`// ${heading}`)
                .writeLine('//------------------------------------------------------'));
        }
        return (this.writer
            .writeLine('/////////////////////////////////////////')
            .writeLine(`// ${heading}`)
            .writeLine('/////////////////////////////////////////'));
    }
    writeJSDoc(doc) {
        if (!doc)
            return;
        this.writer.writeLine(`/**`);
        doc.split(/\n\r?/).forEach((line) => {
            this.writer.writeLine(` * ${line.trim()}`);
        });
        this.writer.writeLine(` */`);
    }
    writeExport(exportName, exportPath) {
        this.writer.writeLine(`export ${exportName} from '${exportPath}';`);
    }
    writeImports(imports = []) {
        new Set(imports).forEach((importString) => {
            this.writer.writeLine(importString);
        });
    }
}

const loadDMMF = async (schemaPath) => {
    const datamodel = fs__namespace.readFileSync(schemaPath, 'utf-8');
    const dmmf = await internals.getDMMF({ datamodel });
    return dmmf;
};

const writeArgs = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }, model) => {
    const { useMultipleFiles, prismaClientPath, inputTypePath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', prismaClientPath);
        writeImport(`{ ${model.name}SelectSchema }`, `../${inputTypePath}/${model.name}SelectSchema`);
        writeImport(`{ ${model.name}IncludeSchema }`, `../${inputTypePath}/${model.name}IncludeSchema`);
    }
    writer
        .blankLine()
        .write(`export const ${model.name}ArgsSchema: `)
        .write(`z.ZodType<Prisma.${model.name}Args> = `)
        .write(`z.object(`)
        .inlineBlock(() => {
        writer
            .write(`select: `)
            .write(`z.lazy(() => ${model.name}SelectSchema).optional(),`)
            .newLine()
            .conditionalWrite(model.hasRelationField(), `include: z.lazy(() => ${model.name}IncludeSchema).optional(),`);
    })
        .write(`).strict();`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${model.name}ArgsSchema;`);
    }
};

const writeCountArgs = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }, model) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', prismaClientPath);
        writeImport(`{ ${model.name}CountOutputTypeSelectSchema }`, `./${model.name}CountOutputTypeSelectSchema`);
    }
    writer
        .blankLine()
        .write(`export const ${model.name}CountOutputTypeArgsSchema: `)
        .write(`z.ZodType<Prisma.${model.name}CountOutputTypeArgs> = `)
        .write('z.object(')
        .inlineBlock(() => {
        writer.writeLine(`select: z.lazy(() => ${model.name}CountOutputTypeSelectSchema).nullish(),`);
    })
        .write(`).strict();`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer
            .blankLine()
            .writeLine(`export default ${model.name}CountOutputTypeSelectSchema;`);
    }
};

const writeCountSelect = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }, model) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', prismaClientPath);
    }
    writer
        .blankLine()
        .write(`export const ${model.name}CountOutputTypeSelectSchema: `)
        .write(`z.ZodType<Prisma.${model.name}CountOutputTypeSelect> = `)
        .write(`z.object(`)
        .inlineBlock(() => {
        model.fields.forEach((field) => {
            if (field.isListOutputType() && field.isObjectOutputType()) {
                writer.writeLine(`${field.name}: z.boolean().optional(),`);
            }
        });
    })
        .write(`).strict();`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer
            .blankLine()
            .writeLine(`export default ${model.name}CountOutputTypeSelectSchema;`);
    }
};

const writeCustomEnum = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }, { name, values }) => {
    const { useMultipleFiles } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
    }
    writer.blankLine().write(`export const ${name}Schema = z.enum([`);
    values.forEach((value, idx) => {
        const writeComma = idx !== values.length - 1;
        writer.write(`'${value.name}'${writeComma ? ',' : ''}`);
    });
    writer
        .write(`])`)
        .blankLine()
        .writeLine(`export type ${name}Type = \`\${z.infer<typeof ${name}Schema>}\``);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${name}Schema;`);
    }
};

const writeDecimalJsLike = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', `${prismaClientPath}`);
    }
    writer
        .blankLine()
        .writeLine(`export const DecimalJSLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), });`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default DecimalJSLikeSchema;`);
    }
};

const writeDecimalJsLikeList = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', `${prismaClientPath}`);
    }
    writer
        .blankLine()
        .writeLine(`export const DecimalJSLikeListSchema: z.ZodType<Prisma.DecimalJsLike[]> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), }).array();`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default DecimalJSLikeListSchema;`);
    }
};

const writeInclude = ({ fileWriter: { writer, writeImport, writeImportSet }, dmmf, }, model, getSingleFileContent = false) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', prismaClientPath);
        writeImportSet(model.includeImports);
    }
    writer
        .blankLine()
        .write(`export const ${model.name}IncludeSchema: `)
        .write(`z.ZodType<Prisma.${model.name}Include> = `)
        .write(`z.object(`)
        .inlineBlock(() => {
        model.fields.forEach((field) => {
            if (field.writeIncludeField) {
                writer
                    .write(`${field.name}: `)
                    .write(`z.union([`)
                    .write(`z.boolean(),`)
                    .conditionalWrite(field.isListOutputType(), `z.lazy(() => ${field.outputType.type}FindManyArgsSchema)`)
                    .conditionalWrite(!field.isListOutputType(), `z.lazy(() => ${field.outputType.type}ArgsSchema)`)
                    .write(`]).optional(),`)
                    .newLine();
            }
        });
    })
        .write(`).strict()`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${model.name}IncludeSchema;`);
    }
};

const writeInputJsonValue = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', prismaClientPath);
    }
    writer
        .blankLine()
        .writeLine(`export const InputJsonValue: z.ZodType<Prisma.InputJsonValue> = z.union([`)
        .withIndentationLevel(1, () => {
        writer
            .writeLine(`z.string(),`)
            .writeLine(`z.number(),`)
            .writeLine(`z.boolean(),`)
            .writeLine(`z.lazy(() => z.array(InputJsonValue.nullable())),`)
            .writeLine(`z.lazy(() => z.record(InputJsonValue.nullable())),`);
    })
        .write(`]);`)
        .blankLine()
        .writeLine(`export type InputJsonValueType = z.infer<typeof InputJsonValue>;`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default InputJsonValue;`);
    }
};

const writeInputTypeField = ({ writer, field, writeComma = false, writeValidation = false, }) => {
    const { isNullable, isOptional, zodCustomErrors, zodValidatorString, zodCustomValidatorString, } = field;
    if (field.zodOmitField) {
        writer.write(`// omitted: `);
    }
    writer.write(`${field.name}: `);
    if (field.hasMultipleTypes) {
        writer.write(`z.union([ `);
        field.inputTypes.forEach((inputType, idx) => {
            const writeComma = idx !== field.inputTypes.length - 1;
            writeScalarType(writer, {
                inputType,
                zodCustomErrors,
                zodValidatorString,
                zodCustomValidatorString,
                writeComma,
                writeValidation,
            });
            writeNonScalarType(writer, {
                inputType,
                writeComma,
            });
            writeSpecialType(writer, {
                inputType,
                zodCustomErrors,
                zodCustomValidatorString,
                writeComma,
                writeValidation,
            });
        });
        writer
            .write(` ])`)
            .conditionalWrite(!field.isRequired, `.optional()`)
            .conditionalWrite(field.isNullable, `.nullable()`)
            .write(`,`);
    }
    else {
        const inputType = field.inputTypes[0];
        writeScalarType(writer, {
            inputType,
            isNullable,
            isOptional,
            zodCustomErrors,
            zodValidatorString,
            zodCustomValidatorString,
            writeValidation,
            writeComma,
        });
        writeNonScalarType(writer, {
            inputType,
            isNullable,
            isOptional,
            writeComma,
        });
        writeSpecialType(writer, {
            inputType,
            zodCustomErrors,
            zodCustomValidatorString,
            isNullable,
            isOptional,
            writeValidation,
            writeComma,
        });
    }
    writer.newLine();
};
const writeInputObjectType = ({ fileWriter: { writer, writeImportSet }, dmmf, getSingleFileContent = false, }, inputType) => {
    const { useMultipleFiles, addInputTypeValidation } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImportSet(inputType.imports);
    }
    const type = inputType.hasOmitFields()
        ? `z.ZodType<Omit<Prisma.${inputType.name}, ${inputType.getOmitFieldsUnion()}>>`
        : `z.ZodType<Prisma.${inputType.name}>`;
    writer.blankLine().write(`export const ${inputType.name}Schema: ${type} = `);
    const { extendedWhereUniqueFields } = inputType;
    const writeExtendedWhereUniqueInput = Array.isArray(extendedWhereUniqueFields) &&
        extendedWhereUniqueFields.length !== 0;
    if (writeExtendedWhereUniqueInput) {
        if (extendedWhereUniqueFields.length === 1) {
            writer
                .write(`z.object(`)
                .inlineBlock(() => {
                extendedWhereUniqueFields[0].forEach((field, idx) => {
                    writeInputTypeField({
                        writer,
                        field,
                        writeComma: idx !== extendedWhereUniqueFields[0].length - 1,
                        writeValidation: addInputTypeValidation,
                    });
                });
            })
                .write(`)`)
                .newLine()
                .write(`.and(`);
        }
        else {
            writer
                .write(`z.union([`)
                .newLine()
                .withIndentationLevel(1, () => {
                extendedWhereUniqueFields.forEach((field) => {
                    writer
                        .write(`z.object(`)
                        .inlineBlock(() => {
                        field.forEach((field, idx) => {
                            writeInputTypeField({
                                writer,
                                field,
                                writeComma: idx !== extendedWhereUniqueFields[0].length - 1,
                                writeValidation: addInputTypeValidation,
                            });
                        });
                    })
                        .write(`),`)
                        .newLine();
                });
            })
                .writeLine(`])`)
                .write(`.and(`);
        }
    }
    writer
        .write(`z.object(`)
        .inlineBlock(() => {
        inputType.fields.forEach((field) => {
            writeInputTypeField({
                writer,
                field,
                writeValidation: addInputTypeValidation,
                writeComma: field !== inputType.fields[inputType.fields.length - 1],
            });
        });
    })
        .conditionalWrite(!writeExtendedWhereUniqueInput, `).strict();`)
        .conditionalWrite(writeExtendedWhereUniqueInput, `).strict());`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${inputType.name}Schema;`);
    }
};

const writeIsValidDecimalInput = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('type { Prisma }', `${prismaClientPath}`);
    }
    writer
        .blankLine()
        .writeLine(`export const DECIMAL_STRING_REGEX = /^[0-9.,e+-bxffo_cp]+$|Infinity|NaN/;`)
        .blankLine()
        .writeLine(`export const isValidDecimalInput =`)
        .withIndentationLevel(1, () => {
        writer
            .write(`(v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => `)
            .inlineBlock(() => {
            writer
                .writeLine(`if (v === undefined || v === null) return false;`)
                .writeLine(`return (`)
                .withIndentationLevel(3, () => {
                writer
                    .writeLine(`(typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||`)
                    .writeLine(`(typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||`)
                    .writeLine(`typeof v === 'number'`);
            })
                .write(`)`);
        })
            .write(`;`);
    });
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default isValidDecimalInput;`);
    }
};

const writeJsonValue = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', prismaClientPath);
    }
    writer
        .blankLine()
        .writeLine(`export const JsonValue: z.ZodType<Prisma.JsonValue> = z.union([`)
        .withIndentationLevel(1, () => {
        writer
            .writeLine(`z.string(),`)
            .writeLine(`z.number(),`)
            .writeLine(`z.boolean(),`)
            .writeLine(`z.lazy(() => z.array(JsonValue)),`)
            .writeLine(`z.lazy(() => z.record(JsonValue)),`);
    })
        .writeLine(`]);`)
        .blankLine()
        .writeLine(`export type JsonValueType = z.infer<typeof JsonValue>;`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default JsonValue`);
    }
};

const writeBytes = ({ writer, field, writeOptionalDefaults = false, }) => {
    writer
        .conditionalWrite(field.omitInModel(), '// omitted: ')
        .write(`${field.formattedNames.original}: `)
        .write(`z.instanceof(Buffer)`);
    writeFieldAdditions({ writer, field, writeOptionalDefaults });
};

const writeCustomValidator = ({ writer, field, writeOptionalDefaults = false, }) => {
    writer
        .conditionalWrite(field.omitInModel(), '// omitted: ')
        .write(`${field.formattedNames.original}: `)
        .write(field.zodCustomValidatorString);
    writeFieldAdditions({ writer, field, writeOptionalDefaults });
};

const writeDecimal = ({ writer, field, model, writeOptionalDefaults = false, }) => {
    writer
        .conditionalWrite(field.omitInModel(), '// omitted: ')
        .write(`${field.formattedNames.original}: `)
        .write(`z.union([`)
        .write(`z.number(),`)
        .write(`z.string(),`)
        .write(`DecimalJSLikeSchema,`)
        .write(`]`)
        .conditionalWrite(!!field.zodCustomErrors, field.zodCustomErrors)
        .write(`)`)
        .write(`.refine((v) => isValidDecimalInput(v),`)
        .write(` { message: "Field '${field.formattedNames.original}' must be a Decimal. Location: ['Models', '${model.formattedNames.original}']", `)
        .write(` })`);
    writeFieldAdditions({ writer, field, writeOptionalDefaults });
};

const writeEnum = ({ writer, field, writeOptionalDefaults = false, }) => {
    writer
        .conditionalWrite(field.omitInModel(), '// omitted: ')
        .write(`${field.formattedNames.original}: `)
        .write(`${field.zodType}Schema`);
    writeFieldAdditions({ writer, field, writeOptionalDefaults });
};

const writeFieldAdditions = ({ writer, field, writeOptionalDefaults = false, }) => {
    const { writeNullishInModelTypes } = field.generatorConfig;
    let openapiMethod;
    if (field.relationName) {
        if (field.isList) {
            openapiMethod = 'association';
        }
        else {
            openapiMethod = 'reference';
        }
    }
    else {
        openapiMethod = 'column';
    }
    writer
        .conditionalWrite(field.isList, `.array()`)
        .conditionalWrite(!!field.zodArrayValidatorString, field.zodArrayValidatorString)
        .conditionalWrite(field.isNullable &&
        !field.isOptionalOnDefaultValue &&
        !writeNullishInModelTypes, `.nullable()`)
        .conditionalWrite(field.isNullable &&
        !field.isOptionalOnDefaultValue &&
        writeNullishInModelTypes, `.nullish()`)
        .conditionalWrite(writeOptionalDefaults && field.isOptionalOnDefaultValue, `.optional()`)
        .conditionalWrite(!!field.openapi, `.${openapiMethod}(${util__namespace.inspect(writeFieldOpenApi(field))})`)
        .write(`,`)
        .newLine();
};
function writeFieldOpenApi(field) {
    var _a, _b, _c, _d, _e, _f;
    if (!field.openapi)
        return {};
    const openapi = Object.entries(___namespace.group(field.openapi, (f) => f.type)).reduce((acc, cur) => {
        const [key, value] = cur;
        const openapi = writeOpenApi([key, value]);
        if (openapi.plugin) {
            acc = {
                ...acc,
                plugins: {
                    ...acc['plugins'],
                    [openapi.plugin]: openapi.openapi,
                },
            };
        }
        else {
            const openapi = writeOpenApi([key, value]);
            acc = {
                ...acc,
                ...openapi,
            };
        }
        return acc;
    }, {});
    if (field.relationName) {
        if (field.isList) {
            return _.omitBy({
                ...{
                    display_name: ___namespace.title(field.name),
                    slug: ___namespace.snake(field.name),
                    model_name: field.type,
                    visible: true,
                    foreign_key: field.relatedField &&
                        field.relatedField.relationFromFields &&
                        field.relatedField.relationFromFields[0]
                        ? field.relatedField.relationFromFields[0]
                        : null,
                    primary_key: field.relatedField &&
                        field.relatedField.relationToFields &&
                        field.relatedField.relationToFields[0]
                        ? field.relatedField.relationToFields[0]
                        : null,
                },
                ...openapi,
                visible: visible(openapi),
            }, _.isUndefined);
        }
        return _.omitBy({
            ...{
                display_name: ___namespace.title(field.name),
                model_name: field.type,
                foreign_key: ((_a = field.relationFromFields) === null || _a === void 0 ? void 0 : _a[0]) ||
                    ((_c = (_b = field.relatedField) === null || _b === void 0 ? void 0 : _b.relationFromFields) === null || _c === void 0 ? void 0 : _c[0]) ||
                    null,
                primary_key: ((_d = field.relationToFields) === null || _d === void 0 ? void 0 : _d[0]) ||
                    ((_f = (_e = field.relatedField) === null || _e === void 0 ? void 0 : _e.relationToFields) === null || _f === void 0 ? void 0 : _f[0]) ||
                    null,
                reference_type: field.relatedField ? 'has_one' : 'belongs_to',
            },
            ...openapi,
            visible: field.relatedField
                ? visible(openapi)
                : undefined,
        }, _.isUndefined);
    }
    return _.omitBy({
        ...{
            display_name: ___namespace.title(field.name),
            column_type: field.type,
        },
        ...openapi,
        visible: field.generatorConfig.defaultInvisibleField.indexOf(field.name) > -1
            ? false
            : visible(openapi),
        access_type: field.generatorConfig.defaultReadOnlyField.indexOf(field.name) > -1
            ? 'read_only'
            : 'read_write',
    }, _.isUndefined);
}

const writeJsDoc = (writer, jsDoc) => {
    if (!jsDoc)
        return;
    writer.writeLine(`/**`);
    jsDoc.split(/\n\r?/).forEach((line) => {
        writer.writeLine(` * ${line.trim()}`);
    });
    writer.writeLine(` */`);
};

const writeJson = ({ writer, field }) => {
    writer
        .conditionalWrite(field.omitInModel(), '// omitted: ')
        .write(`${field.formattedNames.original}: `)
        .write(`z.any()`)
        .conditionalWrite(field.isList, `.array()`)
        .conditionalWrite(!field.isRequired, `.optional()`);
    writeFieldAdditions({ writer, field });
};

const writeNonScalarType = (writer, { inputType, isOptional, isNullable, writeLazy = true, writeComma = true }) => {
    const nonScalarType = inputType.getZodNonScalarType();
    if (!nonScalarType)
        return;
    return writer
        .conditionalWrite(writeLazy, `z.lazy(() => ${nonScalarType}Schema)`)
        .conditionalWrite(!writeLazy, `${nonScalarType}Schema`)
        .conditionalWrite(inputType.isList, `.array()`)
        .conditionalWrite(isOptional, `.optional()`)
        .conditionalWrite(isNullable, `.nullable()`)
        .conditionalWrite(writeComma, `,`);
};

const writeRelation = ({ writer, field, writeOptionalDefaults = false, isPartial = false, isOptionalDefaults = false, }) => {
    const isMongoDb = field.generatorConfig.provider === 'mongodb';
    writer
        .conditionalWrite(field.omitInModel(), '// omitted: ')
        .write(`${field.name}: `)
        .conditionalWrite(!isMongoDb && !isPartial && !isOptionalDefaults, `z.lazy(() => ${field.type}WithRelationsSchema)`)
        .conditionalWrite(!isMongoDb && isPartial, `z.lazy(() => ${field.type}PartialWithRelationsSchema)`)
        .conditionalWrite(!isMongoDb && isOptionalDefaults, `z.lazy(() => ${field.type}OptionalDefaultsWithRelationsSchema)`)
        .conditionalWrite(isMongoDb, `z.lazy(() => ${field.type}Schema)`);
    writeFieldAdditions({ writer, field, writeOptionalDefaults });
};

const writeScalar = ({ writer, field, writeOptionalDefaults = false, }) => {
    if (field.type === 'DateTime') {
        writer
            .write(`${field.name}: `)
            .conditionalWrite(!field.generatorConfig.coerceDate, `z.${field.zodType}(`)
            .conditionalWrite(field.generatorConfig.coerceDate, `z.coerce.${field.zodType}(`)
            .conditionalWrite(!!field.zodCustomErrors, field.zodCustomErrors)
            .write(`)`)
            .conditionalWrite(!!field.zodValidatorString, field.zodValidatorString);
        writeFieldAdditions({ writer, field, writeOptionalDefaults });
    }
    else {
        writer
            .write(`${field.name}: `)
            .write(`z.${field.zodType}(`)
            .conditionalWrite(!!field.zodCustomErrors, field.zodCustomErrors)
            .write(`)`)
            .conditionalWrite(!!field.zodValidatorString, field.zodValidatorString);
        writeFieldAdditions({ writer, field, writeOptionalDefaults });
    }
};

const writeScalarType = (writer, { inputType, isOptional, isNullable, writeComma = true, zodCustomErrors, zodValidatorString, zodCustomValidatorString, writeValidation = true, }) => {
    const zodType = inputType.getZodScalarType();
    if (!zodType)
        return;
    if (zodCustomValidatorString) {
        if (zodType === 'date') {
            return writer
                .conditionalWrite(inputType.generatorConfig.addInputTypeValidation, zodCustomValidatorString)
                .conditionalWrite(!inputType.generatorConfig.addInputTypeValidation &&
                !inputType.generatorConfig.coerceDate, `z.${zodType}()`)
                .conditionalWrite(!inputType.generatorConfig.addInputTypeValidation &&
                inputType.generatorConfig.coerceDate, `z.coerce.${zodType}()`)
                .conditionalWrite(inputType.isList, `.array()`)
                .conditionalWrite(isOptional, `.optional()`)
                .conditionalWrite(isNullable, `.nullable()`)
                .conditionalWrite(writeComma, `,`);
        }
        return writer
            .conditionalWrite(inputType.generatorConfig.addInputTypeValidation, zodCustomValidatorString)
            .conditionalWrite(!inputType.generatorConfig.addInputTypeValidation, `z.${zodType}()`)
            .conditionalWrite(inputType.isList, `.array()`)
            .conditionalWrite(isOptional, `.optional()`)
            .conditionalWrite(isNullable, `.nullable()`)
            .conditionalWrite(writeComma, `,`);
    }
    if (zodType === 'date') {
        return writer
            .conditionalWrite(!inputType.generatorConfig.coerceDate, `z.${zodType}(`)
            .conditionalWrite(inputType.generatorConfig.coerceDate, `z.coerce.${zodType}(`)
            .conditionalWrite(writeValidation && !!zodCustomErrors, zodCustomErrors)
            .write(`)`)
            .conditionalWrite(writeValidation && !!zodValidatorString, zodValidatorString)
            .conditionalWrite(inputType.isList, `.array()`)
            .conditionalWrite(isOptional, `.optional()`)
            .conditionalWrite(isNullable, `.nullable()`)
            .conditionalWrite(writeComma, `,`);
    }
    return writer
        .write(`z.${zodType}(`)
        .conditionalWrite(writeValidation && !!zodCustomErrors, zodCustomErrors)
        .write(`)`)
        .conditionalWrite(writeValidation && !!zodValidatorString, zodValidatorString)
        .conditionalWrite(inputType.isList, `.array()`)
        .conditionalWrite(isOptional, `.optional()`)
        .conditionalWrite(isNullable, `.nullable()`)
        .conditionalWrite(writeComma, `,`);
};

const writeSpecialType = (writer, { inputType, isOptional, isNullable, writeComma = true, zodCustomErrors, zodCustomValidatorString, }) => {
    if (!inputType.isSpecialType())
        return;
    if (zodCustomValidatorString &&
        inputType.generatorConfig.addInputTypeValidation) {
        return writer
            .write(zodCustomValidatorString)
            .conditionalWrite(inputType.isList, `.array()`)
            .conditionalWrite(isOptional, `.optional()`)
            .conditionalWrite(isNullable, `.nullable()`)
            .conditionalWrite(writeComma, `,`);
    }
    if (inputType.isDecimalType) {
        if (inputType.isList) {
            return writer
                .write(`z.union([`)
                .write(`z.number().array(),`)
                .write(`z.string().array(),`)
                .write(`DecimalJSLikeListSchema,`)
                .write(`]`)
                .conditionalWrite(!!zodCustomErrors, `, ${zodCustomErrors}`)
                .write(`)`)
                .write(`.refine((v) => `)
                .write(`Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)),`)
                .write(` { message: 'Must be a Decimal' })`)
                .conditionalWrite(isOptional, `.optional()`)
                .conditionalWrite(isNullable, `.nullable()`)
                .conditionalWrite(writeComma, `,`);
        }
        return writer
            .write(`z.union([`)
            .write(`z.number(),`)
            .write(`z.string(),`)
            .write(`DecimalJSLikeSchema,`)
            .write(`]`)
            .conditionalWrite(!!zodCustomErrors, `, ${zodCustomErrors}`)
            .write(`)`)
            .write(`.refine((v) => isValidDecimalInput(v),`)
            .write(` { message: 'Must be a Decimal' })`)
            .conditionalWrite(isOptional, `.optional()`)
            .conditionalWrite(isNullable, `.nullable()`)
            .conditionalWrite(writeComma, `,`);
    }
    if (inputType.isJsonType) {
        return writer
            .write(`InputJsonValue`)
            .conditionalWrite(inputType.isList, `.array()`)
            .conditionalWrite(isOptional, `.optional()`)
            .conditionalWrite(isNullable, `.nullable()`)
            .conditionalWrite(writeComma, `,`);
    }
    if (inputType.isBytesType) {
        return writer
            .write(`z.instanceof(Buffer)`)
            .conditionalWrite(inputType.isList, `.array()`)
            .conditionalWrite(isOptional, `.optional()`)
            .conditionalWrite(isNullable, `.nullable()`)
            .conditionalWrite(writeComma, `,`);
    }
    return writer
        .write(`z.null(),`)
        .conditionalWrite(!isOptional, `.optional()`)
        .conditionalWrite(isNullable, `.nullable()`)
        .conditionalWrite(writeComma, `,`);
};

const writeModelOrType = ({ fileWriter: { writer, writeImport, writeImportSet, writeJSDoc, writeHeading, }, dmmf, getSingleFileContent = false, }, model) => {
    const { useMultipleFiles, createRelationValuesTypes, inputTypePath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImportSet(model.imports);
        if (createRelationValuesTypes && model.hasRelationFields) {
            if (model.hasOptionalJsonFields) {
                writeImport(`type { NullableJsonInput }`, `../${inputTypePath}/transformJsonNull`);
            }
            const imports = new Set();
            const typeImports = [];
            const schemaImports = [];
            model.filterdRelationFields.forEach((field) => {
                if (!dmmf.generatorConfig.isMongoDb) {
                    typeImports.push([
                        `${field.type}WithRelations`,
                        `${field.type}Schema`,
                    ]);
                    schemaImports.push([
                        `${field.type}WithRelationsSchema`,
                        `${field.type}Schema`,
                    ]);
                    if (model.writePartialTypes) {
                        typeImports.push([
                            `${field.type}PartialWithRelations`,
                            `${field.type}Schema`,
                        ]);
                        schemaImports.push([
                            `${field.type}PartialWithRelationsSchema`,
                            `${field.type}Schema`,
                        ]);
                    }
                    if (model.writeOptionalDefaultValuesTypes) {
                        typeImports.push([
                            `${field.type}OptionalDefaultsWithRelations`,
                            `${field.type}Schema`,
                        ]);
                        schemaImports.push([
                            `${field.type}OptionalDefaultsWithRelationsSchema`,
                            `${field.type}Schema`,
                        ]);
                    }
                }
                else {
                    typeImports.push([`${field.type}`, `${field.type}Schema`]);
                    schemaImports.push([`${field.type}Schema`, `${field.type}Schema`]);
                }
            });
            typeImports.forEach((type) => {
                imports.add(`import type { ${type[0]} } from './${type[1]}'`);
            });
            schemaImports.forEach((schema) => {
                imports.add(`import { ${schema[0]} } from './${schema[1]}'`);
            });
            writeImportSet(imports);
        }
    }
    writer.blankLine();
    writeHeading(`${model.formattedNames.upperCaseSpace} SCHEMA`, 'FAT');
    writer.blankLine();
    writeJSDoc(model.clearedDocumentation);
    writer
        .write(`export const ${model.name}Schema = z.object(`)
        .inlineBlock(() => {
        [...model.enumFields, ...model.scalarFields].forEach((field) => {
            writer.conditionalWrite(field.omitInModel(), '// omitted: ');
            writeModelFields({
                writer,
                field,
                model,
                dmmf,
            });
        });
    })
        .write(`)`)
        .conditionalWrite(!!model.openapi, `.resource(${util__namespace.inspect(writeModelOpenApi(model))})`)
        .blankLine()
        .write(`export type ${model.name} = z.infer<typeof ${model.name}Schema>`);
    if (model.writePartialTypes) {
        writer.blankLine();
        writeHeading(`${model.formattedNames.upperCaseSpace} PARTIAL SCHEMA`, 'FAT');
        writer
            .blankLine()
            .write(`export const ${model.name}PartialSchema = ${model.name}Schema.partial()`);
        writer
            .blankLine()
            .write(`export type ${model.name}Partial = z.infer<typeof ${model.name}PartialSchema>`);
    }
    if (model.writeOptionalDefaultValuesTypes) {
        writer.blankLine();
        writeHeading(`${model.formattedNames.upperCaseSpace} OPTIONAL DEFAULTS SCHEMA`, useMultipleFiles ? 'FAT' : 'SLIM');
        writer
            .blankLine()
            .write(`export const ${model.name}OptionalDefaultsSchema = `)
            .write(`${model.name}Schema.merge(z.object(`)
            .inlineBlock(() => {
            [...model.enumFields, ...model.scalarFields].forEach((field) => {
                if (!field.isOptionalDefaultField)
                    return;
                const writeOptions = {
                    writer,
                    field,
                    writeOptionalDefaults: true,
                };
                writer.conditionalWrite(field.omitInModel(), '// omitted: ');
                writeModelFields({
                    ...writeOptions,
                    model,
                    dmmf,
                });
            });
        })
            .write(`))`);
        writer
            .blankLine()
            .write(`export type ${model.name}OptionalDefaults = z.infer<typeof ${model.name}OptionalDefaultsSchema>`);
    }
    if (model.writeRelationValueTypes) {
        writer.blankLine();
        writeHeading(`${model.formattedNames.upperCaseSpace} RELATION SCHEMA`, useMultipleFiles ? 'FAT' : 'SLIM');
        writer
            .blankLine()
            .write(`export type ${model.name}Relations = `)
            .inlineBlock(() => {
            model.relationFields.forEach((field) => {
                writer
                    .conditionalWrite(field.omitInModel(), '// omitted: ')
                    .write(field.name)
                    .conditionalWrite(!field.isRequired, '?')
                    .write(': ')
                    .conditionalWrite(!dmmf.generatorConfig.isMongoDb, `${field.type}WithRelations`)
                    .conditionalWrite(dmmf.generatorConfig.isMongoDb, `${field.type}`)
                    .conditionalWrite(field.isList, '[]')
                    .conditionalWrite(!field.isRequired, ' | null')
                    .write(';')
                    .newLine();
            });
        })
            .write(`;`)
            .blankLine();
        if (model.hasOptionalJsonFields) {
            writer
                .write(`export type ${model.name}WithRelations = Omit<z.infer<typeof ${model.name}Schema>, ${model.optionalJsonFieldUnion}> & `)
                .inlineBlock(() => {
                model.optionalJsonFields.forEach((field) => {
                    writer.write(`${field.name}?: NullableJsonInput;`).newLine();
                });
            })
                .write(` & `);
        }
        else {
            writer.write(`export type ${model.name}WithRelations = z.infer<typeof ${model.name}Schema> & `);
        }
        writer.write(`${model.name}Relations`);
        writer
            .blankLine()
            .write(`export const ${model.name}WithRelationsSchema: z.ZodObject<any> = ${model.name}Schema.merge(z.object(`)
            .inlineBlock(() => {
            model.relationFields.forEach((field) => {
                writeRelation({ writer, field });
            });
        })
            .write(`))`);
    }
    if (model.writeOptionalDefaultsRelationValueTypes) {
        writer.blankLine();
        writeHeading(`${model.formattedNames.upperCaseSpace} OPTIONAL DEFAULTS RELATION SCHEMA`, useMultipleFiles ? 'FAT' : 'SLIM');
        writer
            .blankLine()
            .write(`export type ${model.name}OptionalDefaultsRelations = `)
            .inlineBlock(() => {
            model.relationFields.forEach((field) => {
                writer
                    .conditionalWrite(field.omitInModel(), '// omitted: ')
                    .write(field.name)
                    .conditionalWrite(!field.isRequired, '?')
                    .write(': ')
                    .conditionalWrite(!dmmf.generatorConfig.isMongoDb, `${field.type}OptionalDefaultsWithRelations`)
                    .conditionalWrite(dmmf.generatorConfig.isMongoDb, `${field.type}`)
                    .conditionalWrite(field.isList, '[]')
                    .conditionalWrite(!field.isRequired, ' | null')
                    .write(';')
                    .newLine();
            });
        })
            .write(`;`)
            .blankLine();
        if (model.hasOptionalJsonFields) {
            writer
                .write(`export type ${model.name}OptionalDefaultsWithRelations = Omit<z.infer<typeof ${model.name}OptionalDefaultsSchema>, ${model.optionalJsonFieldUnion}> & `)
                .inlineBlock(() => {
                model.optionalJsonFields.forEach((field) => {
                    writer.write(`${field.name}?: NullableJsonInput;`).newLine();
                });
            })
                .write(` & `);
        }
        else {
            writer.write(`export type ${model.name}OptionalDefaultsWithRelations = z.infer<typeof ${model.name}OptionalDefaultsSchema> & `);
        }
        writer.write(`${model.name}OptionalDefaultsRelations`);
        writer
            .blankLine()
            .write(`export const ${model.name}OptionalDefaultsWithRelationsSchema: z.ZodType<${model.name}OptionalDefaultsWithRelations> = ${model.name}OptionalDefaultsSchema.merge(z.object(`)
            .inlineBlock(() => {
            model.relationFields.forEach((field) => {
                writeRelation({
                    writer,
                    field,
                    isOptionalDefaults: true,
                });
            });
        })
            .write(`))`);
    }
    if (model.writePartialRelationValueTypes) {
        writer.blankLine();
        writeHeading(`${model.formattedNames.upperCaseSpace} PARTIAL RELATION SCHEMA`, useMultipleFiles ? 'FAT' : 'SLIM');
        writer
            .blankLine()
            .write(`export type ${model.name}PartialRelations = `)
            .inlineBlock(() => {
            model.relationFields.forEach((field) => {
                writer
                    .conditionalWrite(field.omitInModel(), '// omitted: ')
                    .write(field.name)
                    .write('?')
                    .write(': ')
                    .conditionalWrite(!dmmf.generatorConfig.isMongoDb, `${field.type}PartialWithRelations`)
                    .conditionalWrite(dmmf.generatorConfig.isMongoDb, `${field.type}`)
                    .conditionalWrite(field.isList, '[]')
                    .conditionalWrite(!field.isRequired, ' | null')
                    .write(';')
                    .newLine();
            });
        })
            .write(`;`)
            .blankLine();
        if (model.hasOptionalJsonFields) {
            writer
                .write(`export type ${model.name}PartialWithRelations = Omit<z.infer<typeof ${model.name}PartialSchema>, ${model.optionalJsonFieldUnion}> & `)
                .inlineBlock(() => {
                model.optionalJsonFields.forEach((field) => {
                    writer.write(`${field.name}?: NullableJsonInput;`).newLine();
                });
            })
                .write(` & `)
                .write(`${model.name}PartialRelations`);
        }
        else {
            writer
                .write(`export type ${model.name}PartialWithRelations = z.infer<typeof ${model.name}PartialSchema> & `)
                .write(`${model.name}PartialRelations`);
        }
        writer
            .blankLine()
            .write(`export const ${model.name}PartialWithRelationsSchema: z.ZodType<${model.name}PartialWithRelations> = ${model.name}PartialSchema.merge(z.object(`)
            .inlineBlock(() => {
            model.relationFields.forEach((field) => {
                writeRelation({ writer, field, isPartial: true });
            });
        })
            .write(`)).partial()`);
        if (model.writeOptionalDefaultsRelationValueTypes) {
            writer.blankLine();
            if (model.hasOptionalJsonFields) {
                writer
                    .write(`export type ${model.name}OptionalDefaultsWithPartialRelations = Omit<z.infer<typeof ${model.name}OptionalDefaultsSchema>, ${model.optionalJsonFieldUnion}> & `)
                    .inlineBlock(() => {
                    model.optionalJsonFields.forEach((field) => {
                        writer.write(`${field.name}?: NullableJsonInput;`).newLine();
                    });
                })
                    .write(` & `);
            }
            else {
                writer.write(`export type ${model.name}OptionalDefaultsWithPartialRelations = z.infer<typeof ${model.name}OptionalDefaultsSchema> & `);
            }
            writer.write(`${model.name}PartialRelations`);
            writer
                .blankLine()
                .write(`export const ${model.name}OptionalDefaultsWithPartialRelationsSchema: z.ZodType<${model.name}OptionalDefaultsWithPartialRelations> = ${model.name}OptionalDefaultsSchema.merge(z.object(`)
                .inlineBlock(() => {
                model.relationFields.forEach((field) => {
                    writeRelation({
                        writer,
                        field,
                        isPartial: true,
                    });
                });
            })
                .write(`).partial())`);
        }
        if (model.writeRelationValueTypes) {
            writer.blankLine();
            if (model.hasOptionalJsonFields) {
                writer
                    .write(`export type ${model.name}WithPartialRelations = Omit<z.infer<typeof ${model.name}Schema>, ${model.optionalJsonFieldUnion}> & `)
                    .inlineBlock(() => {
                    model.optionalJsonFields.forEach((field) => {
                        writer.write(`${field.name}?: NullableJsonInput;`).newLine();
                    });
                })
                    .write(` & `);
            }
            else {
                writer.write(`export type ${model.name}WithPartialRelations = z.infer<typeof ${model.name}Schema> & `);
            }
            writer.write(`${model.name}PartialRelations`);
            writer
                .blankLine()
                .write(`export const ${model.name}WithPartialRelationsSchema: z.ZodType<${model.name}WithPartialRelations> = ${model.name}Schema.merge(z.object(`)
                .inlineBlock(() => {
                model.relationFields.forEach((field) => {
                    writeRelation({
                        writer,
                        field,
                        isPartial: true,
                    });
                });
            })
                .write(`).partial())`);
        }
    }
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${model.name}Schema;`);
    }
};
function writeModelOpenApi(model) {
    const primary_key = model.fields.filter((f) => f.isId);
    if (!model.openapi)
        return {};
    const openapi = Object.entries(___namespace.group(model.openapi, (f) => f.type)).reduce((acc, cur) => {
        const [key, value] = cur;
        const openapi = writeOpenApi([key, value]);
        if (openapi.plugin) {
            acc = {
                ...acc,
                plugins: {
                    ...acc['plugins'],
                    [openapi.plugin]: openapi.openapi,
                },
            };
        }
        else {
            const openapi = writeOpenApi([key, value]);
            acc = {
                ...acc,
                ...openapi,
            };
        }
        return acc;
    }, {});
    return _.omitBy({
        ...{
            name: model.name,
            slug: ___namespace.snake(plur__default.default(model.name)),
            table_name: model.name,
            class_name: model.name,
            display_name: ___namespace.title(plur__default.default(model.name)),
            primary_key: primary_key[0] ? primary_key[0].name : null,
            visible: true,
            display_primary_key: 'true',
        },
        ...openapi,
        visible: visible(openapi),
    }, _.isUndefined);
}

const writeModelFields = (options) => {
    if (options.field.clearedDocumentation) {
        writeJsDoc(options.writer, options.field.clearedDocumentation);
    }
    if (options.field.zodCustomValidatorString) {
        return writeCustomValidator(options);
    }
    if (options.field.kind === 'enum') {
        return writeEnum(options);
    }
    if (options.field.isJsonType) {
        return writeJson(options);
    }
    if (options.field.isBytesType) {
        return writeBytes(options);
    }
    if (options.field.isDecimalType) {
        return writeDecimal(options);
    }
    return writeScalar(options);
};

const writeNullableJsonValue = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }) => {
    const { useMultipleFiles } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('transformJsonNull', './transformJsonNull');
        writeImport('JsonValue', './JsonValue');
    }
    writer
        .blankLine()
        .writeLine(`export const NullableJsonValue = z`)
        .withIndentationLevel(1, () => {
        writer
            .writeLine(`.union([JsonValue, z.literal('DbNull'), z.literal('JsonNull')])`)
            .writeLine('.nullable()')
            .writeLine(`.transform((v) => transformJsonNull(v));`);
    })
        .blankLine()
        .writeLine(`export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default NullableJsonValue;`);
    }
};

const writeSelect = ({ fileWriter: { writer, writeImport, writeImportSet }, dmmf, getSingleFileContent = false, }, model) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
        writeImport('type { Prisma }', prismaClientPath);
        writeImportSet(model.selectImports);
    }
    writer
        .blankLine()
        .write(`export const ${model.name}SelectSchema: `)
        .write(`z.ZodType<Prisma.${model.name}Select> = `)
        .write(`z.object(`)
        .inlineBlock(() => {
        model.fields.forEach((field) => {
            if (field.isEnumOutputType()) {
                return writer
                    .write(`${field.name}: `)
                    .write(`z.boolean()`)
                    .write(`.optional(),`)
                    .newLine();
            }
            if (field.writeSelectFindManyField) {
                return writer
                    .write(`${field.name}: `)
                    .write(`z.union([`)
                    .write(`z.boolean(),`)
                    .write(`z.lazy(() => ${field.outputType.type}FindManyArgsSchema)`)
                    .write(`])`)
                    .write(`.optional()`)
                    .write(`,`)
                    .newLine();
            }
            if (field.writeSelectField) {
                return writer
                    .write(`${field.name}: `)
                    .write(`z.union([`)
                    .write(`z.boolean(),`)
                    .write(`z.lazy(() => ${field.outputType.type}ArgsSchema)`)
                    .write(`])`)
                    .write(`.optional()`)
                    .write(`,`)
                    .newLine();
            }
            return writer
                .write(`${field.name}: `)
                .write(`z.boolean()`)
                .write(`.optional(),`)
                .newLine();
        });
    });
    writer.write(`).strict()`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${model.name}SelectSchema;`);
    }
};

const writeOutputObjectType = ({ fileWriter, dmmf, getSingleFileContent = false }, field) => {
    const { writer, writeImportSet, writeHeading } = fileWriter;
    const { useMultipleFiles } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImportSet(field.argTypeImports);
        const modelWithSelect = dmmf.schema.getModelWithIncludeAndSelect(field);
        if (modelWithSelect && field.generatorConfig.addSelectType) {
            writeImportSet(modelWithSelect.selectImports);
            if (field.writeSelectAndIncludeArgs) {
                writeHeading('Select schema needs to be in file to prevent circular imports');
                writeSelect({ fileWriter, dmmf, getSingleFileContent: true }, modelWithSelect);
            }
        }
    }
    writer
        .blankLine()
        .write(`export const ${field.argName}Schema: `)
        .write(field.customArgType)
        .write(` = `)
        .write(`z.object(`)
        .inlineBlock(() => {
        writer
            .conditionalWriteLine(field.writeSelectArg, `select: ${field.modelType}SelectSchema.optional(),`)
            .conditionalWriteLine(field.writeIncludeArg, `include: ${field.modelType}IncludeSchema.optional(),`);
        field.args.forEach((arg) => {
            writer.write(`${arg.name}: `);
            const { isOptional, isNullable } = arg;
            if (arg.hasMultipleTypes) {
                writer.write(`z.union([ `);
                arg.inputTypes.forEach((inputType, idx) => {
                    const writeComma = idx !== arg.inputTypes.length - 1;
                    writeScalarType(writer, {
                        inputType,
                        writeLazy: false,
                        writeComma,
                    });
                    writeNonScalarType(writer, {
                        inputType,
                        writeLazy: false,
                        writeComma,
                    });
                    writeSpecialType(writer, {
                        inputType,
                        writeLazy: false,
                        writeComma,
                    });
                });
                writer
                    .write(` ])`)
                    .conditionalWrite(arg.isOptional, `.optional()`)
                    .conditionalWrite(arg.isNullable, `.nullable()`)
                    .write(`,`);
            }
            else {
                writeScalarType(writer, {
                    inputType: arg.inputTypes[0],
                    writeLazy: false,
                    isNullable,
                    isOptional,
                });
                writeNonScalarType(writer, {
                    inputType: arg.inputTypes[0],
                    writeLazy: false,
                    isNullable,
                    isOptional,
                });
                writeSpecialType(writer, {
                    inputType: arg.inputTypes[0],
                    writeLazy: false,
                    isNullable,
                    isOptional,
                });
            }
            writer.newLine();
        });
    })
        .write(`).strict()`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${field.argName}Schema;`);
    }
};

const writePrismaEnum = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }, { useNativeEnum, values, name }) => {
    const { useMultipleFiles } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ z }', 'zod');
    }
    if (useNativeEnum) {
        writer.blankLine().write(`export const ${name}Schema = z.enum([`);
        values.forEach((value, idx) => {
            const writeComma = idx !== values.length - 1;
            writer.write(`'${value}'${writeComma ? ',' : ''}`);
        });
        writer.write(`]);`);
    }
    else {
        writer
            .conditionalWrite(useMultipleFiles && name.includes('NullableJson'), `import transformJsonNull from './transformJsonNull'`)
            .blankLine()
            .write(`export const ${name}Schema = z.enum([`);
        values.forEach((value) => {
            writer.write(`'${value}',`);
        });
        writer
            .write(`])`)
            .conditionalWrite(!name.includes('Nullable'), `;`)
            .conditionalWrite(name.includes('Nullable'), `.transform((v) => transformJsonNull(v));`);
    }
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default ${name}Schema;`);
    }
};

const writeTransformJsonNull = ({ fileWriter: { writer, writeImport }, dmmf, getSingleFileContent = false, }) => {
    const { useMultipleFiles, prismaClientPath } = dmmf.generatorConfig;
    if (useMultipleFiles && !getSingleFileContent) {
        writeImport('{ Prisma }', prismaClientPath);
    }
    writer
        .newLine()
        .write(`export type NullableJsonInput = `)
        .write(`Prisma.JsonValue | `)
        .write(`null | `)
        .write(`'JsonNull' | `)
        .write(`'DbNull' | `)
        .write(`Prisma.NullTypes.DbNull | `)
        .write(`Prisma.NullTypes.JsonNull;`)
        .blankLine();
    writer
        .write(`export const transformJsonNull = (v?: NullableJsonInput) => `)
        .inlineBlock(() => {
        writer
            .writeLine(`if (!v || v === 'DbNull') return Prisma.DbNull;`)
            .writeLine(`if (v === 'JsonNull') return Prisma.JsonNull;`)
            .writeLine(`return v;`);
    })
        .write(`;`);
    if (useMultipleFiles && !getSingleFileContent) {
        writer.blankLine().writeLine(`export default transformJsonNull;`);
    }
};

const writeArgTypeFiles = ({ path: outputPath, dmmf }) => {
    if (!dmmf.generatorConfig.createInputTypes)
        return;
    const { outputTypePath } = dmmf.generatorConfig;
    const indexFileWriter = new FileWriter();
    const path = indexFileWriter.createPath(`${outputPath}/${outputTypePath}`);
    if (path) {
        indexFileWriter.createFile(`${path}/index.ts`, ({ writeExport }) => {
            dmmf.schema.outputObjectTypes.model.forEach((model) => {
                if (model.hasRelationField()) {
                    writeExport(`{ ${model.name}ArgsSchema }`, `./${model.name}ArgsSchema`);
                }
            });
            dmmf.schema.outputObjectTypes.argTypes.forEach((outputType) => {
                outputType.prismaActionFields.forEach((field) => {
                    writeExport(`{ ${field.argName}Schema }`, `./${field.argName}Schema`);
                });
            });
        });
        dmmf.schema.outputObjectTypes.model.forEach((model) => {
            if (model.writeIncludeArgs()) {
                new FileWriter().createFile(`${path}/${model.name}ArgsSchema.ts`, (fileWriter) => writeArgs({ fileWriter, dmmf }, model));
            }
            if (model.writeCountArgs()) {
                new FileWriter().createFile(`${path}/${model.name}CountOutputTypeArgsSchema.ts`, (fileWriter) => writeCountArgs({ fileWriter, dmmf }, model));
                new FileWriter().createFile(`${path}/${model.name}CountOutputTypeSelectSchema.ts`, (fileWriter) => writeCountSelect({ fileWriter, dmmf }, model));
            }
        });
        dmmf.schema.outputObjectTypes.argTypes.forEach((outputType) => {
            outputType.prismaActionFields.forEach((field) => {
                new FileWriter().createFile(`${path}/${field.argName}Schema.ts`, (fileWriter) => writeOutputObjectType({ fileWriter, dmmf }, field));
            });
        });
    }
};

const writeInputTypeFiles = ({ path: outputPath, dmmf, }) => {
    const { inputTypePath } = dmmf.generatorConfig;
    const indexFileWriter = new FileWriter();
    const path = indexFileWriter.createPath(`${outputPath}/${inputTypePath}`);
    if (path) {
        indexFileWriter.createFile(`${path}/index.ts`, ({ writeExport }) => {
            if (dmmf.generatorConfig.createInputTypes) {
                dmmf.schema.inputObjectTypes.prisma.forEach(({ name }) => {
                    writeExport(`{ ${name}Schema }`, `./${name}Schema`);
                });
            }
            dmmf.schema.enumTypes.prisma.forEach(({ name }) => {
                writeExport(`{ ${name}Schema }`, `./${name}Schema`);
            });
            dmmf.datamodel.enums.forEach(({ name }) => {
                writeExport(`{ ${name}Schema }`, `./${name}Schema`);
            });
            if (dmmf.schema.hasJsonTypes) {
                writeExport(`{ transformJsonNull }`, `./transformJsonNull`);
                writeExport(`{ NullableJsonValue }`, `./NullableJsonValue`);
                writeExport(`{ InputJsonValue }`, `./InputJsonValue`);
                writeExport(`{ JsonValue }`, `./JsonValue`);
            }
            if (dmmf.schema.hasDecimalTypes) {
                writeExport(`{ DecimalJSLikeSchema }`, `./DecimalJsLikeSchema`);
                writeExport(`{ DecimalJSLikeListSchema }`, `./DecimalJsLikeListSchema`);
                writeExport(`{ isValidDecimalInput }`, `./isValidDecimalInput`);
            }
        });
        if (dmmf.schema.hasJsonTypes) {
            new FileWriter().createFile(`${path}/transformJsonNull.ts`, (fileWriter) => writeTransformJsonNull({ fileWriter, dmmf }));
            new FileWriter().createFile(`${path}/JsonValue.ts`, (fileWriter) => writeJsonValue({ fileWriter, dmmf }));
            new FileWriter().createFile(`${path}/NullableJsonValue.ts`, (fileWriter) => writeNullableJsonValue({ fileWriter, dmmf }));
            new FileWriter().createFile(`${path}/InputJsonValue.ts`, (fileWriter) => writeInputJsonValue({ fileWriter, dmmf }));
        }
        if (dmmf.schema.hasDecimalTypes) {
            new FileWriter().createFile(`${path}/DecimalJsLikeSchema.ts`, (fileWriter) => writeDecimalJsLike({ fileWriter, dmmf }));
            new FileWriter().createFile(`${path}/DecimalJsLikeListSchema.ts`, (fileWriter) => writeDecimalJsLikeList({ fileWriter, dmmf }));
            new FileWriter().createFile(`${path}/isValidDecimalInput.ts`, (fileWriter) => writeIsValidDecimalInput({ fileWriter, dmmf }));
        }
        dmmf.schema.enumTypes.prisma.forEach((enumData) => {
            new FileWriter().createFile(`${path}/${enumData.name}Schema.ts`, (fileWriter) => writePrismaEnum({ fileWriter, dmmf }, enumData));
        });
        dmmf.datamodel.enums.forEach((enumData) => {
            new FileWriter().createFile(`${path}/${enumData.name}Schema.ts`, (fileWriter) => writeCustomEnum({ fileWriter, dmmf }, enumData));
        });
        if (!dmmf.generatorConfig.createInputTypes)
            return;
        dmmf.schema.outputObjectTypes.model.forEach((model) => {
            if (model.hasRelationField()) {
                new FileWriter().createFile(`${path}/${model.name}IncludeSchema.ts`, (fileWriter) => writeInclude({ fileWriter, dmmf }, model));
            }
            new FileWriter().createFile(`${path}/${model.name}SelectSchema.ts`, (fileWriter) => writeSelect({ fileWriter, dmmf }, model));
        });
        dmmf.schema.inputObjectTypes.prisma.forEach((inputType) => {
            new FileWriter().createFile(`${path}/${inputType.name}Schema.ts`, (fileWriter) => writeInputObjectType({ fileWriter, dmmf }, inputType));
        });
    }
};

const writeModelFiles = ({ path, dmmf }) => {
    if (!dmmf.generatorConfig.createModelTypes)
        return;
    const indexFileWriter = new FileWriter();
    const modelPath = indexFileWriter.createPath(`${path}/modelSchema`);
    if (modelPath) {
        indexFileWriter.createFile(`${modelPath}/index.ts`, ({ writeExport }) => {
            dmmf.datamodel.models.forEach((model) => {
                writeExport(`*`, `./${model.name}Schema`);
            });
            dmmf.datamodel.types.forEach((model) => {
                writeExport(`*`, `./${model.name}Schema`);
            });
        });
    }
    dmmf.datamodel.models.forEach((model) => {
        new FileWriter().createFile(`${modelPath}/${model.name}Schema.ts`, (fileWriter) => writeModelOrType({ fileWriter, dmmf }, model));
    });
    dmmf.datamodel.types.forEach((model) => {
        new FileWriter().createFile(`${modelPath}/${model.name}Schema.ts`, (fileWriter) => writeModelOrType({ fileWriter, dmmf }, model));
    });
};

const writeSingleFileArgTypeStatements = (dmmf, fileWriter) => {
    if (!dmmf.generatorConfig.createInputTypes)
        return;
    fileWriter.writer.blankLine();
    fileWriter.writeHeading(`ARGS`, 'FAT');
    dmmf.schema.outputObjectTypes.argTypes.forEach((outputType) => {
        outputType.prismaActionFields.forEach((field) => {
            writeOutputObjectType({ dmmf, fileWriter }, field);
        });
    });
};

const writeSingleFileEnumStatements = (dmmf, fileWriter) => {
    fileWriter.writer.blankLine();
    fileWriter.writeHeading(`ENUMS`, 'FAT');
    dmmf.schema.enumTypes.prisma.forEach((enumData) => {
        writePrismaEnum({ dmmf, fileWriter }, enumData);
    });
    dmmf.datamodel.enums.forEach((enumData) => {
        writeCustomEnum({ fileWriter, dmmf }, enumData);
    });
    fileWriter.writer.newLine();
};

const writeSingleFileHelperStatements = (dmmf, fileWriter) => {
    fileWriter.writer.blankLine();
    fileWriter.writeHeading('HELPER FUNCTIONS', 'FAT');
    fileWriter.writer.blankLine();
    if (dmmf.schema.hasJsonTypes) {
        fileWriter.writeHeading(`JSON`, 'SLIM');
        writeTransformJsonNull({ fileWriter, dmmf });
        writeJsonValue({ fileWriter, dmmf });
        writeNullableJsonValue({ fileWriter, dmmf });
        writeInputJsonValue({ fileWriter, dmmf });
        fileWriter.writer.newLine();
    }
    if (dmmf.schema.hasDecimalTypes) {
        fileWriter.writeHeading(`DECIMAL`, 'SLIM');
        writeDecimalJsLike({ fileWriter, dmmf });
        writeDecimalJsLikeList({ fileWriter, dmmf });
        writeIsValidDecimalInput({ fileWriter, dmmf });
        fileWriter.writer.newLine();
    }
};

const writeSingleFileImportStatements = (dmmf, { writer, writeImport }) => {
    const { prismaClientPath, extendZod } = dmmf.generatorConfig;
    writeImport('{ z }', 'zod');
    if (dmmf.schema.hasJsonTypes) {
        writeImport(`{ Prisma }`, `${prismaClientPath}`);
    }
    else {
        writeImport(`type { Prisma }`, `${prismaClientPath}`);
    }
    if (extendZod != '') {
        writeImport(`{ extendZod }`, `${extendZod}`);
        writer.writeLine(`extendZod(z);`);
    }
    if (dmmf.customImports) {
        dmmf.customImports.forEach((statement) => {
            writer.writeLine(statement);
        });
    }
};

const writeSingleFileIncludeSelectStatements = (dmmf, fileWriter) => {
    if (!dmmf.generatorConfig.createInputTypes)
        return;
    fileWriter.writer.blankLine();
    fileWriter.writeHeading(`SELECT & INCLUDE`, 'FAT');
    fileWriter.writer.blankLine();
    dmmf.schema.outputObjectTypes.model.forEach((model) => {
        fileWriter.writeHeading(`${model.formattedNames.upperCaseSpace}`, 'SLIM');
        if (model.writeInclude()) {
            writeInclude({ fileWriter, dmmf }, model);
        }
        if (model.writeIncludeArgs()) {
            writeArgs({ fileWriter, dmmf }, model);
        }
        if (model.writeCountArgs()) {
            writeCountArgs({ fileWriter, dmmf }, model);
            writeCountSelect({ fileWriter, dmmf }, model);
        }
        writeSelect({ fileWriter, dmmf }, model);
        fileWriter.writer.blankLine();
    });
};

const writeSingleFileInputTypeStatements = (dmmf, fileWriter) => {
    if (!dmmf.generatorConfig.createInputTypes)
        return;
    fileWriter.writer.blankLine();
    fileWriter.writeHeading(`INPUT TYPES`, 'FAT');
    dmmf.schema.inputObjectTypes.prisma.forEach((inputType) => {
        writeInputObjectType({ dmmf, fileWriter }, inputType);
        fileWriter.writer.newLine();
    });
};

const writeSingleFileModelStatements = (dmmf, fileWriter) => {
    if (!dmmf.generatorConfig.createModelTypes)
        return;
    fileWriter.writeHeading(`MODELS`, 'FAT');
    dmmf.datamodel.models.forEach((model) => {
        writeModelOrType({ fileWriter, dmmf }, model);
        fileWriter.writer.newLine();
    });
};

const writeSingleFileTypeStatements = (dmmf, fileWriter) => {
    if (!dmmf.generatorConfig.createModelTypes ||
        dmmf.generatorConfig.provider !== 'mongodb')
        return;
    fileWriter.writer.blankLine();
    fileWriter.writeHeading(`MONGODB TYPES`, 'FAT');
    dmmf.datamodel.types.forEach((type) => {
        fileWriter.writeHeading(`${type.formattedNames.upperCaseSpace}`, 'SLIM');
        fileWriter.writer.newLine();
        writeModelOrType({ fileWriter, dmmf }, type);
        fileWriter.writer.newLine();
    });
};

const generateSingleFile = ({ dmmf, path }) => {
    new FileWriter().createFile(`${path}/index.ts`, (fileWriter) => {
        writeSingleFileImportStatements(dmmf, fileWriter);
        writeSingleFileHelperStatements(dmmf, fileWriter);
        writeSingleFileEnumStatements(dmmf, fileWriter);
        writeSingleFileModelStatements(dmmf, fileWriter);
        writeSingleFileTypeStatements(dmmf, fileWriter);
        writeSingleFileIncludeSelectStatements(dmmf, fileWriter);
        writeSingleFileInputTypeStatements(dmmf, fileWriter);
        writeSingleFileArgTypeStatements(dmmf, fileWriter);
    });
};

const generateMultipleFiles = ({ dmmf, path }) => {
    new FileWriter().createFile(`${path}/index.ts`, ({ writeExport }) => {
        if (dmmf.generatorConfig.createModelTypes) {
            writeExport('*', './modelSchema');
        }
        writeExport('*', `./${dmmf.generatorConfig.inputTypePath}`);
        if (dmmf.generatorConfig.createInputTypes) {
            writeExport('*', `./${dmmf.generatorConfig.outputTypePath}`);
        }
    });
    writeModelFiles({ path, dmmf });
    writeInputTypeFiles({ path, dmmf });
    writeArgTypeFiles({ path, dmmf });
};

exports.DirectoryHelper = DirectoryHelper;
exports.ExtendedDMMF = ExtendedDMMF;
exports.ExtendedDMMFModel = ExtendedDMMFModel;
exports.FileWriter = FileWriter;
exports.generateMultipleFiles = generateMultipleFiles;
exports.generateSingleFile = generateSingleFile;
exports.loadDMMF = loadDMMF;
exports.parseGeneratorConfig = parseGeneratorConfig;
exports.skipGenerator = skipGenerator;
exports.writeFieldOpenApi = writeFieldOpenApi;
exports.writeModelFiles = writeModelFiles;
exports.writeModelOpenApi = writeModelOpenApi;
exports.writeModelOrType = writeModelOrType;
