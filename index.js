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
      return axios({
        method: "GET",
        url: "http://ergast.com/api/f1/current/last/results.json",
        data: "",
      })
        .then((response) => {
          var json = response.data.MRData.RaceTable; //General query for race

          var name = json.Races[0].Results[0].Driver.givenName;
          var surname = json.Races[0].Results[0].Driver.familyName;
	      console.log("This is a test");
          agent.add(`The winner of the most recent race was ${name + " " + surname}`); 
        })
        .catch((error) => {
          console.log(error);
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
