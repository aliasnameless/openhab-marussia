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
    fs.writeFile('src/death.note', deathNote, (err) => {
      if (err) {
          console.error('Ошибка при записи файла:', err);
      } else {
          console.log('Файл успешно сохранен!');
      }
    });    
    return message
  },

}
