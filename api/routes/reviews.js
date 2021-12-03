const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/reviews');
const Game = require('../models/games');


router.get('/', (req, res, next) => {
    Review.find()
        .select('username email star comments location')
        .populate('username', 'email')
        .exec()
        .then(reviews => {
            console.log(reviews);
            res.status(200).json(reviews);
        })
});

router.get('/userreviews', (req, res, next) => {
    Review.find()
        .select('username email star comments location')
        .populate('username', 'email')
        .exec()
        .then(account => {
            res.status(200).json({
                count: account.length,
                account: account.map(account => {
                    return {
                        _id: account._id,
                        username: account.username,
                        email: account.email,
                        star: account.star,
                        comments: account.comments,
                        location: account.location
                    }
                }),
                request: {
                    type: 'GET'
                }
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });
});

router.post('/', (req, res, next) => {
    const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        star: req.body.email,
        comments: req.body.comments,
        location: req.body.location
    });
    review
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created review successfully",
                createdReview: {
                    username: result.username,
                    _id: result._id,
                    email: result.email,
                    request: {
                        type: 'GET'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.get('/:reviewId', (req, res, next) => {
    Review.findById(req.params.reviewId)
        .select('username comment')
        .populate('username')
        .exec()
        .then(review => {
            if (!review) {
                return res.status(404).json({
                    message: 'Review not found'
                })
            }
            res.status(200).json({
                review: review,
                request: {
                    type: 'GET'
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:reviewId', (req, res, next) => {
    Review.deleteOne({ _id: req.params.reviewId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Review deleted',
                request: {
                    type: 'POST'
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});


module.exports = router;
