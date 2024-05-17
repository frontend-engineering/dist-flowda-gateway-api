import { __decorate } from 'tslib';
import { injectable } from 'inversify';
import { z } from 'zod';

/// <reference types="@types/react" />
function CustomResource(schemaName) {
    const _customRender = new Map();
    let AbstractCustomResource = class AbstractCustomResource {
        constructor() {
            this.schemaName = schemaName;
        }
        getCellRenderer(colName) {
            if (!_customRender.has(colName))
                return;
            return _customRender.get(colName);
        }
        registerCellRenderer(colName, reactNode) {
            if (_customRender.has(colName)) {
                console.warn(`ignore already registered schema field, schema: ${this.schemaName}, field: ${colName}`);
                return;
            }
            _customRender.set(colName, reactNode);
        }
    };
    AbstractCustomResource = __decorate([
        injectable()
    ], AbstractCustomResource);
    return AbstractCustomResource;
}

const agFilterInnerSchema = z.object({
    filterType: z.enum(['text', 'number']),
    // filterType: z.string(),
    type: z.enum(['contains', 'equals']),
    // type: z.string(),
    filter: z.union([z.string(), z.number()]),
});
const agFilterInner2Schema = z.object({
    filterType: z.enum(['text']),
    // filterType: z.string(),
    operator: z.enum(['OR', 'AND']),
    // operator: z.string(),
    conditions: z.array(agFilterInnerSchema),
});
const agFilterSchema = z.record(agFilterInnerSchema.or(agFilterInner2Schema));
const agSortSchema = z.array(z.object({
    colId: z.string(),
    sort: z.enum(['asc', 'desc']),
}));
const cellRendererInputSchema = z.object({
    value: z.any(),
    // data: z.object({
    //   id: z.union([z.string(), z.number()]).transform(arg => arg.toString())
    // }),
    data: z.unknown(),
    valueFormatted: z.string().nullable(),
    colDef: z.object({
        field: z.string(),
    }),
});

const loginInputSchema = z.object({
    username: z.string(),
    password: z.string().min(4),
});
const loginOutputSchema = z.object({
    at: z.object({
        token: z.string(),
    }),
});

const ColumnKeySchema = z.object({
    column_type: z.string(),
    display_name: z.string(),
    description: z.string().optional(),
    example: z.string().optional(),
    visible: z.boolean(),
    access_type: z.union([z.literal('read_only'), z.literal('read_write')]).default('read_write'),
    plugins: z.any().optional(),
});
const AssociationKeySchema = z.object({
    display_name: z.string(),
    slug: z.string(),
    model_name: z.string(),
    foreign_key: z.string(),
    primary_key: z.string(),
    visible: z.boolean(),
});
const ReferenceKeySchema = z.union([
    z.object({
        display_name: z.string(),
        model_name: z.string(),
        reference_type: z.literal('belongs_to'),
        foreign_key: z.string(),
        primary_key: z.string(),
    }),
    z.object({
        display_name: z.string(),
        model_name: z.string(),
        reference_type: z.literal('has_one'),
        foreign_key: z.string(),
        primary_key: z.string(),
        visible: z.boolean(),
    }),
]);
const ResourceKeySchema = z.object({
    name: z.string(),
    slug: z.string(),
    table_name: z.string(),
    class_name: z.string(),
    display_name: z.string(),
    primary_key: z.string().nullable(),
    visible: z.boolean(),
    display_primary_key: z.string(),
    display_column: z.string().optional(),
    searchable_columns: z.string().optional(),
    plugins: z.any().optional(),
    // openapi3-ts
    properties: z.record(z.string(), z.union([ColumnKeySchema, AssociationKeySchema, ReferenceKeySchema])).optional(),
    required: z.array(z.string()).optional(),
});

const ColumnUISchema = ColumnKeySchema.extend({
    name: z.string(),
    validators: z.array(z.unknown()),
    reference: ReferenceKeySchema.optional(),
});
const ResourceUISchema = ResourceKeySchema.omit({
    properties: true,
    required: true,
}).extend({
    namespace: z.string().describe('网关作为命名空间'),
    columns: z.array(ColumnUISchema),
    associations: z.array(AssociationKeySchema),
});

const handleContextMenuInputSchema = z.object({
    uri: z.string().describe('所属 Grid 的 uri'),
    cellRendererInput: cellRendererInputSchema,
    column: ColumnUISchema.optional(),
    association: AssociationKeySchema.optional(),
});
const treeGridUriQuerySchema = z.object({
    schemaName: z.string(),
    displayName: z.string(),
    id: z.string(),
    field: z.string(),
});
const newFormUriSchema = z.object({
    displayName: z.string(),
    schemaName: z.string(),
});

// todo: 后续开源相关服务后再同步调整
const selectOptionSchema = z.object({
    value: z.union([z.string(), z.number()]),
    label: z.string(),
});
const resourceKeySchema = z.object({
    origin: z.string(),
    resource: z.string(),
    resourceSchema: z.string(),
    id: z.union([z.string(), z.number()]).optional(),
});
const getDataSchema = z.object({
    user: z.any(),
    path: z.string(),
    query: z.any(),
});
const putDataSchema = z.object({
    user: z.any(),
    path: z.string(),
    updatedValue: z.any(),
});
const postDataSchema = z.object({
    user: z.any(),
    path: z.string(),
    value: z.any(),
});
const removeDataSchema = z.object({
    user: z.any(),
    path: z.string(),
});

const getResourceInputSchema = z.object({
    tenant: z.string(),
    schemaName: z.string(),
});
const findManyResourceDataInputSchema = z.object({
    tenant: z.string(),
    schemaName: z.string(),
    current: z.number(),
    pageSize: z.number(),
    sort: agSortSchema,
    filterModel: agFilterSchema,
});
const findUniqueResourceDataInputSchema = z.object({
    tenant: z.string(),
    schemaName: z.string(),
    id: z.number(),
});
const getResourceDataInputSchema = z.union([findManyResourceDataInputSchema, findUniqueResourceDataInputSchema]);
const getResourceDataOutputInnerSchema = z.object({
    pagination: z.object({
        total: z.number(),
    }),
    data: z.array(z.any()),
});
const getResourceDataOutputSchema = z.union([getResourceDataOutputInnerSchema, z.unknown()]);
const putResourceDataInputSchema = z.object({
    tenant: z.string(),
    schemaName: z.string(),
    id: z.number(),
    updatedValue: z.any(),
});
const postResourceDataInputSchema = z.object({
    tenant: z.string(),
    schemaName: z.string(),
    value: z.any(),
});
const removeResourceDataInputSchema = z.object({
    tenant: z.string(),
    schemaName: z.string(),
    id: z.union([z.number(), z.string()]).nullable(),
});

// https://github.com/colinhacks/zod/discussions/2245
const baseMenuItemSchema = z.object({
    name: z.string(),
    slug: z.string(),
    id: z.string(),
    icon: z.string().optional()
});
const menuItemSchema = baseMenuItemSchema.extend({
    children: z.lazy(() => menuItemSchema.array().optional()),
    parent: z.lazy(() => menuItemSchema.optional()),
});
const agMenuItemSchema = baseMenuItemSchema.extend({
    hierarchy: z.array(z.string())
});

const ctxTenantSchema = z.object({
    id: z.number(),
    name: z.string(),
});
const ctxUserSchema = z.object({
    id: z.number(),
    tenantId: z.number(),
    username: z.string(),
});

const taskSchema = z.object({
    id: z.string(),
    name: z.string(),
    assignee: z.string(),
    executionId: z.string(),
    processDefinitionId: z.string(),
    processInstanceId: z.string(),
    taskDefinitionKey: z.string(),
    tenantId: z.string(),
});
// 可能后续再增加 或者先请求一次后端
const taskUriInputSchema = taskSchema.pick({
    id: true,
    name: true,
    taskDefinitionKey: true,
});
// displayName 是为了兼容 getUriDisplayName()
const taskUriOutputSchema = z.object({
    taskId: z.string(),
    displayName: z.string(),
    taskDefinitionKey: z.string(),
});
// 逐步增强，现在仅支持单个 resource
// 后续可支持多个，且不仅仅是 resource 可以是 view 甚至 plugin
const wfCfgSchema = z.array(z.object({
    taskDefinitionKey: z.string(),
    resource: z.object({
        schemaName: z.string(),
        inputMap: z.record(z.string(), z.string()),
        columns: z.array(z.object({
            name: z.string(),
            access_type: z.union([z.literal('read_only'), z.literal('read_write')]),
        })),
    }),
}));

const NOT_REGISTERED = 'No matching bindings found for serviceIdentifier:';
const MANAGEABLE_EDITOR_ID = 'resource-editor-opener';
const NOT_REGISTERED_SCHEME = 'unknown uri:';

// schema.service data.service 依赖下面3个 toConstantValue
// todo: 后续开源相关服务后再同步调整
const PrismaClientSymbol = Symbol('PrismaClient');
const CustomZodSchemaSymbol = Symbol.for('CustomZodSchema');

const builtinPluginSchema = z.object({
    axios: z
        .object({
        method: z.string(),
        url: z.string(),
        data: z.any(),
    })
        .optional(),
    open_task: z.boolean().optional(),
});

/**
 * getServices 方法会将 inversify module 转换成 nestjs module，这样 nestjs controller 就可以使用了
 * 所以，注意：如果不需要给 controller 使用，则不需要 bind
 */
const ServiceSymbol = Symbol('Service');
const ApiServiceSymbol = Symbol('ApiService');
const TreeGridModelSymbol = Symbol.for('TreeGridModel');
const GridModelSymbol = Symbol.for('GridModel');
const PreviewModelSymbol = Symbol.for('PreviewModel');
const WorkflowConfigModelSymbol = Symbol.for('WorkflowConfigModel');
const LoginModelSymbol = Symbol.for('LoginModel');
const ThemeModelSymbol = Symbol.for('ThemeModel');
const TaskFormModelSymbol = Symbol.for('TaskFormModel');
const NewFormModelSymbol = Symbol.for('NewFormModel');
const WorkflowConfigSymbol = Symbol.for('WorkflowConfig');
const CustomResourceSymbol = Symbol.for('CustomResourceSymbol');
const ManageableServiceSymbol = Symbol.for('ManageableService');
const ManageableModelSymbol = Symbol.for('ManageableModel');
const CheckManageableFactorySymbol = Symbol.for('CheckManageableFactory');
const ManageableWidgetSymbol = Symbol.for('ManageableWidget');
const ManageableWidgetFactorySymbol = Symbol.for('ManageableWidgetFactory');
const ManageableModelFactorySymbol = Symbol.for('ManageableModelFactory');

export { ApiServiceSymbol, AssociationKeySchema, CheckManageableFactorySymbol, ColumnKeySchema, ColumnUISchema, CustomResource, CustomResourceSymbol, CustomZodSchemaSymbol, GridModelSymbol, LoginModelSymbol, MANAGEABLE_EDITOR_ID, ManageableModelFactorySymbol, ManageableModelSymbol, ManageableServiceSymbol, ManageableWidgetFactorySymbol, ManageableWidgetSymbol, NOT_REGISTERED, NOT_REGISTERED_SCHEME, NewFormModelSymbol, PreviewModelSymbol, PrismaClientSymbol, ReferenceKeySchema, ResourceKeySchema, ResourceUISchema, ServiceSymbol, TaskFormModelSymbol, ThemeModelSymbol, TreeGridModelSymbol, WorkflowConfigModelSymbol, WorkflowConfigSymbol, agFilterInner2Schema, agFilterInnerSchema, agFilterSchema, agMenuItemSchema, agSortSchema, baseMenuItemSchema, builtinPluginSchema, cellRendererInputSchema, ctxTenantSchema, ctxUserSchema, findManyResourceDataInputSchema, findUniqueResourceDataInputSchema, getDataSchema, getResourceDataInputSchema, getResourceDataOutputInnerSchema, getResourceDataOutputSchema, getResourceInputSchema, handleContextMenuInputSchema, loginInputSchema, loginOutputSchema, menuItemSchema, newFormUriSchema, postDataSchema, postResourceDataInputSchema, putDataSchema, putResourceDataInputSchema, removeDataSchema, removeResourceDataInputSchema, resourceKeySchema, selectOptionSchema, taskSchema, taskUriInputSchema, taskUriOutputSchema, treeGridUriQuerySchema, wfCfgSchema };
