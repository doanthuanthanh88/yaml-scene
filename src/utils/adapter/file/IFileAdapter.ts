export interface IFileAdapter {
  read();
  write(data: any);
}