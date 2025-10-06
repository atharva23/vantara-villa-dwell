import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

const BookStay = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    noOfGuests: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.destination || 
        !formData.checkInDate || !formData.checkOutDate || !formData.noOfGuests) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("book_stay_inquiries").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          destination: formData.destination,
          check_in_date: formData.checkInDate,
          check_out_date: formData.checkOutDate,
          no_of_guests: parseInt(formData.noOfGuests),
        },
      ]);

      if (error) throw error;

      // Redirect to WhatsApp with pre-filled message
      const message = encodeURIComponent(
        `Hi Vantara Living,\n\nI'd like to book a stay:\n\nName: ${formData.name}\nDestination: ${formData.destination}\nCheck-in: ${formData.checkInDate}\nCheck-out: ${formData.checkOutDate}\nGuests: ${formData.noOfGuests}\n\nPlease assist me with the next steps.`
      );
      window.open(`https://wa.me/1234567890?text=${message}`, "_blank");

      toast({
        title: "Inquiry Submitted",
        description: "We'll contact you shortly on WhatsApp!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        checkInDate: "",
        checkOutDate: "",
        noOfGuests: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
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
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Book Your Stay
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your details and we'll help you find the perfect villa
            </p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Inquiry Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
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
                  <Label htmlFor="destination">Preferred Destination *</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="E.g., Goa, Manali, Udaipur"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkInDate">Check-in Date *</Label>
                    <div className="relative">
                      <Input
                        id="checkInDate"
                        name="checkInDate"
                        type="date"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        required
                      />
                      <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkOutDate">Check-out Date *</Label>
                    <div className="relative">
                      <Input
                        id="checkOutDate"
                        name="checkOutDate"
                        type="date"
                        value={formData.checkOutDate}
                        onChange={handleChange}
                        required
                      />
                      <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noOfGuests">Number of Guests *</Label>
                  <Input
                    id="noOfGuests"
                    name="noOfGuests"
                    type="number"
                    min="1"
                    value={formData.noOfGuests}
                    onChange={handleChange}
                    placeholder="Number of guests"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Inquiry & Chat on WhatsApp"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  After submitting, you'll be redirected to WhatsApp to continue the booking process
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookStay;
