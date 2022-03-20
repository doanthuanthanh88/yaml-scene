import { Simulator } from "@app/Simulator"

describe('Echo', () => {
  test('Text', async () => {
    await Simulator.Run(`
- Echo: Hello world                       # Print white text

- Echo: 
    message: Hello red
    color: red

- Echo: 
    message: Hello red
    transforms:
      - Colorize: red

- Echo/Green: Green text                  # Print green text

- Echo/Blue: Blue text                    # Print blue text

- Echo/Red: Red text                      # Print red text

- Echo/Yellow: Yellow text                # Print yellow text

- Echo/Cyan: Cyan text                    # Print cyan text

- Echo/Gray: Gray text                    # Print gray text
    
  `)
  })

  test('Object', async () => {
    await Simulator.Run(`
- Echo: 
    message: {
      name: 'thanh'
    }

- Echo: 
    message: {
      name: 'thanh'
    }
    transforms:
      - Json
      - Colorize: red

- Echo:                                   
    message: {
      user: "thanh"
    }
    pretty: true
    color: green

- Echo:                                   
    message: {
      user: "thanh"
    }
    transforms:
      - Json: 
          pretty: true
      - Colorize: green
    
  `)
  })

  test('Schema', async () => {
    await Simulator.Run(`
- Echo/Schema:
    color: red
    pretty: true
    message: {
      name: 'thanh'
    }

- Echo: 
    message: {
      name: 'thanh'
    }
    schema: true

- Echo: 
    message: {
      name: 'thanh'
    }
    transforms:
      - Schema
      - Json
      - Colorize: red

- Vars:
    user:
      name: thanh
      sex: male

- Echo/Schema: \${user}                    # Print object schema

- Echo/Schema:
    message: \${user}
    transforms:
      - Json:
          pretty: true
      - Colorize: gray

- Echo/Schema:
    message: \${user}
    transforms:
      - Json
      - Colorize: gray
  `)
  })
})
