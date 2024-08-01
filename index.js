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
            if (line.trim()) {
                hashes.push(line.trim());
            }
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
            console.log(`Processing account with hash: ${hash}`);

            // Perform tembakPoint request
            await axios.post('https://www.vanadatahero.com/api/tasks/1', {
                status: 'completed',
                points: parseFloat(points) // Ensure points is a number
            }, {
                headers: {
                    'X-Telegram-Web-App-Init-Data': hash,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
                    'Priority': 'u=1, i',
                    'Referer': 'https://www.vanadatahero.com/home',
                    'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126", "Microsoft Edge WebView2";v="126"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin'
                }
            });

            // Perform infoUser request
            const response = await axios.get('https://www.vanadatahero.com/api/player', {
                headers: {
                    'X-Telegram-Web-App-Init-Data': hash,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
                    'Priority': 'u=1, i',
                    'Referer': 'https://www.vanadatahero.com/home',
                    'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126", "Microsoft Edge WebView2";v="126"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin'
                }
            });

            const infoUser = response.data;
            console.log(`Username: ${infoUser.tgUsername}`);
            console.log(`TG Wallet: ${infoUser.tgWalletAddress}`);
            console.log(`Vana Wallet: ${infoUser.vanaWalletAddress}`);
            console.log(`Points: ${infoUser.points}`);
            console.log('---------------------------');

        } catch (error) {
            console.error(`Error with hash ${hash}: ${error.message}`);
            console.error('Response data:', error.response ? error.response.data : 'No response data');
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
