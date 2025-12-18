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
import { MapPin, MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowFullImage(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleCloseFullImage = () => {
    setShowFullImage(false);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  // Filter out videos for the grid
  const imageUrls = property.images.filter(img => !img.match(/\.(mp4|mov|avi|webm)$/i));
  const remainingCount = imageUrls.length - 4;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-3 sm:p-6">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {property.name}
                </DialogTitle>
                <DialogDescription className="flex items-center text-muted-foreground mb-4 text-sm sm:text-base">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {property.location}
                </DialogDescription>
              </div>
              <Badge className="bg-primary ml-2 sm:ml-4 text-xs sm:text-sm">{property.category}</Badge>
            </div>
          </DialogHeader>

          {/* Responsive Image Grid - Grid on ALL devices */}
          {imageUrls && imageUrls.length > 0 && (
            <div className="mb-4 sm:mb-6 w-full">
              {/* Grid layout for all screen sizes - scales down on mobile */}
              <div className="grid grid-cols-4 gap-1 sm:gap-2 h-[200px] sm:h-[300px] md:h-[400px]">
                {/* Large image on the left */}
                <div 
                  className="col-span-2 row-span-2 relative overflow-hidden rounded-l-md sm:rounded-l-lg cursor-pointer group"
                  onClick={() => handleImageClick(0)}
                >
                  <img
                    src={imageUrls[0]}
                    alt={`${property.name} - Main`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Top right image */}
                {imageUrls[1] && (
                  <div 
                    className="col-span-2 relative overflow-hidden rounded-tr-md sm:rounded-tr-lg cursor-pointer group"
                    onClick={() => handleImageClick(1)}
                  >
                    <img
                      src={imageUrls[1]}
                      alt={`${property.name} - Image 2`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                )}

                {/* Bottom right images */}
                {imageUrls[2] && (
                  <div 
                    className="relative overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(2)}
                  >
                    <img
                      src={imageUrls[2]}
                      alt={`${property.name} - Image 3`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                )}

                {imageUrls[3] && (
                  <div 
                    className="relative overflow-hidden rounded-br-md sm:rounded-br-lg cursor-pointer group"
                    onClick={() => handleImageClick(3)}
                  >
                    <img
                      src={imageUrls[3]}
                      alt={`${property.name} - Image 4`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {remainingCount > 0 && (
                      <div 
                        className="absolute inset-0 bg-black/70 flex items-center justify-center hover:bg-black/60 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowGallery(true);
                        }}
                      >
                        <span className="text-white text-xs sm:text-sm md:text-xl font-bold">
                          +{remainingCount}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* View all photos link */}
              <button
                onClick={() => setShowGallery(true)}
                className="mt-2 sm:mt-3 text-xs sm:text-sm text-primary hover:underline font-medium"
              >
                View all {imageUrls.length} photos
              </button>
            </div>
          )}

          {/* Price & Details */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-2 sm:mb-3">
              <span className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground">starts from </span>
              ₹{property.price}
              <span className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground"> / night</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm md:text-base text-muted-foreground">
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
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2 sm:mb-3">Description</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2 sm:mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border sticky bottom-0 bg-background pb-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 w-full px-4 sm:px-8 py-4 sm:py-6 md:py-3 text-sm sm:text-base"
              onClick={onBook}
              size="lg"
            >
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>Book via WhatsApp</span>
            </Button>
            <Button variant="outline" onClick={onClose} size="lg" className="w-full sm:w-auto py-4 sm:py-6 md:py-3 text-sm sm:text-base">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Grid View Modal */}
      {showGallery && (
        <Dialog open={showGallery} onOpenChange={handleCloseGallery}>
          <DialogContent className="max-w-7xl max-h-[95vh] p-3 sm:p-6 overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-background z-10 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg sm:text-2xl font-bold">{property.name}</DialogTitle>
                  <DialogDescription className="mt-1 text-xs sm:text-sm">
                    {imageUrls.length} photos
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseGallery}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>

            {/* Grid of all images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
              {imageUrls.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={image}
                    alt={`${property.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-2 sm:p-3">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Full Image Viewer Modal - Fixed z-index and clickable arrows */}
      {showFullImage && (
        <Dialog open={showFullImage} onOpenChange={handleCloseFullImage}>
          <DialogContent className="max-w-5xl w-[95vw] sm:w-[90vw] max-h-[85vh] p-0 overflow-hidden bg-black">
            <div className="relative w-full h-full flex flex-col">
              {/* Header with close button - Higher z-index */}
              <div className="relative z-30 bg-gradient-to-b from-black/90 via-black/70 to-transparent p-2 sm:p-4 flex items-center justify-between">
                <div className="text-white">
                  <h3 className="font-semibold text-sm sm:text-lg">{property.name}</h3>
                  <p className="text-xs sm:text-sm text-white/80">
                    {selectedImageIndex + 1} / {imageUrls.length}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseFullImage}
                  className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>

              {/* Main Image Viewer - Lower z-index */}
              <div className="flex-1 relative flex items-center justify-center p-2 sm:p-4 min-h-[250px] sm:min-h-[400px] z-10">
                <img
                  src={imageUrls[selectedImageIndex]}
                  alt={`${property.name} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain pointer-events-none"
                />
              </div>

              {/* Navigation Arrows - Highest z-index to be clickable */}
              {imageUrls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10 sm:h-12 sm:w-12"
                  >
                    <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                  </Button>
                </>
              )}

              {/* Thumbnail Strip - Medium z-index */}
              <div className="relative z-20 bg-black/90 p-2 sm:p-4 border-t border-white/10">
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-2">
                  {imageUrls.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-12 h-12 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-white scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={media}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
