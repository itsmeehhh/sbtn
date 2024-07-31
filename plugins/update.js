import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from'fs';
import path from'path';
import axios from'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const owner = 'noureddineouafy';
const repo = 'silana-bot';
const handler = async (m, { conn, args, text, command, usedPrefix, isCreator, isPrems }) => {


if (!text) {
try {
   const folders = ['plugins', 'lib']; 
// مجلدات لي غادين يتحدثو بالامر ديريكت

   function generateRandomIP() {
     return Math.floor(Math.random() * 256) + '.' +
       Math.floor(Math.random() * 256) + '.' +
       Math.floor(Math.random() * 256) + '.' +
       Math.floor(Math.random() * 256);
   }

   function fetchAndSaveFiles(folder) {
     const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;
     const rootPath = path.join(__dirname, '..', folder);

     axios.get(githubApiUrl, {
       headers: {
         'X-Forwarded-For': generateRandomIP()
       }
     })
       .then(response => {
         const files = response.data;

         if (Array.isArray(files)) {
           if (!fs.existsSync(rootPath)) {
             fs.mkdirSync(rootPath, { recursive: true });
             console.log(`Folder created: ${folder}`);

           }

           files.forEach(file => {
             if (file.type === 'file' && file.name !== 'update.js') {
               const filePath = path.join(rootPath, file.name);

               axios.get(file.download_url, { responseType: 'arraybuffer', headers: { 'X-Forwarded-For': generateRandomIP() } })
                 .then(response => {
                   fs.writeFile(filePath, response.data, err => {
                     if (err) throw err;
                     console.log(`File saved: ${file.name}`);


                   });
                 })
                 .catch(err => {
                   console.error(`Error downloading file: ${file.name}`, err);
                 });
             }
           });
         } else {
           console.log(`The folder '${folder}' does not exist in the repository.`);

         }
       })
       .catch(err => {
         if (err.response && err.response.status === 404) {
           console.log(`The folder '${folder}' does not exist in the repository.`);
         } else {
           console.error(`Error fetching from GitHub API for folder ${folder}`, err);
 conn.reply(m.chat, `*اعد المحاولة بعد دقيقة* !!`, m);
         }
       });
   }

   folders.forEach(folder => {
     fetchAndSaveFiles(folder);
   });
   conn.reply(m.chat, `*تم تحديث روبوتك*🥳`, m);
} catch (error) {
    conn.reply(m.chat, 'An error occurred while updating. Ensure your bot is in a Git repository.', m);
} else {
 try {
   const files = [text];
   function generateRandomIP() {
     return Math.floor(Math.random() * 256) + '.' +
       Math.floor(Math.random() * 256) + '.' +
       Math.floor(Math.random() * 256) + '.' +
       Math.floor(Math.random() * 256);
   }

   function fetchAndSaveFile(filePath) {
     const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
     const localFilePath = path.join(__dirname, '..', filePath);

     axios.get(githubApiUrl, {
       headers: {
         'X-Forwarded-For': generateRandomIP()
       }
     })
       .then(response => {
         const data = response.data;

         if (data.type === 'file' && filePath !== 'plugins/update.js') {
           axios.get(data.download_url, { responseType: 'arraybuffer', headers: { 'X-Forwarded-For': generateRandomIP() } })
             .then(response => {
               fs.writeFile(localFilePath, response.data, err => {
                 if (err) throw err;
                 console.log(`File saved: ${filePath}`);
conn.reply(m.chat, `*تم تحديث روبوتك* 🥳`, m);
               });
             })
             .catch(err => {
               console.error(`Error downloading file: ${filePath}`, err);
             });
         } else {
           console.log(`The file '${filePath}' does not exist or is not of type 'file'.`);
 
conn.reply(m.chat, `*الملف ${filePath} غير موجود*!!`, m);
         }
       })
       .catch(err => {
         if (err.response && err.response.status === 404) {
           console.log(`The file '${filePath}' does not exist in the repository.`);
 
  conn.reply(m.chat, `*الملف ${filePath} غير موجود*!!`, m);
         } else {
           console.error(`Error fetching from GitHub API for file ${filePath}`, err);
 conn.reply(m.chat, `*انتظر دقيقة ثم اعد المحاولة* ❤️`, m);
         }
       });
   }

   files.forEach(file => {
     fetchAndSaveFile(file);
   });
   } catch (error) {
    conn.reply(m.chat, 'An error occurred while updating. Ensure your bot is in a Git repository.', m);
}

};     

handler.help = ['update'];
handler.tags = ['system'];
handler.command = /^(update)$/i;
//handler.owner = true;

export default handler;
