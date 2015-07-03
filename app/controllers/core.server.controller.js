'use strict';

/**
 * Module dependencies.
 */
var mailChimp = require('../../node_modules/mailchimp-api/mailchimp'),
	validator = require('../../node_modules/email-validator'),
	config = require('../../config/mc-config.json');

var mc = new mailChimp.Mailchimp(config.apikey);

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.emailSubscribe = function(req, res) {

	var msg = null;
	if (!req.body.fname || (req.body.fname && req.body.fname.length === 0)) {
		msg = {message: 'A first name is required'};
	} else if (!req.body.lname || (req.body.lname && req.body.lname.length === 0)) {
		msg = {message: 'A last name is required'};
	} else if (!req.body.emailAddr || (req.body.emailAddr && req.body.emailAddr.length === 0)) {
		msg = {message: 'An email address is required'};
	}
	if (msg !== null)
		return res.status(400).send(msg);

	var validEmail = validator.validate(req.body.emailAddr);
	var mcData = {
		id: req.params.listId,
		email: {email:req.body.emailAddr},
		merge_fields: {
			FNAME: req.body.fname,
			LNAME: req.body.lname
		},
		interests: {
			'a6c111d220': req.body.frontEndWebDev,
			'5a9a0ceb8e': req.body.backEndWebDev,
			'f00bf5af31': req.body.dbForDev,
			'11de21f773': req.body.dbAdmin,
			'0035c371bf': req.body.dbForNonDev,
			'3f32d7d9de': req.body.forKids,
			'62de2aa30f': req.body.idk
		}
	};

	if (process.env.NODE_ENV === 'production' && validEmail) {
		mc.lists.subscribe(mcData,
		function(data) {
			res.send({message: 'Thank you <strong>' + req.body.fname + '</strong>!<br>Your email (<strong>' + req.body.emailAddr + '</strong>) has been subscribed!'});
		},
		function(error) {
			res.send({email: req.body.emailAddr, message: 'There was an error subscribing that email.\n' + error.error});
		});
	} else if (process.env.NODE_ENV === 'development') {
		res.send({email: req.body.emailAddr, message: 'This email <strong>' + req.body.emailAddr + '</strong> would have been subscribed - but you are hitting a dev server!'});
	} else {
		res.send({email: req.body.emailAddr, message: 'Invalid email address format'});
	}
};
