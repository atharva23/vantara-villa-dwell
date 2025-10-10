import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertyDetailDialog } from "@/components/PropertyDetailDialog";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  const categories = ["All", "Beach", "Mountain", "Heritage", "Corporate"];

  useEffect(() => {
    fetchPropertiesFromGoogleSheet();
  }, []);

  const fetchPropertiesFromGoogleSheet = async () => {
    try {
      // Published Google Sheet ID
      const sheetId = "2PACX-1vT8CNao_YChnXaP-bjX1-hqGGRflUtgUdPXXniwTeTTlBDP32JDtFA_eCw2SiNEyFBEHNTVUq4_iONy";
      const gid = "1148006823";
      
      // Using CSV export for published sheets
      const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${gid}&single=true&output=csv`;
      
      console.log("Fetching from URL:", url);
      const response = await fetch(url);
      const csvText = await response.text();
      
      console.log("CSV Response (first 500 chars):", csvText.substring(0, 500));
      
      // Parse CSV to JSON
      const lines = csvText.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      console.log("Headers:", headers);
      
      const parsedProperties: Property[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Handle CSV parsing with quoted values
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim().replace(/^"|"$/g, ''));
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        
        // Columns: Property ID, Name, Location, Description, Price per Night, Image URL 1, Image URL 2, Image URL 3, WhatsApp Number, Booking Link, Amenities, Max Guests, Bedrooms, Bathrooms
        const images = [values[5], values[6], values[7]].filter(img => img && img.trim());
        
        parsedProperties.push({
          id: values[0] || "",
          name: values[1] || "",
          location: values[2] || "",
          description: values[3] || "",
          price: values[4]?.replace('₹', '').replace(',', '') || "",
          category: "Villa", // Default category
          images: images,
          whatsapp_number: values[8] || "+91 84850 99069",
          book_link: values[9] || "",
          amenities: values[10] ? values[10].split(",").map((a: string) => a.trim()) : [],
          max_guests: values[11] || "",
          bedrooms: values[12] || "",
          bathrooms: values[13] || "",
        });
      }
      
      console.log("Parsed properties:", parsedProperties);
      setProperties(parsedProperties);
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

  const filteredProperties = selectedCategory === "All" 
    ? properties 
    : properties.filter(p => p.category === selectedCategory);

  const handleBookNow = (property: Property) => {
    const phoneNumber = property.whatsapp_number.replace(/[^0-9]/g, '');
    const message = `I'm interested in booking ${property.name}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Luxury Villas
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover handpicked properties across stunning destinations
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Card 
                  key={property.id} 
                  className="group overflow-hidden border-border hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                  onClick={() => setSelectedProperty(property)}
                >
                  {/* Property Image with Overlay */}
                  <div className="relative h-72 bg-muted overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <>
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm">
                      {property.category}
                    </Badge>
                    {property.images && property.images.length > 1 && (
                      <Badge variant="secondary" className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm">
                        +{property.images.length - 1} photos
                      </Badge>
                    )}
                  </div>

                  <CardContent className="pt-6 space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                    
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {property.description}
                    </p>

                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                      {property.bedrooms && <span>🛏️ {property.bedrooms} Beds</span>}
                      {property.bathrooms && <span>🚿 {property.bathrooms} Baths</span>}
                      {property.max_guests && <span>👥 {property.max_guests} Guests</span>}
                    </div>

                    <div className="text-2xl font-bold text-primary pt-2">
                      ₹{property.price}
                      <span className="text-sm font-normal text-muted-foreground"> / night</span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(property);
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Book Now via WhatsApp
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
