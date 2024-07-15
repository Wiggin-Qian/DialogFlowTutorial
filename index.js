// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

//Added for tutorial
const axios = require('axios');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function race(agent){
    //Here we get the type of the utterance
    const position = agent.parameters.position;
    const query = agent.parameters.query;
    
    if(position=='champion' && query=='recent'){
		fetch("https://v1.formula-1.api-sports.io/rankings/races?race=50", {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "v1.formula-1.api-sports.io",
				"x-rapidapi-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
			}
		})
		.then(response => {
			console.log(response.json());
		})
		.then(data => {
			if (data && data.response && data.response.length > 0) {
				const winner = data.response[0];  // Get the first element which is the winner
				console.log(`The winner is ${winner.driver.name}`);
				agent.add(`The winner of the most recent race was ${winner}`); 
			} else {
				console.log("No data found");
			}
		})
		.catch(err => {
			console.log(err);
		});


    }
    
	
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Race Intent', race);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
