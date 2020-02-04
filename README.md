# node-tail
Read Last Line of a file in Realtime

# Usage-

    const { Tail } = require('tail-me')

    const tail = new Tail( { filename : 'your filepath'})

    tail.on('line',(newLine)=>{
        console.log(newLine)
    })

    tail.on('error',(e)=>{
        console.log(e)
    })
