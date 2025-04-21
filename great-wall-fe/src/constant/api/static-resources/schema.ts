import {z} from "zod";
import {baseListInputSchema, baseOutputSchema, getPageRecordSchema, getRecordSchema} from "@/constant/api/schema.ts";

export const staticResourcesListInputSchema = baseListInputSchema.merge(
  z.object({})
)
export type StaticResourcesListInput = z.infer<typeof staticResourcesListInputSchema>;

export const staticResourcesInputSchema = z.object({
  name: z.string()
    .min(1, {message: "名称不能为空"})
    .max(50, {message: "名称长度不能超过50个字符"}),
  describe: z.string()
    .max(150, {message: "描述长度不能超过150个字符"})
    .nullable()
    .optional()
});

export type StaticResourcesInput = z.infer<typeof staticResourcesInputSchema>;

export const staticResourcesOutputSchema = baseOutputSchema.merge(
  z.object({
    name: z.string().describe("名称"),
    describe: z.string().optional().nullable().describe("描述")
  })
);

export type StaticResourcesOutput = z.infer<typeof staticResourcesOutputSchema>;

export const staticResourcesOutputRecordSchema = getPageRecordSchema(staticResourcesOutputSchema);
export type StaticResourcesOutputRecord = z.infer<typeof staticResourcesOutputRecordSchema>;

export enum FileTypeEnum {
  FILE = "FILE",
  DIR = "DIR"
}

export const fileOutputSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(FileTypeEnum),
  parentDir: z.string().nullable(),
  relativePath: z.string(),
  size: z.number().int().nonnegative(),
  lastUpdateTime: z.number().int().nonnegative()
});

export type FileOutput = z.infer<typeof fileOutputSchema>;

export const fileOutputRecordSchema = getRecordSchema(fileOutputSchema);
export type FileOutputRecord = z.infer<typeof fileOutputRecordSchema>;


export const createFileDirInputSchema = z.object({
  name: z.string(),
  parentDir: z.string().optional().nullable()
});

export type CreateFileDirInput = z.infer<typeof createFileDirInputSchema>;