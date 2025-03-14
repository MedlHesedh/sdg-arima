import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Bath, Bed, BedDouble, CarFront } from 'lucide-react'

function FilterSection({ setBathCount, setBedCount, setParkingCount, setHomeType }) {
    return (
        <div className='px-3 py-2 grid grid-cols-2 
    md:flex gap-2'>
            <Select onValueChange={setBedCount}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bed" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2">
                        <h2 className='flex gap-2'>
                            <BedDouble className='h-5 w-5 text-primary' /> 2+</h2>
                    </SelectItem>
                    <SelectItem value="3">
                        <h2 className='flex gap-2'>
                            <BedDouble className='h-5 w-5 text-primary' /> 3+</h2>
                    </SelectItem>
                    <SelectItem value="4">
                        <h2 className='flex gap-2'>
                            <BedDouble className='h-5 w-5 text-primary' /> 4+</h2>
                    </SelectItem>
                    <SelectItem value="5">
                        <h2 className='flex gap-2'>
                            <BedDouble className='h-5 w-5 text-primary' /> 5+</h2>
                    </SelectItem>


                </SelectContent>
            </Select>

            <Select onValueChange={setBathCount}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bath" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2">
                        <h2 className='flex gap-2'>
                            <Bath className='h-5 w-5 text-primary' /> 2+</h2>
                    </SelectItem>
                    <SelectItem value="3">
                        <h2 className='flex gap-2'>
                            <Bath className='h-5 w-5 text-primary' /> 3+</h2>
                    </SelectItem>
                    <SelectItem value="4">
                        <h2 className='flex gap-2'>
                            <Bath className='h-5 w-5 text-primary' /> 4+</h2>
                    </SelectItem>
                    <SelectItem value="5">
                        <h2 className='flex gap-2'>
                            <Bath className='h-5 w-5 text-primary' /> 5+</h2>
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={setParkingCount}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Parking" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1+">
                        <h2 className='flex gap-2'>
                            <CarFront className='h-5 w-5 text-primary' /> 1+</h2>
                    </SelectItem>
                    <SelectItem value="2">
                        <h2 className='flex gap-2'>
                            <CarFront className='h-5 w-5 text-primary' /> 2+</h2>
                    </SelectItem>
                    <SelectItem value="3">
                        <h2 className='flex gap-2'>
                            <CarFront className='h-5 w-5 text-primary' /> 3+</h2>
                    </SelectItem>


                </SelectContent>
            </Select>
            <Select onValueChange={(value) => value == 'All' ?
                setHomeType(null) : setHomeType(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Home Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">
                        All
                    </SelectItem>
                    <SelectItem value="detached">Detached House</SelectItem>
                    <SelectItem value="bungalow">Bungalow</SelectItem>
                    <SelectItem value="cottage">Cottage</SelectItem>
                    <SelectItem value="ranch">Ranch-Style House</SelectItem>
                    <SelectItem value="split-level">Split-Level House</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="triplex">Triplex</SelectItem>
                    <SelectItem value="fourplex">Fourplex</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="row-house">Row House</SelectItem>
                    <SelectItem value="condo">Condominium (Condo)</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="studio">Studio Apartment</SelectItem>
                    <SelectItem value="mansion">Mansion</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="estate">Estate Home</SelectItem>
                    <SelectItem value="chateau">Chateau</SelectItem>
                    <SelectItem value="tiny-house">Tiny House</SelectItem>
                    <SelectItem value="modular">Modular Home</SelectItem>
                    <SelectItem value="container">Container Home</SelectItem>
                    <SelectItem value="earth-sheltered">Earth-Sheltered Home</SelectItem>
                    <SelectItem value="dome">Dome Home</SelectItem>


                </SelectContent>
            </Select>

        </div>
    )
}

export default FilterSection