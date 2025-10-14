import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { MapPin, CalendarIcon, Users, Search, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    params.set("adults", adults.toString());
    params.set("children", children.toString());
    
    navigate(`/properties?${params.toString()}`);
  };

  const totalGuests = adults + children;

  return (
    <div className="bg-white rounded-full shadow-lg border border-border max-w-4xl mx-auto">
      <div className="flex items-center divide-x divide-border">
        {/* Location */}
        <div className="flex items-center gap-3 px-6 py-4 flex-1 min-w-0">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
        </div>

        {/* Check-in - Check-out */}
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-6 py-4 flex-1 min-w-0 text-left hover:bg-accent/50 transition-colors">
              <CalendarIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className={cn("text-base", !checkIn && !checkOut && "text-muted-foreground")}>
                {checkIn && checkOut
                  ? `${format(checkIn, "MMM dd")} - ${format(checkOut, "MMM dd")}`
                  : "Check-in - Check-out"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Check-in</p>
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Check-out</p>
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => {
                    setCheckOut(date);
                    if (date) setShowDatePicker(false);
                  }}
                  disabled={(date) => !checkIn || date <= checkIn}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover open={showGuestPicker} onOpenChange={setShowGuestPicker}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-6 py-4 flex-1 min-w-0 text-left hover:bg-accent/50 transition-colors">
              <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-base">
                {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Adults</p>
                  <p className="text-sm text-muted-foreground">Ages 13+</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="h-8 w-8 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdults(adults + 1)}
                    className="h-8 w-8 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Children</p>
                  <p className="text-sm text-muted-foreground">Ages 0-12</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="h-8 w-8 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setChildren(children + 1)}
                    className="h-8 w-8 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <div className="p-2">
          <Button 
            onClick={handleSearch}
            size="icon"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
