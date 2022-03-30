# Document
*Describe all of elements in tool. (meaning, how to use...)*
| Element | Description |  
|---|---|  
| DOC | --- |
|[Doc/Guide/MD](#Doc%2FGuide%2FMD)| Auto scan file to detect the comment format which is generated to markdown document ...|  
  
  
# Details
## Doc/Guide/MD <a name="Doc/Guide/MD"></a>
Auto scan file to detect the comment format which is generated to markdown document  

```yaml
- Doc/Guide/MD: 
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```


  