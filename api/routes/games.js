const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const checkAuth = require('../authentication/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Game = require("../models/games");

router.get("/", (req, res, next) => {
    Game.find()
        .select("name price _id gameImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                games: docs.map(doc => {
                    return {
                        name: doc.name,
                        gameImage: doc.gameImage,
                        _id: doc._id,
                        request: {
                            type: "GET"
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/", upload.single('gameImage'), (req, res, next) => {
    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        gameImage: ''
    });
    game
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created game successfully",
                createdGame: {
                    name: result.name,
                    _id: result._id,
                    gameImage: result.gameImage,
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

router.get("/:gameId", (req, res, next) => {
    const id = req.params.gameId;
    Game.findById(id)
        .select('name price _id gameImage')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    game: doc,
                    request: {
                        type: 'GET'
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch("/:gameId", (req, res, next) => {
    const id = req.params.gameId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Game.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Game updated',
                request: {
                    type: 'GET'
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

router.delete("/:gamesId", (req, res, next) => {
    const id = req.params.gameId;
    Game.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Game deleted',
                request: {
                    type: 'POST'
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

module.exports = router;