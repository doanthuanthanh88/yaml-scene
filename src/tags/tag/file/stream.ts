import file from ".";

/*****
@name !tag file/stream
@description Transform file/URL to stream
- File in local path
- File from url
@group !Tags
@example
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file/stream: ~/data.json
      file2: !tag
        file/stream: https://raw....
*/
export default class stream extends file {

  override init(path: any) {
    super.init({
      path,
      adapters: [
        {
          Resource: {
            readType: 'stream'
          }
        }
      ]
    })
  }

}