const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { API_CONFIG } = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Route to fetch jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: 'Software Engineer in India',
                page: '1',
                num_pages: '1'
            },
            headers: {
                'X-RapidAPI-Key': 'f3357142b2msh83c651110519d6dp14f00cjsne091ea6840e8',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        console.log('API Response:', response.data);

        const jobsData = response.data.data || [];
        const jobs = jobsData.map(job => ({
            id: job.job_id || Math.random().toString(),
            company: job.employer_name || 'Company Not Listed',
            title: job.job_title || 'Position Not Listed',
            location: job.job_city || job.job_country || 'Location Not Specified',
            lpa: job.salary || 'Salary Not Specified',
            skills: job.job_required_skills || ['Skills Not Specified'],
            postedDays: 0
        }));

        res.json({ jobs });
    } catch (error) {
        console.error('Error details:', error);
        // Return fallback data
        res.status(500).json({ 
            error: 'Failed to fetch jobs',
            errorDetails: error.message,
            jobs: [
                {
                    id: 1,
                    company: "SpecBee",
                    title: "FrontEnd Developer",
                    location: "Bangalore",
                    lpa: "3.70 LPA",
                    skills: ["HTML", "CSS", "JavaScript", "jQuery", "React"],
                    postedDays: 2
                },
                {
                    id: 2,
                    company: "Cubic Logics India",
                    title: "Application Support",
                    location: "Bangalore",
                    lpa: "3 LPA",
                    skills: ["Manual Testing", "SQL"],
                    postedDays: 3
                },
                {
                    id: 3,
                    company: "AKS Information",
                    title: "Software Developer",
                    location: "Noida",
                    lpa: "5 LPA",
                    skills: ["Java", "Spring Boot", "Python"],
                    postedDays: 3
                }
            ]
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 