const express = require('express');
const router = express.Router();
const datetime = require('node-datetime');
const random = require('randomstring');
const dataOps = require('../operations/dataops');

router.get('/', (req, res, next) => {
    res.json({
        success: false,
        msg: 'No key supplied'
    })
})
router.get('/:subkey', (req, res, next) => {
    dataOps.getData(req.params.subkey, (error, data, success) => {
        if (error) {
            res.json({
                success: false,
                msg: error
            })
        }
        if (!success) {
            res.json({
                success: false,
                msg: 'key mismatch or error fetching data'
            })
        }
        if (success) {
            res.json({
                success: true,
                msg: 'Data fetched successfully',
                data: data
            })
        }
    })
})

router.get('/:subkey/latest', (req, res, next) => {
    dataOps.getLatest(req.params.subkey, (error, data, success) => {
        if (error) {
            res.json({
                success: false,
                msg: error
            })
        }
        if (!success) {
            res.json({
                success: false,
                msg: 'key mismatch or error fetching data'
            })
        }
        if (success) {
            res.json({
                success: true,
                msg: 'Data fetched successfully',
                data: data
            })
        }
    })
})
router.post('/', (req, res, next) => {
    res.send({
        success: false,
        msg: 'No key supplied'
    })
})
router.post('/:pubkey', (req, res, next) => {
    var dt = datetime.create();
    var timestamp = dt.format('Y-m-d H:M:S');
    var temp = ((req.body.temperature == null) ? 0 : req.body.temperature);
    var hum = ((req.body.humidity == null) ? 0 : req.body.humidity);
    var press = ((req.body.pressure == null) ? 0 : req.body.pressure);
    var lig = ((req.body.light == null) ? 0 : req.body.light);
    const sensData = {
        temperature: temp,
        humidity: hum,
        pressure: press,
        light: lig,
        lastupdate: timestamp
    }
    if (req.body.temperature == null && req.body.humidity == null && req.body.pressure == null && req.body.light == null) {
        res.send({
            success: false,
            msg: 'No data sent'
        })
    }
    else {
        dataOps.postData(req.params.pubkey, sensData, (error, success) => {
            if (error) {
                res.send({
                    success: false,
                    msg: error
                })
            }
            if (success) {
                res.send({
                    success: true,
                    msg: 'Data saved'
                })
            }
            if (!success) {
                res.send({
                    success: false,
                    msg: 'key mismatch'
                })
            }

        })
    }
})

module.exports = router;