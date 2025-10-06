import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  property_name: string;
  location: string;
  description: string;
  price_per_night: number;
  no_of_bedrooms: number;
  no_of_bathrooms: number;
  category: string;
  images: string[];
  featured: boolean;
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { toast } = useToast();

  const categories = ["All", "Beach", "Mountain", "Heritage", "Corporate"];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load properties",
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
    const message = encodeURIComponent(
      `Hi Vantara Living, I'd like to book ${property.property_name} in ${property.location}. Please assist me with the next steps.`
    );
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
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
                <Card key={property.id} className="overflow-hidden border-border hover:shadow-xl transition-shadow">
                  {/* Property Image */}
                  <div className="relative h-64 bg-muted">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.property_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    {property.featured && (
                      <Badge className="absolute top-4 left-4 bg-accent text-foreground">
                        Featured
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-primary">
                      {property.category}
                    </Badge>
                  </div>

                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {property.property_name}
                    </h3>
                    
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.no_of_bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.no_of_bathrooms} Baths</span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-primary">
                      ₹{property.price_per_night.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground"> / night</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handleBookNow(property)}
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
    </div>
  );
};

export default Properties;
