const fetch = require('node-fetch');

async function testProfileAPI() {
    const baseUrl = 'http://localhost:3000/api/recycler/profile';
    const testUserId = 'test-recycler-123';

    console.log('--- Testing GET (should return defaults) ---');
    try {
        const getResp = await fetch(`${baseUrl}?userId=${testUserId}`);
        const getData = await getResp.json();
        console.log('GET Response:', JSON.stringify(getData, null, 2));
    } catch (err) {
        console.error('GET Failed:', err.message);
    }

    console.log('\n--- Testing PUT (Upsert) ---');
    const updateData = {
        userId: testUserId,
        location: 'Adyar',
        rates: { PET: 15, HDPE: 18, LDPE: 12, PP: 10 }
    };
    try {
        const putResp = await fetch(baseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const putData = await putResp.json();
        console.log('PUT Response:', JSON.stringify(putData, null, 2));
    } catch (err) {
        console.error('PUT Failed:', err.message);
    }

    console.log('\n--- Testing GET again (should return updated values) ---');
    try {
        const getResp2 = await fetch(`${baseUrl}?userId=${testUserId}`);
        const getData2 = await getResp2.json();
        console.log('GET 2 Response:', JSON.stringify(getData2, null, 2));
    } catch (err) {
        console.error('GET 2 Failed:', err.message);
    }
}

testProfileAPI();
