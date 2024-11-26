import { useContext, useState } from "react"
import { RealTimeDataContext } from "../../contexts/RealTimeDataContext"
import { TimeOffsetSelector } from "../time-offset-selector/TimeOffsetSelector"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './realtimevisibility.css'
import { CircularProgress, IconButton } from "@mui/material";

export const RealTimeVisibility = () => {
    const { data, isLoading, error, forceReload } = useContext(RealTimeDataContext)
    const [selectedTimeOffset, setSelectedTimeOffset] = useState('now')

    return (
        <div className="h-100">
            {isLoading && !error && (
                <div className="pt-5 h-100 d-flex flex-column gap-3 align-items-center align-items-center">
                    <CircularProgress />
                    <span>Loading visibility data...</span>
                </div>
            )}

            {!isLoading && error && (
                <div className="pt-5 h-100 d-flex flex-column gap-1 align-items-center align-items-center">
                    {error}
                    <IconButton onClick={forceReload}>
                        <i className="bi bi-arrow-clockwise text-white"></i>
                    </IconButton>
                    <span>Try again</span>
                </div>
            )}

            {!isLoading && !error && data && (
                <div className="h-100 d-flex flex-column">
                    <TimeOffsetSelector selectedTimeOffset={selectedTimeOffset} setTimeOffset={setSelectedTimeOffset} />

                    <TableContainer component={Paper} className='real-time-visibility'>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <caption>
                                <span>Powered by </span>
                                <a href="https://github.com/csymlstd/visible-planets-api.git">csymlstd / visible-planets-api</a>
                            </caption>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="right">Visibility</TableCell>
                                    <TableCell align="right">Altitude</TableCell>
                                    <TableCell align="right">Azimuth</TableCell>
                                    <TableCell align="right">Magnitude</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data[selectedTimeOffset].data.map(body => (
                                    <TableRow
                                        key={body.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component='th' scope='row'>{body.name}</TableCell>
                                        <TableCell align="right">
                                            {body.aboveHorizon ? 'visible' : 'not visible'}
                                        </TableCell>
                                        <TableCell align="right">{body.altitude.toFixed(2)}°</TableCell>
                                        <TableCell align="right">{body.azimuth.toFixed(2)}°</TableCell>
                                        <TableCell align="right">{body.magnitude.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    )
}




/*
[Log] Object (Real-Time-Visibility.jsx, line 25)

now: Object

data: Array (10)
0 Object

aboveHorizon: true

altitude: 23.005571247026708

azimuth: 164.50185978124085

constellation: "Libra"

declination: {negative: true, degrees: 20, arcminutes: 1, arcseconds: 28.5, raw: -20.024576232895402}

magnitude: -26.768794911751954

nakedEyeObject: true

name: "Sun"

rightAscension: {negative: false, hours: 15, minutes: 49, seconds: 30.8, raw: 15.825210348238352}

Prototipo Object
1 {name: "Moon", constellation: "Cancer", rightAscension: Object, declination: Object, altitude: 15.860865216628156, …}
2 {name: "Mercury", constellation: "Ophiuchus", rightAscension: Object, declination: Object, altitude: 11.147647661392227, …}
3 {name: "Venus", constellation: "Sagittarius", rightAscension: Object, declination: Object, altitude: 0.8246024607271352, …}
4 {name: "Mars", constellation: "Cancer", rightAscension: Object, declination: Object, altitude: 11.885312975172823, …}
5 {name: "Jupiter", constellation: "Taurus", rightAscension: Object, declination: Object, altitude: -14.48359790348691, …}
6 {name: "Saturn", constellation: "Aquarius", rightAscension: Object, declination: Object, altitude: -28.365585044962458, …}
7 {name: "Uranus", constellation: "Taurus", rightAscension: Object, declination: Object, altitude: -24.505507213573964, …}
8 {name: "Neptune", constellation: "Pisces", rightAscension: Object, declination: Object, altitude: -31.595806226163305, …}
9 {name: "Pluto", constellation: "Capricornus", rightAscension: Object, declination: Object, altitude: -9.751971440511284, …}

Prototipo Array

links: Object

engine: "https://www.npmjs.com/package/astronomy-engine"

self: "https://api.visibleplanets.dev/v3?latitude=45.53342&longitude=12.64385&elevation=0&aboveHorizon=false&time=2024-11-21T09:54:39.360Z"

Prototipo Object

meta: Object

aboveHorizon: false

elevation: 0

engineVersion: "2.1.12"

latitude: 45.53342

longitude: 12.64385

time: "2024-11-21T09:54:39+00:00"

Prototipo Object

Prototipo Object

sixH: {meta: Object, data: Array, links: {self: "https://api.visibleplanets.dev/v3?latitude=45.5334…&aboveHorizon=false&time=2024-11-21T15:54:39.360Z", engine: "https://www.npmjs.com/package/astronomy-engine"}}

threeH: {meta: Object, data: Array, links: {self: "https://api.visibleplanets.dev/v3?latitude=45.5334…&aboveHorizon=false&time=2024-11-21T12:54:39.360Z", engine: "https://www.npmjs.com/package/astronomy-engine"}}

twelveH: {meta: Object, data: Array, links: {self: "https://api.visibleplanets.dev/v3?latitude=45.5334…&aboveHorizon=false&time=2024-11-21T21:54:39.360Z", engine: "https://www.npmjs.com/package/astronomy-engine"}}

updated: "2024-11-21T09:54:39.360Z"

Prototipo Object

*/