/// <reference types="@types/qs" />
import * as _flowda_types from '@flowda/types';
import { TCtx, ResourceKey, AssociationKey, ColumUI } from '@flowda/types';
export { createZodDto, extendZod } from '@flowda/types';
import { interfaces } from 'inversify';
import * as express from 'express';
import * as qs from 'qs';
import * as express_serve_static_core from 'express-serve-static-core';
import * as trpcExpress from '@trpc/server/adapters/express';
import { ProcedureType, TRPCError, Unwrap, DefaultErrorShape } from '@trpc/server';
import { SchemaObject } from 'openapi3-ts';
import { ZodTypeAny } from 'zod';

declare function bindService<T>(bind: interfaces.Bind, constructor: new (...args: never[]) => T): void;
declare function bindServiceSymbol<T>(bind: interfaces.Bind, implementIdentifier: interfaces.ServiceIdentifier<T>, constructor: interfaces.Newable<T>): void;
declare function getServices(servicesContainer: interfaces.Container): {
    provide: any;
    useValue: any;
}[];

declare const REQ_END = "================================================ End ================================================\n";
declare const ERROR_END = "***************************************** ERROR END *****************************************";
declare function logInputSerialize(object: any): void;
declare function logOutputSerialize(object: any): void;
declare function logContext(opts: trpcExpress.CreateExpressContextOptions): void;
declare function getStatusKeyFromStatus(status: number): "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
declare function getErrorCodeFromKey(key: keyof typeof TRPC_ERROR_CODES_BY_KEY): -32700 | -32600 | -32603 | -32001 | -32003 | -32004 | -32005 | -32008 | -32009 | -32012 | -32013 | -32022 | -32029 | -32099;
declare const TRPC_ERROR_CODES_BY_KEY: {
    /**
     * Invalid JSON was received by the server.
     * An error occurred on the server while parsing the JSON text.
     */
    readonly PARSE_ERROR: -32700;
    /**
     * The JSON sent is not a valid Request object.
     */
    readonly BAD_REQUEST: -32600;
    readonly INTERNAL_SERVER_ERROR: -32603;
    readonly NOT_IMPLEMENTED: -32603;
    readonly UNAUTHORIZED: -32001;
    readonly FORBIDDEN: -32003;
    readonly NOT_FOUND: -32004;
    readonly METHOD_NOT_SUPPORTED: -32005;
    readonly TIMEOUT: -32008;
    readonly CONFLICT: -32009;
    readonly PRECONDITION_FAILED: -32012;
    readonly PAYLOAD_TOO_LARGE: -32013;
    readonly UNPROCESSABLE_CONTENT: -32022;
    readonly TOO_MANY_REQUESTS: -32029;
    readonly CLIENT_CLOSED_REQUEST: -32099;
};
declare function logErrorStart(opts: {
    type: ProcedureType | 'unknown';
    path: string | undefined;
    input: unknown;
}): void;
declare function logErrorEnd(opts: {
    error: TRPCError;
}): void;
declare function transformHttpException(opts: {
    type: ProcedureType | 'unknown';
    path: string | undefined;
    input: unknown;
    ctx: Unwrap<any> | undefined;
    shape: DefaultErrorShape;
}, json: {
    status: number;
    message: string;
    error: string;
    stack?: string;
}): {
    code: -32700 | -32600 | -32603 | -32001 | -32003 | -32004 | -32005 | -32008 | -32009 | -32012 | -32013 | -32022 | -32029 | -32099;
    data: {
        code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
        httpStatus: number;
        description: {
            procedure: string;
            input: unknown;
            error: string;
        };
        path?: string | undefined;
        stack?: string | undefined;
    };
    message: string;
};
declare function errorFormatter(opts: {
    type: ProcedureType | 'unknown';
    path: string | undefined;
    input: unknown;
    ctx: Unwrap<any> | undefined;
    shape: DefaultErrorShape;
    error: TRPCError;
}, handlers?: {
    log?: (input: {
        requestId: string;
        tenantId: number;
        userId: number;
        log: any;
    }) => Promise<void>;
}): DefaultErrorShape;
declare const transformer: {
    input: {
        serialize: (object: any) => any;
        deserialize: (object: any) => any;
    };
    output: {
        serialize: (object: any) => any;
        deserialize: (object: any) => any;
    };
};
declare function createContext(opts: trpcExpress.CreateExpressContextOptions): {
    req: express.Request<express_serve_static_core.ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
    res: express.Response<any, Record<string, any>>;
    requestId: string;
    _diagnosis: any[];
    user: {
        username: string;
        id: number;
        tenantId: number;
    } | undefined;
    tenant: {
        name: string;
        id: number;
    } | undefined;
};
/**
 * 一个简单的基于 trpc ctx 的 诊断工具 报错之后会记录手动埋的路径，方便排查错误
 */
declare function diag(ctx: TCtx | undefined, ...message: any[]): void;

declare const ignoredSuffix: string[];
/**
 * convert all tables from a zod-prisma-types generated xx.ts
 * to ui schema spec compatible (suffix ResourceSchema) constant value
 *
 * e.g. CustomerOrderWithRelationsSchema -> CustomerOrderResourceSchema
 */
declare function getAllResourceSchema(zt: Record<string, any>): Record<string, any>;

declare class SchemaTransformer {
    private jsonschema?;
    private columns?;
    private associations?;
    set(jsonschema: ResourceKey): this;
    toJSON(): Omit<{
        properties: undefined;
        required: undefined;
        columns: {
            display_name: string;
            name: string;
            visible: boolean;
            column_type: string;
            access_type: "read_only" | "read_write";
            validators: unknown[];
            example?: string | undefined;
            description?: string | undefined;
            plugins?: any;
            reference?: {
                display_name: string;
                primary_key: string;
                model_name: string;
                foreign_key: string;
                reference_type: "belongs_to";
            } | {
                display_name: string;
                primary_key: string;
                visible: boolean;
                model_name: string;
                foreign_key: string;
                reference_type: "has_one";
            } | undefined;
        }[] | undefined;
        associations: AssociationKey[] | undefined;
        class_name: string;
        display_column?: string | undefined;
        display_name: string;
        display_primary_key: string;
        name: string;
        primary_key: string | null;
        searchable_columns?: string | undefined;
        slug: string;
        table_name: string;
        visible: boolean;
        plugins?: Partial<_flowda_types.PluginType> | undefined;
    }, "properties" | "required">;
}
declare function processJsonschema(jsonschema: ResourceKey): {
    columns: ColumUI[];
    associations: AssociationKey[];
};

declare function traverse(path: string, tree: SchemaObject, visit: (k: string, node: SchemaObject | undefined) => void): void;
declare function convertToSwage(input: {
    paths: Record<string, Record<string, {
        requestBody: unknown;
        responses: Record<string, unknown>;
    }>>;
}): {
    definitions: Record<string, unknown>;
    paths: Record<string, Record<string, {
        requestBody: unknown;
        responses: Record<string, unknown>;
    }>>;
};

declare function zodToOpenAPI(zodRef: ZodTypeAny, useOutput?: boolean): {
    class_name: string;
    display_name: string;
    display_primary_key: string;
    name: string;
    primary_key: string | null;
    slug: string;
    table_name: string;
    visible: boolean;
    display_column?: string | undefined;
    searchable_columns?: string | undefined;
    plugins?: any;
    properties?: Record<string, {
        display_name: string;
        visible: boolean;
        column_type: string;
        access_type: "read_only" | "read_write";
        description?: string | undefined;
        example?: string | undefined;
        plugins?: any;
    } | {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    } | {
        display_name: string;
        primary_key: string;
        model_name: string;
        foreign_key: string;
        reference_type: "belongs_to";
    } | {
        display_name: string;
        primary_key: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
        reference_type: "has_one";
    }> | undefined;
    required?: string[] | undefined;
};

export { ERROR_END, REQ_END, SchemaTransformer, bindService, bindServiceSymbol, convertToSwage, createContext, diag, errorFormatter, getAllResourceSchema, getErrorCodeFromKey, getServices, getStatusKeyFromStatus, ignoredSuffix, logContext, logErrorEnd, logErrorStart, logInputSerialize, logOutputSerialize, processJsonschema, transformHttpException, transformer, traverse, zodToOpenAPI };
