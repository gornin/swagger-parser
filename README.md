# swagger-parser

解析swagger api doc, 快速生成适用于umi框架的services文件

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
        "/ResultsReceive/approval-info/{workId}": {
            "get": {
                "tags": [
                    "results-receive-controller"
                ],
                "summary": "待办事务/结果物領取/結果物領取-確認/服務結果領取確認單-申請信息",
                "operationId": "queryApprovalInfoUsingGET",
                "produces": [
                    "*/*"
                ],
                "parameters": [
                    {
                        "name": "workId",
                        "in": "path",
                        "description": "办件id",
                        "required": false,
                        "type": "integer",
                        "format": "int64"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/标准返回«ApprovalInfoVO»"
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
        "/ResultsReceive/confirm": {
            "post": {
                "tags": [
                    "results-receive-controller"
                ],
                "summary": "待办事务/结果物領取/确认",
                "operationId": "saveReceiveResultsUsingPOST",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "*/*"
                ],
                "parameters": [
                    {
                        "in": "body",
                        "name": "confirmResultsReceiveDTO",
                        "description": "confirmResultsReceiveDTO",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/ConfirmResultsReceiveDTO"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/标准返回«boolean»"
                        }
                    },
                    "201": {
                        "description": "Created"
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
        "标准返回«ApprovalInfoVO»": {
            "type": "object",
            "properties": {
                "data": {
                    "description": "实际数据，一般来说是DTO",
                    "$ref": "#/definitions/ApprovalInfoVO"
                },
                "errCode": {
                    "type": "integer",
                    "format": "int32",
                    "example": 0,
                    "description": "业务错误码，如101，-95，0为成功"
                },
                "message": {
                    "type": "string",
                    "description": "返回错误信息"
                },
                "requestId": {
                    "type": "string",
                    "example": "my-center-xxxxxxx",
                    "description": "微服务中心相关的请求id"
                },
                "success": {
                    "type": "boolean",
                    "description": "是否成功"
                }
            },
            "title": "标准返回«ApprovalInfoVO»"
        },
        "标准返回«boolean»": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "boolean",
                    "description": "实际数据，一般来说是DTO"
                },
                "errCode": {
                    "type": "integer",
                    "format": "int32",
                    "example": 0,
                    "description": "业务错误码，如101，-95，0为成功"
                },
                "message": {
                    "type": "string",
                    "description": "返回错误信息"
                },
                "requestId": {
                    "type": "string",
                    "example": "my-center-xxxxxxx",
                    "description": "微服务中心相关的请求id"
                },
                "success": {
                    "type": "boolean",
                    "description": "是否成功"
                }
            },
            "title": "标准返回«boolean»"
        },
    }
}
```

## 目标格式

```js
import { get, post } from '@/utils/fetch';

/* 
 *【results-receive-controller】待办事务/结果物領取/結果物領取-確認/服務結果領取確認單-申請信息 
 * workId: integer 办件id
 */
export const queryApprovalInfoUsingGET = (workId) => get(`/ResultsReceive/approval-info/${workId}`)

/* 
 *【results-receive-controller】待办事务/结果物領取/确认 
 * applicantIdcard: string 證件號碼
 * applicantIdcardType: string 申請人證件類型
 * receiveAddress: string 領取地址
 * receiveBySelf: string 是否本人領取，0-本人領取
 * receiveType: string 領取方式，0-親自領取
 * recipient: string 領取人，姓名
 * remark: string 備註
 * workId: integer 辦件id
 */
export const saveReceiveResultsUsingPOST = (params) => post('/ResultsReceive/confirm', params)
```