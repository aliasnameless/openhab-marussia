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
  justTakl: (message) => message,
}
