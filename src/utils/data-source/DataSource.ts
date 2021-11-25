export interface DataSource {
  read(): any
  write(data: any): any
}