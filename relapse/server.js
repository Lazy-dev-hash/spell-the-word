
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Data file paths
const ratingsFile = path.join(__dirname, 'data', 'ratings.json');
const reactionsFile = path.join(__dirname, 'data', 'reactions.json');
const viewsFile = path.join(__dirname, 'data', 'views.json');

// Ensure data directory exists
const ensureDataDir = async () => {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
};

// Helper functions
const readJsonFile = async (filePath, defaultValue = []) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return defaultValue;
    }
};

const writeJsonFile = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// API Routes

// Ratings API
app.get('/api/ratings', async (req, res) => {
    try {
        const ratings = await readJsonFile(ratingsFile);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get ratings' });
    }
});

app.post('/api/ratings', async (req, res) => {
    try {
        const { rating, message, sender, timestamp } = req.body;
        const ratings = await readJsonFile(ratingsFile);
        
        const newRating = {
            id: Date.now(),
            rating,
            message,
            sender,
            timestamp
        };
        
        ratings.push(newRating);
        await writeJsonFile(ratingsFile, ratings);
        
        res.json(newRating);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save rating' });
    }
});

// Reactions API
app.get('/api/reactions/:ratingId', async (req, res) => {
    try {
        const { ratingId } = req.params;
        const reactions = await readJsonFile(reactionsFile, {});
        const count = reactions[ratingId] ? reactions[ratingId].length : 0;
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get reaction count' });
    }
});

app.get('/api/reactions/:ratingId/:userId', async (req, res) => {
    try {
        const { ratingId, userId } = req.params;
        const reactions = await readJsonFile(reactionsFile, {});
        const hasReacted = reactions[ratingId] ? 
            reactions[ratingId].some(r => r.userId === userId) : false;
        res.json({ hasReacted });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check user reaction' });
    }
});

app.post('/api/reactions', async (req, res) => {
    try {
        const { ratingId, userId, action } = req.body;
        const reactions = await readJsonFile(reactionsFile, {});
        
        if (!reactions[ratingId]) {
            reactions[ratingId] = [];
        }
        
        const existingReaction = reactions[ratingId].find(r => r.userId === userId);
        
        if (action === 'add' && !existingReaction) {
            reactions[ratingId].push({
                userId,
                timestamp: new Date().toLocaleString()
            });
            await writeJsonFile(reactionsFile, reactions);
            res.json({ success: true });
        } else if (action === 'remove' && existingReaction) {
            reactions[ratingId] = reactions[ratingId].filter(r => r.userId !== userId);
            await writeJsonFile(reactionsFile, reactions);
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to process reaction' });
    }
});

// Views API
app.get('/api/views', async (req, res) => {
    try {
        const views = await readJsonFile(viewsFile);
        res.json({ totalViews: views.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get view count' });
    }
});

app.post('/api/views', async (req, res) => {
    try {
        const { timestamp, userAgent } = req.body;
        const views = await readJsonFile(viewsFile);
        
        const newView = {
            id: Date.now(),
            timestamp,
            userAgent,
            ip: req.ip || req.connection.remoteAddress
        };
        
        views.push(newView);
        await writeJsonFile(viewsFile, views);
        
        res.json({ success: true, totalViews: views.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track view' });
    }
});

// Initialize and start server
const startServer = async () => {
    await ensureDataDir();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
        console.log('Data storage initialized');
    });
};

startServer().catch(console.error);
