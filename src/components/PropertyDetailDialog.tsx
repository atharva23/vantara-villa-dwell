import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, X } from "lucide-react";
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
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
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

        {/* Image Carousel */}
        {property.images && property.images.length > 0 && (
          <div className="mb-6">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[250px] sm:h-[400px] rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${property.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {property.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 sm:left-4" />
                  <CarouselNext className="right-2 sm:right-4" />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Price & Details */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-3">
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
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{property.description}</p>
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={onBook}
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Book Now via WhatsApp
          </Button>
          <Button variant="outline" onClick={onClose} size="lg" className="sm:w-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
