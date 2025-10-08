import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, MapPin, Users, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-villa.jpg";

const Home = () => {
  const services = [
    {
      icon: <Sparkles className="h-8 w-8 text-accent" />,
      title: "Concierge Service",
      description: "24/7 personal concierge for all your needs during your stay",
    },
    {
      icon: <MapPin className="h-8 w-8 text-accent" />,
      title: "Airport Transfers",
      description: "Seamless airport pickup and drop-off in luxury vehicles",
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Private Chef",
      description: "Personalized culinary experiences by professional chefs",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "An absolutely stunning villa with impeccable service. Our family vacation was made perfect by Vantara Living.",
      rating: 5,
    },
    {
      name: "Raj Patel",
      location: "Mumbai, India",
      text: "The attention to detail and luxury amenities exceeded all expectations. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emily Chen",
      location: "Singapore",
      text: "From booking to checkout, everything was seamless. The villa was exactly as advertised, if not better.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-foreground/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Curated Luxury Villas.<br />Seamless Stays.<br />Memorable Experiences.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Discover handpicked luxury villas in the world's most stunning destinations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-foreground">
              <Link to="/properties">
                Explore Villas <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
              <Link to="/host">Host with Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Premium Guest Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Elevate your stay with our curated services designed for discerning travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 text-center">
                  <div className="flex justify-center mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Villas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked luxury accommodations across breathtaking destinations
            </p>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/properties">
                View All Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Guest Experiences
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What our guests say about their stays
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Dream Vacation?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Book your luxury villa today and experience hospitality redefined
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-foreground">
              <Link to="/book">Book a Stay</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
