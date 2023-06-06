const router = require("express").Router();

const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

router.get('/movies/create', (req, res, next) => {
    Celebrity.find()
    .then(allCelebrities => {
        console.log('allCelebrities', allCelebrities)
        res.render('movies/new-movie', {celebrities: allCelebrities});
    })
    .catch(err => console.log(err));
});

router.post('/movies/create', (req, res, next) => {
    const { title, genre, plot, cast } = req.body;
    Movie.create({ title, genre, plot, cast })
    .then(() => res.redirect('/movies'))
    .catch(err => {
        console.log(err)
        res.render('movies/new-movie')
    });
});

router.get('/movies', (req, res, next) => {
    Movie.find()
    .then((allMovies) => res.render('movies/movies', { movies: allMovies}))
    .catch(err => console.log(err));
});

router.get('/movies/:id', (req, res, next) => {
    Movie.findById(req.params.id)
    .populate('cast')
    .then(movieDetails => {
        console.log('movieDetails', movieDetails)
            res.render('movies/movie-details', {details: movieDetails})
    })
    .catch(err => console.log(err));
});


router.post('/movies/:id/delete', (req, res, next) => {
    Movie.findByIdAndRemove(req.params.id)
    .then(deletedMovie => {
        console.log('deletedMovie', deletedMovie)
        res.redirect('/movies')
    })
    .catch(err => console.log(err));
});

router.get('/movies/:id/edit', (req, res, next) => {
    Movie.findById(req.params.id)
    .then(movieToEdit => {
        Celebrity.find()
            .then(allCelebrities => {
                res.render('movies/edit-movie', { movie: movieToEdit, celebrities: allCelebrities });
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.post('/movies/:id/edit', (req, res, next) => {
    const { id } = req.params;
    const {title, genre, plot, cast} = req.body
    Movie.findByIdAndUpdate(id, {title, genre, plot, cast}, {new: true})
        .then(updatedMovie => {
            console.log('updatedMovie', updatedMovie)
            res.redirect(`/movies/${updatedMovie._id}`)
        })
        .catch(err => console.log(err));
})


module.exports = router;

