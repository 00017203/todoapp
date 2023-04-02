
// third part libs
const express = require('express')
const app = express()

// node libs
const fs = require('fs')
const PORT = 8000

app.set('view engine', 'pug')
app.use('/static', express.static('public')) // assets
app.use(express.urlencoded({ extended: false }))

//http://localhost:8000
app.get('/', (req, res) => {
	fs.readFile('./data/videogames.json', (err, data) => {
		if (err) throw err 

		const videogames = JSON.parse(data)

		res.render('home', { videogames: videogames })
	})
})

app.post('/add', (req, res) => {
	const formData = req.body

	if (formData.videogame.trim() == '') {
		fs.readFile('./data/videogames.json', (err, data) => {
					if (err) throw err

					const videogames = JSON.parse(data)

					res.render('home', { error:true, videogames:videogames })
				})
	} 	else {
		fs.readFile('./data/videogames.json', (err, data) => {
			if (err) throw err

			const videogames = JSON.parse(data)

			const videogame = {
				id: id(),
				description: formData.videogame
			}

			videogames.push(videogame)

			fs.writeFile('./data/videogames.json', JSON.stringify(videogames), (err) => {
				if (err) throw err

				fs.readFile('./data/videogames.json', (err, data) => {
					if (err) throw err

					const videogames = JSON.parse(data)

					res.render('home', { success:true, videogames:videogames })
				})
			})
		})
	}
})

app.get('/:id/delete', (req, res) => {
	const id = req.params.id

	fs.readFile('./data/videogames.json', (err, data) => {
		if (err) throw err 

		const videogames = JSON.parse(data)

		const filteredVideoGames = videogames.filter(videogame => videogame.id != id)

		fs.writeFile('./data/videogames.json', JSON.stringify(filteredVideoGames), (err) => {
			if (err) throw err 

			res.render('home', { videogames: filteredVideoGames, deleted: true })
		})
	})
})


app.get('/:id/update', (req, res) => {
	const id = req.params.id 

	fs.readFile('./data/videogames.json', (err, data) => {
		if (err) throw err 

		const videogames = JSON.parse(data)
		const videogame = videogames.filter(videogame => videogame.id == id)[0]
		
		const videogameIdx = videogames.indexOf(videogame)
		const splicedVideoGame = videogames.splice(videogameIdx, 1)[0]

		splicedVideoGame.done = true

		videogames.push(splicedVideoGame)

		fs.writeFile('./data/videogames.json', JSON.stringify(videogames), (err) => {
			if (err) throw err 

			res.render('home', { videogames: videogames })
		})
	})
})

app.listen(PORT, (err) => {
	if (err) throw err 

	console.log(`This app is running on port ${ PORT }`)
})

function id () {
  return '_' + Math.random().toString(36).substr(2, 9);
}
