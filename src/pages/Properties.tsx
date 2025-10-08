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
      // Replace with your actual Google Sheet ID
      const sheetId = "1148006823";
      const gid = "0"; // Sheet tab ID (usually 0 for first sheet)
      
      // Using Google Visualization API to fetch as JSON
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      // Parse the response (Google returns JSONP, need to extract JSON)
      const json = JSON.parse(text.substring(47).slice(0, -2));
      
      const rows = json.table.rows;
      const parsedProperties: Property[] = rows.map((row: any) => {
        const cells = row.c;
        return {
          id: cells[0]?.v || "",
          name: cells[1]?.v || "",
          location: cells[2]?.v || "",
          price: cells[3]?.v || "",
          description: cells[4]?.v || "",
          category: cells[5]?.v || "",
          amenities: cells[6]?.v ? cells[6].v.split(",").map((a: string) => a.trim()) : [],
          images: cells[7]?.v ? cells[7].v.split(",").map((img: string) => img.trim()) : [],
          book_link: cells[8]?.v || "https://wa.me/918485099069?text=Hi, I want to book a villa.",
        };
      });
      
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
