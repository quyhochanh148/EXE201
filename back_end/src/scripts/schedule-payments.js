// src/scripts/schedule-payments.js
const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || 'https://exe201-gl51.onrender.com';

// Thông tin đăng nhập admin
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'quytthe173122@fpt.edu.vn';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'quy123456';

/**
 * Lấy token admin bằng cách đăng nhập
 */
async function getAdminToken() {
    try {
        console.log(`Attempting to login as: ${ADMIN_USERNAME}`);
        const response = await axios.post(`${BASE_URL}/api/auth/signin`, {
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD
        });

        console.log('Login successful!');
        return response.data.accessToken;
    } catch (error) {
        console.error('Login failed:');
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        throw new Error('Failed to get admin token');
    }
}

/**
 * Schedule automatic payment batch creation every 3 days
 */
async function schedulePayments() {
    try {
        // Lấy token mới khi khởi động script
        

        // Debug info
        console.log('Debug info:');
        console.log('BASE_URL:', BASE_URL);


        // Thay đổi cron pattern để chạy mỗi 30 giây để dễ test
        // cron.schedule('* * * * *', async () => {
        //     console.log('Running scheduled payment batch creation...', new Date().toISOString());

        //     try {
        //         console.log('Sending POST request to:', `${BASE_URL}/api/revenue/batch/create`);

        //         // Create new payment batch
        //         const batchResponse = await axios.post(
        //             `${BASE_URL}/api/revenue/batch/create`,
        //             {},
        //             {
        //                 headers: {
        //                     'x-access-token': adminToken,
        //                     'Content-Type': 'application/json'
        //                 },
        //                 timeout: 10000 // 10 giây timeout
        //             }
        //         );

        //         console.log('Batch response received:', batchResponse.status);
        //         console.log('Batch response data:', JSON.stringify(batchResponse.data, null, 2));

        //         const batchId = batchResponse.data.batch.batch_id;
        //         console.log(`Created payment batch: ${batchId}`);

        //         // Process the batch (in a real system, this might be a separate step after review)
        //         console.log('Sending batch process request to:', `${BASE_URL}/api/revenue/batch/${batchId}/process`);

        //         const processResponse = await axios.post(
        //             `${BASE_URL}/api/revenue/batch/${batchId}/process`,
        //             {
        //                 transaction_id: `TRANS-${Date.now()}`
        //             },
        //             {
        //                 headers: {
        //                     'x-access-token': adminToken,
        //                     'Content-Type': 'application/json'
        //                 },
        //                 timeout: 10000
        //             }
        //         );

        //         console.log('Process response received:', processResponse.status);
        //         console.log('Process response data:', JSON.stringify(processResponse.data, null, 2));
        //         console.log(`Processed batch ${batchId}: ${processResponse.data.records_updated} records updated`);
        cron.schedule('0 0 * * *', async () => {
            const today = new Date();
            const day = today.getDate();

            // Chỉ chạy nếu ngày chia hết cho 3 (ví dụ: 3, 6, 9, 12, ...)
            if (day % 3 !== 0) {
                console.log(`Skipping batch creation on day ${day} — not a 3-day interval`);
                return;
            }

            console.log('Running scheduled payment batch creation...', new Date().toISOString());

            try {
                const adminToken = await getAdminToken();
                console.log('New admin token obtained:', `${adminToken.substring(0, 20)}...`);
                console.log('Sending POST request to:', `${BASE_URL}/api/revenue/batch/create`);

                // Create new payment batch
                const batchResponse = await axios.post(
                    `${BASE_URL}/api/revenue/batch/create`,
                    {},
                    {
                        headers: {
                            'x-access-token': adminToken,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    }
                );

                console.log('Batch response received:', batchResponse.status);
                console.log('Batch response data:', JSON.stringify(batchResponse.data, null, 2));

                const batchId = batchResponse.data.batch.batch_id;
                console.log(`Created payment batch: ${batchId}`);

                // Process the batch
                console.log('Sending batch process request to:', `${BASE_URL}/api/revenue/batch/${batchId}/process`);

                const processResponse = await axios.post(
                    `${BASE_URL}/api/revenue/batch/${batchId}/process`,
                    {
                        transaction_id: `TRANS-${Date.now()}`
                    },
                    {
                        headers: {
                            'x-access-token': adminToken,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    }
                );

                console.log('Process response received:', processResponse.status);
                console.log('Process response data:', JSON.stringify(processResponse.data, null, 2));
                console.log(`Processed batch ${batchId}: ${processResponse.data.records_updated} records updated`);
            } catch (error) {
                console.error('Error in scheduled payment task:');
                if (error.response) {
                    // Lỗi từ phản hồi của API
                    console.error('Response status:', error.response.status);
                    console.error('Response data:', JSON.stringify(error.response.data, null, 2));
                    console.error('Response headers:', JSON.stringify(error.response.headers, null, 2));
                } else if (error.request) {
                    // Lỗi không nhận được phản hồi
                    console.error('No response received! Request details:');
                    console.error('Request method:', error.config.method);
                    console.error('Request URL:', error.config.url);
                    console.error('Request headers:', JSON.stringify(error.config.headers, null, 2));
                    console.error('Request data:', JSON.stringify(error.config.data, null, 2));
                } else {
                    // Lỗi khác
                    console.error('Error message:', error.message);
                    console.error('Full error stack:', error.stack);
                }
            }
        });

        console.log('Payment schedule initialized to run every 3 days');
    } catch (error) {
        console.error('Failed to initialize payment schedule:', error.message);
    }
}

// Start scheduling if this file is run directly
if (require.main === module) {
    schedulePayments();
}

module.exports = { schedulePayments };
