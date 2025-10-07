import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import PropertyForm from '@/components/admin/PropertyForm';
import PropertyList from '@/components/admin/PropertyList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export interface Property {
  id?: string;
  property_name: string;
  location: string;
  description: string | null;
  no_of_bedrooms: number;
  no_of_bathrooms: number;
  price_per_night: number;
  weekday_price: number;
  weekend_price: number;
  max_guests_base_price: number;
  max_guests: number;
  extra_person_cost: number;
  meal_charges_per_person: number;
  amenities: string[];
  category: 'Beach' | 'Mountain' | 'Heritage' | 'Corporate';
  images: string[];
  availability_status: 'Available' | 'Booked' | 'Maintenance';
  featured: boolean;
  published: boolean;
}

export default function Admin() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching properties',
        description: error.message,
      });
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error deleting property',
        description: error.message,
      });
    } else {
      toast({
        title: 'Property deleted',
        description: 'The property has been successfully deleted.',
      });
      fetchProperties();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProperty(null);
    fetchProperties();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-primary mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and submissions</p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          )}
        </div>

        {showForm ? (
          <PropertyForm
            property={editingProperty}
            onClose={handleFormClose}
          />
        ) : (
          <Tabs defaultValue="properties" className="w-full">
            <TabsList>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="bookings">Booking Inquiries</TabsTrigger>
              <TabsTrigger value="hosts">Host Submissions</TabsTrigger>
              <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties">
              <PropertyList
                properties={properties}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="bookings">
              <div className="text-center py-12 text-muted-foreground">
                Booking inquiries list coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="hosts">
              <div className="text-center py-12 text-muted-foreground">
                Host submissions list coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <div className="text-center py-12 text-muted-foreground">
                Contact messages list coming soon
              </div>
            </TabsContent>
          </Tabs>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
}
