# Post service
Demo CRUD API to generate to markdown document
> Developed by [Doan Thuan Thanh](mailto:doanthuanthanh88@gmail.com)  
> Updated at 3/12/2022, 12:22:06 PM  

| | API title | URL |  
|---|---|---|  
|**1**|[Create a new post](#Create%20a%20new%20post)| `POST` /posts|  
|**2**|[Delete a post](#Delete%20a%20post)| `DELETE` /posts/:id|  
|**3**|[Get a post details](#Get%20a%20post%20details)| `GET` /posts/:id|  
|**4**|[Get all of posts](#Get%20all%20of%20posts)| `GET` /posts|  
|**5**|[Update a post](#Update%20a%20post)| `PUT` /posts/:id|  
  

---

## [Create a new post](#) <a name="Create%20a%20new%20post"></a>



- `POST /posts`
- ✅  &nbsp; **201**  *Created*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts" -X POST -H "content-type: application/json" -d "{\"id\":2,\"title\":\"json-server 2\",\"author\":\"typicode 2\"}"
```

</details>


## REQUEST
### Request body
`Content-Type: *application/json*`  

<details>
  <summary>Example</summary>

```json
{
  "id": 2,
  "title": "json-server 2",
  "author": "typicode 2"
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |
| &nbsp;&nbsp;&nbsp;&nbsp; `title` | string |
| &nbsp;&nbsp;&nbsp;&nbsp; `author` | string |

</details>

## RESPONSE
### Response data
`Content-Type: *application/json; charset=utf-8*`  

<details>
  <summary>Example</summary>

```json
{
  "id": 2,
  "title": "json-server 2",
  "author": "typicode 2"
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |
| &nbsp;&nbsp;&nbsp;&nbsp; `title` | string |
| &nbsp;&nbsp;&nbsp;&nbsp; `author` | string |

</details>


---

## [Delete a post](#) <a name="Delete%20a%20post"></a>



- `DELETE /posts/:id`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts/2" -X DELETE -H "content-type: application/json"
```

</details>


## REQUEST
### Params
<details>
  <summary>Example</summary>

```json
{
  "id": 2
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |

</details>

## RESPONSE
### Response data
`Content-Type: *application/json; charset=utf-8*`  

<details>
  <summary>Example</summary>

```json
{}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |

</details>


---

## [Get a post details](#) <a name="Get%20a%20post%20details"></a>



- `GET /posts/:id`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts/2" -X GET -H "content-type: application/json"
```

</details>


## REQUEST
### Params
<details>
  <summary>Example</summary>

```json
{
  "id": 2
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |

</details>

## RESPONSE
### Response data
`Content-Type: *application/json; charset=utf-8*`  

<details>
  <summary>Example</summary>

```json
{
  "id": 2,
  "title": "json-server 2 updated",
  "author": "typicode 2 updated"
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |
| &nbsp;&nbsp;&nbsp;&nbsp; `title` | string |
| &nbsp;&nbsp;&nbsp;&nbsp; `author` | string |

</details>


---

## [Get all of posts](#) <a name="Get%20all%20of%20posts"></a>



- `GET /posts`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts" -X GET -H "content-type: application/json"
```

</details>


## REQUEST
## RESPONSE
### Response data
`Content-Type: *application/json; charset=utf-8*`  

<details>
  <summary>Example</summary>

```json
[
  {
    "id": 1,
    "title": "json-server",
    "labels": [
      "news",
      "user"
    ],
    "creator": {
      "name": "thanh",
      "created_time": 1647087723969
    },
    "tags": [
      {
        "id": 1,
        "name": "thanh 1"
      },
      {
        "id": 2,
        "name": "thanh 2"
      }
    ]
  }
]
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | array&lt;object&gt; |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |
| &nbsp;&nbsp;&nbsp;&nbsp; `title` | string |
| &nbsp;&nbsp;&nbsp;&nbsp; `labels` | array&lt;string&gt; |
| &nbsp;&nbsp;&nbsp;&nbsp; `creator` | object |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `name` | string |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `created_time` | number |
| &nbsp;&nbsp;&nbsp;&nbsp; `tags` | array&lt;object&gt; |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `id` | number |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `name` | string |

</details>


---

## [Update a post](#) <a name="Update%20a%20post"></a>



- `PUT /posts/:id`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts/2" -X PUT -H "content-type: application/json" -d "{\"id\":2,\"title\":\"json-server 2 updated\",\"author\":\"typicode 2 updated\"}"
```

</details>


## REQUEST
### Params
<details>
  <summary>Example</summary>

```json
{
  "id": 2
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |

</details>

### Request body
`Content-Type: *application/json*`  

<details>
  <summary>Example</summary>

```json
{
  "id": 2,
  "title": "json-server 2 updated",
  "author": "typicode 2 updated"
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |
| &nbsp;&nbsp;&nbsp;&nbsp; `title` | string |
| &nbsp;&nbsp;&nbsp;&nbsp; `author` | string |

</details>

## RESPONSE
### Response data
`Content-Type: *application/json; charset=utf-8*`  

<details>
  <summary>Example</summary>

```json
{
  "id": 2,
  "title": "json-server 2 updated",
  "author": "typicode 2 updated"
}
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | object |
| &nbsp;&nbsp;&nbsp;&nbsp; `id` | number |
| &nbsp;&nbsp;&nbsp;&nbsp; `title` | string |
| &nbsp;&nbsp;&nbsp;&nbsp; `author` | string |

</details>

  