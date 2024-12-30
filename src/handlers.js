import fs from 'fs';


export default {
  switchLight: (power, location, message) => {
    console.log({ power, location });
    return message;
  },

  setTemperature: (temperature, location, message) => {
    console.log({ temperature, location });
    return message;
  },

 
 
  switchScene: (scene, message) => {
    console.log(scene);
    return message;
  }, 

  notRecognized: (message) => message,
  freeTalk: (message) => message,
  
  saveIdentity: (deathNote, message) => {
    const date = new Date().toLocaleString();

    fs.writeFile('src/death.note', `${deathNote} (запись сделана ${date})\n`, (err) => {
      if (err) {
          console.error('Ошибка при записи файла:', err);
      } else {
          console.log('Файл успешно сохранен!');
      }
    });    
    return message
  },

  reset: (message) => {
    setTimeout(() => process.exit(1), 5_000);
    return message;
  }

}
