import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './realtimevisibility.css'

export const RealTimeVisibility = ({ data }) => {
    return (
        <div className="h-100 d-flex flex-column">
            <TableContainer component={Paper} className='real-time-visibility'>
                <Table sx={{ minWidth: 650 }} size="small">
                    <caption>
                        <span>Powered by </span>
                        <a href="https://github.com/csymlstd/visible-planets-api.git">csymlstd / visible-planets-api</a>
                    </caption>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">Visibility</TableCell>
                            <TableCell align="center">Altitude</TableCell>
                            <TableCell align="center">Azimuth</TableCell>
                            <TableCell align="center">RA</TableCell>
                            <TableCell align="center">Dec</TableCell>
                            <TableCell align="center">Magnitude</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(body => (
                            <TableRow
                                key={body.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className={body.aboveHorizon ? 'green-text' : 'red-text'}
                            >
                                <TableCell component='th' scope='row'>{body.name}</TableCell>
                                <TableCell align="right">
                                    {body.aboveHorizon ? 'visible' : 'not visible'}
                                </TableCell>
                                <TableCell align="right">{body.altitude.toFixed(2)}°</TableCell>
                                <TableCell align="right">{body.azimuth.toFixed(2)}°</TableCell>
                                <TableCell align="right">
                                    {body.rightAscension.negative ? <span>-</span> : null}
                                    <span>{body.rightAscension.hours}h</span>
                                    <span>{body.rightAscension.minutes}'</span>
                                    <span>{body.rightAscension.seconds}''</span>
                                </TableCell>
                                <TableCell align="right">
                                    {body.declination.negative ? <span>-</span> : null}
                                    <span>{body.declination.degrees}°</span>
                                    <span>{body.declination.arcminutes}'</span>
                                    <span>{body.declination.arcseconds}''</span>
                                </TableCell>
                                <TableCell align="right">{body.magnitude.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}