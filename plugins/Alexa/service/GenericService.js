//
//  GenericAlexaHomematicService.js
//  Homematic Virtual Interface Core
//
//  Created by Thomas Kluge on 15.01.17.
//  Copyright � 2016 kSquare.de. All rights reserved.
//


"use strict";

var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(require.main.filename);
if (appRoot.endsWith("bin")) {appRoot =  appRoot+"/../lib";}

if (appRoot.endsWith('node_modules/daemonize2/lib')) { 

	appRoot = path.join(appRoot,'..','..','..','lib')

	if (!fs.existsSync(path.join(appRoot,'HomematicVirtualPlatform.js'))) {
	   appRoot = path.join(path.dirname(require.main.filename),'..','..','..','node_modules','homematic-virtual-interface','lib')
	}
}

var regarequest = require(appRoot + "/HomematicReqaRequest.js");


function GenericAlexaHomematicService (homematicDevice,log,hmlayer,name) {
	this.homematicDevice = homematicDevice;
	this.log = log;
	this.hm_layer = hmlayer; 
	this.alexaname = "unknow";
	this.ccuInterface = undefined;
	this.name = name;
}


GenericAlexaHomematicService.prototype =  {
		
	getActions: function(){return undefined},	
		
	getType : function(){return undefined},
		
	handleEvent: function(event,callback) {},

	sendRega : function(script,callback) {
		new regarequest(this.hm_layer,script,callback);
	},

	getPhrases: function(lng){
		var that = this;
    	var result = [];
		
		try {

		var buffer = fs.readFileSync(__dirname + '/phrases.json');
    	var phrases = JSON.parse(buffer.toString());
    	if (phrases) {
	    	
	    	this.getActions().forEach(function (action){
		    	
		    	var phrase = phrases[action];
		    	if (phrase) {
			    	var localized_phrase = phrase[lng];
			    	if (localized_phrase) {
				    	result.push(localized_phrase.split("$device$").join(that.alexaname));
			    	}
		    	}
	    	});
    	}
    	} catch (e){}
    	return result;
	},	


	setState: function(adress,datapoint,value,callback) {
		this.hm_layer.callRPCMethod(this.ccuInterface,"setValue",[adress,datapoint,value], function(error, value) {
			if (callback) {
				callback(value);
			}
		});
	},
    
    
    getState: function(adress,datapoint,callback) {
		this.hm_layer.callRPCMethod(this.ccuInterface,"getValue",[adress,datapoint], function(error, value) {
			if (callback) {
				callback(error,value);
			}
		});
	}
	
}



module.exports = {GenericAlexaHomematicService : GenericAlexaHomematicService}
