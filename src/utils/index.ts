import { Content, Definitions } from "../types";

export function getDefinitions(ref: string, definitions: Definitions): string[] {
    const def = ref.replace('#/definitions/', '');
    const { properties } = definitions[def] || {};
    const prop = Object.entries(properties).map(([k, v]) => {
        if (v.$ref) {
            return `${k}:\n * \t ${getDefinitions(v.$ref, definitions).join('|')}`; // .join('\n * \t ')};
        }
        if (v.items && v.items.$ref) {
            return `${k}:\n * \t ${getDefinitions(v.items.$ref, definitions).join('|')}`; //.join('\n * \t ')};
        }
        return `${k}: ${v.type} ${v.description || ''}`;
    });
    return prop;
}

export function getParams(params: any[], definitions: Definitions) {
    return params?.map(para => {
        if (para.schema && para.schema.$ref) {
            return getDefinitions(para.schema.$ref, definitions).join('\n * ');
        } else if (para.type) {
            return `${para.name}: ${para.type} ${para.description || ''}`;
        }
    }).join('\n * ');
}

export function comments(summary: string, tags: string[], parameters: any, definitions: any) {
    return `/*\n *【${tags.toString()}】${summary} \n * ${getParams(parameters, definitions) || ''}\n */\n`;
}

export function parser(content: any) {
    let data: Content = content;
    if (typeof content === "string") {
        data = JSON.parse(content);
    }

    let target = "import { get, post } from '@/utils/fetch';\n";
    const { paths, definitions } = data;

    Object.entries(paths).forEach(([key, val]) => {
        const { get, post, put, delete: del } = val;
        if (get) {
            // https://www.runoob.com/regexp/regexp-syntax.html
            const reg = /(?<=\{)[a-zA-Z0-9]+(?=\})/g;
            const param = key.match(reg);
            const { operationId, summary, tags, parameters } = get;
            target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (${param || ''}) => get(\`${key.replaceAll("/{", "/${")}\`)\n`;
        } else if (del) {
            // https://www.runoob.com/regexp/regexp-syntax.html
            const reg = /(?<=\{)[a-zA-Z0-9]+(?=\})/g;
            const param = key.match(reg);
            const { operationId, summary, tags, parameters } = del;
            target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (${param || ''}) => del(\`${key.replaceAll("/{", "/${")}\`)\n`;
        } else if (post) {
            const { operationId, summary, tags, parameters } = post;
            target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (params) => post('${key}', params)\n`;
        } else if (put) {
            const { operationId, summary, tags, parameters } = put;
            target += `\n${comments(summary, tags, parameters, definitions)}export const ${operationId} = (params) => put('${key}', params)\n`;
        }
    });

    return target;
}