import app from './app.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.info(`Server up and running on port ${PORT}`))
