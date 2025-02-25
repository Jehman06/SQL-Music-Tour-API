// DEPENDENCIES
const events = require('express').Router()
const db = require('../models')
const { Event } = db
const { Op } = require('sequelize')

// FIND ALL EVENTS
events.get('/', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order: [["date", "ASC"]],
            where: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
        })
        res.status(200).json(foundEvents)
    } catch (error) {
        res.status(500).json(error)
    }
});

// FIND A SPECIFIC EVENT
events.get('/:name', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { event_id: req.params.name },
            include: [
                {
                    model: MeetGreet,
                    as: "meet_greets",
                    include: { model: bands, as: "bands" }
                },
                {
                    model: setTime,
                    as: "set_times",
                    include: [
                        {
                            model: Band,
                            as: "bands"
                        },
                        {
                            model: Stage,
                            as: "stages"
                        }
                    ]
                },
                {
                    model: Stage,
                    as: "stages",
                    include: { model: StageEvent, as: "stage_events" }
                }
            ]
        })
        res.status(200).json(foundEvent)
    } catch (error) {
        res.status(500).json(error)
    }
});

// CREATE AN EVENT
events.post('/', async (req, res) => {
    try {
        const newEvent = Event.create(req.body)
        res.status(200).json({
            message: "Successfully inserted a new event",
            data: newEvent
        })
    } catch (error) {
        res.status(500).json(error)
    }
});

// UPDATE AN EVENT
events.put('/:id', async (req, res) => {
    try {
        const updatedEvents = Event.update(req.body, {
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedEvents} event(s)`
        })
    } catch (error) {
        res.status(500).json(error)
    }
});

// DELETE AN EVENT
events.delete('/:id', async (req, res) => {
    try {
        const deletedEvents = Event.destroy({
            where: {
                event_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedEvents} event(s)`
        })
    } catch (error) {
        res.status(500).json(error)
    }
});

// EXPORT
module.exports = events