export interface FileInfo {
  createdAt: Date;
  markAsPrincipal: Boolean;
  file?: File;
  src?: string;
  name?: string;
  size?: number;
  type?: string;
  modelType?: string;
  modelId?: string;
  url?: string;
  id?: string;
}
