export default async function startDebugMessages(chat) {

  const makeString = async () => {
    let temperatureLocations = { 'outdoor': -10, 'kitchen': 22, 'bathroom': 22, 'entrance': 22, 'toilet': 22, 'bedroom_big': 22, 'bedroom_small': 22 };
    const message = Object.entries(temperatureLocations).reduce((accumulator, [location, value]) =>
      accumulator + `${new Date()}#temperature.${location} = ${value+(value * Math.random() / 10) }\n`
      , '');
    
    console.log('>>> send telemetry')
    await chat.fetchFull(message);
    console.log('<<< telemetry update')


  }

  ///makeString();
  setInterval(makeString, 60_000);
} 