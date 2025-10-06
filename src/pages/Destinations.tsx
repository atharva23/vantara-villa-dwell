import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import beachVilla from "@/assets/beach-villa.jpg";
import mountainVilla from "@/assets/mountain-villa.jpg";

const Destinations = () => {
  const experiences = [
    {
      category: "Beach",
      title: "Coastal Paradise",
      description: "Pristine beaches, turquoise waters, and luxurious beachfront villas. Perfect for sun-seekers and water sports enthusiasts.",
      image: beachVilla,
      highlights: ["Private Beach Access", "Water Sports", "Sunset Views", "Ocean-front Dining"],
    },
    {
      category: "Mountain",
      title: "Mountain Retreats",
      description: "Escape to serene mountain villas surrounded by breathtaking peaks, pine forests, and cool mountain air.",
      image: mountainVilla,
      highlights: ["Panoramic Views", "Trekking Trails", "Cozy Fireplaces", "Nature Immersion"],
    },
    {
      category: "Heritage",
      title: "Cultural Heritage",
      description: "Stay in beautifully restored heritage properties that blend historical charm with modern luxury amenities.",
      image: beachVilla, // Reusing image, will be replaced with proper heritage image
      highlights: ["Historical Architecture", "Cultural Tours", "Traditional Cuisine", "Local Crafts"],
    },
    {
      category: "Corporate",
      title: "Corporate Stays",
      description: "Sophisticated villas designed for business travelers and team retreats, with modern work amenities.",
      image: mountainVilla, // Reusing image, will be replaced with proper corporate image
      highlights: ["High-speed WiFi", "Meeting Spaces", "Business Services", "Team Building Areas"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Destinations
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curated experiences across stunning locations, tailored to your preferences
            </p>
          </div>

          {/* Experiences Grid */}
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <Card key={index} className="overflow-hidden border-border">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-accent text-foreground px-4 py-2 rounded-md font-semibold">
                      {experience.category}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className={`p-8 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {experience.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                      {experience.description}
                    </p>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {experience.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span className="text-sm text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <Button asChild className="bg-primary hover:bg-primary/90 w-fit">
                      <Link to={`/properties?category=${experience.category}`}>
                        View {experience.category} Villas
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-muted/30 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Not Sure Which Destination?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let our experts help you find the perfect villa for your needs and preferences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/properties">Browse All Villas</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Destinations;
