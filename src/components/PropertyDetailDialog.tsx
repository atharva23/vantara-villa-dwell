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

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  // Filter out videos for the grid
  const imageUrls = property.images.filter(img => !img.match(/\.(mp4|mov|avi|webm)$/i));
  const remainingCount = imageUrls.length - 4;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
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

          {/* Booking.com Style Image Grid - 4 images only */}
          {imageUrls && imageUrls.length > 0 && (
            <div className="mb-6 w-full">
              <div className="grid grid-cols-4 gap-2 h-[400px]">
                {/* Large image on the left - 2 columns, full height */}
                <div 
                  className="col-span-2 row-span-2 relative overflow-hidden rounded-l-lg cursor-pointer group"
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
                    className="col-span-2 relative overflow-hidden rounded-tr-lg cursor-pointer group"
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

                {/* Bottom right - 2 images */}
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

                {/* Last image with overlay showing remaining count */}
                {imageUrls[3] && (
                  <div 
                    className="relative overflow-hidden rounded-br-lg cursor-pointer group"
                    onClick={() => setShowGallery(true)}
                  >
                    <img
                      src={imageUrls[3]}
                      alt={`${property.name} - Image 4`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {remainingCount > 0 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center hover:bg-black/60 transition-colors">
                        <span className="text-white text-xl font-bold">
                          +{remainingCount} photos
                        </span>
                      </div>
                    )}
                    {remainingCount === 0 && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    )}
                  </div>
                )}
              </div>

              {/* Show all photos link */}
              <button
                onClick={() => setShowGallery(true)}
                className="mt-3 text-sm text-primary hover:underline font-medium"
              >
                View all {imageUrls.length} photos
              </button>
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

      {/* Gallery Grid View Modal */}
      {showGallery && (
        <Dialog open={showGallery} onOpenChange={setShowGallery}>
          <DialogContent className="max-w-7xl max-h-[95vh] p-6 overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">{property.name}</DialogTitle>
                  <DialogDescription className="mt-1">
                    {imageUrls.length} photos
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowGallery(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>

            {/* Grid of all images */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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
                      <div className="bg-white/90 rounded-full p-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Full Image Viewer Modal */}
      {showFullImage && (
        <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
          <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 m-0 overflow-hidden bg-black border-0">
            <div className="relative w-full h-full flex flex-col">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="text-sm text-white/80">
                    {selectedImageIndex + 1} / {imageUrls.length}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFullImage(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Main Image Viewer */}
              <div className="flex-1 relative flex items-center justify-center p-4">
                <img
                  src={imageUrls[selectedImageIndex]}
                  alt={`${property.name} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Navigation Arrows */}
                {imageUrls.length > 1 && (
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
                  {imageUrls.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
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
