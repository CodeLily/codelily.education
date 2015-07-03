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
		email: {
			email: req.body.emailAddr
		},
		merge_vars: {
			FNAME: req.body.fname,
			LNAME: req.body.lname,
			groupings: [
				{
					name: 'Interested In',
					groups: []
				}
			]
		}
	};

	if (req.body.frontEndWebDev && req.body.frontEndWebDev === true)
		mcData.merge_vars.groupings[0].groups.push('Front End Development (HTML, CSS, JavaScript)');

	if (req.body.backEndWebDev && req.body.backEndWebDev === true)
		mcData.merge_vars.groupings[0].groups.push('Back End Development (Server Side Programming/Scripting)');

	if (req.body.dbForDev && req.body.dbForDev === true)
		mcData.merge_vars.groupings[0].groups.push('Databases for Developers');

	if (req.body.dbAdmin && req.body.dbAdmin === true)
		mcData.merge_vars.groupings[0].groups.push('Database Administration');

	if (req.body.dbForNonDev && req.body.dbForNonDev === true)
		mcData.merge_vars.groupings[0].groups.push('Databases for Non-Developers');

	if (req.body.forKids && req.body.forKids === true)
		mcData.merge_vars.groupings[0].groups.push('I want my kids to learn how to code!');

	if (req.body.idk && req.body.idk === true)
		mcData.merge_vars.groupings[0].groups.push('I don\'t know what I\'m interested in but I want to start learning!');

	if (process.env.NODE_ENV === 'production' && validEmail || true) {
		mc.lists.subscribe(mcData,
		function(data) {
			res.send({message: 'Thank you <strong>' + req.body.fname + '</strong>!<br>Your email (<strong>' + req.body.emailAddr + '</strong>) has been subscribed!'});
		},
		function(error) {
			res.send({email: req.body.emailAddr, error: 'There was an error subscribing that email.\n' + error.error});
		});
	} else if (process.env.NODE_ENV === 'development') {
		res.send({email: req.body.emailAddr, message: 'This email <strong>' + req.body.emailAddr + '</strong> would have been subscribed - but you are hitting a dev server!'});
	} else {
		res.send({email: req.body.emailAddr, error: 'Invalid email address format'});
	}
};
