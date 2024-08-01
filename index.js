const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

// Function to read lines from hash.txt
const readHashes = () => {
    return new Promise((resolve, reject) => {
        const hashes = [];
        const rl = readline.createInterface({
            input: fs.createReadStream('hash.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            hashes.push(line);
        });

        rl.on('close', () => {
            resolve(hashes);
        });

        rl.on('error', (err) => {
            reject(err);
        });
    });
};

// Function to perform the requests
const performRequests = async (hashes, points) => {
    for (const hash of hashes) {
        try {
            // Perform tembakPoint request
            await axios.post('https://www.vanadatahero.com/api/tasks/1', {
                status: 'completed',
                points: points
            }, {
                headers: {
                    'X-Telegram-Web-App-Init-Data': hash,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0'
                }
            });

            // Perform infoUser request
            const response = await axios.get('https://www.vanadatahero.com/api/player', {
                headers: {
                    'X-Telegram-Web-App-Init-Data': hash,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0'
                }
            });

            const infoUser = response.data;
            console.log(`Username: ${infoUser.tgUsername}`);
            console.log(`TG Wallet: ${infoUser.tgWalletAddress}`);
            console.log(`Vana Wallet: ${infoUser.vanaWalletAddress}`);
            console.log(`Points: ${infoUser.points}`);
            console.log('---------------------------');

        } catch (error) {
            console.error(`Error with hash ${hash}:`, error);
        }
    }
};

// Main function
const main = async () => {
    try {
        const hashes = await readHashes();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Jumlah Tembak Point: ', async (points) => {
            await performRequests(hashes, points);
            rl.close();
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

main();
