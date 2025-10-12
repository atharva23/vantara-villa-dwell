import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Users, Baby } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    params.set("adults", adults.toString());
    params.set("children", children.toString());
    
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Check-in Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => !checkIn || date <= checkIn}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Adults */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Adults</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="h-10 w-10"
            >
              -
            </Button>
            <div className="flex-1 flex items-center justify-center gap-2 h-10 border border-input rounded-md bg-background">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{adults}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAdults(adults + 1)}
              className="h-10 w-10"
            >
              +
            </Button>
          </div>
        </div>

        {/* Children */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Children</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="h-10 w-10"
            >
              -
            </Button>
            <div className="flex-1 flex items-center justify-center gap-2 h-10 border border-input rounded-md bg-background">
              <Baby className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{children}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setChildren(children + 1)}
              className="h-10 w-10"
            >
              +
            </Button>
          </div>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="w-full h-10 bg-primary hover:bg-primary/90"
        >
          Search Villas
        </Button>
      </div>
    </div>
  );
};
