"use client";

import React from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "@/data/companies";

const CompanyCarousel = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full py-8"
    >
      <CarouselContent className="flex gap-6 sm:gap-16 items-center">
        {companies.map(({ name, id, path }) => (
          <CarouselItem key={id} className="basis-1/3 sm:basis-1/4 lg:basis-1/6 flex justify-center">
            <Image
              src={path}
              alt={name}
              width={160}
              height={44}
              className="h-7 sm:h-9 w-auto object-contain opacity-35 hover:opacity-85 transition-opacity grayscale invert brightness-200"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CompanyCarousel;
