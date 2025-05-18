const axios = require('axios');

async function cekStatus(merchant, keyorkut) {
    const apiUrl = "https://linecloud.my.id/api/orkut/cekstatus";
    const apikey = "Line";

    try {
        // Using axios with proper parameter handling and timeout
        const response = await axios.get(apiUrl, {
            params: {
                apikey: apikey,
                merchant: merchant,
                keyorkut: keyorkut
            },
            timeout: 15000, // 15 seconds timeout
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept 200-499 status codes
            }
        });

        // Check if the response contains valid data
        if (!response.data) {
            throw new Error('Empty response from server');
        }

        return response.data;
    } catch (error) {
        console.error("Error checking status:", error);
        
        // Improved error message handling
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Unknown error occurred';
        
        return { 
            success: false, 
            message: errorMessage,
            statusCode: error.response?.status
        };
    }
}

module.exports = function(app) {
    app.get('/orkut/cekstatus', async (req, res) => {
        const { merchant, keyorkut } = req.query;

        // Enhanced input validation
        if (!merchant || typeof merchant !== 'string' || merchant.trim() === '') {
            return res.status(400).json({ 
                status: false, 
                error: "Parameter merchant harus diisi dengan nilai yang valid" 
            });
        }

        if (!keyorkut || typeof keyorkut !== 'string' || keyorkut.trim() === '') {
            return res.status(400).json({ 
                status: false, 
                error: "Parameter keyorkut harus diisi dengan nilai yang valid" 
            });
        }

        try {
            const response = await cekStatus(merchant, keyorkut);
            
            // Handle non-successful responses from the API
            if (!response.success) {
                return res.status(response.statusCode || 400).json({
                    status: false,
                    error: response.message || 'Gagal memeriksa status',
                    data: response
                });
            }
            
            // Successful response
            res.status(200).json({
                status: true,
                creator: 'ikann',
                data: response // Return the complete response
            });
        } catch (error) {
            console.error("Server error:", error);
            res.status(500).json({ 
                status: false, 
                error: 'Terjadi kesalahan pada server' 
            });
        }
    });
};