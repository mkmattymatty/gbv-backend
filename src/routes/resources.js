// backend/src/routes/resources.js
const express = require('express');
const router = express.Router();

// Get resources
router.get('/', (req, res) => {
  const resources = {
    emergency: {
      title: 'Emergency Contacts',
      contacts: [
        { name: 'National Domestic Violence Hotline', phone: '1-800-799-7233', available: '24/7' },
        { name: 'Emergency Services', phone: '911', available: '24/7' },
        { name: 'Crisis Text Line', phone: 'Text HOME to 741741', available: '24/7' }
      ]
    },
    abuseTypes: [
      {
        type: 'Physical Abuse',
        description: 'Any intentional use of physical force with the potential for causing harm.',
        signs: ['Unexplained injuries', 'Frequent injuries', 'Fear of partner']
      },
      {
        type: 'Emotional/Psychological Abuse',
        description: 'Non-physical behaviors that control, isolate, or frighten someone.',
        signs: ['Constant criticism', 'Isolation from friends/family', 'Threats']
      },
      {
        type: 'Sexual Abuse',
        description: 'Any sexual contact without consent.',
        signs: ['Forced sexual activity', 'Reproductive coercion', 'Sexual threats']
      },
      {
        type: 'Financial Abuse',
        description: 'Controlling financial resources to create dependency.',
        signs: ['No access to money', 'Forced to account for spending', 'Sabotaged employment']
      },
      {
        type: 'Digital Abuse',
        description: 'Using technology to control, harass, or stalk.',
        signs: ['Constant monitoring', 'Demanding passwords', 'GPS tracking']
      },
      {
        type: 'Stalking',
        description: 'Repeated unwanted attention causing fear.',
        signs: ['Following', 'Unwanted gifts/messages', 'Showing up uninvited']
      }
    ],
    supportServices: [
      { name: 'Legal Aid', description: 'Free or low-cost legal assistance' },
      { name: 'Shelters', description: 'Safe housing options' },
      { name: 'Counseling', description: 'Mental health support' },
      { name: 'Financial Assistance', description: 'Emergency funds and planning' }
    ]
  };
  
  res.json(resources);
});

module.exports = router;
