import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/navigation'
import './mediaswiper.css'
import { MediaCard } from './MediaCard';

export const MediaSwiper = ({ media }) => {
    return (
        <Swiper
            className='h-100'
            modules={[Navigation]}
            spaceBetween={50}
            breakpoints={{
                576: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 4 }
            }}
            navigation
        >
            {media.map(item => (
                    <SwiperSlide key={item._id}>
                       <MediaCard item={item}/>
                    </SwiperSlide> 
            ))}
        </Swiper>
    );
};