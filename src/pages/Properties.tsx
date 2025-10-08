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
        
        parsedProperties.push({
          id: values[0] || "",
          name: values[1] || "",
          location: values[2] || "",
          price: values[3] || "",
          description: values[4] || "",
          category: values[5] || "",
          amenities: values[6] ? values[6].split(",").map((a: string) => a.trim()) : [],
          images: values[7] ? values[7].split(",").map((img: string) => img.trim()) : [],
          book_link: values[8] || "https://wa.me/918485099069?text=Hi, I want to book a villa.",
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
    window.open(property.book_link, "_blank");
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
                  className="overflow-hidden border-border hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedProperty(property)}
                >
                  {/* Property Image */}
                  <div className="relative h-64 bg-muted">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4 bg-primary">
                      {property.category}
                    </Badge>
                  </div>

                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {property.name}
                    </h3>
                    
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="text-2xl font-bold text-primary">
                      ₹{property.price}
                      <span className="text-sm font-normal text-muted-foreground"> / night</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(property);
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Book Now
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
