import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Leaf, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-10 w-10 text-accent" />,
      title: "End-to-End Villa Management",
      description: "We specialize in complete villa rental and management solutions designed to maximize your property's potential.",
    },
    {
      icon: <Shield className="h-10 w-10 text-accent" />,
      title: "Flexible Branding Options",
      description: "List under Vantara Living or build your own independent identity with full backend support from our team.",
    },
    {
      icon: <Leaf className="h-10 w-10 text-accent" />,
      title: "360-Degree Marketing Services",
      description: "From branding strategy and content creation to listing optimization and performance campaigns, every service is tailored to your goals.",
    },
    {
      icon: <Award className="h-10 w-10 text-accent" />,
      title: "Operations with Consistent Growth",
      description: "We manage guest inquiries, bookings, and day-to-day operations to drive higher occupancy and premium guest experiences.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Vantara Living
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              At Vantara Living, we specialize in end-to-end villa rental and management solutions
              designed for modern property owners. Our approach is simple: we help you maximize your
              villa's potential while giving you complete flexibility over how your brand is presented.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <Card className="border-border shadow-lg">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                  How We Support Owners
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto">
                  Whether you want to list your villa under the Vantara Living umbrella or build your
                  own independent identity, we provide seamless backend support. From social media
                  management and digital presence to handling guest inquiries and bookings, our team
                  helps your property stand out in a competitive market.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Full-spectrum support tailored to your property's growth goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">{value.icon}</div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Why Choose Vantara Living?
            </h2>
            <div className="bg-muted/30 rounded-lg p-8 md:p-12">
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-6">
                We offer 360-degree marketing services, including branding strategy, content creation,
                listing optimization, and performance-driven campaigns. For owners who prefer to grow
                their own brand, we work behind the scenes while you retain full ownership of your
                identity.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                Beyond marketing, we take care of villa operations to deliver a smooth experience for
                both owners and guests. At Vantara Living, we do not just manage villas - we build
                brands, elevate experiences, and create long-term value for property owners.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
