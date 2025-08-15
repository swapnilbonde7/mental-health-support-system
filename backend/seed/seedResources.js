// backend/seed/seedResources.js
const mongoose = require('mongoose');
require('dotenv').config();

const Resource = require('../models/Resource'); // adjust path if your model file name differs

const data = [
  {
    title: 'Beyond Blue',
    type: 'link',
    url: 'https://www.beyondblue.org.au',
    tags: ['support', 'depression', 'anxiety'],
    description: 'Information & 24/7 mental health support.'
  },
  {
    title: 'Lifeline Australia',
    type: 'link',
    url: 'https://www.lifeline.org.au',
    tags: ['crisis', '24/7', 'phone'],
    description: '13 11 14 – crisis support & suicide prevention.'
  },
  {
    title: 'Headspace',
    type: 'link',
    url: 'https://headspace.org.au',
    tags: ['youth', 'counselling', 'services'],
    description: 'Youth mental health & wellbeing services.'
  },
  {
    title: 'SANE Australia',
    type: 'link',
    url: 'https://www.sane.org',
    tags: ['complex mental health', 'support'],
    description: 'Support for people with complex mental health needs.'
  },
  {
    title: 'Black Dog Institute',
    type: 'link',
    url: 'https://www.blackdoginstitute.org.au',
    tags: ['research', 'resources', 'depression'],
    description: 'Evidence‑based resources & support.'
  },
  {
    title: 'Head to Health',
    type: 'link',
    url: 'https://www.headtohealth.gov.au',
    tags: ['gov', 'directory', 'services'],
    description: 'Government portal to mental health services.'
  }
];

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Missing MONGO_URI in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    await Resource.deleteMany({});
    await Resource.insertMany(data);
    console.log('✅ Seeded resources');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
