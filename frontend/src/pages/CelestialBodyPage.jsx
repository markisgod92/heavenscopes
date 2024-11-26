import { useEffect, useState } from "react"
import { BodyRealTimeData } from "../components/celestial-body-components/real-time-data/BodyRealTimeData"
import { Col, Row } from "react-bootstrap"
import { ModelViewer } from "../components/celestial-body-components/model-3D/ModelViewer"
import { MediaSwiper } from "../components/celestial-body-components/official-media-visualization/MediaSwiper"
import { useParams } from "react-router-dom"

export const CelestialBodyPage = () => {
    const {bodyName} = useParams()
    const [celestialBodyData, setCelestialBodyData] = useState(null)

    const getCelestialBodyData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/celestial-bodies/by-name/${bodyName.toLowerCase()}?media=true`)
            const data = await response.json()
            setCelestialBodyData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getCelestialBodyData()
    }, [bodyName])

    return (
        <>
            <Row className="pt-3">
                <h2>{bodyName}</h2>
            </Row>

            <Row>
                <Col sm={12} md={6}>
                    {celestialBodyData && (
                        <ModelViewer model3D={celestialBodyData.model3D} />
                    )}

                </Col>
                <Col sm={12} md={6}>
                    <BodyRealTimeData bodyName={bodyName} />
                </Col>
            </Row>

            {celestialBodyData && celestialBodyData.licensedMedia.length > 0 && (
                <Row className="pt-5">
                    <h4>Official media</h4>
                    <MediaSwiper media={celestialBodyData.licensedMedia} />
                </Row>

            )}

            <Row>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, quo debitis. Sit, illum nostrum voluptates amet maxime ex eveniet impedit laborum? Neque laborum delectus obcaecati officia! Saepe minus fugiat, vel minima ipsa illum voluptatum cum. Veniam, earum quo, deleniti voluptatibus perferendis placeat, ex reiciendis magni aspernatur officia impedit eos quaerat? Quam doloremque vel itaque facilis provident a ipsam deserunt quis dicta, sapiente sequi eum quasi ducimus aliquid ea facere dolorum impedit quidem ipsum nam repellendus ratione totam! Facilis neque sunt at distinctio enim atque, voluptates id sint minima nulla! Qui, quos quisquam quidem vero sapiente cumque laborum voluptates nisi placeat totam. Alias nulla tenetur, porro eaque quod provident repellat quidem rem est vel dicta. Alias molestias at reprehenderit, fugit architecto ratione nesciunt facilis, possimus nihil placeat ad saepe assumenda? Itaque necessitatibus esse, assumenda eaque autem enim! Quaerat nam distinctio ipsa rem nostrum? Maxime reiciendis ipsa qui. Fugiat, eligendi, sit nemo at est incidunt ratione debitis dolorum veniam accusamus nostrum ab, asperiores laborum laudantium molestias sequi perspiciatis magni nihil doloremque porro velit. Ut illo est impedit distinctio nulla explicabo odit quam eum magnam consequatur dicta quasi cupiditate excepturi unde debitis, sed in quidem! Facere, libero autem iure fugit cum quibusdam. Alias ab deserunt expedita earum? Quas possimus tempora repudiandae cumque esse consequatur sequi odit vel, et accusantium beatae quae aspernatur labore recusandae, sit itaque facere libero odio illo ullam in? Vitae quae explicabo, beatae nostrum nihil nulla quidem placeat ducimus eligendi distinctio nobis, incidunt in esse pariatur, ipsa soluta! Nemo inventore recusandae commodi consequatur aliquam accusantium, distinctio pariatur optio consequuntur soluta rerum odio necessitatibus iusto iste a in reiciendis voluptate. Alias laboriosam modi odit iste ipsa ad itaque vel praesentium repellendus maxime eos, incidunt tempore vero, atque quasi vitae? Nemo dicta eos quo eligendi quod est soluta amet aliquid pariatur eaque consectetur dolorum consequatur repellendus officiis, fugit saepe expedita beatae veritatis numquam magni, consequuntur unde quasi porro quaerat? Inventore sunt quis amet atque eaque dolor corrupti, ipsum non placeat sequi doloribus magni in, excepturi accusamus. Harum nemo dolore voluptas, quidem rerum ut error earum nesciunt consequuntur amet cum magni sapiente ad mollitia maiores repellat iste aspernatur quas nostrum ipsa, provident dolorem, dolor est. Placeat, inventore dolore, commodi ratione excepturi tempora ea fugiat illo doloremque illum facilis. Nulla obcaecati quis ex consectetur dignissimos labore aliquam pariatur repellat veniam architecto doloribus minima dicta vitae reiciendis, natus magnam sunt qui at quos, distinctio odio dolor ipsa quod incidunt. Nesciunt quae illo eaque consectetur iste adipisci iure ad non, tenetur error beatae animi veritatis perferendis enim veniam minima repellendus ut officia fuga ipsam sunt dolor consequuntur pariatur. Ea illum neque sequi? Necessitatibus facere obcaecati non tempore, quaerat nihil accusantium rerum alias dignissimos accusamus at quas! Facere labore sint, dolorum doloremque mollitia incidunt odit illo ullam accusantium fugit nisi aliquid saepe omnis, maxime aperiam at qui aut, eligendi ex eius? Iste magni illum labore fugiat eveniet exercitationem saepe voluptatibus doloribus delectus totam corrupti molestias et obcaecati, ad culpa dolorem dicta at nulla ea maxime, cupiditate ab.</div>
            </Row>
        </>
    )
}