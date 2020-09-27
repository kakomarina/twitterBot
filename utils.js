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
        if (line[0] == undefined) {
            continue;
        } 
        
        if (count > 0 && lyrics[count-1].slice(-1) == ",") {
            lyrics[count - 1] = lyrics[count - 1] + " " + line;
        }
        else if (line[0] == line[0].toLowerCase()) {
            lyrics[count -1] = lyrics[count - 1] + " " + line;
        } else {
            lyrics.push(line);
            count++;
        }
    }

    return lyrics;

}

module.exports = {
    parseLyrics: parseLyrics,
};
