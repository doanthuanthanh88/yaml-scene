import file from ".";

/*****
@name !tag file/json
@description Transform file/URL to json object
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
        file/json: ~/data.json
      file2: !tag
        file/json: https://raw....
*/
export default class json extends file {

  override init(path: any) {
    super.init({
      path,
      adapters: [
        'Json'
      ]
    })
  }

}