import tmi from 'tmi.js'
import 'dotenv/config'

const apiUrl = 'https://api.mihomo.me/sr_info_parsed/';

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.USERNAME, //'HSRHelper',
		password: process.env.PASSWORD //'oauth:kcpbgf6o2fw197nomeihlinjizmipu' //jsfsk9hfp5124ytlts2n74oitkomp0'
	},
	channels: [ 'NukeGH05T', 'hsrhelper', 'celeisnoctil' ]
});

client.connect();

client.on('message', (channel, userstate, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		client.say(channel, `@${userstate.username}, heya!`);
	}

    if(message.toLowerCase().match(/^!hsr\s+(\d+)$/)) {

        getData(message.toLowerCase().match(/^!hsr\s+(\d+)$/)[1])
        .then(data => {
            // Handle the parsed JSON data
            //console.log('JSON data:', data);
            const playerData = data.player;
            const charData = data.characters;

		    client.say(channel, `@${userstate.username}, 
                Avatar:${playerData.avatar.name}, \nNick:${playerData.nickname}, \nLevel:${playerData.level}
                , \nWorld Level:${playerData.world_level}, \nBio:\"${playerData.signature}\"
                , \nAchievements:${playerData.space_info.achievement_count}
                , \nCharacters Displayed:${charArray(charData)}`);

        })
        .catch(error => {
            // Handle errors from the fetch or JSON parsing
            console.error('Error in promise chain:', error);
        });

	}
});


function charArray(characters) {
    let charList = ""
    console.log(characters.length);
    characters.forEach(char => {
        if (characters[characters.length-1].name === char.name) {
            charList+= char.name;
        } else {
            charList+= char.name + ', ';
        }
    });

    return charList;
}


// Fetch JSON data from the API
function getData(uid) {
    // Returning the fetch promise
    console.log(apiUrl + uid);
    return fetch(apiUrl + uid + '?lang=en')
        .then(response => {
            // Check if the request was successful (status code 200)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            return response.json();
        })
        .catch(error => {
            // Handle errors during the fetch or JSON parsing
            console.error('Error fetching data:', error);
            // Ensure the promise is rejected so that it can be caught further if needed
            throw error;
        });
}
