import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, CalendarIcon, Users, Search, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  useEffect(() => {
    fetchLocationsFromGoogleSheet();
  }, []);

  const fetchLocationsFromGoogleSheet = async () => {
    try {
      // Published Google Sheet ID - same as Properties page
      const sheetId = "2PACX-1vT12tHyrXjuP1h8xA_IntzhinKDZXqJSq5J8CmjAuJ2zDvZHfYSY9xh5PWxuObUHWnCgV-4IncGW8Z5";
      const gid = "870502534";
      
      // Using CSV export for published sheets
      const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${gid}&single=true&output=csv`;
      
      const response = await fetch(url);
      const csvText = await response.text();
      
      // Parse CSV to get unique locations
      const lines = csvText.split('\n');
      const uniqueLocations = new Set<string>();
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim().replace(/^"|"$/g, ''));
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        
        const locationValue = values[2];
        if (locationValue && locationValue.trim()) {
          uniqueLocations.add(locationValue.trim());
        }
      }
      
      setLocations(Array.from(uniqueLocations).sort());
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([
        "Goa",
        "Manali",
        "Udaipur",
        "Shimla",
        "Ooty",
        "Rishikesh",
        "Coorg",
        "Lonavala",
        "Kasauli",
        "Nainital"
      ]);
    }
  };

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
    <div className="bg-white rounded-3xl md:rounded-full shadow-lg border border-border max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:divide-x divide-border">
        {/* Location */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 flex-1 min-w-0 border-b md:border-b-0 border-border">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 focus:ring-offset-0 text-sm md:text-base">
              <SelectValue placeholder="Search Location" />
            </SelectTrigger>
            {/* Scrollbar always visible */}
            <SelectContent className="max-h-48 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Check-in - Check-out */}
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 flex-1 min-w-0 text-left hover:bg-accent/50 transition-colors border-b md:border-b-0 border-border">
              <CalendarIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className={cn("text-sm md:text-base", !checkIn && !checkOut && "text-muted-foreground")}>
                {checkIn && checkOut
                  ? `${format(checkIn, "MMM dd")} - ${format(checkOut, "MMM dd")}`
                  : "Check-in - Check-out"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <p className="text-sm font-medium mb-2">
                {!checkIn ? "Select Check-in Date" : !checkOut ? "Select Check-out Date" : "Dates Selected"}
              </p>
              <Calendar
                mode="single"
                selected={!checkIn ? checkIn : checkOut}
                onSelect={(date) => {
                  if (!checkIn) {
                    setCheckIn(date);
                  } else if (!checkOut) {
                    setCheckOut(date);
                    setShowDatePicker(false);
                  }
                }}
                disabled={(date) => {
                  if (!checkIn) {
                    return date < new Date();
                  }
                  return date <= checkIn;
                }}
                className="pointer-events-auto"
              />
              {checkIn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCheckIn(undefined);
                    setCheckOut(undefined);
                  }}
                  className="w-full mt-2"
                >
                  Reset Dates
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover open={showGuestPicker} onOpenChange={setShowGuestPicker}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 flex-1 min-w-0 text-left hover:bg-accent/50 transition-colors border-b md:border-b-0 border-border">
              <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm md:text-base">
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
        <div className="p-3 md:p-2">
          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto h-10 md:h-12 md:rounded-full rounded-lg bg-primary hover:bg-primary/90"
          >
            <Search className="h-5 w-5 md:mr-0 mr-2" />
            <span className="md:hidden">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
