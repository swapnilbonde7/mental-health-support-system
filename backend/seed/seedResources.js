const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Resource = require('../models/Resource');

const data = [
  { title: 'Headspace', url: 'https://headspace.org.au', type: 'link', tags: ['youth','counselling','services'], description: 'Youth mental health & wellbeing services.'},
  { title: 'SANE Australia', url: 'https://www.sane.org', type: 'link', tags: ['complex mental health','support']},
  { title: 'Black Dog Institute', url: 'https://www.blackdoginstitute.org.au', type: 'link', tags: ['research','resources','depression']},
  { title: 'Head to Health', url: 'https://www.headtohealth.gov.au', type: 'link', tags: ['gov','directory','services']},
  { title: 'Beyond Blue', url: 'https://www.beyondblue.org.au', type: 'link', tags: ['support','depression','anxiety']},
  { title: 'Lifeline Australia', url: 'https://lifeline.org.au', type: 'link', tags: ['crisis','24/7','phone']}
];

(async () => {
  await connectDB();
  await Resource.deleteMany({});
  await Resource.insertMany(data);
  console.log('Seeded resources');
  process.exit(0);
})();
