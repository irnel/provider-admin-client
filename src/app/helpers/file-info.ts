export class FileInfo {
  createdAt: Date = new Date();
  markAsPrincipal = false;
  progress: number;
  type?: string;
  modelId?: string;
  url?: string;

  constructor(public src: string, public file: File) {}
}
