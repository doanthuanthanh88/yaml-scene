# Demo APIs
Demo Dynamic CRUD API to generate to markdown document
> Developed by [Doan Thuan Thanh](mailto:doanthuanthanh88@gmail.com)  
> Updated at 4/11/2022, 3:57:21 PM  

| | Title (10) | URL |  
|---|---|---|  
| |ACTIONS (6) | |
|**1**|[Create a new post](#user-content-create%20a%20new%20post)| `POST` /posts|  
|**2**|[Create a new user](#user-content-create%20a%20new%20user)| `POST` /users|  
|**3**|[Delete a post](#user-content-delete%20a%20post)| `DELETE` /posts/:id|  
|**4**|[Delete a user](#user-content-delete%20a%20user)| `DELETE` /users/:id|  
|**5**|[Update a post](#user-content-update%20a%20post)| `PUT` /posts/:id|  
|**6**|[Update a user](#user-content-update%20a%20user)| `PUT` /users/:id|  
| |POST (5) | |
|**1**|[Create a new post](#user-content-create%20a%20new%20post)| `POST` /posts|  
|**2**|[Delete a post](#user-content-delete%20a%20post)| `DELETE` /posts/:id|  
|**3**|[Get a post details](#user-content-get%20a%20post%20details)| `GET` /posts/:id|  
|**4**|[Get all of posts](#user-content-get%20all%20of%20posts)| `GET` /posts|  
|**5**|[Update a post](#user-content-update%20a%20post)| `PUT` /posts/:id|  
| |RETURNS (4) | |
|**1**|[Get a post details](#user-content-get%20a%20post%20details)| `GET` /posts/:id|  
|**2**|[Get a user details](#user-content-get%20a%20user%20details)| `GET` /users/:id|  
|**3**|[Get all of posts](#user-content-get%20all%20of%20posts)| `GET` /posts|  
|**4**|[Get all of users](#user-content-get%20all%20of%20users)| `GET` /users|  
| |USER (5) | |
|**1**|[Create a new user](#user-content-create%20a%20new%20user)| `POST` /users|  
|**2**|[Delete a user](#user-content-delete%20a%20user)| `DELETE` /users/:id|  
|**3**|[Get a user details](#user-content-get%20a%20user%20details)| `GET` /users/:id|  
|**4**|[Get all of users](#user-content-get%20all%20of%20users)| `GET` /users|  
|**5**|[Update a user](#user-content-update%20a%20user)| `PUT` /users/:id|  
  

---

<a id="user-content-create%20a%20new%20post" name="user-content-create%20a%20new%20post"></a>
## [Create a new post](#)



- `POST /posts`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts" -X POST -H "content-type: application/json" -d "{\"id\":2,\"title\":\"title 2\",\"author\":\"typicode 2\"}"
```

</details>



<br/>

## REQUEST
### Request body
`Content-Type: *application/json*`  

<details>
  <summary>Example</summary>

```json
{
  "id": 2,
  "title": "title 2",
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
  "title": "title 2",
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

<a id="user-content-create%20a%20new%20user" name="user-content-create%20a%20new%20user"></a>
## [Create a new user](#)



- `POST /users`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/users" -X POST -H "content-type: application/json" -d "{\"id\":2,\"title\":\"title 2\",\"author\":\"typicode 2\"}"
```

</details>



<br/>

## REQUEST
### Request body
`Content-Type: *application/json*`  

<details>
  <summary>Example</summary>

```json
{
  "id": 2,
  "title": "title 2",
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
  "title": "title 2",
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

<a id="user-content-delete%20a%20post" name="user-content-delete%20a%20post"></a>
## [Delete a post](#)



- `DELETE /posts/:id`
- ✅  &nbsp; **204**  *No Content*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts/2" -X DELETE -H "content-type: application/json"
```

</details>



<br/>

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
`Content-Type: *undefined*`  

<details>
  <summary>Example</summary>

```json
""
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | string |

</details>


---

<a id="user-content-delete%20a%20user" name="user-content-delete%20a%20user"></a>
## [Delete a user](#)



- `DELETE /users/:id`
- ✅  &nbsp; **204**  *No Content*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/users/2" -X DELETE -H "content-type: application/json"
```

</details>



<br/>

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
`Content-Type: *undefined*`  

<details>
  <summary>Example</summary>

```json
""
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | string |

</details>


---

<a id="user-content-get%20a%20post%20details" name="user-content-get%20a%20post%20details"></a>
## [Get a post details](#)



- `GET /posts/:id`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts/2" -X GET -H "content-type: application/json"
```

</details>



<br/>

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
  "title": "title 2 updated",
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

<a id="user-content-get%20a%20user%20details" name="user-content-get%20a%20user%20details"></a>
## [Get a user details](#)



- `GET /users/:id`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/users/2" -X GET -H "content-type: application/json"
```

</details>



<br/>

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
  "title": "title 2 updated",
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

<a id="user-content-get%20all%20of%20posts" name="user-content-get%20all%20of%20posts"></a>
## [Get all of posts](#)



- `GET /posts`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts" -X GET -H "content-type: application/json"
```

</details>



<br/>

## REQUEST
## RESPONSE
### Response data
`Content-Type: *application/json; charset=utf-8*`  

<details>
  <summary>Example</summary>

```json
[]
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | array&lt;&gt; |

</details>


---

<a id="user-content-get%20all%20of%20users" name="user-content-get%20all%20of%20users"></a>
## [Get all of users](#)



- `GET /users`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/users" -X GET -H "content-type: application/json"
```

</details>



<br/>

## REQUEST
## RESPONSE
### Response data
`Content-Type: *application/json; charset=utf-8*`  

<details>
  <summary>Example</summary>

```json
[]
```

</details>

<details open>
  <summary>Schema</summary>

| Name | Type |
| --- | --- |
|  `@ROOT` | array&lt;&gt; |

</details>


---

<a id="user-content-update%20a%20post" name="user-content-update%20a%20post"></a>
## [Update a post](#)



- `PUT /posts/:id`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/posts/2" -X PUT -H "content-type: application/json" -d "{\"id\":2,\"title\":\"title 2 updated\",\"author\":\"typicode 2 updated\"}"
```

</details>



<br/>

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
  "title": "title 2 updated",
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
  "title": "title 2 updated",
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

<a id="user-content-update%20a%20user" name="user-content-update%20a%20user"></a>
## [Update a user](#)



- `PUT /users/:id`
- ✅  &nbsp; **200**  *OK*



<details open>
<summary><b>cURL</b></summary>

```sh
curl "/users/2" -X PUT -H "content-type: application/json" -d "{\"id\":2,\"title\":\"title 2 updated\",\"author\":\"typicode 2 updated\"}"
```

</details>



<br/>

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
  "title": "title 2 updated",
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
  "title": "title 2 updated",
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

  