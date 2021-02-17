require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image})
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//call photos based on rover viewing 

//call based on data, search input 

// call based on most recent data 





app.get('/rover/:rover', async (req, res) =>{
   // let rover =  req.param;
    const name = req.params.rover
    console.log(name)
    console.log(req.params)
    try{
       
        let response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/latest_photos?&api_key=${process.env.API_KEY}`)
        .then(res => res.json())
        res.send(response)
    }
    catch{
        console.log('error')
    }
})

