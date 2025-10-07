import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { X, Upload } from 'lucide-react';
import { Property } from '@/pages/Admin';

interface PropertyFormProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyForm({ property, onClose }: PropertyFormProps) {
  const [formData, setFormData] = useState<Property>({
    property_name: '',
    location: '',
    description: '',
    no_of_bedrooms: 1,
    no_of_bathrooms: 1,
    price_per_night: 0,
    weekday_price: 0,
    weekend_price: 0,
    max_guests_base_price: 8,
    max_guests: 10,
    extra_person_cost: 1000,
    meal_charges_per_person: 1500,
    amenities: [],
    category: 'Mountain',
    images: [],
    availability_status: 'Available',
    featured: false,
    published: true,
  });
  const [amenityInput, setAmenityInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave = {
      ...formData,
      amenities: formData.amenities,
      images: formData.images,
    };

    let error;
    if (property?.id) {
      const result = await supabase
        .from('properties')
        .update(dataToSave)
        .eq('id', property.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('properties')
        .insert([dataToSave]);
      error = result.error;
    }

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error saving property',
        description: error.message,
      });
    } else {
      toast({
        title: property ? 'Property updated' : 'Property created',
        description: `The property has been successfully ${property ? 'updated' : 'created'}.`,
      });
      onClose();
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        variant: 'destructive',
        title: 'Error uploading image',
        description: uploadError.message,
      });
    } else {
      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);
      
      setFormData({
        ...formData,
        images: [...formData.images, data.publicUrl],
      });
    }
    setUploading(false);
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()],
      });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">
          {property ? 'Edit Property' : 'Add New Property'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_name">Villa Name *</Label>
              <Input
                id="property_name"
                value={formData.property_name}
                onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beach">Beach</SelectItem>
                  <SelectItem value="Mountain">Mountain</SelectItem>
                  <SelectItem value="Heritage">Heritage</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="no_of_bedrooms">Bedrooms (BHK) *</Label>
              <Input
                id="no_of_bedrooms"
                type="number"
                min="1"
                value={formData.no_of_bedrooms}
                onChange={(e) => setFormData({ ...formData, no_of_bedrooms: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="no_of_bathrooms">Bathrooms *</Label>
              <Input
                id="no_of_bathrooms"
                type="number"
                min="1"
                value={formData.no_of_bathrooms}
                onChange={(e) => setFormData({ ...formData, no_of_bathrooms: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekday_price">Monday to Thursday Price (₹) *</Label>
              <Input
                id="weekday_price"
                type="number"
                min="0"
                value={formData.weekday_price}
                onChange={(e) => setFormData({ ...formData, weekday_price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekend_price">Friday, Saturday & Sunday Price (₹) *</Label>
              <Input
                id="weekend_price"
                type="number"
                min="0"
                value={formData.weekend_price}
                onChange={(e) => setFormData({ ...formData, weekend_price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_guests_base_price">Price Up to (Max Guests at Base Price) *</Label>
              <Input
                id="max_guests_base_price"
                type="number"
                min="1"
                value={formData.max_guests_base_price}
                onChange={(e) => setFormData({ ...formData, max_guests_base_price: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_guests">Maximum Guests *</Label>
              <Input
                id="max_guests"
                type="number"
                min="1"
                value={formData.max_guests}
                onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra_person_cost">Extra Person Cost (₹) *</Label>
              <Input
                id="extra_person_cost"
                type="number"
                min="0"
                value={formData.extra_person_cost}
                onChange={(e) => setFormData({ ...formData, extra_person_cost: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal_charges_per_person">Meal Charges Per Person (₹) *</Label>
              <Input
                id="meal_charges_per_person"
                type="number"
                min="0"
                value={formData.meal_charges_per_person}
                onChange={(e) => setFormData({ ...formData, meal_charges_per_person: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability_status">Availability Status *</Label>
              <Select value={formData.availability_status} onValueChange={(value: any) => setFormData({ ...formData, availability_status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="flex gap-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.amenities.map((amenity, index) => (
                <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {amenity}
                  <X className="h-4 w-4 cursor-pointer" onClick={() => removeAmenity(index)} />
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                <span className="text-sm text-muted-foreground flex items-center">or</span>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL"
                />
                <Button type="button" onClick={addImageUrl}>Add URL</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Property ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Property</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
