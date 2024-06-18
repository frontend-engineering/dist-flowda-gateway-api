import { ServiceSymbol, ReferenceKeySchema, AssociationKeySchema, ColumnUISchema } from '@flowda/types';
export { createZodDto, extendZod } from '@flowda/types';
import consola from 'consola';
import * as _ from 'radash';
import { HttpException } from '@nestjs/common';
import { repeat, set } from 'lodash';
import { createId } from '@paralleldrive/cuid2';
import merge from 'ts-deepmerge';
import { z } from 'zod';

function bindService(bind, constructor) {
    bind(constructor).toSelf().inSingletonScope();
    bind(ServiceSymbol).toFactory((context) => {
        return context.container.get(constructor);
    });
}
function bindServiceSymbol(bind, implementIdentifier, constructor) {
    bind(implementIdentifier).to(constructor).inSingletonScope();
    bind(ServiceSymbol).toFactory((context) => {
        return context.container.get(implementIdentifier);
    });
}
function getServices(servicesContainer) {
    return servicesContainer.getAll(ServiceSymbol).map((service) => {
        return {
            provide: service.constructor,
            useValue: service,
        };
    });
}

/// <reference types="@types/express-serve-static-core" />
/// <reference types="@types/qs" />
const REQ_END = '================================================ End ================================================\n';
const ERROR_END = '***************************************** ERROR END *****************************************';
function logInputSerialize(object) {
    setTimeout(function () {
        consola.info('request args  :');
        console.log(object);
        console.log();
    }, 0);
}
function logOutputSerialize(object) {
    setTimeout(function () {
        console.log();
        if ((object === null || object === void 0 ? void 0 : object.code) < 0) {
            consola.info('response error:');
            console.log(Object.assign(Object.assign({}, object), { message: '<...>', data: Object.assign(Object.assign({}, object.data), { stack: '<...>' }) }));
        }
        else {
            consola.info('response data :');
            const resp = JSON.stringify(object);
            if (resp.length > 1000)
                console.log(resp.slice(0, 1000) + '...');
            else
                console.log(object);
        }
        console.log(REQ_END + '\n');
    }, 0);
}
function logContext(opts) {
    setTimeout(function () {
        const req = opts.req;
        console.log('=============================================== Start ===============================================');
        consola.info('url           :', req.url.split('?')[0]);
        consola.info('from          :', req.headers['x-from']);
    }, 0);
}
function getStatusKeyFromStatus(status) {
    var _a;
    return (_a = JSONRPC2_TO_HTTP_STATUS[status]) !== null && _a !== void 0 ? _a : 'INTERNAL_SERVER_ERROR';
}
function getErrorCodeFromKey(key) {
    var _a;
    return (_a = TRPC_ERROR_CODES_BY_KEY[key]) !== null && _a !== void 0 ? _a : -32603;
}
const JSONRPC2_TO_HTTP_CODE = {
    PARSE_ERROR: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    METHOD_NOT_SUPPORTED: 405,
    TIMEOUT: 408,
    CONFLICT: 409,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    UNPROCESSABLE_CONTENT: 422,
    TOO_MANY_REQUESTS: 429,
    CLIENT_CLOSED_REQUEST: 499,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
};
const JSONRPC2_TO_HTTP_STATUS = _.invert(JSONRPC2_TO_HTTP_CODE);
const TRPC_ERROR_CODES_BY_KEY = {
    /**
     * Invalid JSON was received by the server.
     * An error occurred on the server while parsing the JSON text.
     */
    PARSE_ERROR: -32700,
    /**
     * The JSON sent is not a valid Request object.
     */
    BAD_REQUEST: -32600, // 400
    // Internal JSON-RPC error
    INTERNAL_SERVER_ERROR: -32603,
    NOT_IMPLEMENTED: -32603,
    // Implementation specific errors
    UNAUTHORIZED: -32001, // 401
    FORBIDDEN: -32003, // 403
    NOT_FOUND: -32004, // 404
    METHOD_NOT_SUPPORTED: -32005, // 405
    TIMEOUT: -32008, // 408
    CONFLICT: -32009, // 409
    PRECONDITION_FAILED: -32012, // 412
    PAYLOAD_TOO_LARGE: -32013, // 413
    UNPROCESSABLE_CONTENT: -32022, // 422
    TOO_MANY_REQUESTS: -32029, // 429
    CLIENT_CLOSED_REQUEST: -32099, // 499
};
function logErrorStart(opts) {
    setTimeout(function () {
        consola.error('**************************************** ERROR START ****************************************');
        consola.info(`procedure    :`, `${opts.path}.${opts.type}`);
        consola.info(`input        :`);
        console.log(opts.input);
    }, 0);
}
function logErrorEnd(opts) {
    setTimeout(function () {
        consola.info(`message      :`, opts.error.message);
        consola.info(`stack        :`, opts.error.stack);
        consola.error(ERROR_END);
    }, 0);
}
function transformHttpException(opts, json) {
    const shape = opts.shape;
    const key = getStatusKeyFromStatus(json.status);
    const code = getErrorCodeFromKey(key);
    setTimeout(function () {
        consola.info(`cause`);
        console.log(`    status     :`, json.status);
        console.log(`    message    :`, json.message);
        console.log(`    error      :`, json.error);
        consola.info(`stack        :`, json.stack);
        consola.error(ERROR_END);
    }, 0);
    return Object.assign(Object.assign({}, shape), { code, 
        // message // message 无需替代 throw new ConflictException('<message>') 第一个参数已经替代了 https://docs.nestjs.com/exception-filters#built-in-http-exceptions
        data: Object.assign(Object.assign({}, shape.data), {
            code: key, // 替换成 HttpException 对应的 短字符
            httpStatus: json.status, // 替换成 http status code
            description: {
                // 详情
                procedure: `${opts.path}.${opts.type}`,
                input: opts.input,
                error: json.error,
            },
        }) });
}
function errorFormatter(opts, handlers) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let json = {
        procedure: `${opts.path}.${opts.type}`,
        input: opts.input,
        diagnosis: ((_a = opts.ctx) === null || _a === void 0 ? void 0 : _a._diagnosis) || [],
    };
    const requestId = ((_b = opts.ctx) === null || _b === void 0 ? void 0 : _b.requestId) || '';
    const tenantId = ((_d = (_c = opts.ctx) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.tenantId) || ((_f = (_e = opts.ctx) === null || _e === void 0 ? void 0 : _e.tenant) === null || _f === void 0 ? void 0 : _f.id);
    const userId = (_h = (_g = opts.ctx) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.id;
    logErrorStart(opts);
    consola.info(`tenantId     :`, tenantId);
    consola.info(`userId       :`, userId);
    if (Array.isArray((_j = opts.ctx) === null || _j === void 0 ? void 0 : _j._diagnosis) && opts.ctx._diagnosis.length > 0) {
        consola.info(`trace:`);
        const msg = opts.ctx._diagnosis
            .map((m) => {
            const indent = repeat(' ', 4);
            const msg = m.map(i => (typeof i === 'string' ? i : JSON.stringify(i))).join(', ');
            return indent + msg;
        })
            .join('\n');
        console.log(msg);
        console.log();
    }
    // 如果是 nestjs HttpException
    if (opts.error.cause instanceof HttpException) {
        const json2 = {
            status: opts.error.cause.getStatus(),
            message: opts.error.cause.getResponse()['message'],
            error: opts.error.cause.getResponse()['error'],
            stack: opts.error.stack,
        };
        json = Object.assign(json, json2);
        const ret = transformHttpException(opts, json2);
        if (typeof (handlers === null || handlers === void 0 ? void 0 : handlers.log) === 'function') {
            handlers.log({
                requestId,
                tenantId,
                userId,
                log: json,
            });
        }
        return ret;
    }
    else {
        logErrorEnd(opts);
        json = Object.assign(json, {
            message: opts.error.message,
            stack: opts.error.stack,
        });
        if (typeof (handlers === null || handlers === void 0 ? void 0 : handlers.log) === 'function') {
            handlers.log({
                requestId,
                tenantId,
                userId,
                log: json,
            });
        }
        return opts.shape;
    }
}
// object => object 是默认值
// https://github.com/trpc/trpc/blob/next/packages/client/src/internals/transformer.ts#L57
const transformer = {
    input: {
        // on client
        serialize: (object) => object,
        // on server -> resolver
        deserialize: (object) => {
            logInputSerialize(object);
            return object;
        },
    },
    output: {
        // on server -> client
        serialize: (object) => {
            logOutputSerialize(object);
            return object;
        },
        // on client
        deserialize: (object) => object,
    },
};
function createContext(opts) {
    logContext(opts);
    const requestId = createId();
    opts.res.setHeader('x-request-id', requestId);
    consola.info('x-request-id  :', requestId);
    return {
        req: opts.req,
        res: opts.res,
        requestId,
        _diagnosis: [],
        user: undefined,
        tenant: undefined,
    };
}
/**
 * 一个简单的基于 trpc ctx 的 诊断工具 报错之后会记录手动埋的路径，方便排查错误
 */
function diag(ctx, ...message) {
    (ctx === null || ctx === void 0 ? void 0 : ctx._diagnosis) != null && ctx._diagnosis.push(message);
}

const ignoredSuffix = [
    'TransactionIsolationLevelSchema',
    'ScalarFieldEnumSchema',
    'SortOrderSchema',
    'DecimalJSLike',
    'NullableJsonNullValueInput',
    'JsonNullValueInput',
    'NullsOrder',
    'JsonNullValueFilter',
    'DynamicColumnType',
];
/**
 * convert all tables from a zod-prisma-types generated xx.ts
 * to ui schema spec compatible (suffix ResourceSchema) constant value
 *
 * e.g. CustomerOrderWithRelationsSchema -> CustomerOrderResourceSchema
 */
function getAllResourceSchema(zt) {
    const exportedKeys = Object.keys(zt);
    const cz = exportedKeys.reduce((acc, cur) => {
        if (!cur.endsWith('Schema'))
            return acc;
        if (ignoredSuffix.some(x => cur.indexOf(x) > -1))
            return acc;
        if (cur.endsWith('WithRelationsSchema')) {
            const k = cur.split('WithRelationsSchema')[0] + 'ResourceSchema';
            acc[k] = zt[cur];
            return acc;
        }
        else {
            if (cur.endsWith('Schema')) {
                const prefix = cur.split('Schema')[0];
                const k = (prefix + 'WithRelationsSchema');
                if (exportedKeys.indexOf(k) === -1) {
                    acc[prefix + 'ResourceSchema'] = zt[cur];
                    return acc;
                }
            }
            else {
                throw new Error(`Wrong branch, key:${cur}`);
            }
        }
        return acc;
    }, {});
    return cz;
}

class SchemaTransformer {
    set(jsonschema) {
        this.jsonschema = jsonschema;
        const processed = processJsonschema(jsonschema);
        this.columns = processed.columns;
        this.associations = processed.associations;
        return this;
    }
    toJSON() {
        if (!this.jsonschema)
            throw new Error(`No jsonschema set`);
        return _.omit(Object.assign(Object.assign({}, this.jsonschema), { properties: undefined, required: undefined, columns: this.columns, associations: this.associations }), ['properties', 'required']);
    }
}
function processJsonschema(jsonschema) {
    if (jsonschema.properties == null)
        throw new Error(`no properties, ${jsonschema.class_name}`);
    const props = jsonschema.properties;
    const refCols = Object.keys(props)
        .filter(k => {
        const prop = props[k];
        if ('model_name' in prop && 'reference_type' in prop) {
            return prop.model_name && prop.reference_type;
        }
        return false;
    })
        .map(k => {
        const prop = props[k];
        const ret = ReferenceKeySchema.safeParse(prop);
        if (!ret.success)
            throw new Error(`reference parse error, k:${k}, prop: ${JSON.stringify(prop)}, error: ${ret.error.message}`);
        return ret.data;
    });
    return Object.keys(props).reduce((acc, cur) => {
        const prop = props[cur];
        if ('reference_type' in prop && prop.reference_type === 'belongs_to') {
            // reference 忽略，在 foreign_key column 附着在 reference 上
            return acc;
        }
        if ('model_name' in prop && !('reference_type' in prop)) {
            const ret = AssociationKeySchema.safeParse(Object.assign(Object.assign({}, prop), { name: cur }));
            if (!ret.success)
                throw new Error(`association parse error, k:${cur}, prop: ${JSON.stringify(prop)}, error: ${ret.error.message}`);
            acc.associations.push(ret.data);
            return acc;
        }
        const ref = refCols.find(r => r.foreign_key === cur);
        let colParseRet;
        if ('reference_type' in prop && prop.reference_type === 'has_one') {
            colParseRet = ColumnUISchema.safeParse({
                column_type: 'reference',
                display_name: prop.display_name,
                //            ^?
                validators: [],
                name: cur,
                visible: prop.visible,
                reference: prop,
            });
        }
        else if ('column_type' in prop) {
            colParseRet = ColumnUISchema.safeParse(Object.assign(Object.assign({}, prop), { name: cur, validators: [], reference: ref }));
        }
        else {
            throw new Error(`unknown branch, ${JSON.stringify(prop)}`);
        }
        if (!colParseRet.success)
            throw new Error(`column parse error, k:${cur}, prop: ${JSON.stringify(prop)}, error: ${colParseRet.error.message}`);
        const col = colParseRet.data;
        if (jsonschema.required && jsonschema.required.indexOf(cur) > -1) {
            if (!col.validators)
                col.validators = [];
            col.validators.push({
                required: true,
            });
        }
        acc.columns.push(col);
        return acc;
    }, {
        columns: [],
        associations: [],
    });
}

function traverse(path, tree, visit) {
    visit(path, tree);
    if (tree != null && tree.type === 'object' && tree.properties != null) {
        Object.keys(tree.properties).forEach(k => {
            var _a;
            const prop = (_a = tree === null || tree === void 0 ? void 0 : tree.properties) === null || _a === void 0 ? void 0 : _a[k];
            //    ^?
            if (prop == null)
                return;
            if ('$ref' in prop) {
                throw new Error('$ref not support');
            }
            traverse(`${path}.${k}`, prop, visit);
        });
    }
    if (tree.type === 'array' && tree.items) {
        if ('$ref' in tree.items) {
            throw new Error('array $ref not support');
        }
        traverse(`${path}[0]`, tree.items, visit);
    }
}
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function extractToDef(defs, body) {
    const bodyIn = body.content['application/json'];
    const title = bodyIn.schema.title;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const example = {};
    traverse('root', bodyIn.schema, (p, node) => {
        if (!!(node === null || node === void 0 ? void 0 : node.description) || !!(node === null || node === void 0 ? void 0 : node.example)) {
            set(example, p, `${node.description}(e.g. ${node.example})`);
        }
    });
    defs[title] = Object.assign(Object.assign({}, bodyIn.schema), { example: example.root || {} });
    bodyIn.schema = {
        $ref: `#/definitions/${title}`,
    };
}
function convertToSwage(input) {
    const defs = {};
    Object.keys(input.paths).forEach(path => {
        const pathVal = input.paths[path];
        Object.keys(pathVal).forEach(method => {
            const methodVal = pathVal[method];
            const { requestBody, responses } = methodVal;
            extractToDef(defs, requestBody);
            Object.keys(responses).forEach(resCode => {
                const resCodeVal = responses[resCode];
                extractToDef(defs, resCodeVal);
            });
        });
    });
    return Object.assign(Object.assign({}, input), { definitions: defs });
}

function iterateZodObject({ zodRef, useOutput, }) {
    return Object.keys(zodRef.shape).reduce((carry, key) => (Object.assign(Object.assign({}, carry), { [key]: generateSchema(zodRef.shape[key], useOutput) })), {});
}
function parseTransformation({ zodRef, schemas, useOutput, }) {
    const input = generateSchema(zodRef._def.schema, useOutput);
    let output = 'undefined';
    if (useOutput && zodRef._def.effect) {
        const effect = zodRef._def.effect.type === 'transform' ? zodRef._def.effect : null;
        if (effect && 'transform' in effect) {
            try {
                output = typeof effect.transform(['integer', 'number'].includes(`${input.type}`)
                    ? 0
                    : 'string' === input.type
                        ? ''
                        : 'boolean' === input.type
                            ? false
                            : 'object' === input.type
                                ? {}
                                : 'null' === input.type
                                    ? null
                                    : 'array' === input.type
                                        ? []
                                        : undefined, { addIssue: () => undefined, path: [] } // TODO: Discover if context is necessary here
                );
            }
            catch (e) {
                /**/
            }
        }
    }
    return merge(Object.assign(Object.assign(Object.assign({}, (zodRef.description ? { description: zodRef.description } : {})), input), (['number', 'string', 'boolean', 'null'].includes(output)
        ? {
            type: output,
        }
        : {})), ...schemas);
}
function parseString({ zodRef, schemas, }) {
    const baseSchema = {
        type: 'string',
    };
    const { checks = [] } = zodRef._def;
    checks.forEach((item) => {
        switch (item.kind) {
            case 'email':
                baseSchema.format = 'email';
                break;
            case 'uuid':
                baseSchema.format = 'uuid';
                break;
            case 'cuid':
                baseSchema.format = 'cuid';
                break;
            case 'url':
                baseSchema.format = 'uri';
                break;
            case 'datetime':
                baseSchema.format = 'date-time';
                break;
            case 'length':
                baseSchema.minLength = item.value;
                baseSchema.maxLength = item.value;
                break;
            case 'max':
                baseSchema.maxLength = item.value;
                break;
            case 'min':
                baseSchema.minLength = item.value;
                break;
            case 'regex':
                baseSchema.pattern = item.regex.source;
                break;
        }
    });
    return merge(baseSchema, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseNumber({ zodRef, schemas, }) {
    const baseSchema = {
        type: 'number',
    };
    const { checks = [] } = zodRef._def;
    checks.forEach((item) => {
        switch (item.kind) {
            case 'max':
                baseSchema.maximum = item.value;
                // TODO: option to make this always explicit? (false instead of non-existent)
                if (!item.inclusive)
                    baseSchema.exclusiveMaximum = true;
                break;
            case 'min':
                baseSchema.minimum = item.value;
                if (!item.inclusive)
                    baseSchema.exclusiveMinimum = true;
                break;
            case 'int':
                baseSchema.type = 'integer';
                break;
            case 'multipleOf':
                baseSchema.multipleOf = item.value;
        }
    });
    return merge(baseSchema, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseObject({ zodRef, schemas, useOutput, }) {
    var _a;
    let additionalProperties;
    // `catchall` obviates `strict`, `strip`, and `passthrough`
    if (!(zodRef._def.catchall instanceof z.ZodNever ||
        ((_a = zodRef._def.catchall) === null || _a === void 0 ? void 0 : _a._def.typeName) === 'ZodNever'))
        additionalProperties = generateSchema(zodRef._def.catchall, useOutput);
    else if (zodRef._def.unknownKeys === 'passthrough')
        additionalProperties = true;
    else if (zodRef._def.unknownKeys === 'strict')
        additionalProperties = false;
    // So that `undefined` values don't end up in the schema and be weird
    additionalProperties = additionalProperties != null ? { additionalProperties } : {};
    const requiredProperties = Object.keys(zodRef.shape).filter((key) => {
        const item = zodRef.shape[key];
        return (!(item.isOptional() ||
            item instanceof z.ZodDefault ||
            item._def.typeName === 'ZodDefault') &&
            !(item instanceof z.ZodNever || item._def.typeName === 'ZodDefault'));
    });
    const required = requiredProperties.length > 0 ? { required: requiredProperties } : {};
    return merge(Object.assign(Object.assign({ type: 'object', properties: iterateZodObject({
            zodRef: zodRef,
            schemas,
            useOutput,
        }) }, required), additionalProperties), zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseRecord({ zodRef, schemas, useOutput, }) {
    return merge({
        type: 'object',
        additionalProperties: zodRef._def.valueType instanceof z.ZodUnknown
            ? {}
            : generateSchema(zodRef._def.valueType, useOutput),
    }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseBigInt({ zodRef, schemas, }) {
    return merge({ type: 'integer', format: 'int64' }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseBoolean({ zodRef, schemas, }) {
    return merge({ type: 'boolean' }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseDate({ zodRef, schemas }) {
    return merge({ type: 'string', format: 'date-time' }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseNull({ zodRef, schemas }) {
    return merge({
        type: 'string',
        format: 'null',
        nullable: true,
    }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseOptionalNullable({ schemas, zodRef, useOutput, }) {
    return merge(generateSchema(zodRef.unwrap(), useOutput), zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseDefault({ schemas, zodRef, useOutput, }) {
    return merge(Object.assign({ default: zodRef._def.defaultValue() }, generateSchema(zodRef._def.innerType, useOutput)), zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseArray({ schemas, zodRef, useOutput, }) {
    const constraints = {};
    if (zodRef._def.exactLength != null) {
        constraints.minItems = zodRef._def.exactLength.value;
        constraints.maxItems = zodRef._def.exactLength.value;
    }
    if (zodRef._def.minLength != null)
        constraints.minItems = zodRef._def.minLength.value;
    if (zodRef._def.maxLength != null)
        constraints.maxItems = zodRef._def.maxLength.value;
    return merge(Object.assign({ type: 'array', items: generateSchema(zodRef.element, useOutput) }, constraints), zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseLiteral({ schemas, zodRef, }) {
    return merge({
        type: typeof zodRef._def.value,
        enum: [zodRef._def.value],
    }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseEnum({ schemas, zodRef, }) {
    return merge({
        type: typeof Object.values(zodRef._def.values)[0],
        enum: Object.values(zodRef._def.values),
    }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseIntersection({ schemas, zodRef, useOutput, }) {
    return merge({
        allOf: [
            generateSchema(zodRef._def.left, useOutput),
            generateSchema(zodRef._def.right, useOutput),
        ],
    }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseUnion({ schemas, zodRef, useOutput, }) {
    return merge({
        oneOf: zodRef._def.options.map((schema) => generateSchema(schema, useOutput)),
    }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseDiscriminatedUnion({ schemas, zodRef, useOutput, }) {
    return merge({
        discriminator: {
            propertyName: zodRef._def.discriminator,
        },
        oneOf: Array.from(zodRef._def.options.values()).map((schema) => generateSchema(schema, useOutput)),
    }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseNever({ zodRef, schemas, }) {
    return merge({ readOnly: true }, zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
function parseBranded({ schemas, zodRef, }) {
    return merge(generateSchema(zodRef._def.type), ...schemas);
}
function catchAllParser({ zodRef, schemas, }) {
    return merge(zodRef.description ? { description: zodRef.description } : {}, ...schemas);
}
const workerMap = {
    ZodObject: parseObject,
    ZodRecord: parseRecord,
    ZodString: parseString,
    ZodNumber: parseNumber,
    ZodBigInt: parseBigInt,
    ZodBoolean: parseBoolean,
    ZodDate: parseDate,
    ZodNull: parseNull,
    ZodOptional: parseOptionalNullable,
    ZodNullable: parseOptionalNullable,
    ZodDefault: parseDefault,
    ZodArray: parseArray,
    ZodLiteral: parseLiteral,
    ZodEnum: parseEnum,
    ZodNativeEnum: parseEnum,
    ZodTransformer: parseTransformation,
    ZodEffects: parseTransformation,
    ZodIntersection: parseIntersection,
    ZodUnion: parseUnion,
    ZodDiscriminatedUnion: parseDiscriminatedUnion,
    ZodNever: parseNever,
    ZodBranded: parseBranded,
    // TODO Transform the rest to schemas
    ZodUndefined: catchAllParser,
    // TODO: `prefixItems` is allowed in OpenAPI 3.1 which can be used to create tuples
    ZodTuple: catchAllParser,
    ZodMap: catchAllParser,
    ZodFunction: catchAllParser,
    ZodLazy: catchAllParser,
    ZodPromise: catchAllParser,
    ZodAny: catchAllParser,
    ZodUnknown: catchAllParser,
    ZodVoid: catchAllParser,
};
function generateSchema(zodRef, useOutput) {
    const { openapi = {} } = zodRef._def;
    const schemas = [
        zodRef.isNullable && zodRef.isNullable() ? { nullable: true } : {},
        ...(Array.isArray(openapi) ? openapi : [openapi]),
    ];
    try {
        const typeName = zodRef._def.typeName;
        if (typeName in workerMap) {
            return workerMap[typeName]({
                zodRef: zodRef,
                schemas,
                useOutput,
            });
        }
        return catchAllParser({ zodRef, schemas });
    }
    catch (err) {
        console.error(err);
        return catchAllParser({ zodRef, schemas });
    }
}

function zodToOpenAPI(zodRef, useOutput) {
    return generateSchema(zodRef, useOutput);
}

export { ERROR_END, REQ_END, SchemaTransformer, bindService, bindServiceSymbol, convertToSwage, createContext, diag, errorFormatter, getAllResourceSchema, getErrorCodeFromKey, getServices, getStatusKeyFromStatus, ignoredSuffix, logContext, logErrorEnd, logErrorStart, logInputSerialize, logOutputSerialize, processJsonschema, transformHttpException, transformer, traverse, zodToOpenAPI };
