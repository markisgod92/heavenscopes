import { useRef, useEffect, useState } from 'react';
import starData from '../../data/BSC.json';
import './skymap.css';

const toRadians = (deg) => (deg * Math.PI) / 180;
const toDegrees = (rad) => (rad * 180) / Math.PI;

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
    const jd = 2440587.5 + date.getTime() / 86400000;
    const jd2000 = jd - 2451545.0;
    const gmst = (18.697374558 + 24.06570982441908 * jd2000) % 24;
    const lst = (gmst * 15 + lon) % 360;

    return stars
        .filter((star) => parseFloat(star.MAG) < 6)
        .map((star) => {
            const raDeg = parseRA(star.RA);
            const decDeg = parseDEC(star.DEC);
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
                magnitude: parseFloat(star.MAG),
                azimuth: azimuth * -1 + 180,
                altitude,
                type: 'star',
            };
        })
        .filter(Boolean);
};

const calculateObjectPositions = (objects, lat, lon) => {
    return objects.map((obj) => {
        const { azimuth, altitude, name, magnitude } = obj;
        if (!obj.aboveHorizon) return null;
        return {
            name,
            magnitude,
            azimuth,
            altitude,
            type: obj.nakedEyeObject ? 'planet' : 'object',
        };
    }).filter(Boolean);
};

export const SkyMap = ({ data, stars, meta }) => {
    const canvasRef = useRef(null);
    const [drag, setDrag] = useState({ isDragging: false, startX: 0, offsetX: 0 });

    const { latitude, longitude, time } = meta;
    const date = new Date(time);

    const mapHeight = 500;
    const virtualSkyWidth = 360;
    const marginLeft = 30;
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
        const objectsWithPosition = calculateObjectPositions(data, latitude, longitude);

        drawMap(ctx, [...objectsWithPosition, ...starsWithPosition], drag.offsetX, canvas.width);
    }, [data, stars, drag.offsetX]);

    const drawMap = (ctx, objects, offsetX, canvasWidth) => {
        const scaleX = canvasWidth / virtualSkyWidth;
        ctx.clearRect(0, 0, canvasWidth, mapHeight + marginBottom);

        ctx.fillStyle = '#000';
        ctx.fillRect(marginLeft, 0, canvasWidth - marginLeft, mapHeight);

        drawAltitudeMarkers(ctx);
        drawCardinalPoints(ctx, offsetX, scaleX);
        drawObjects(ctx, objects, offsetX, scaleX);
    };

    const drawAltitudeMarkers = (ctx) => {
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
    };

    const drawCardinalPoints = (ctx, offsetX, scaleX) => {
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
    };

    const drawObjects = (ctx, objects, offsetX, scaleX) => {
        objects.forEach((obj) => {
            const azAdjusted = ((obj.azimuth + offsetX + virtualSkyWidth) % virtualSkyWidth) * scaleX;
            const y = mapHeight - (obj.altitude / 90) * mapHeight;
            drawObject(ctx, obj, marginLeft + azAdjusted, y);
        });
    };

    const drawObject = (ctx, obj, x, y) => {
        let size;
        let color;
    
        if (obj.type === 'star') {
            size = Math.max(0.4, 3 - obj.magnitude);
            color = 'white';
        } else if (obj.name === 'Sun') {
            size = 15;
            color = 'yellow';
        } else if (obj.name === 'Moon') {
            size = 13;
            color = 'lightgray';
        } else {
            size = Math.max(2, 3 - obj.magnitude )
            color = 'orange';
        }
    
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    
        if (obj.type !== 'star' && obj.name !== 'Moon' && obj.name !== 'Sun') {
            ctx.font = '12px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText(obj.name, x + size + 30, y + (size / 2));
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