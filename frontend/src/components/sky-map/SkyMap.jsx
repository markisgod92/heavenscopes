import { useRef, useEffect, useState } from 'react';
import starData from '../../data/BSC.json'
import './skymap.css';

const parseRA = (ra) => {
    const [hours, minutes, seconds] = ra.split(":").map(parseFloat);
    return (hours + minutes / 60 + seconds / 3600) * 15;
};

const parseDEC = (dec) => {
    const sign = dec[0] === '+' ? 1 : -1;
    const [degrees, minutes, seconds] = dec.slice(1).split(":").map(parseFloat);
    return sign * (degrees + minutes / 60 + seconds / 3600);
};

const calculateStarPositions = (stars, lat, lon, date) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const toDegrees = (rad) => (rad * 180) / Math.PI;

    const jd = 2440587.5 + date.getTime() / 86400000;
    const jd2000 = jd - 2451545.0;
    const gmst = (18.697374558 + 24.06570982441908 * jd2000) % 24;
    const lst = (gmst * 15 + lon) % 360;

    return stars
        .map((star) => {
            if(parseFloat(star.MAG) < 6) {
            const raDeg = parseRA(star.RA)
            const decDeg = parseDEC(star.DEC)
            const ha = (lst - raDeg + 360) % 360;

            const haRad = toRadians(ha);
            const decRad = toRadians(decDeg);
            const latRad = toRadians(lat);

            const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
            const altitude = toDegrees(Math.asin(sinAlt));

            if (altitude < 0) return null;

            const cosAz = (Math.sin(decRad) - Math.sin(latRad) * Math.sin(toRadians(altitude))) /
                          (Math.cos(latRad) * Math.cos(toRadians(altitude)));
            let az = toDegrees(Math.acos(cosAz));

            let azimuth = ha > 180 ? 360 - az : az;

            azimuth = (azimuth + 180) % 360;

            return {
                name: star["Title HD"],
                magnitude: star.MAG,
                azimuth: azimuth * (- 1) + 180,
                altitude,
                type: 'star'
            };
        }
        })
        .filter(Boolean);
    
};


export const SkyMap = ({ data, meta }) => {
    const canvasRef = useRef(null);
    const [drag, setDrag] = useState({ isDragging: false, startX: 0, offsetX: 0 });
    const { latitude, longitude, elevation, time } = meta
    const date = new Date(time)

    const mapHeight = 500;
    const virtualSkyWidth = 360;
    const marginLeft = 50;
    const marginBottom = 30;

    const updateCanvasSize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const parentWidth = canvas.parentElement.offsetWidth;
        canvas.width = parentWidth;
        canvas.height = mapHeight + marginBottom;
    
        const ctx = canvas.getContext('2d');
        drawMap(ctx, data, drag.offsetX, canvas.width);
    };
    

    useEffect(() => {
        const handleResize = () => updateCanvasSize();
        updateCanvasSize();
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [data, drag.offsetX]);
    

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const ctx = canvas.getContext('2d');
        const starsWithPosition = calculateStarPositions(starData, latitude, longitude, date);
    
        console.log("Stars with position:", starsWithPosition);
        console.log("Data passed to drawMap:", [...data, ...starsWithPosition]);
    
        drawMap(ctx, [...data, ...starsWithPosition], drag.offsetX, canvas.width);
    }, [data, drag.offsetX]);
    

    const drawMap = (ctx, objects, offsetX, canvasWidth) => {
        const scaleX = canvasWidth / virtualSkyWidth;

        ctx.clearRect(0, 0, canvasWidth, mapHeight + marginBottom);

        ctx.fillStyle = '#000';
        ctx.fillRect(marginLeft, 0, canvasWidth - marginLeft, mapHeight);

        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        for (let alt = 0; alt <= 90; alt += 10) {
            const y = mapHeight - (alt / 90) * mapHeight;
            ctx.fillText(`${alt}°`, marginLeft - 5, y + 4);
            ctx.beginPath();
            ctx.moveTo(marginLeft - 3, y);
            ctx.lineTo(marginLeft, y);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.closePath();
        }

        const cardinalPoints = [
            { label: 'N', az: 0 },
            { label: 'E', az: 90 },
            { label: 'S', az: 180 },
            { label: 'W', az: 270 },
        ];

        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        cardinalPoints.forEach((point) => {
            const x = marginLeft + ((point.az + offsetX + virtualSkyWidth) % virtualSkyWidth) * scaleX;
            ctx.fillText(point.label, x, mapHeight + 20);
        });

        objects.forEach((obj) => {
            const azAdjusted = ((obj.azimuth + offsetX + virtualSkyWidth) % virtualSkyWidth) * scaleX;
            const y = mapHeight - (obj.altitude / 90) * mapHeight;

            drawObject(ctx, obj, marginLeft + azAdjusted, y);
        });
    };

    const drawObject = (ctx, obj, x, y) => {
        const baseSize = 2;
    
        let size;
    
        if (obj.name === 'Moon') {
            size = 8;
        } else if (obj.name === 'Sun') {
            size = 10;
        } else if (obj.type === 'star') {
            size = Math.max(0.4 , 3 - obj.magnitude); 
        } else {
            size = Math.max(baseSize + 1, baseSize + 1 - obj.magnitude * 0.2);  
        }
    
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        
        if (obj.name === 'Moon') {
            ctx.fillStyle = 'lightgray';
        } else if (obj.name === 'Sun') {
            ctx.fillStyle = 'yellow';
        } else if (obj.type === 'star') {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = 'orange';
        }
    
        ctx.fill();
        ctx.closePath();
    
        if(obj.type !== 'star') {
            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(obj.name, x, y - 10);
        }
    };
    
    

    const handleMouseDown = (e) => {
        setDrag({ isDragging: true, startX: e.clientX, offsetX: drag.offsetX });
    };

    const handleMouseMove = (e) => {
        if (drag.isDragging) {
            const delta = e.clientX - drag.startX;
            setDrag((prev) => ({
                ...prev,
                offsetX: (prev.offsetX + delta / 2 + virtualSkyWidth) % virtualSkyWidth,
                startX: e.clientX,
            }));
        }
    };

    const handleMouseUp = () => {
        setDrag((prev) => ({ ...prev, isDragging: false }));
    };

    return (
        <div className="skymap-container">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="skymap-canvas"
            />
        </div>
    );
};