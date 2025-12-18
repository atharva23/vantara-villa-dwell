import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, X, Grid3x3, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  description: string;
  category: string;
  amenities: string[];
  images: string[];
  book_link: string;
  whatsapp_number: string;
  max_guests?: string;
  bedrooms?: string;
  bathrooms?: string;
}

interface PropertyDetailDialogProps {
  property: Property;
  onClose: () => void;
  onBook: () => void;
}

export const PropertyDetailDialog = ({
  property,
  onClose,
  onBook,
}: PropertyDetailDialogProps) => {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {property.name}
                </DialogTitle>
                <DialogDescription className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </DialogDescription>
              </div>
              <Badge className="bg-primary ml-4">{property.category}</Badge>
            </div>
          </DialogHeader>

          {/* Image Slider with 3 images visible */}
          {property.images && property.images.length > 0 && (
            <div className="mb-6 w-full overflow-hidden">
              <Carousel className="w-full max-w-full">
                <CarouselContent className="ml-0">
                  {property.images.map((media, index) => {
                    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(media);
                    
                    return (
                      <CarouselItem 
                        key={index} 
                        className="pl-2 basis-full md:basis-1/2 lg:basis-1/3 cursor-pointer"
                        onClick={() => !isVideo && handleImageClick(index)}
                      >
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted group">
                          {isVideo ? (
                            <video
                              src={media}
                              className="w-full h-full object-cover"
                              controls
                              loop
                              muted
                              playsInline
                              preload="metadata"
                            >
                              <source src={media} type="video/mp4" />
                            </video>
                          ) : (
                            <>
                              <img
                                src={media}
                                alt={`${property.name} - Image ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {property.images.length > 3 && (
                  <>
                    <CarouselPrevious className="left-2 sm:left-4" />
                    <CarouselNext className="right-2 sm:right-4" />
                  </>
                )}
              </Carousel>
              
              {/* View All Gallery Button */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-muted-foreground">
                  {property.images.length} {property.images.length === 1 ? 'photo' : 'photos'}
                </div>
                {property.images.length > 3 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowGallery(true)}
                    className="gap-2"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    View All Photos
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Price & Details */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-3">
              <span className="text-base sm:text-lg font-normal text-muted-foreground">starts from </span>
              ₹{property.price}
              <span className="text-base sm:text-lg font-normal text-muted-foreground"> / night</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base text-muted-foreground">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  🛏️ <span className="font-medium">{property.bedrooms}</span> Bedrooms
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1">
                  🚿 <span className="font-medium">{property.bathrooms}</span> Bathrooms
                </span>
              )}
              {property.max_guests && (
                <span className="flex items-center gap-1">
                  👥 <span className="font-medium">{property.max_guests}</span> Guests
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">Description</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border sticky bottom-0 bg-background pb-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 w-full px-8 py-6 sm:py-3 text-base sm:text-sm"
              onClick={onBook}
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Book Now via WhatsApp</span>
              <span className="sm:hidden whitespace-nowrap">Book via WhatsApp</span>
            </Button>
            <Button variant="outline" onClick={onClose} size="lg" className="w-full sm:w-auto py-6 sm:py-3">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Gallery Modal */}
      {showGallery && (
        <Dialog open={showGallery} onOpenChange={setShowGallery}>
          <DialogContent className="max-w-7xl h-[95vh] p-0 overflow-hidden bg-black">
            <div className="relative w-full h-full flex flex-col">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="text-sm text-white/80">
                    {selectedImageIndex + 1} / {property.images.length}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowGallery(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Main Image Viewer */}
              <div className="flex-1 relative flex items-center justify-center p-4">
                {property.images[selectedImageIndex]?.match(/\.(mp4|mov|avi|webm)$/i) ? (
                  <video
                    src={property.images[selectedImageIndex]}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                    loop
                    playsInline
                  >
                    <source src={property.images[selectedImageIndex]} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={property.images[selectedImageIndex]}
                    alt={`${property.name} - Image ${selectedImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                )}

                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-12 w-12"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full h-12 w-12"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="bg-black/90 p-4 border-t border-white/10">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((media, index) => {
                    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(media);
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-white scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {isVideo ? (
                          <video
                            src={media}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={media}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
