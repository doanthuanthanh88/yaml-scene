export interface IFileWriter {
  write(data: any): Promise<void>
}