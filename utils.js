const readLine = require('readline');
const fs = require('fs');
const { timeStamp } = require('console');

var lyrics = [];


async function parseLyrics(filename) {
    const file = readLine.createInterface({ 
        input: fs.createReadStream(filename), 
        output: process.stdout, 
        terminal: false
    }); 

    var count = 0;
      
    for await (const line of file) {
        if (line[0] != undefined && line[0] == line[0].toUpperCase()) {
            lyrics.push(line);
            count++;
        } else if (line[0] != undefined) {
            lyrics[count -1] = lyrics[count - 1] + " " + line;
        }
    }

    return lyrics;

}

module.exports = {
    parseLyrics: parseLyrics,
};
