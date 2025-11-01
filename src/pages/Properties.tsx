import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertyDetailDialog } from "@/components/PropertyDetailDialog";
import { format } from "date-fns";

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

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const locationParam = searchParams.get("location");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = searchParams.get("adults") || "2";
  const children = searchParams.get("children") || "0";

  const locations = ["All", ...Array.from(new Set(properties.map(p => p.location)))];

  useEffect(() => {
    fetchPropertiesFromGoogleSheet();
  }, []);

  useEffect(() => {
    if (locationParam && properties.length > 0) {
      setSelectedLocation(locationParam);
    }
  }, [locationParam, properties]);

  const fetchPropertiesFromGoogleSheet = async () => {
    try {
      const sheetId = "2PACX-1vT12tHyrXjuP1h8xA_IntzhinKDZXqJSq5J8CmjAuJ2zDvZHfYSY9xh5PWxuObUHWnCgV-4IncGW8Z5";
      const gid = "870502534";
      const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${gid}&single=true&output=csv`;

      const response = await fetch(url);
      const csvText = await response.text();

      const lines = csvText.split("\n");
      const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));

      const parsedProperties: Property[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values: string[] = [];
        let currentValue = "";
        let insideQuotes = false;

        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          if (char === '"') insideQuotes = !insideQuotes;
          else if (char === "," && !insideQuotes) {
            values.push(currentValue.trim().replace(/^"|"$/g, ""));
            currentValue = "";
          } else currentValue += char;
        }
        values.push(currentValue.trim().replace(/^"|"$/g, ""));

        const propertyId = values[0]?.trim();
        if (!propertyId) continue;

        // ✅ OPTIMIZATION: Load images lazily, store just the property ID for now
        parsedProperties.push({
          id: propertyId,
          name: values[1] || "",
          location: values[2] || "",
          description: values[3] || "",
          price: values[4]?.replace("₹", "").replace(",", "") || "",
          category: "Villa",
          images: [], // Will be loaded on-demand
          whatsapp_number: values[5] || "+91 84850 99069",
          book_link: values[6] || "",
          amenities: values[7] ? values[7].split(",").map(a => a.trim()) : [],
          max_guests: values[8] || "",
          bedrooms: values[9] || "",
          bathrooms: values[10] || "",
        });
      }

      setProperties(parsedProperties);
      
      // ✅ Load images for all properties in parallel after initial render
      loadAllPropertyImages(parsedProperties);
      
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties from Google Sheets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load images in background after page loads
  const loadAllPropertyImages = async (propertiesList: Property[]) => {
    const s3BucketUrl = "https://vantara-living.s3.us-east-1.amazonaws.com";
    
    // Load images for all properties in parallel
    const imagePromises = propertiesList.map(async (property) => {
      try {
        const listUrl = `${s3BucketUrl}/?list-type=2&prefix=${property.id}/&max-keys=5`;
        const s3ListResponse = await fetch(listUrl);
        const s3ListXml = await s3ListResponse.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(s3ListXml, "application/xml");
        const keys = Array.from(xml.getElementsByTagName("Key"))
          .map(el => el.textContent)
          .filter(
            key =>
              key &&
              !key.endsWith("/") &&
              key.match(/\.(jpg|jpeg|png|webp|gif|heic|mp4|mov|avi|webm)$/i)
          );

        const mediaUrls = keys.map(k => `${s3BucketUrl}/${k}`).slice(0, 5);
        
        return { id: property.id, images: mediaUrls };
      } catch (err) {
        console.error(`Error fetching S3 files for ${property.id}:`, err);
        return { id: property.id, images: [] };
      }
    });

    // Wait for all images to load
    const results = await Promise.all(imagePromises);
    
    // Update properties with images
    setProperties(prev => 
      prev.map(property => {
        const result = results.find(r => r.id === property.id);
        return result ? { ...property, images: result.images } : property;
      })
    );
  };

  const filteredProperties = properties.filter(p => {
    if (selectedLocation !== "All" && p.location !== selectedLocation) return false;
    if (p.max_guests) {
      const totalGuests = parseInt(adults) + parseInt(children);
      const maxGuests = parseInt(p.max_guests);
      return totalGuests <= maxGuests;
    }
    return true;
  });

  const handleBookNow = (property: Property) => {
    const phoneNumber = property.whatsapp_number.replace(/[^0-9]/g, "");
    let message = `I'm interested in booking ${property.name}`;

    if (checkIn && checkOut) {
      const checkInDate = format(new Date(checkIn), "PPP");
      const checkOutDate = format(new Date(checkOut), "PPP");
      message += `\n\nBooking Details:\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nAdults: ${adults}\nChildren: ${children}`;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShare = (property: Property) => {
    const shareUrl = window.location.origin + `/properties?property=${property.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: property.name,
          text: `Check out ${property.name} at ${property.location}`,
          url: shareUrl,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link copied!",
            description: "Property link copied to clipboard",
          });
        });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Property link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Luxury Villas
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover handpicked properties across stunning destinations
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {locations.map(location => (
              <Button
                key={location}
                onClick={() => setSelectedLocation(location)}
                variant={selectedLocation === location ? "default" : "outline"}
              >
                {location}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <Card
                  key={property.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative h-72 bg-muted overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <>
                        {(() => {
                          const firstMedia = property.images[0];
                          const isVideo = /\.(mp4|mov|avi|webm)$/i.test(firstMedia);
                          console.log('Media URL:', firstMedia, 'Is Video:', isVideo);
                          
                          return isVideo ? (
                            <video
                              key={firstMedia}
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="auto"
                              onLoadedData={() => console.log('Video loaded successfully')}
                              onError={(e) => {
                                console.error(`Video failed to load: ${firstMedia}`, e);
                              }}
                            >
                              <source src={firstMedia} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={firstMedia}
                              alt={property.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onLoad={() => console.log('Image loaded:', firstMedia)}
                            />
                          );
                        })()}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">Loading...</span>
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4 bg-primary/90">
                      {property.category}
                    </Badge>
                  </div>

                  <CardContent className="pt-6 space-y-3">
                    <h3 className="text-xl font-bold">{property.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {property.description}
                    </p>
                    <div className="text-2xl font-bold text-primary pt-2">
                      ₹{property.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / night
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={e => {
                        e.stopPropagation();
                        handleBookNow(property);
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        handleShare(property);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {selectedProperty && (
        <PropertyDetailDialog
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onBook={() => handleBookNow(selectedProperty)}
        />
      )}
    </div>
  );
};

export default Properties;
