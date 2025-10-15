import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  description: string;
  category: string;
  images: string[];
}

interface PropertySliderProps {
  properties: Property[];
}

export const PropertySlider = ({ properties }: PropertySliderProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {properties.map((property) => (
          <CarouselItem key={property.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden border-border hover:shadow-2xl transition-all duration-300 group">
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {property.category && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      {property.category}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                  {property.name}
                </h3>
                <div className="flex items-center text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">starts from </span>
                    <span className="text-2xl font-bold text-primary">{property.price}</span>
                    <span className="text-sm text-muted-foreground"> / night</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="left-0 -translate-x-12" />
        <CarouselNext className="right-0 translate-x-12" />
      </div>
    </Carousel>
  );
};
