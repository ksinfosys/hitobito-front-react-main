import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, Scrollbar, A11y, FreeMode } from 'swiper';
import { Link } from "react-router-dom";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Intro() {

    return (
        <>
            <div className="intro-wrap">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                    initialSlide={1}
                >
                    <SwiperSlide>
                        <img src="/images/intro-1.png" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/intro-2.png" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/intro-3.png" alt="" />
                    </SwiperSlide>
                </Swiper>
                <div className="intro-bottom">
                    <ul className="img-list">
                        <li>
                            <Link to="">
                                <img src="/images/banner-1.png" alt="" />
                            </Link>
                        </li>
                        <li>
                            <Link to="">
                                <img src="/images/banner-2.png" alt="" />
                            </Link>
                        </li>
                        <li>
                            <Link to="">
                                <img src="/images/banner-3.png" alt="" />
                            </Link>
                        </li>
                        <li>
                            <Link to="">
                                <img src="/images/banner-4.png" alt="" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div >
            <div className="intro-mobile-wrap">
                <Swiper
                    slidesPerView={1}
                    centeredSlides={true}
                    spaceBetween={30}
                    autoplay={{
                        delay: 300,
                        disableOnInteraction: false,
                    }
                    }
                    className="mySwiper-mo"
                    loop={true}
                >
                    <SwiperSlide>
                        <img src="/images/mobile-main-banner-1.png" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/mobile-main-banner-2.png" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/images/mobile-main-banner-3.png" alt="" />
                    </SwiperSlide>
                </Swiper>
            </div >

        </>
    );
}

export default Intro;
