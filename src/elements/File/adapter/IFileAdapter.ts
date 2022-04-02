export interface IFileAdapter {
  read(): Promise<any>
  write(data: any): Promise<void>
}