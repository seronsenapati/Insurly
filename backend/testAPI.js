const axios = require('axios');

async function testRegistrationAPI() {
  try {
    const testData = {
      name: 'API Test User',
      phone: '9876543211',
      email: 'apitest@example.com',
      password: 'password123',
      platform: 'zomato',
      zone: {
        area: 'Patia',
        pincode: '751024',
        city: 'Bhubaneswar'
      },
      avgWeeklyEarnings: 5000,
      workingDaysPerWeek: 6,
      workingHoursPerDay: 8,
      upiId: 'apitest@ybl'
    };

    console.log('Testing registration API...');
    console.log('Sending data:', testData);

    const response = await axios.post('http://localhost:5000/api/auth/register', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ API Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistrationAPI();
