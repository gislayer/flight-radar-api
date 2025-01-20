import express from 'express';
import bodyParser from 'body-parser';
import geojsonvt from 'geojson-vt';
import cors from 'cors';
import vtpbf from 'vt-pbf';
import pg from 'pg';

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5000mb'}));

// PostgreSQL bağlantısı
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'flightradar',
    password: '1234',
    port: 5432,
});

// Global tileIndex saklayıcı
const tileIndexMap = new Map();

// Son noktaları güncelleme fonksiyonu
async function updateLastPoints() {
    try {
        const client = await pool.connect();
        const result = await client.query(
            'select r.id,st_asgeojson(r.point) as geometry, a.aircraft_type_id as type, r.altitude, r.speed from routes r,aircraft a where r.status=true and a.id=r.aircraft_id'
        );
        client.release();

        const geojson = {
            type: 'FeatureCollection',
            features: result.rows.map(item => ({
                type: 'Feature',
                geometry: JSON.parse(item.geometry),
                properties: {
                    id: item.id,
                    type: item.type,
                    altitude: item.altitude,
                    speed: item.speed
                }
            }))
        };

        var options = {
            maxZoom: 18,
            tolerance: 3,
            extent: 4096,
            buffer: 64,
            debug: 0,
            lineMetrics: false,
            promoteId: null,
            generateId: false,
            indexMaxZoom: 5,
            indexMaxPoints: 100000
        }

        const tileIndex = geojsonvt(geojson, options);
        tileIndexMap.set('lastpoints', tileIndex);
        console.log('Son noktalar güncellendi');

    } catch (error) {
        console.error('Son noktalar güncellenirken hata:', error);
    }
}

// İlk güncellemeyi yap ve her 2 saniyede bir tekrarla
updateLastPoints();
setInterval(updateLastPoints, 1000000);

// Son noktalar için tile endpoint'i
app.get('/lastpoints/:z/:x/:y.pbf', (req, res) => {
    const { z, x, y } = req.params;
    
    if (!tileIndexMap.has('lastpoints')) {
        return res.status(404).json({ error: 'Layer bulunamadı' });
    }

    const tileIndex = tileIndexMap.get('lastpoints');
    const tile = tileIndex.getTile(parseInt(z), parseInt(x), parseInt(y));
    
    if (!tile) {
        res.status(404).send();
        return;
    }

    const pbfData = vtpbf.fromGeojsonVt({ "lastpoints": tile });
    res.setHeader("Content-Type", "application/x-protobuf");
    res.send(Buffer.from(pbfData));
});

// Sunucuyu başlat
app.listen(2004, () => {
    console.log('Sunucu 2001 portunda çalışıyor');
});
