const router = require('express').Router();
const db = require('../models');

//route to find all workouts with total duration
router.get('/api/workouts', function (req, res) {
  db.Workout.aggregate([
    { $addFields: { totalDuration: { $sum: '$exercises.duration' } } },
  ])
    .then(function (dbWorkout) {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//route to add a workout
router.put('/api/workouts/:id', function (req, res) {
  db.Workout.findOneAndUpdate(
    { _id: req.params.id },
    {
      $inc: { totalDuration: req.body.duration },
      $push: { exercises: req.body },
    },
    { new: true, runValidators: true }
  )
    .then(function (dbWorkout) {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//route to create workout
router.post('/api/workouts', ({ body }, res) => {
  db.Workout.create({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//route to get workouts range for last 7 days
router.get('/api/workouts/range', (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: { $sum: '$exercises.duration' },
        totalWeight: { $sum: '$exercises.weight' },
      },
    },
  ])
    .limit(7)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
