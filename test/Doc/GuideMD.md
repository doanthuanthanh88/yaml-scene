# Document
*Describe all of elements in tool. (meaning, how to use...)*
| Element | Description |  
|---|---|  
| DOC | --- |
|[Doc~GuideMD](#Doc~GuideMD)| Auto scan file to detect the comment format which is generated to markdown document|  
  
  
# Details
## Doc~GuideMD <a name="Doc~GuideMD"></a>
Auto scan file to detect the comment format which is generated to markdown document  

```yaml
- Doc~GuideMD: 
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```


  