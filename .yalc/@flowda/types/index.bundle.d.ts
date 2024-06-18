/// <reference types="@types/react" />
import { URI } from '@theia/core';
import { z, ZodErrorMap, ZodTypeDef, ZodSchema } from 'zod';
import { SchemaObject } from 'openapi3-ts';

interface ManageableModel {
    getUri(): string;
    setUri(uri: string | URI): void;
    onCurrentEditorChanged(): Promise<void>;
}

declare const agFilterInnerSchema: z.ZodObject<{
    filterType: z.ZodEnum<["text", "number"]>;
    type: z.ZodEnum<["contains", "equals"]>;
    filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
}, "strip", z.ZodTypeAny, {
    filterType: "number" | "text";
    filter: string | number;
    type: "contains" | "equals";
}, {
    filterType: "number" | "text";
    filter: string | number;
    type: "contains" | "equals";
}>;
declare const agFilterInner2Schema: z.ZodObject<{
    filterType: z.ZodEnum<["text"]>;
    operator: z.ZodEnum<["OR", "AND"]>;
    conditions: z.ZodArray<z.ZodObject<{
        filterType: z.ZodEnum<["text", "number"]>;
        type: z.ZodEnum<["contains", "equals"]>;
        filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filterType: "text";
    operator: "OR" | "AND";
    conditions: {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }[];
}, {
    filterType: "text";
    operator: "OR" | "AND";
    conditions: {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }[];
}>;
declare const agFilterSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
    filterType: z.ZodEnum<["text", "number"]>;
    type: z.ZodEnum<["contains", "equals"]>;
    filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
}, "strip", z.ZodTypeAny, {
    filterType: "number" | "text";
    filter: string | number;
    type: "contains" | "equals";
}, {
    filterType: "number" | "text";
    filter: string | number;
    type: "contains" | "equals";
}>, z.ZodObject<{
    filterType: z.ZodEnum<["text"]>;
    operator: z.ZodEnum<["OR", "AND"]>;
    conditions: z.ZodArray<z.ZodObject<{
        filterType: z.ZodEnum<["text", "number"]>;
        type: z.ZodEnum<["contains", "equals"]>;
        filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filterType: "text";
    operator: "OR" | "AND";
    conditions: {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }[];
}, {
    filterType: "text";
    operator: "OR" | "AND";
    conditions: {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }[];
}>]>>;
declare const agSortSchema: z.ZodArray<z.ZodObject<{
    colId: z.ZodString;
    sort: z.ZodEnum<["asc", "desc"]>;
}, "strip", z.ZodTypeAny, {
    sort: "asc" | "desc";
    colId: string;
}, {
    sort: "asc" | "desc";
    colId: string;
}>, "many">;
declare const cellRendererInputSchema: z.ZodObject<{
    value: z.ZodAny;
    data: z.ZodUnknown;
    valueFormatted: z.ZodNullable<z.ZodString>;
    colDef: z.ZodObject<{
        field: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        field: string;
    }, {
        field: string;
    }>;
}, "strip", z.ZodTypeAny, {
    valueFormatted: string | null;
    colDef: {
        field: string;
    };
    value?: any;
    data?: unknown;
}, {
    valueFormatted: string | null;
    colDef: {
        field: string;
    };
    value?: any;
    data?: unknown;
}>;
type CellRendererInput = z.infer<typeof cellRendererInputSchema>;

declare const loginInputSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
type loginInputSchemaDto = z.infer<typeof loginInputSchema>;
declare const loginOutputSchema: z.ZodObject<{
    at: z.ZodObject<{
        token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        token: string;
    }, {
        token: string;
    }>;
}, "strip", z.ZodTypeAny, {
    at: {
        token: string;
    };
}, {
    at: {
        token: string;
    };
}>;
type loginOutputSchemaDto = z.infer<typeof loginOutputSchema>;

declare const handleContextMenuInputSchema: z.ZodObject<{
    uri: z.ZodString;
    cellRendererInput: z.ZodObject<{
        value: z.ZodAny;
        data: z.ZodUnknown;
        valueFormatted: z.ZodNullable<z.ZodString>;
        colDef: z.ZodObject<{
            field: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            field: string;
        }, {
            field: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        valueFormatted: string | null;
        colDef: {
            field: string;
        };
        value?: any;
        data?: unknown;
    }, {
        valueFormatted: string | null;
        colDef: {
            field: string;
        };
        value?: any;
        data?: unknown;
    }>;
    column: z.ZodOptional<z.ZodObject<{
        example: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        display_name: z.ZodString;
        visible: z.ZodBoolean;
        plugins: z.ZodOptional<z.ZodAny>;
        column_type: z.ZodString;
        access_type: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"read_only">, z.ZodLiteral<"read_write">]>>;
        name: z.ZodString;
        validators: z.ZodArray<z.ZodUnknown, "many">;
        reference: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            display_name: z.ZodString;
            model_name: z.ZodString;
            reference_type: z.ZodLiteral<"belongs_to">;
            foreign_key: z.ZodString;
            primary_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            display_name: string;
            primary_key: string;
            model_name: string;
            foreign_key: string;
            reference_type: "belongs_to";
        }, {
            display_name: string;
            primary_key: string;
            model_name: string;
            foreign_key: string;
            reference_type: "belongs_to";
        }>, z.ZodObject<{
            display_name: z.ZodString;
            model_name: z.ZodString;
            reference_type: z.ZodLiteral<"has_one">;
            foreign_key: z.ZodString;
            primary_key: z.ZodString;
            visible: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            display_name: string;
            primary_key: string;
            visible: boolean;
            model_name: string;
            foreign_key: string;
            reference_type: "has_one";
        }, {
            display_name: string;
            primary_key: string;
            visible: boolean;
            model_name: string;
            foreign_key: string;
            reference_type: "has_one";
        }>]>>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        display_name: string;
        name: string;
        visible: boolean;
        column_type: string;
        validators: unknown[];
        example?: string | undefined;
        description?: string | undefined;
        plugins?: any;
        access_type?: "read_only" | "read_write" | undefined;
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
    }>>;
    association: z.ZodOptional<z.ZodObject<{
        display_name: z.ZodString;
        slug: z.ZodString;
        model_name: z.ZodString;
        foreign_key: z.ZodString;
        primary_key: z.ZodString;
        visible: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }, {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    uri: string;
    cellRendererInput: {
        valueFormatted: string | null;
        colDef: {
            field: string;
        };
        value?: any;
        data?: unknown;
    };
    column?: {
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
    } | undefined;
    association?: {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    } | undefined;
}, {
    uri: string;
    cellRendererInput: {
        valueFormatted: string | null;
        colDef: {
            field: string;
        };
        value?: any;
        data?: unknown;
    };
    column?: {
        display_name: string;
        name: string;
        visible: boolean;
        column_type: string;
        validators: unknown[];
        example?: string | undefined;
        description?: string | undefined;
        plugins?: any;
        access_type?: "read_only" | "read_write" | undefined;
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
    } | undefined;
    association?: {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    } | undefined;
}>;
declare const treeGridUriQuerySchema: z.ZodObject<{
    schemaName: z.ZodString;
    displayName: z.ZodString;
    id: z.ZodString;
    field: z.ZodString;
}, "strip", z.ZodTypeAny, {
    field: string;
    schemaName: string;
    displayName: string;
    id: string;
}, {
    field: string;
    schemaName: string;
    displayName: string;
    id: string;
}>;
declare const newFormUriSchema: z.ZodObject<{
    displayName: z.ZodString;
    schemaName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaName: string;
    displayName: string;
}, {
    schemaName: string;
    displayName: string;
}>;

declare const selectOptionSchema: z.ZodObject<{
    value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    label: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string | number;
    label: string;
}, {
    value: string | number;
    label: string;
}>;
declare const resourceKeySchema: z.ZodObject<{
    origin: z.ZodString;
    resource: z.ZodString;
    resourceSchema: z.ZodString;
    id: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
}, "strip", z.ZodTypeAny, {
    origin: string;
    resource: string;
    resourceSchema: string;
    id?: string | number | undefined;
}, {
    origin: string;
    resource: string;
    resourceSchema: string;
    id?: string | number | undefined;
}>;
declare const getDataSchema: z.ZodObject<{
    user: z.ZodAny;
    path: z.ZodString;
    query: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    path: string;
    user?: any;
    query?: any;
}, {
    path: string;
    user?: any;
    query?: any;
}>;
declare const putDataSchema: z.ZodObject<{
    user: z.ZodAny;
    path: z.ZodString;
    updatedValue: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    path: string;
    user?: any;
    updatedValue?: any;
}, {
    path: string;
    user?: any;
    updatedValue?: any;
}>;
declare const postDataSchema: z.ZodObject<{
    user: z.ZodAny;
    path: z.ZodString;
    value: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    path: string;
    user?: any;
    value?: any;
}, {
    path: string;
    user?: any;
    value?: any;
}>;
declare const removeDataSchema: z.ZodObject<{
    user: z.ZodAny;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    user?: any;
}, {
    path: string;
    user?: any;
}>;

declare const getResourceInputSchema: z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schemaName: string;
    tenant: string;
}, {
    schemaName: string;
    tenant: string;
}>;
declare const findManyResourceDataInputSchema: z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
    current: z.ZodNumber;
    pageSize: z.ZodNumber;
    sort: z.ZodArray<z.ZodObject<{
        colId: z.ZodString;
        sort: z.ZodEnum<["asc", "desc"]>;
    }, "strip", z.ZodTypeAny, {
        sort: "asc" | "desc";
        colId: string;
    }, {
        sort: "asc" | "desc";
        colId: string;
    }>, "many">;
    filterModel: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        filterType: z.ZodEnum<["text", "number"]>;
        type: z.ZodEnum<["contains", "equals"]>;
        filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }>, z.ZodObject<{
        filterType: z.ZodEnum<["text"]>;
        operator: z.ZodEnum<["OR", "AND"]>;
        conditions: z.ZodArray<z.ZodObject<{
            filterType: z.ZodEnum<["text", "number"]>;
            type: z.ZodEnum<["contains", "equals"]>;
            filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        }, "strip", z.ZodTypeAny, {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }, {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }, {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }>]>>;
}, "strip", z.ZodTypeAny, {
    sort: {
        sort: "asc" | "desc";
        colId: string;
    }[];
    schemaName: string;
    tenant: string;
    current: number;
    pageSize: number;
    filterModel: Record<string, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    } | {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }>;
}, {
    sort: {
        sort: "asc" | "desc";
        colId: string;
    }[];
    schemaName: string;
    tenant: string;
    current: number;
    pageSize: number;
    filterModel: Record<string, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    } | {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }>;
}>;
declare const findUniqueResourceDataInputSchema: z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    schemaName: string;
    id: number;
    tenant: string;
}, {
    schemaName: string;
    id: number;
    tenant: string;
}>;
declare const getResourceDataInputSchema: z.ZodUnion<[z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
    current: z.ZodNumber;
    pageSize: z.ZodNumber;
    sort: z.ZodArray<z.ZodObject<{
        colId: z.ZodString;
        sort: z.ZodEnum<["asc", "desc"]>;
    }, "strip", z.ZodTypeAny, {
        sort: "asc" | "desc";
        colId: string;
    }, {
        sort: "asc" | "desc";
        colId: string;
    }>, "many">;
    filterModel: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        filterType: z.ZodEnum<["text", "number"]>;
        type: z.ZodEnum<["contains", "equals"]>;
        filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    }, "strip", z.ZodTypeAny, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    }>, z.ZodObject<{
        filterType: z.ZodEnum<["text"]>;
        operator: z.ZodEnum<["OR", "AND"]>;
        conditions: z.ZodArray<z.ZodObject<{
            filterType: z.ZodEnum<["text", "number"]>;
            type: z.ZodEnum<["contains", "equals"]>;
            filter: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        }, "strip", z.ZodTypeAny, {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }, {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }, {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }>]>>;
}, "strip", z.ZodTypeAny, {
    sort: {
        sort: "asc" | "desc";
        colId: string;
    }[];
    schemaName: string;
    tenant: string;
    current: number;
    pageSize: number;
    filterModel: Record<string, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    } | {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }>;
}, {
    sort: {
        sort: "asc" | "desc";
        colId: string;
    }[];
    schemaName: string;
    tenant: string;
    current: number;
    pageSize: number;
    filterModel: Record<string, {
        filterType: "number" | "text";
        filter: string | number;
        type: "contains" | "equals";
    } | {
        filterType: "text";
        operator: "OR" | "AND";
        conditions: {
            filterType: "number" | "text";
            filter: string | number;
            type: "contains" | "equals";
        }[];
    }>;
}>, z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    schemaName: string;
    id: number;
    tenant: string;
}, {
    schemaName: string;
    id: number;
    tenant: string;
}>]>;
declare const getResourceDataOutputInnerSchema: z.ZodObject<{
    pagination: z.ZodObject<{
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
    }, {
        total: number;
    }>;
    data: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    data: any[];
    pagination: {
        total: number;
    };
}, {
    data: any[];
    pagination: {
        total: number;
    };
}>;
declare const getResourceDataOutputSchema: z.ZodUnion<[z.ZodObject<{
    pagination: z.ZodObject<{
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
    }, {
        total: number;
    }>;
    data: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    data: any[];
    pagination: {
        total: number;
    };
}, {
    data: any[];
    pagination: {
        total: number;
    };
}>, z.ZodUnknown]>;
declare const putResourceDataInputSchema: z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
    id: z.ZodNumber;
    updatedValue: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    schemaName: string;
    id: number;
    tenant: string;
    updatedValue?: any;
}, {
    schemaName: string;
    id: number;
    tenant: string;
    updatedValue?: any;
}>;
declare const postResourceDataInputSchema: z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
    value: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    schemaName: string;
    tenant: string;
    value?: any;
}, {
    schemaName: string;
    tenant: string;
    value?: any;
}>;
declare const removeResourceDataInputSchema: z.ZodObject<{
    tenant: z.ZodString;
    schemaName: z.ZodString;
    id: z.ZodNullable<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    schemaName: string;
    id: string | number | null;
    tenant: string;
}, {
    schemaName: string;
    id: string | number | null;
    tenant: string;
}>;

declare const baseMenuItemSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    id: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    id: string;
    icon?: string | undefined;
}, {
    name: string;
    slug: string;
    id: string;
    icon?: string | undefined;
}>;
type MenuItem = z.infer<typeof baseMenuItemSchema> & {
    children?: MenuItem[];
    parent?: MenuItem;
};
declare const menuItemSchema: z.ZodType<MenuItem>;
declare const agMenuItemSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    id: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    hierarchy: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    id: string;
    hierarchy: string[];
    icon?: string | undefined;
}, {
    name: string;
    slug: string;
    id: string;
    hierarchy: string[];
    icon?: string | undefined;
}>;

declare const ctxTenantSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
}, {
    name: string;
    id: number;
}>;
type ctxTenantSchemaDto = z.infer<typeof ctxTenantSchema>;
declare const ctxUserSchema: z.ZodObject<{
    id: z.ZodNumber;
    tenantId: z.ZodNumber;
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    id: number;
    tenantId: number;
}, {
    username: string;
    id: number;
    tenantId: number;
}>;
type ctxUserSchemaDto = z.infer<typeof ctxUserSchema>;
type TCtx = {
    _diagnosis: any[];
};

declare const taskSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    assignee: z.ZodString;
    executionId: z.ZodString;
    processDefinitionId: z.ZodString;
    processInstanceId: z.ZodString;
    taskDefinitionKey: z.ZodString;
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    tenantId: string;
    assignee: string;
    executionId: string;
    processDefinitionId: string;
    processInstanceId: string;
    taskDefinitionKey: string;
}, {
    name: string;
    id: string;
    tenantId: string;
    assignee: string;
    executionId: string;
    processDefinitionId: string;
    processInstanceId: string;
    taskDefinitionKey: string;
}>;
declare const taskUriInputSchema: z.ZodObject<Pick<{
    id: z.ZodString;
    name: z.ZodString;
    assignee: z.ZodString;
    executionId: z.ZodString;
    processDefinitionId: z.ZodString;
    processInstanceId: z.ZodString;
    taskDefinitionKey: z.ZodString;
    tenantId: z.ZodString;
}, "name" | "id" | "taskDefinitionKey">, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    taskDefinitionKey: string;
}, {
    name: string;
    id: string;
    taskDefinitionKey: string;
}>;
declare const taskUriOutputSchema: z.ZodObject<{
    taskId: z.ZodString;
    displayName: z.ZodString;
    taskDefinitionKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    displayName: string;
    taskDefinitionKey: string;
    taskId: string;
}, {
    displayName: string;
    taskDefinitionKey: string;
    taskId: string;
}>;
declare const wfCfgSchema: z.ZodArray<z.ZodObject<{
    taskDefinitionKey: z.ZodString;
    resource: z.ZodObject<{
        schemaName: z.ZodString;
        inputMap: z.ZodRecord<z.ZodString, z.ZodString>;
        columns: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            access_type: z.ZodUnion<[z.ZodLiteral<"read_only">, z.ZodLiteral<"read_write">]>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            access_type: "read_only" | "read_write";
        }, {
            name: string;
            access_type: "read_only" | "read_write";
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        columns: {
            name: string;
            access_type: "read_only" | "read_write";
        }[];
        schemaName: string;
        inputMap: Record<string, string>;
    }, {
        columns: {
            name: string;
            access_type: "read_only" | "read_write";
        }[];
        schemaName: string;
        inputMap: Record<string, string>;
    }>;
}, "strip", z.ZodTypeAny, {
    resource: {
        columns: {
            name: string;
            access_type: "read_only" | "read_write";
        }[];
        schemaName: string;
        inputMap: Record<string, string>;
    };
    taskDefinitionKey: string;
}, {
    resource: {
        columns: {
            name: string;
            access_type: "read_only" | "read_write";
        }[];
        schemaName: string;
        inputMap: Record<string, string>;
    };
    taskDefinitionKey: string;
}>, "many">;

type JSONValue = string | number | boolean | {
    [x: string]: JSONValue;
} | Array<JSONValue>;
interface JSONObject {
    [x: string]: JSONValue;
}
type DefaultFormValueType = Record<string, string | number | undefined>;
type WidgetOption<T> = {
    id: string;
    uri: string;
    title: string;
    model: T;
};

interface PluginType {
    [x: string]: unknown;
}
type ColumnKey = {
    column_type: string;
    display_name: string;
    description?: string;
    example?: string;
    visible: boolean;
    access_type?: 'read_only' | 'read_write';
    plugins?: Partial<PluginType>;
};
declare const ColumnKeySchema: z.ZodObject<{
    column_type: z.ZodString;
    display_name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    example: z.ZodOptional<z.ZodString>;
    visible: z.ZodBoolean;
    access_type: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"read_only">, z.ZodLiteral<"read_write">]>>;
    plugins: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    display_name: string;
    visible: boolean;
    column_type: string;
    access_type: "read_only" | "read_write";
    description?: string | undefined;
    example?: string | undefined;
    plugins?: any;
}, {
    display_name: string;
    visible: boolean;
    column_type: string;
    description?: string | undefined;
    example?: string | undefined;
    access_type?: "read_only" | "read_write" | undefined;
    plugins?: any;
}>;
type AssociationKey = {
    display_name: string;
    slug: string;
    model_name: string;
    foreign_key: string;
    primary_key: string;
    visible: boolean;
};
declare const AssociationKeySchema: z.ZodObject<{
    display_name: z.ZodString;
    slug: z.ZodString;
    model_name: z.ZodString;
    foreign_key: z.ZodString;
    primary_key: z.ZodString;
    visible: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    display_name: string;
    primary_key: string;
    slug: string;
    visible: boolean;
    model_name: string;
    foreign_key: string;
}, {
    display_name: string;
    primary_key: string;
    slug: string;
    visible: boolean;
    model_name: string;
    foreign_key: string;
}>;
type ReferenceKey = {
    display_name: string;
    model_name: string;
    reference_type: 'belongs_to';
    foreign_key: string;
    primary_key: string;
} | {
    display_name: string;
    model_name: string;
    reference_type: 'has_one';
    foreign_key: string;
    primary_key: string;
    visible: boolean;
};
declare const ReferenceKeySchema: z.ZodUnion<[z.ZodObject<{
    display_name: z.ZodString;
    model_name: z.ZodString;
    reference_type: z.ZodLiteral<"belongs_to">;
    foreign_key: z.ZodString;
    primary_key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    display_name: string;
    primary_key: string;
    model_name: string;
    foreign_key: string;
    reference_type: "belongs_to";
}, {
    display_name: string;
    primary_key: string;
    model_name: string;
    foreign_key: string;
    reference_type: "belongs_to";
}>, z.ZodObject<{
    display_name: z.ZodString;
    model_name: z.ZodString;
    reference_type: z.ZodLiteral<"has_one">;
    foreign_key: z.ZodString;
    primary_key: z.ZodString;
    visible: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    display_name: string;
    primary_key: string;
    visible: boolean;
    model_name: string;
    foreign_key: string;
    reference_type: "has_one";
}, {
    display_name: string;
    primary_key: string;
    visible: boolean;
    model_name: string;
    foreign_key: string;
    reference_type: "has_one";
}>]>;
type ResourceKey = {
    class_name: string;
    display_column?: string;
    display_name: string;
    display_primary_key: string;
    name: string;
    primary_key: string | null;
    searchable_columns?: string;
    slug: string;
    table_name: string;
    visible: boolean;
    plugins?: Partial<PluginType>;
    properties?: Record<string, ColumnKey | AssociationKey | ReferenceKey>;
    required?: string[];
};
declare const ResourceKeySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    table_name: z.ZodString;
    class_name: z.ZodString;
    display_name: z.ZodString;
    primary_key: z.ZodNullable<z.ZodString>;
    visible: z.ZodBoolean;
    display_primary_key: z.ZodString;
    display_column: z.ZodOptional<z.ZodString>;
    searchable_columns: z.ZodOptional<z.ZodString>;
    plugins: z.ZodOptional<z.ZodAny>;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        column_type: z.ZodString;
        display_name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        example: z.ZodOptional<z.ZodString>;
        visible: z.ZodBoolean;
        access_type: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"read_only">, z.ZodLiteral<"read_write">]>>;
        plugins: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        visible: boolean;
        column_type: string;
        access_type: "read_only" | "read_write";
        description?: string | undefined;
        example?: string | undefined;
        plugins?: any;
    }, {
        display_name: string;
        visible: boolean;
        column_type: string;
        description?: string | undefined;
        example?: string | undefined;
        access_type?: "read_only" | "read_write" | undefined;
        plugins?: any;
    }>, z.ZodObject<{
        display_name: z.ZodString;
        slug: z.ZodString;
        model_name: z.ZodString;
        foreign_key: z.ZodString;
        primary_key: z.ZodString;
        visible: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }, {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }>, z.ZodUnion<[z.ZodObject<{
        display_name: z.ZodString;
        model_name: z.ZodString;
        reference_type: z.ZodLiteral<"belongs_to">;
        foreign_key: z.ZodString;
        primary_key: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        primary_key: string;
        model_name: string;
        foreign_key: string;
        reference_type: "belongs_to";
    }, {
        display_name: string;
        primary_key: string;
        model_name: string;
        foreign_key: string;
        reference_type: "belongs_to";
    }>, z.ZodObject<{
        display_name: z.ZodString;
        model_name: z.ZodString;
        reference_type: z.ZodLiteral<"has_one">;
        foreign_key: z.ZodString;
        primary_key: z.ZodString;
        visible: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        primary_key: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
        reference_type: "has_one";
    }, {
        display_name: string;
        primary_key: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
        reference_type: "has_one";
    }>]>]>>>;
    required: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
        description?: string | undefined;
        example?: string | undefined;
        access_type?: "read_only" | "read_write" | undefined;
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
}>;

declare const ColumnUISchema: z.ZodObject<{
    example: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    display_name: z.ZodString;
    visible: z.ZodBoolean;
    plugins: z.ZodOptional<z.ZodAny>;
    column_type: z.ZodString;
    access_type: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"read_only">, z.ZodLiteral<"read_write">]>>;
    name: z.ZodString;
    validators: z.ZodArray<z.ZodUnknown, "many">;
    reference: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        display_name: z.ZodString;
        model_name: z.ZodString;
        reference_type: z.ZodLiteral<"belongs_to">;
        foreign_key: z.ZodString;
        primary_key: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        primary_key: string;
        model_name: string;
        foreign_key: string;
        reference_type: "belongs_to";
    }, {
        display_name: string;
        primary_key: string;
        model_name: string;
        foreign_key: string;
        reference_type: "belongs_to";
    }>, z.ZodObject<{
        display_name: z.ZodString;
        model_name: z.ZodString;
        reference_type: z.ZodLiteral<"has_one">;
        foreign_key: z.ZodString;
        primary_key: z.ZodString;
        visible: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        primary_key: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
        reference_type: "has_one";
    }, {
        display_name: string;
        primary_key: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
        reference_type: "has_one";
    }>]>>;
}, "strip", z.ZodTypeAny, {
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
}, {
    display_name: string;
    name: string;
    visible: boolean;
    column_type: string;
    validators: unknown[];
    example?: string | undefined;
    description?: string | undefined;
    plugins?: any;
    access_type?: "read_only" | "read_write" | undefined;
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
}>;
declare const ResourceUISchema: z.ZodObject<{
    class_name: z.ZodString;
    display_column: z.ZodOptional<z.ZodString>;
    display_name: z.ZodString;
    display_primary_key: z.ZodString;
    name: z.ZodString;
    primary_key: z.ZodNullable<z.ZodString>;
    searchable_columns: z.ZodOptional<z.ZodString>;
    slug: z.ZodString;
    table_name: z.ZodString;
    visible: z.ZodBoolean;
    plugins: z.ZodOptional<z.ZodAny>;
    namespace: z.ZodString;
    columns: z.ZodArray<z.ZodObject<{
        example: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        display_name: z.ZodString;
        visible: z.ZodBoolean;
        plugins: z.ZodOptional<z.ZodAny>;
        column_type: z.ZodString;
        access_type: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"read_only">, z.ZodLiteral<"read_write">]>>;
        name: z.ZodString;
        validators: z.ZodArray<z.ZodUnknown, "many">;
        reference: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
            display_name: z.ZodString;
            model_name: z.ZodString;
            reference_type: z.ZodLiteral<"belongs_to">;
            foreign_key: z.ZodString;
            primary_key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            display_name: string;
            primary_key: string;
            model_name: string;
            foreign_key: string;
            reference_type: "belongs_to";
        }, {
            display_name: string;
            primary_key: string;
            model_name: string;
            foreign_key: string;
            reference_type: "belongs_to";
        }>, z.ZodObject<{
            display_name: z.ZodString;
            model_name: z.ZodString;
            reference_type: z.ZodLiteral<"has_one">;
            foreign_key: z.ZodString;
            primary_key: z.ZodString;
            visible: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            display_name: string;
            primary_key: string;
            visible: boolean;
            model_name: string;
            foreign_key: string;
            reference_type: "has_one";
        }, {
            display_name: string;
            primary_key: string;
            visible: boolean;
            model_name: string;
            foreign_key: string;
            reference_type: "has_one";
        }>]>>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        display_name: string;
        name: string;
        visible: boolean;
        column_type: string;
        validators: unknown[];
        example?: string | undefined;
        description?: string | undefined;
        plugins?: any;
        access_type?: "read_only" | "read_write" | undefined;
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
    }>, "many">;
    associations: z.ZodArray<z.ZodObject<{
        display_name: z.ZodString;
        slug: z.ZodString;
        model_name: z.ZodString;
        foreign_key: z.ZodString;
        primary_key: z.ZodString;
        visible: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }, {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    class_name: string;
    display_name: string;
    display_primary_key: string;
    name: string;
    primary_key: string | null;
    slug: string;
    table_name: string;
    visible: boolean;
    namespace: string;
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
    }[];
    associations: {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }[];
    display_column?: string | undefined;
    searchable_columns?: string | undefined;
    plugins?: any;
}, {
    class_name: string;
    display_name: string;
    display_primary_key: string;
    name: string;
    primary_key: string | null;
    slug: string;
    table_name: string;
    visible: boolean;
    namespace: string;
    columns: {
        display_name: string;
        name: string;
        visible: boolean;
        column_type: string;
        validators: unknown[];
        example?: string | undefined;
        description?: string | undefined;
        plugins?: any;
        access_type?: "read_only" | "read_write" | undefined;
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
    }[];
    associations: {
        display_name: string;
        primary_key: string;
        slug: string;
        visible: boolean;
        model_name: string;
        foreign_key: string;
    }[];
    display_column?: string | undefined;
    searchable_columns?: string | undefined;
    plugins?: any;
}>;
type ResourceUI = z.infer<typeof ResourceUISchema>;
type ColumUI = z.infer<typeof ColumnUISchema>;

interface ApiService {
    getResourceSchema: (input: z.infer<typeof getResourceInputSchema>) => Promise<z.infer<typeof ResourceUISchema>>;
    getResourceData: (input: z.infer<typeof getResourceDataInputSchema>) => Promise<z.infer<typeof getResourceDataOutputSchema>>;
    putResourceData: (input: z.infer<typeof putResourceDataInputSchema>) => Promise<unknown>;
    postResourceData: (input: z.infer<typeof postResourceDataInputSchema>) => Promise<unknown>;
    removeResourceData: (input: z.infer<typeof removeResourceDataInputSchema>) => Promise<unknown>;
}

type CellRenderer = (param: CellRendererInput) => JSX.Element;
interface ICustomResource {
    schemaName: string;
    getCellRenderer(colName: string): undefined | CellRenderer;
}
declare function CustomResource(schemaName: string): abstract new () => {
    schemaName: string;
    getCellRenderer(colName: string): CellRenderer | undefined;
    registerCellRenderer(colName: string, reactNode: CellRenderer): void;
};

declare const NOT_REGISTERED = "No matching bindings found for serviceIdentifier:";
declare const MANAGEABLE_EDITOR_ID = "resource-editor-opener";
declare const NOT_REGISTERED_SCHEME = "unknown uri:";

declare const PrismaClientSymbol: unique symbol;
declare const CustomZodSchemaSymbol: unique symbol;

declare const builtinPluginSchema: z.ZodObject<{
    axios: z.ZodOptional<z.ZodObject<{
        method: z.ZodString;
        url: z.ZodString;
        data: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        method: string;
        url: string;
        data?: any;
    }, {
        method: string;
        url: string;
        data?: any;
    }>>;
    open_task: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    axios?: {
        method: string;
        url: string;
        data?: any;
    } | undefined;
    open_task?: boolean | undefined;
}, {
    axios?: {
        method: string;
        url: string;
        data?: any;
    } | undefined;
    open_task?: boolean | undefined;
}>;
declare module '@flowda/types' {
    interface PluginType {
        builtin: z.infer<typeof builtinPluginSchema>;
    }
}

/**
 * getServices 方法会将 inversify module 转换成 nestjs module，这样 nestjs controller 就可以使用了
 * 所以，注意：如果不需要给 controller 使用，则不需要 bind
 */
declare const ServiceSymbol: unique symbol;
declare const ApiServiceSymbol: unique symbol;
declare const TreeGridModelSymbol: unique symbol;
declare const GridModelSymbol: unique symbol;
declare const PreviewModelSymbol: unique symbol;
declare const WorkflowConfigModelSymbol: unique symbol;
declare const LoginModelSymbol: unique symbol;
declare const ThemeModelSymbol: unique symbol;
declare const TaskFormModelSymbol: unique symbol;
declare const NewFormModelSymbol: unique symbol;
declare const WorkflowConfigSymbol: unique symbol;
declare const CustomResourceSymbol: unique symbol;
declare const ManageableServiceSymbol: unique symbol;
declare const ManageableModelSymbol: unique symbol;
declare const CheckManageableFactorySymbol: unique symbol;
declare const ManageableWidgetSymbol: unique symbol;
declare const ManageableWidgetFactorySymbol: unique symbol;
declare const ManageableModelFactorySymbol: unique symbol;

declare module 'zod' {
    interface ZodTypeDef {
        errorMap?: ZodErrorMap;
        description?: string;
        /**
         * OpenAPI metadata
         */
        openapi?: any;
    }
    interface ZodSchema<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
        openapi<T extends ZodSchema<Output, Def, Input>>(this: T, metadata: Partial<SchemaObject>): T;
        resource<T extends ZodSchema<Output, Def, Input>>(this: T, metadata: Partial<ResourceKey>): T;
        column<T extends ZodSchema<Output, Def, Input>>(this: T, metadata: Partial<ColumnKey>): T;
        association<T extends ZodSchema<Output, Def, Input>>(this: T, metadata: AssociationKey): T;
        reference<T extends ZodSchema<Output, Def, Input>>(this: T, metadata: ReferenceKey): T;
    }
}
declare function extendZod(zod: typeof z, forceOverride?: boolean): void;

interface ZodDto<TOutput = any, TDef extends ZodTypeDef = ZodTypeDef, TInput = TOutput> {
    new (): TOutput;
    isZodDto: true;
    schema: ZodSchema<TOutput, TDef, TInput>;
    create(input: unknown): TOutput;
}
declare function createZodDto<TOutput = any, TDef extends ZodTypeDef = ZodTypeDef, TInput = TOutput>(schema: ZodSchema<TOutput, TDef, TInput>): ZodDto<TOutput, TDef, TInput>;

export { type ApiService, ApiServiceSymbol, type AssociationKey, AssociationKeySchema, type CellRenderer, type CellRendererInput, CheckManageableFactorySymbol, type ColumUI, type ColumnKey, ColumnKeySchema, ColumnUISchema, CustomResource, CustomResourceSymbol, CustomZodSchemaSymbol, type DefaultFormValueType, GridModelSymbol, type ICustomResource, type JSONObject, type JSONValue, LoginModelSymbol, MANAGEABLE_EDITOR_ID, type ManageableModel, ManageableModelFactorySymbol, ManageableModelSymbol, ManageableServiceSymbol, ManageableWidgetFactorySymbol, ManageableWidgetSymbol, type MenuItem, NOT_REGISTERED, NOT_REGISTERED_SCHEME, NewFormModelSymbol, type PluginType, PreviewModelSymbol, PrismaClientSymbol, type ReferenceKey, ReferenceKeySchema, type ResourceKey, ResourceKeySchema, type ResourceUI, ResourceUISchema, ServiceSymbol, type TCtx, TaskFormModelSymbol, ThemeModelSymbol, TreeGridModelSymbol, type WidgetOption, WorkflowConfigModelSymbol, WorkflowConfigSymbol, type ZodDto, agFilterInner2Schema, agFilterInnerSchema, agFilterSchema, agMenuItemSchema, agSortSchema, baseMenuItemSchema, builtinPluginSchema, cellRendererInputSchema, createZodDto, ctxTenantSchema, type ctxTenantSchemaDto, ctxUserSchema, type ctxUserSchemaDto, extendZod, findManyResourceDataInputSchema, findUniqueResourceDataInputSchema, getDataSchema, getResourceDataInputSchema, getResourceDataOutputInnerSchema, getResourceDataOutputSchema, getResourceInputSchema, handleContextMenuInputSchema, loginInputSchema, type loginInputSchemaDto, loginOutputSchema, type loginOutputSchemaDto, menuItemSchema, newFormUriSchema, postDataSchema, postResourceDataInputSchema, putDataSchema, putResourceDataInputSchema, removeDataSchema, removeResourceDataInputSchema, resourceKeySchema, selectOptionSchema, taskSchema, taskUriInputSchema, taskUriOutputSchema, treeGridUriQuerySchema, wfCfgSchema };
