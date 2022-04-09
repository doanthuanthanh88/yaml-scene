import file from ".";

/**
 * @guide
 * @name !tag file/buffer
 * @description Transform file/URL to buffer
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
        file/buffer: ~/data.json
      file2: !tag
        file/buffer: https://raw...
 * @end
 */
export default class buffer extends file {

  override init(path: any) {
    super.init({
      path,
      adapters: [
        {
          Resource: {
            readType: 'buffer'
          }
        }
      ]
    })
  }

}