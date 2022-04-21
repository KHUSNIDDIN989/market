const fs = require('fs')
const path = require('path')

const read = dir => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, `../model/${dir}`), { encoding: 'utf-8', flag: 'r'}))
}

const write = (dir, data) => {
    return fs.writeFileSync(path.resolve(__dirname, `../model/${dir}`), JSON.stringify(data, null, 4))
}

module.exports = {
    read,
    write
}


/*

markets 

    {
        id: 1,
        name:"Makro",
        brenches: [
            {
                id: 2,
                name: "Olmozor",
                workers:[
                    {
                        id:1,
                        name: "alisher"
                    },
                    {
                        id:2,
                        name: "kamol"
                    },
                ],
                products:[
                    {
                        id:1,
                        name: "cola",
                        price: 10000,
                        conunt: 1000
                    }
                ]
            },
            {
                id: 3,
                name: "Chilonzor",
                workers:[
                    {
                        id:1,
                        name: "Lola"
                    },
                    {
                        id:2,
                        name: "Ali"
                    },
                ],
                products:[
                    {
                        id:1,
                        name: "fanta",
                        price: 10000,
                        conunt: 1000
                    },
                    {
                        id:1,
                        name: "fanta",
                        price: 10000,
                        conunt: 1000
                    }
                ]
            }
        ],
    }*/