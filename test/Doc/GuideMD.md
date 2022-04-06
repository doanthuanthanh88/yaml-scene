# Document
*Describe all of elements in tool. (meaning, how to use...)*
| Element | Description |  
|---|---|  
| DOC | --- |
|[Doc/Guide/MD](#user-content-doc-doc%2fguide%2fmd)| Auto scan file to detect the comment format which is generated to markdown document ...|  
  
  
# Details
<a id="user-content-doc-doc%2fguide%2fmd" name="user-content-doc-doc%2fguide%2fmd"></a>
## Doc/Guide/MD
`Doc`  
Auto scan file to detect the comment format which is generated to markdown document  

```yaml
- Doc/Guide/MD:
    includes:
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```

<br/>

  