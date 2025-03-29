import React, { useState } from 'react';
import { SearchIcon, Settings2, Menu, Calendar, Clock} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as UIDatePicker } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/app/utils/functionsUtils';

interface SidebarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    setSelectedFilter: React.Dispatch<React.SetStateAction<string[]>>;
    setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  }


export function Sidebar( { 
    searchTerm, 
    setSearchTerm, 
    setSelectedFilter,
    setStartDate, 
    setEndDate}
    : SidebarProps ){
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState('');
    const [filters, setFilters] = useState<string[]>([]);

    const handleFilterChange = (value: string) => {
        setFilters((prevFilters) => {
            const newFilters = prevFilters.includes(value)
                ? prevFilters.filter((f) => f !== value)
                : [...prevFilters, value];
    
            setSelectedFilter(newFilters);
            return newFilters;
        });
    }
    
    return(
        <div className='flex w-full flex-col z-50'>
            <aside className={`fixed inset-y-0 left-0 z-10 hidden transition-all durration-300 ${isExpanded ? 'w-62' : 'w-14'} border-r bg-gray-800 sm:flex`}>
                <nav className='flex flex-col items-end gap-4 px-2 py-5'>
                    <Button 
                        variant="ghost" 
                        className="mb-4 cursor-pointer" 
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <Menu className="h-5 w-5 text-[#F3F3F3] cursor-pointer" />
                    </Button>
                    <div className="flex flex-col gap-4 w-full px-2 mt-4">
                        <div className="flex items-center gap-2 w-full">
                            <SearchIcon className="h-5 w-5 text-[#F3F3F3] cursor-pointer" onClick={() => setIsExpanded(true)} />
                            {isExpanded && 
                                <Input 
                                    className="w-full bg-[#F3F3F3] text-[#000] cursor-pointer" 
                                    placeholder="Pesquisar..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                            }
                        </div>
                        <div className="flex items-center gap-2 w-full">
                            <Settings2 className="h-5 w-5 text-[#F3F3F3] cursor-pointer" onClick={() => setIsExpanded(true)}/>
                            {isExpanded ? (
                             <div className="w-full">
                                <div className="flex flex-col gap-2 p-6">
                                    {["operando", "parado", "manutencao"].map((option) => (
                                        <label key={option} className="flex items-center gap-2 cursor-pointer text-[#F3F3F3]">
                                            <Checkbox
                                                checked={filters.includes(option)}
                                                onCheckedChange={() => handleFilterChange(option)}
                                                className='border-[#F3F3F3] border-2'
                                            />
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            ): null}
                        </div>
                        <div className="flex items-center gap-2 w-full">
                            <Calendar className="h-5 w-5 text-[#F3F3F3] cursor-pointer " onClick={() => setIsExpanded(true)}/>
                            {isExpanded ? (
                                <div className="w-full">

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="w-full bg-[#F3F3F3] text-[#757575] cursor-pointer mb-4">
                                            {selectedDate ? `De: ${formatDate(selectedDate)}` : "Selecionar Data"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <UIDatePicker 
                                            mode="single" 
                                            selected={selectedDate} 
                                            onSelect={(date) => {
                                                setSelectedDate(date || undefined);
                                                setStartDate(date || undefined);
                                            }}  />
                                        </PopoverContent>
                                        </Popover>

                                        {/* Selecionar Data Final (opcional) */}
                                        <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="w-full bg-[#F3F3F3] text-[#757575] cursor-pointer">
                                            {selectedDate ? `Até: ${formatDate(selectedDate)}` : "Selecionar Data Final"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <UIDatePicker 
                                            mode="single"   
                                            selected={selectedDate} 
                                            onSelect={(date) => {
                                                setSelectedDate(date || undefined);
                                                setEndDate(date || undefined);  // Atualiza o estado externo
                                            }}  />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-2 w-full ">
                            <Clock className="h-5 w-5 text-[#F3F3F3] cursor-pointer" onClick={() => setIsExpanded(true)} />
                            {isExpanded ? (
                                <Select onValueChange={(value) => setSelectedTime(value)}>
                                    <SelectTrigger className="w-full bg-[#F3F3F3] text-[#000] cursor-pointer">
                                        <SelectValue placeholder="Selecionar Hora" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-[#F3F3F3]'>
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>{`${i}:00`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ): null}
                        </div>
                    </div>
                </nav>
            </aside>

            {/* <div className='sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14 z-50'>
                <header className='sticky top-8 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent'>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className='sm: hidden' >
                                <PanelBottom className='w-5 h-5'/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className='sm:max-w-x'>
                            <nav>
                                <link
                                 href='#' 
                                 className='flex h-10 w-10 bg-primary 
                                 rounded-full text-lg items-center justify-center 
                                 text-primary-foreground md:text-base gap-2'
                                 >
                                    <Settings2 className="h-5 w-5 transition-all hover:text-foreground"/>
                                    <span>logo</span>
                                </link>
                                <link
                                 href='#' 
                                 className='flex items-center gap-4 px-2.5 text-muted-foreground'
                                 >
                                    <SearchIcon className='h-5 w-5 transition-all'/>
                                    <span>pesquisar</span>
                                </link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <h2>Menu</h2>
                </header>
            </div> */}
        </div>
    )

}
