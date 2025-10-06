import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Leaf, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-10 w-10 text-accent" />,
      title: "Curated Experiences",
      description: "Every property is handpicked and verified to ensure exceptional quality and memorable stays.",
    },
    {
      icon: <Shield className="h-10 w-10 text-accent" />,
      title: "Trust & Transparency",
      description: "We believe in honest communication and building lasting relationships with our guests and hosts.",
    },
    {
      icon: <Leaf className="h-10 w-10 text-accent" />,
      title: "Sustainability",
      description: "Committed to promoting eco-friendly practices and supporting local communities.",
    },
    {
      icon: <Award className="h-10 w-10 text-accent" />,
      title: "Excellence in Service",
      description: "24/7 support and personalized concierge services to make your stay seamless.",
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
              Our Story
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vantara Living was born from a passion for exceptional hospitality and a vision to 
              redefine luxury villa experiences. We believe that travel should be more than just 
              a vacation—it should be a journey of discovery, comfort, and unforgettable memories.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <Card className="border-border shadow-lg">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto">
                  To curate and deliver extraordinary luxury villa experiences that exceed expectations, 
                  foster meaningful connections, and create lasting memories. We are committed to providing 
                  seamless, personalized service while maintaining the highest standards of quality, 
                  sustainability, and authenticity in every stay.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
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
                We go beyond traditional villa rentals. Each property in our portfolio is carefully 
                selected for its unique character, location, and amenities. Our dedicated team ensures 
                that every aspect of your stay is taken care of—from the moment you inquire to long 
                after you've checked out.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                Whether you're seeking a tranquil beachfront escape, a majestic mountain retreat, 
                a heritage villa with cultural richness, or a corporate stay for your team—Vantara Living 
                is your trusted partner in creating extraordinary experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
