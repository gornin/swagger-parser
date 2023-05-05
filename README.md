# swagger-parser

解析swagger

使用的是 json 格式，`http://xxx/v2/api-docs` 获取，暂时没有调用，所以需要手动copy后保存成json文件。

在vscode中打开此json，使用快捷键 `shift + alt + g` 生成目标js文件。

## 原文件格式

```json
{
    "swagger":"2.0",
    "info":{
        "description": "Api Documentation",
        "version": "1.0",
        "title": "Api Documentation",
        "termsOfService": "urn:tos",
        "contact": {},
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0"
        }
    },
    "host":"",
    "basePath": "/",
    "tags":[
        {
            "name": "TabServiceNoticeLog-api",
            "description": "Tab Service Notice Log Controller"
        },
    ],
    "paths":{
         "/actuator": {
            "get": {
                "tags": [
                    "web-mvc-links-handler"
                ],
                "summary": "links",
                "operationId": "linksUsingGET",
                "produces": [
                    "application/json",
                    "application/vnd.spring-boot.actuator.v2+json"
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "object",
                                "additionalProperties": {
                                    "$ref": "#/definitions/Link"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                },
                "deprecated": false
            }
        },
    },
    "definitions":{
        "ApiPageResult": {
            "type": "object",
            "properties": {
                "list": {
                    "type": "array",
                    "items": {
                        "type": "object"
                    }
                },
                "pageNum": {
                    "type": "integer",
                    "format": "int64"
                },
                "pageSize": {
                    "type": "integer",
                    "format": "int64"
                },
                "totalCount": {
                    "type": "integer",
                    "format": "int64"
                }
            },
            "title": "ApiPageResult"
        },
    }
}
```

## 目标格式

```js
import { get, post } from '@/utils/fetch';

/* 
 *【results-receive-controller】注释信息
 * id: integer id
 */
export const queryApprovalInfoUsingGET = (id) => get(`/ResultsReceive/approval-info/${id}`)

/* 
 *【results-receive-controller】注释信息
 * name: string 姓名
 * id: integer id
 */
export const saveReceiveResultsUsingPOST = (params) => post('/ResultsReceive/confirm', params)
```