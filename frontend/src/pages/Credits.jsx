import { Row, Col } from "react-bootstrap"

export const Credits = () => {
    return (
        <Row className="p-3">
            <Col sm={12}>
                <h3 className="text-center">Credits</h3>
            </Col>

            <Col sm={12} className="pt-5">
                <ul className="list-unstyled d-flex flex-column gap-4">
                    <li>
                        <h5>Visible Planets API</h5>
                        <p>
                            Provided by Casey Milstead. Visit on github: <a href="https://github.com/csymlstd">csymlstd</a>
                        </p>
                        <p>This useful API returns the position data of the planets of the Solar System in the sky, based on time, location coordinates and elevation.</p>
                        <p>The observer can easily use this data to point an observation device, such as a binocular or a telescope, to the object.</p>
                    </li>

                    <li>
                        <h5>OpenWeather</h5>
                        <p>
                            <a href="https://openweather.co.uk">openweather.co.uk</a>
                        </p>
                        <p>Thanks to OpenWeather API tools, Heavenscopes can provide coordinates based on a location prompted by the user and real-time weather forecast at that location.</p>
                    </li>

                    <li>
                        <h5>Solar System Scope</h5>
                        <p>
                            <a href="https://www.solarsystemscope.com">www.solarsystemscope.com</a>
                        </p>
                        <p>The Solar System Scope project provides high resolution textures for the planets of the Solar System, based on NASA imagery data.</p>
                    </li>
                </ul>
            </Col>
        </Row>
    )
}