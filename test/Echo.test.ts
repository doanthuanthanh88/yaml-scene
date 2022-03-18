import { Simulator } from "@app/Simulator"

test('Echo', async () => {
  await Simulator.Run(`
  - Echo: Hello world                       # Print white text

  - Echo~Green: Green text                  # Print green text
  
  - Echo~Blue: Blue text                    # Print blue text
  
  - Echo~Red: Red text                      # Print red text
  
  - Echo~Yellow: Yellow text                # Print yellow text
  
  - Echo~Cyan: Cyan text                    # Print cyan text
  
  - Echo~Gray: Gray text                    # Print gray text
  
  - Echo:                                   
      message: Hello
      color: green
      pretty: true
  
  - Vars:
      user:
        name: thanh
        sex: male
  
  - Echo~Schema: \${user}                    # Print object schema
  
  - Echo~Schema:
      message: \${user}
      color: gray
      pretty: true
  
  - Echo:                                                           
      message: {
        name: "thanh"
      }
      color: red
      type: schema
      pretty: true
`)
})