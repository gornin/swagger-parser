export interface Content {
    swagger: string
    info: Info
    host: string
    basePath: string
    tags: Tag[]
    paths: Paths
    definitions: Definitions
}

export interface Properties{
    [key:string]:{
        type: string;
        format: string;
        description: string;
    }
}

export interface Definitions {
    [key: string]: {
        type: string;
        properties: Properties;
        title: string;
        description?: string;
    }
}

export interface Info {
    description: string
    version: string
    title: string
    termsOfService: string
    contact: Contact
    license: License
}

export interface Contact { }

export interface License {
    name: string
    url: string
}

export interface Tag {
    name: string
    description: string
}

export interface Paths {
    [key: string]: {
        get: Get;
        post: Post;
        delete: Delete;
        put: Put;
    }
}

export interface Get {
    tags: string[]
    summary: string
    operationId: string
    produces: string[]
    parameters: Parameter[]
    responses: Responses
    deprecated: boolean
}

export interface Post {
    tags: string[]
    summary: string
    operationId: string
    produces: string[]
    parameters: Parameter[]
    responses: Responses
    deprecated: boolean
}

export interface Delete {
    tags: string[]
    summary: string
    operationId: string
    produces: string[]
    parameters: Parameter[]
    responses: Responses
    deprecated: boolean
}

export interface Put {
    tags: string[]
    summary: string
    operationId: string
    produces: string[]
    parameters: Parameter[]
    responses: Responses
    deprecated: boolean
}

export interface Parameter {
    in: string
    name: string
    description: string
    required: boolean
    schema: Schema
}

export interface Schema {
    type: string
    additionalProperties?: AdditionalProperties
}

export interface AdditionalProperties {
    type: string
}

export interface Responses {
    "200": N200
    "401": N401
    "403": N403
    "404": N404
}

export interface N200 {
    description: string
    schema: Schema200
}
export interface Schema200 {
    type: string
}
export interface N401 {
    description: string
}
export interface N403 {
    description: string
}
export interface N404 {
    description: string
}