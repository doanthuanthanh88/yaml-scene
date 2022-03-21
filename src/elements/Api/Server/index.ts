import { ElementProxy } from '@app/elements/ElementProxy';
import { IElement } from '@app/elements/IElement';
import cors from '@koa/cors';
import Router from '@koa/router';
import chalk from 'chalk';
import http from 'http';
import https from 'https';
import Koa from 'koa';
import bodyParser from 'koa-body';
import serve from 'koa-static';
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import { CRUDModel } from './CRUDModel';

/**
 * @guide
 * @name Api/Server
 * @description Mock API server  
- Server static file
- Support upload file then save to server
- Server RESTFul API data 
- Create APIs which auto handle CRUD data
 * @group Api
 * @example
- Api/Server:
    title: Mock http request to serve data
    https: true                                 # Server content via https
    https:                                      # Server content via https with custom cert and key
      key: 
      cert: 
    host: 0.0.0.0                               # Server host
    port: 8000                                  # Server port

    routers:                                    # Defined routes

      # Server static files
      - serveIn: [./assets]                     # All of files in list will be served after request to

      # Server upload API
      - path: /upload                           # Upload path. Default method is POST
        method: POST                            # Request method (POST, PUT, PATCH, DELETE, HEAD)
                                                # - Default method is POST
        uploadTo: ./uploadDir                   # Directory includes uploading files

      # Create APIs which auto handle CRUD data
      - path: '/posts'                          # Request path
        CRUD: true                              # Auto create full RESTful API
                                                # - GET    /posts            : Return list posts
                                                # - GET    /posts/:id        : Return post details by id
                                                # - POST   /posts            : Create a new post
                                                # - PUT    /posts/:id        : Replace entity of post to new post
                                                # - PATCH  /posts/:id        : Only update some properties of post
                                                # - DELETE /posts/:id        : Delete a post by id
        init: [                                 # Init data
          {
            "id": 1,
            "label": "label 01"
          }
        ]

      # Create a API which you can customize response, path....
      - method: GET                             # Request method (POST, PUT, PATCH, DELETE, HEAD)
                                                # - Default method is GET
        path: /posts/:id                        # Request path
        response:                               # Response data
          status: 200                           # - Response status
          statusMessage: OK                     # - Response status message
          headers:                              # - Response headers
            server: nginx
          data: [                               # - Response data. 
            {                                   #   - Use some variables to replace value to response
              "id": ${+$params.id},             # $params:  Request params (/:id)
              "title": "title 1",               # $headers: Request headers
              "author": "thanh"                 # $query:   Request querystring (?name=thanh)
              "des": "des 1",                   # $body:    Request body
            }                                   # $request: Request
          ]                                     # $ctx:     Context
      # Create a API which you handle request and response
      - method: GET                             # Request method (POST, PUT, PATCH, DELETE, HEAD)
                                                # - Default method is GET
        path: /posts/:id                        # Request path
        handler: |                              # Handle code which handle request and response data
          // _: this.proxy, 
          // __: this, $params: 
          // ctx.params, headers: ctx.headers, 
          // query: ctx.request.query, 
          // body: ctx.request.body, 
          // request: ctx.request, 
          // ctx: ctx

          const merge = require('lodash.merge')
          return merge({
            name: $query.name
          }, {
            id: 1
          })
          
 * @end
 */
export default class Server implements IElement {
  private static readonly KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAynRSsMcDagvV86OaKAmi3Y7GfUnuYm6IG0PpaNEPD+F/LNNO
vHGbFouYbHNX6RvejmJVGg9iQGYUnLgY4qipOplaZRKF1kiWzvCJ6xyVaMhKHlEo
l5cwJrJj9cR8mMWRHBdnw4RcXultEooh0CYVl61YDF00mkOSK4ySNwyFKavOzLM9
ulMDt2hZnD6OWVw+m2FzdMAqsSsjt4bm92mc73Ei2TN/Fb4TEETGyBGpFZUPfUUb
5MQsjb4daAILmeRDLBX199DVtn2fXCfM7DqnWGn6D25cfQ7cmzkqm18BN0kPDfEV
NSY2J1hAqHDYSBpcg30imbKmmQ6FgP6BMy/dQwIDAQABAoIBAFF9Lsd+423s46pU
oLka39ZEILrPZkdybBBlbm7FL0XaIwFc8GVDaQRTHgAREUJ/+D3hcJWzuX1oWUWX
iFS7RJqUnWDvarWMtD8JbMoY0D7D16mKS0dxEG2TAk8rTmeDplvjQ93byf5eAIwk
02Vf3vMVT8pyPbkWF6C1zSihPnw9tsisSz9s1p7hve1g/98c1D3xWJSj6ATV6I4I
5vP9SQMiiKirLcaKVj7RsVG3wFs40dQrmsLX6mJeW1VBrj80Ie5+U/EnjIWntE5H
OIC+FUaQdI/oO5gsM54DgVJBawxHyCrvxK52nS1bgVo48e0HLSITilXwaX3mvhTS
VMNUR1ECgYEA8N7RO4PUer+xf91G4mnTWrQlY+KYUzXuZT52/F5fVFCdEDW3ogqh
LUoHxJM2tCoQQzMQ57pTPsT4YC725Pb7VxjwnslCWNEd+AwRXGccDNjV4DFrRD74
Nh/12NnYX5N/S7beQEOykzPt06eTeUmYcLVrZDGhm9/Le52MpKlpqVkCgYEA1yvH
Uk7zAqDakNBl1jpGAIjIaieVbi2mJJOUpcXxAzzORXrBPOsz6NHz1Xu336DPciwW
CFXGlImFD29cTm09PrHGtLYCh60JJXbaT7fv8/CwdPipxJMQkUjMIgBivZKkQATd
omiaXxYTAj6mz1OCh+v99iy5j0Rswl5/CObQC/sCgYAssDpDf3bpey00Wtpu4VFs
L6YMPRsjvQrIz+kFc4DeRMKPIlg6gRxcKbL9Po7UqEUyIoRNad1N9P9b4Pq/ii8h
fqgN3asojUuxHJQP/7VNkOFFYgXTuJcWe6GCJRCm0te4NWpQo/66ntTOAvYyd3wH
1TDieu7P25qGCbnxRtkqqQKBgAqp8MbzgreuoSZsLZ/gY3fDT6tzKsS7HnDRn5xX
owo2CUMIQmtyfLAdN6hs6T/8CEvwQ2dGWQEjj6SkMD7yywZAaUirfJSczsc8jLVG
uG2ukBA8Aq3rW/bXVMaankom6l0B4Lob1QrBXU/PKxU7Xky+NWft74RaL8myRTl7
tvPhAoGBALFvxPDmPmN/sNIQrMmFB9aakjSzzKEwPuLQAZfm/cUP3uRzh3g+rA+I
F1Z81tlFlCBbNvbBFu4OAdzvs5eD+OmEX/g7RHwalPgTd2PFqbHnB9gDdIv/4FFh
qxLCaZQzqr8sDtbGfYiWc3utfUKS4gqSTMLm2IvJ/bz09ATbkGE4
-----END RSA PRIVATE KEY-----
  `;
  private static readonly CERT = `-----BEGIN CERTIFICATE-----
MIIDIDCCAggCCQD5jt6BwlNWnTANBgkqhkiG9w0BAQUFADBSMQswCQYDVQQGEwJW
TjELMAkGA1UECAwCSE4xCzAJBgNVBAcMAkxZMSkwJwYJKoZIhvcNAQkBFhpkb2Fu
dGh1YW50aGFuaDg4QGdtYWlsLmNvbTAeFw0yMTAzMDgwNzM0MjZaFw0yMTA0MDcw
NzM0MjZaMFIxCzAJBgNVBAYTAlZOMQswCQYDVQQIDAJITjELMAkGA1UEBwwCTFkx
KTAnBgkqhkiG9w0BCQEWGmRvYW50aHVhbnRoYW5oODhAZ21haWwuY29tMIIBIjAN
BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAynRSsMcDagvV86OaKAmi3Y7GfUnu
Ym6IG0PpaNEPD+F/LNNOvHGbFouYbHNX6RvejmJVGg9iQGYUnLgY4qipOplaZRKF
1kiWzvCJ6xyVaMhKHlEol5cwJrJj9cR8mMWRHBdnw4RcXultEooh0CYVl61YDF00
mkOSK4ySNwyFKavOzLM9ulMDt2hZnD6OWVw+m2FzdMAqsSsjt4bm92mc73Ei2TN/
Fb4TEETGyBGpFZUPfUUb5MQsjb4daAILmeRDLBX199DVtn2fXCfM7DqnWGn6D25c
fQ7cmzkqm18BN0kPDfEVNSY2J1hAqHDYSBpcg30imbKmmQ6FgP6BMy/dQwIDAQAB
MA0GCSqGSIb3DQEBBQUAA4IBAQBBbt1vIAfn7+NNGJqcq8JoQMkNutP4Lay4/ejs
rTU/ucjDeHcpW+6iBPyANfPaAyua3Wjr9A3RXtcPOni1Zt8QqmV5N7VI+wS1FLdL
3e25MFrvvgPaQvU1C9WltL0KD80/yP4zd5kVvviG/gKyCE8XwfovmLy+1rMErO0C
+gjG6O0COdYMSTdm3bHfntmyGiNvBgyRmMOnDkLSGO/dvKGjroffxNVDe0xAmi7W
SDhm47OwPFXyyHp+ObPLYcfK0wZ23J2Inj24VNw6uwhRoWij66j4zh/VqfciiA5B
zsqKxI1xw5qstqlVX3MQR6n8xTfr2Ec6W3lGbtuQ0MEHYbT8
-----END CERTIFICATE-----
  `;
  private resolve: any;
  private reject: any;

  proxy: ElementProxy<Server>;

  title: string;
  port?: number;
  host?: string;
  https?: {
    key: string;
    cert: string;
  } | boolean;
  routers: ({
    CRUD: boolean
    init?: any[]
    path: string
  } | {
    /** Server static files in these folders */
    serveIn: string | string[];
  } | {
    /** Upload file */
    path: string;
    method: string;
    uploadTo: string;
  } | {
    /** Mock response data */
    method: string;
    path: string;
    response?: {
      /** Respnse status */
      status?: number;
      /** Response status text */
      statusText?: string;
      /** Response headers */
      headers?: any;
      /** Response data */
      data?: any;
    }
  } | {
    /** Customize request and response */
    method: string;
    path: string;
    handler?: string
  })[]

  #app?: Koa;
  #router?: Router;
  #server?: http.Server | https.Server;

  init(props: Partial<Server>) {
    merge(this, props);
    this.#app = new Koa();
    this.#app.use(cors());
    this.#router = new Router();
  }

  prepare() {
    this.routers = this.proxy.getVar(this.routers);
    let i: number
    for (i = 0; i < this.routers.length; i++) {
      const r: any = this.routers[i]
      if (r.serveIn) {
        const serveIns = !Array.isArray(r.serveIn) ? [r.serveIn] : r.serveIn
        serveIns.forEach(serveIn => {
          this.proxy.logger.info(chalk.gray(`- GET /**/* \t- SERVE IN \t${this.proxy.resolvePath(serveIn)}/**/*`));
          this.#app.use(serve(this.proxy.resolvePath(serveIn)));
        })
      } else if (r.uploadTo) {
        if (!r.method)
          r.method = 'POST';
        else
          r.method = r.method.toUpperCase();
        this.proxy.logger.info(chalk.gray(`- ${r.method} ${r.path} \t- UPLOAD TO \t${this.proxy.resolvePath(r.uploadTo)}/*`));
        this.#router[r.method.toLowerCase()](r.path, bodyParser({
          multipart: true,
          formidable: {
            uploadDir: r.uploadTo,
            keepExtensions: true,
            multiples: true,
          },
          urlencoded: true,
          formLimit: '500000mb',
        }), (ctx, next) => {
          ctx.body = { ...(ctx.request.files || {}), ...(ctx.request.body || {}) }
          return next();
        });
      } else if (r.CRUD) {
        const crud = new CRUDModel()
        if (r.init) {
          (Array.isArray(r.init) ? r.init : [r.init]).forEach(item => crud.create(item))
        }
        this.routers.splice(this.routers.findIndex(e => e === r), 1, {
          method: 'GET',
          path: `${r.path}`,
          response: {
            status: 200,
            statusText: 'FIND',
            data: crud
          }
        }, {
          method: 'GET',
          path: `${r.path}/:id`,
          response: {
            status: 200,
            statusText: 'DETAILS',
            data: crud
          }
        }, {
          method: 'POST',
          path: `${r.path}`,
          response: {
            status: 200,
            statusText: 'CREATE',
            data: crud
          }
        }, {
          method: 'PUT',
          path: `${r.path}/:id`,
          response: {
            status: 200,
            statusText: 'UPDATE',
            data: crud
          }
        }, {
          method: 'PATCH',
          path: `${r.path}/:id`,
          response: {
            status: 200,
            statusText: 'PATCH',
            data: crud
          }
        }, {
          method: 'DELETE',
          path: `${r.path}/:id`,
          response: {
            status: 204,
            statusText: 'REMOVE',
            data: crud
          }
        })
        i--
      } else {
        r.method = !r.method ? 'GET' : r.method.toUpperCase()
        if (r.path) {
          this.proxy.logger.info(chalk.gray(`- ${r.method} ${r.path}`));
          this.#router[r.method.toLowerCase()](r.path, bodyParser({
            multipart: true,
            urlencoded: true,
          }), async (ctx, next) => {
            if (r.handler) {
              const rs = await this.proxy.eval(r.handler, { params: ctx.params, headers: ctx.headers, query: ctx.request.query, body: ctx.request.body, request: ctx.request, ctx: ctx });
              if (ctx.body === undefined) ctx.body = rs === undefined ? null : rs
            } else {
              if (r.response?.status)
                ctx.status = r.response?.status;
              if (r.response?.statusText)
                ctx.message = r.response?.statusText;
              if (r.response?.data instanceof CRUDModel) {
                const data: CRUDModel = r.response.data
                switch (ctx.message) {
                  case 'FIND':
                    ctx.body = data.find(ctx.request.query)
                    break
                  case 'DETAILS':
                    ctx.body = data.get('id', ctx.params.id)
                    break
                  case 'CREATE':
                    ctx.body = data.create(ctx.request.body)
                    break
                  case 'PATCH':
                    ctx.body = data.patch('id', ctx.params.id, ctx.request.body)
                    break
                  case 'UPDATE':
                    ctx.body = data.update('id', ctx.params.id, ctx.request.body)
                    break
                  case 'REMOVE':
                    ctx.body = data.remove('id', ctx.params.id)
                    break
                }
              } else if (r.response?.data) {
                ctx.body = cloneDeep(r.response.data);
                ctx.body = this.proxy.getVar(ctx.body, { $params: ctx.params, $headers: ctx.headers, $query: ctx.request.query, $body: ctx.request.body, $request: ctx.request, $ctx: ctx });
              }
            }
            return next();
          });
        }
      }
    }
    if (!this.host)
      this.host = '0.0.0.0';
    if (!this.port)
      this.port = !this.https ? 8000 : 4430;
  }

  private get httpObject() {
    return !this.https ? http : https;
  }

  private get serverOption() {
    return !this.https ? {} : this.https === true ? {
      key: Server.KEY,
      cert: Server.CERT
    } : {
      key: this.https?.key || Server.KEY,
      cert: this.https?.cert || Server.CERT
    };
  }

  start() {
    return new Promise((r: any) => {
      this.#app
        .use(this.#router.routes())
        .use(this.#router.allowedMethods());
      this.#server = this.httpObject.createServer(this.serverOption, this.#app.callback());
      this.#server.listen(this.port, this.host, r);
      this.#server.on('close', () => {
        this.#server = null
      })
    });
  }

  async stop() {
    this.#server?.close(err => err ? this.reject(err) : this.resolve(undefined));
  }

  async exec() {
    return new Promise(async (resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      console.group();
      this.proxy.logger.info(chalk.green(this.title));
      await this.start() as any;
      this.proxy.logger.info(chalk.green('Listening at %s://%s:%d'), this.https ? 'https' : 'http', this.host, this.port);
      console.groupEnd();
    });
  }

  async dispose() {
    await this.stop();
  }

}
