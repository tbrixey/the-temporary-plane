import locations from '../schemas/locations';
// This registers a user to a specific class

export const locationSeed = async () => {
  console.log('LOCATION SEED');
  await locations.create({
    name: 'Udame',
    population: 524,
    type: 'town',
    x: 5,
    y: 5,
  });
  await locations.create({
    name: 'Righteous',
    population: 723,
    type: 'town',
    x: 50,
    y: 78,
  });
  await locations.create({
    name: 'Atrium',
    population: 692,
    type: 'town',
    x: -30,
    y: 78,
  });
  await locations.create({
    name: 'Atrium',
    population: 5602,
    type: 'city',
    x: -89,
    y: -78,
  });
  await locations.create({
    name: 'Orabu',
    population: 9631,
    type: 'city',
    x: -2,
    y: 40,
  });
};
