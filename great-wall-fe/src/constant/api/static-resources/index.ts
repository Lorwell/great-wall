import {
  CreateFileDirInput,
  FileOutputRecord,
  fileOutputRecordSchema,
  StaticResourcesInput,
  StaticResourcesListInput,
  StaticResourcesOutput,
  StaticResourcesOutputRecord,
  staticResourcesOutputRecordSchema,
  staticResourcesOutputSchema
} from "@/constant/api/static-resources/schema.ts";
import {deleteJsonRequest, getRequest, postJsonRequest, putJsonRequest} from "@/constant/api";

/**
 * 静态资源列表
 */
export function staticResourcesList(input?: StaticResourcesListInput): Promise<StaticResourcesOutputRecord> {
  return postJsonRequest(`/api/static-resources/list`, {
    body: input,
    resultSchema: staticResourcesOutputRecordSchema
  });
}

/**
 * 静态资源描述
 */
export function staticResourcesDetails(id: number): Promise<StaticResourcesOutput> {
  return getRequest(`/api/static-resources/${id}`, {
    resultSchema: staticResourcesOutputSchema
  });
}

/**
 * 创建静态资源
 */
export function createStaticResources(input: StaticResourcesInput): Promise<StaticResourcesOutput> {
  return postJsonRequest(`/api/static-resources`, {
    body: input,
    resultSchema: staticResourcesOutputSchema
  });
}

/**
 * 更新静态资源
 */
export function updateStaticResources(id: number, input: StaticResourcesInput): Promise<StaticResourcesOutput> {
  return putJsonRequest(`/api/static-resources/${id}`, {
    body: input,
    resultSchema: staticResourcesOutputSchema
  });
}

/**
 * 删除静态资源
 */
export function deleteStaticResources(id: number): Promise<void> {
  return deleteJsonRequest(`/api/static-resources/${id}`);
}

/**
 * 静态资源文件列表
 */
export function staticResourcesFileList(id: number, parentDir?: string): Promise<FileOutputRecord> {
  return getRequest(`/api/static-resources/${id}/files`, {
    queryParam: {parentDir},
    resultSchema: fileOutputRecordSchema
  });
}

/**
 * 静态资源创建文件夹
 */
export function staticResourcesCreateFileDir(id: number,
                                             input: CreateFileDirInput): Promise<void> {
  return postJsonRequest(`/api/static-resources/${id}/file-dir`, {
    body: input,
  });
}

/**
 * 删除静态资源文件
 */
export function staticResourcesDeleteFile(id: number, relativePath: string): Promise<void> {
  return deleteJsonRequest(`/api/static-resources/${id}/files`, {
    body: {
      relativePath
    }
  });
}

