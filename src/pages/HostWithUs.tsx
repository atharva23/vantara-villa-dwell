import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Home, TrendingUp, Shield, Users } from "lucide-react";

const HostWithUs = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    villaName: "",
    location: "",
    amenities: "",
  });

  const benefits = [
    {
      icon: <TrendingUp className="h-10 w-10 text-accent" />,
      title: "Maximize Revenue",
      description: "Competitive pricing and high occupancy rates",
    },
    {
      icon: <Shield className="h-10 w-10 text-accent" />,
      title: "Full Support",
      description: "Comprehensive property management and maintenance",
    },
    {
      icon: <Users className="h-10 w-10 text-accent" />,
      title: "Quality Guests",
      description: "Verified guests who respect your property",
    },
    {
      icon: <Home className="h-10 w-10 text-accent" />,
      title: "Premium Listing",
      description: "Professional photography and marketing",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ownerName || !formData.email || !formData.phone || 
        !formData.villaName || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const amenitiesArray = formData.amenities
        .split(",")
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const { error } = await supabase.from("host_submissions").insert([
        {
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          villa_name: formData.villaName,
          location: formData.location,
          amenities: amenitiesArray,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Submission Successful",
        description: "We'll review your property and contact you soon!",
      });

      // Reset form
      setFormData({
        ownerName: "",
        email: "",
        phone: "",
        villaName: "",
        location: "",
        amenities: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              List Your Villa with Us
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our network of premium properties and unlock your villa's full potential
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Submit Your Property</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 1234567890"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="villaName">Villa Name *</Label>
                    <Input
                      id="villaName"
                      name="villaName"
                      value={formData.villaName}
                      onChange={handleChange}
                      placeholder="Name of your property"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                    <Textarea
                      id="amenities"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleChange}
                      placeholder="E.g., Pool, WiFi, Parking, Garden, AC"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Property"}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Our team will review your submission and contact you within 48 hours
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HostWithUs;
