import file from ".";

/**
 * @guide
 * @name !tag file/text
 * @description Transform file/URL to text
- File in local path
- File from url
 * @group !Tags
 * @example
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file/text: ~/data.json
      file2: !tag
        file/text: https://raw....
 * @end
 */
export default class stream extends file {

  override init(path: any) {
    super.init({
      path,
      adapters: [
        'Text'
      ]
    })
  }

}