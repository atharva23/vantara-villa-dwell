import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Property } from '@/pages/Admin';

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

export default function PropertyList({ properties, loading, onEdit, onDelete }: PropertyListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No properties found. Add your first property to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <div className="aspect-video relative">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.property_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                No Image
              </div>
            )}
            {property.featured && (
              <Badge className="absolute top-2 right-2">Featured</Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-serif text-xl mb-2">{property.property_name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{property.category}</Badge>
              <Badge variant={property.published ? 'default' : 'secondary'}>
                {property.published ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="outline">{property.availability_status}</Badge>
            </div>
            <div className="space-y-1 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">BHK:</span>
                <span className="font-medium">{property.no_of_bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weekday:</span>
                <span className="font-medium">₹{property.weekday_price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weekend:</span>
                <span className="font-medium">₹{property.weekend_price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Guests:</span>
                <span className="font-medium">{property.max_guests}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(property)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => property.id && onDelete(property.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
