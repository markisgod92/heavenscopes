import { useEffect, useState } from "react"
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap"
import { coordDecimalToDMS, coordDMSToDecimal } from "../../utils/location-conversions"

export const SettingsForm = ({ onUpdate }) => {
    const [isManual, setManual] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [searchError, setSearchError] = useState(false)
    const [formData, setFormData] = useState({
        isMetric: true,
        location: {
            lat: 41.9027835,
            lon: 12.4963655
        },
        elevation: 0
    })
    const [dmsCoords, setDmsCoords] = useState({})
    const [validationErrors, setValidationErrors] = useState({ lat: {}, lon: {} })

    const toggleManualSetting = () => {
        setManual(prev => !prev)
    }

    const validateField = (name, field, value) => {
        const number = parseFloat(value)

        const limits = {
            degrees: name === 'lat' ? 90 : 180,
            minutes: 59,
            seconds: 59
        }

        const max = limits[field]
        if (isNaN(number) || number < 0 || number > max) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: { ...prev[name], [field]: `${field} must be between 0 and ${max}` }
            }))
            return false
        }

        setValidationErrors((prev) => ({
            ...prev,
            [name]: { ...prev[name], [field]: null }
        }))
        return true
    }

    const handleCoordsChange = (name, field, value) => {
        if (validateField(name, field, value)) {
            setDmsCoords({
                ...dmsCoords,
                [name]: {
                    ...dmsCoords[name],
                    [field]: value
                }
            })
        }
    }

    const handleSearch = async () => {
        setSearchError(false)

        if (!searchInput) {
            setSearchError(true)
            return
        }

        try {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`)
            const data = await response.json()

            setFormData({
                ...formData,
                location: {
                    lat: data[0].lat,
                    lon: data[0].lon
                }
            })
        } catch (error) {
            setSearchError(true)
        }
    }

    useEffect(() => {
        if (!isManual) {
            setDmsCoords({
                lat: coordDecimalToDMS(formData.location.lat),
                lon: coordDecimalToDMS(formData.location.lon)
            })
            toggleManualSetting()
        }
    }, [formData.location, isManual])

    useEffect(() => {
        if (isManual) {
            const newLat = coordDMSToDecimal(dmsCoords.lat)
            const newLon = coordDMSToDecimal(dmsCoords.lon)

            if (newLat !== formData.location.lat || newLon !== formData.location.lon) {
                setFormData({
                    ...formData,
                    location: {
                        lat: coordDMSToDecimal(dmsCoords.lat),
                        lon: coordDMSToDecimal(dmsCoords.lon)
                    }
                })
            }
        }
    }, [dmsCoords, isManual])

    useEffect(() => {
        onUpdate(formData)
    }, [formData])

    return (
        <>
            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Set coordinates
                </Form.Label>
                <Col sm={12} md={9}>
                    <Form.Check
                        type="switch"
                        label='Manually'
                        checked={isManual}
                        onChange={toggleManualSetting}
                    />
                </Col>
                <Form.Text>
                    Coordinates and elevation are used to get visibility data from your position. You can always change them from your account settings.
                </Form.Text>
            </Form.Group>

            {isManual ? (
                <>
                    <Form.Group as={Row}>
                        <Form.Label column sm={12} md={3}>
                            Latitude
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                placeholder="degrees"
                                min={0}
                                max={90}
                                isInvalid={!!validationErrors.lat.degrees}
                                value={dmsCoords.lat.degrees}
                                onChange={(e) => handleCoordsChange('lat', 'degrees', e.target.value)}
                            />
                            <Form.Control
                                type="number"
                                placeholder="minutes"
                                min={0}
                                max={59}
                                value={dmsCoords.lat.minutes}
                                isInvalid={!!validationErrors.lat.minutes}
                                onChange={(e) => handleCoordsChange('lat', 'minutes', e.target.value)}
                            />
                            <Form.Control
                                type="number"
                                placeholder="seconds"
                                min={0}
                                max={59}
                                value={dmsCoords.lat.seconds}
                                isInvalid={!!validationErrors.lat.seconds}
                                onChange={(e) => handleCoordsChange('lat', 'seconds', e.target.value)}
                            />
                            <Form.Select
                                name="isNegative"
                                value={dmsCoords.lat.isNegative}
                                onChange={(e) => handleCoordsChange('lat', 'isNegative', e.target.value === 'true')}
                            >
                                <option value={false}>N</option>
                                <option value={true}>S</option>
                            </Form.Select>

                            <Form.Control.Feedback type='invalid'>
                                {validationErrors.lat.degrees || validationErrors.lat.minutes || validationErrors.lat.seconds}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column sm={12} md={3}>
                            Longitude
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                placeholder="degrees"
                                min={0}
                                max={180}
                                isInvalid={!!validationErrors.lon.degrees}
                                value={dmsCoords.lon.degrees}
                                onChange={(e) => handleCoordsChange('lon', 'degrees', e.target.value)}
                            />
                            <Form.Control
                                type="number"
                                placeholder="minutes"
                                min={0}
                                max={59}
                                isInvalid={!!validationErrors.lon.minutes}
                                value={dmsCoords.lon.minutes}
                                onChange={(e) => handleCoordsChange('lon', 'minutes', e.target.value)}
                            />
                            <Form.Control
                                type="number"
                                placeholder="seconds"
                                min={0}
                                max={59}
                                isInvalid={!!validationErrors.lon.seconds}
                                value={dmsCoords.lon.seconds}
                                onChange={(e) => handleCoordsChange('lon', 'seconds', e.target.value)}
                            />
                            <Form.Select
                                name="isNegative"
                                value={dmsCoords.lon.isNegative}
                                onChange={(e) => handleCoordsChange('lon', 'isNegative', e.target.value === 'true')}
                            >
                                <option value={false}>E</option>
                                <option value={true}>W</option>
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>
                                {validationErrors.lon.degrees || validationErrors.lon.minutes || validationErrors.lon.seconds}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </>
            ) : (
                <>
                    <Form.Group as={Row}>
                        <Form.Label column sm={12} md={3}>Search location</Form.Label>
                        <Col sm={12} md={9}>
                            <Form.Control
                                type="text"
                                placeholder="Search for location..."
                                value={searchInput}
                                isInvalid={searchError}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    <Button onClick={handleSearch}>Search</Button>
                </>
            )}

            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Measure unit
                </Form.Label>
                <Col sm={12} md={9}>
                    <Form.Select
                        value={formData.isMetric}
                        onChange={(e) => setFormData({
                            ...formData,
                            isMetric: e.target.value === 'true'
                        })}
                    >
                        <option value={true}>Metric</option>
                        <option value={false}>Imperial</option>
                    </Form.Select>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column sm={12} md={3}>
                    Elevation
                </Form.Label>
                <Col sm={10} md={7}>
                    <Form.Control
                        type="number"
                        name="elevation"
                        value={formData.elevation}
                        onChange={(e) => setFormData({
                            ...formData,
                            elevation: e.target.value
                        })}
                    />
                </Col>
                <Form.Label column sm={2}>
                    {formData.isMetric ? 'mt' : 'ft'}
                </Form.Label>
            </Form.Group>
        </>
    )
}