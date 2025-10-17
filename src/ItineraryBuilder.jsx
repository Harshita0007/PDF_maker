import React, { useState } from 'react';
import { generatePDF } from '../src/utils/pdfGenerator';

const ItineraryBuilder = () => {
    const [formData, setFormData] = useState({
        destination: 'Singapore',
        departureFrom: 'Mumbai',
        departureDate: '31/10/2025',
        arrivalDate: '03/11/2025',
        days: 4,
        nights: 3,
        travelers: 6,
        dailyActivities: [
            {
                day: 1,
                date: '27th November',
                title: 'Arrival In Singapore + City Exploration',
                morning: 'Arrive In Singapore. Transfer From Airport To Hotel.',
                afternoon: 'Check Into Your Hotel\nVisit Marina Bay Sands Sky Park (2-3 Hours)\nOptional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge',
                evening: 'Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'
            },
            {
                day: 2,
                date: '27th November',
                title: 'Singapore City Excursion',
                morning: 'Arrive In Singapore. Transfer From Airport To Hotel.',
                afternoon: 'Check Into Your Hotel\nVisit Marina Bay Sands Sky Park (2-3 Hours)',
                evening: 'Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'
            },
            {
                day: 3,
                date: '27th November',
                title: 'Gardens By The Bay + Marina Bay',
                morning: 'Arrive In Singapore. Transfer From Airport To Hotel.',
                afternoon: 'Check Into Your Hotel\nVisit Marina Bay Sands Sky Park (2-3 Hours)',
                evening: 'Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'
            },
            {
                day: 4,
                date: '27th November',
                title: 'Arrival In Genting And Relax',
                morning: 'Arrive In Singapore. Transfer From Airport To Hotel.',
                afternoon: 'Check Into Your Hotel\nVisit Marina Bay Sands Sky Park (2-3 Hours)',
                evening: 'Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'
            }
        ],
        flights: [
            { date: 'Thu 10 Jan\'24', airline: 'Fly Air India (AX-123)', route: 'From Delhi (DEL) To Singapore (SIN)' },
            { date: 'Thu 10 Jan\'24', airline: 'Fly Air India (AX-123)', route: 'From Delhi (DEL) To Singapore (SIN)' },
            { date: 'Thu 10 Jan\'24', airline: 'Fly Air India (AX-123)', route: 'From Delhi (DEL) To Singapore (SIN)' },
            { date: 'Thu 10 Jan\'24', airline: 'Fly Air India (AX-123)', route: 'From Delhi (DEL) To Singapore (SIN)' }
        ],
        hotels: [
            { city: 'Singapore', checkIn: '24/02/2024', checkOut: '24/02/2024', nights: 2, hotelName: 'Super TownHouse Oak Vashi Formerly Blue Diamond' },
            { city: 'Singapore', checkIn: '24/02/2024', checkOut: '24/02/2024', nights: 2, hotelName: 'Super TownHouse Oak Vashi Formerly Blue Diamond' },
            { city: 'Singapore', checkIn: '24/02/2024', checkOut: '24/02/2024', nights: 3, hotelName: 'Super TownHouse Oak Lonavala (Variant 1) Four Bedroom Villa' },
            { city: 'Singapore', checkIn: '24/02/2024', checkOut: '24/02/2024', nights: 3, hotelName: 'Super TownHouse Oak Lonavala (Variant 1) Four Bedroom Villa' }
        ],
        importantNotes: [
            { point: 'Airlines Standard Policy', details: 'In Case Of Visa Rejection, Visa Fees Or Any After Non-Cancellable Component Cannot Be Reimbursed At Any Cost.' },
            { point: 'Flight/Hotel Cancellation', details: 'In Case Of Visa Rejection, Visa Fees Or Any After Non-Cancellable Component Cannot Be Reimbursed At Any Cost.' }
        ],
        scopeOfService: [
            { service: 'Flight Tickets and Hotel Vouchers', details: 'Delivered 3 Days Post Full Payment' },
            { service: 'Web Check-In', details: 'Boarding Pass Delivery Via Email/WhatsApp' },
            { service: 'Support', details: 'Chat Support - Response Time: 6 Hours' },
            { service: 'Complimentary Support', details: 'Provided' },
            { service: 'Trip Support', details: 'Response Time: 5 Minutes' }
        ],
        inclusionSummary: [
            { category: 'Flight', count: 2, details: 'All Flights Mentioned', status: 'Awaiting Confirmation' },
            { category: 'Airport Tax', count: 2, details: 'View Singapore Outbound Training. Returns Outward Onward Economy Flight For Melbourne', status: 'Awaiting Confirmation' },
            { category: 'Hotel', count: 2, details: 'Hotel stays included', status: 'Included' }
        ],
        activities: [
            { city: 'Rio De Janeiro', activity: 'Sydney Harbour Cruise & Taronga Zoo', type: 'Nature/Sightseeing', timeRequired: '2-3 Hours' },
            { city: 'Rio De Janeiro', activity: 'Sydney Harbour Cruise & Taronga Zoo', type: 'Airlines/Standard', timeRequired: '2-3 Hours' },
            { city: 'Rio De Janeiro', activity: 'Sydney Harbour Cruise & Taronga Zoo', type: 'Airlines/Standard', timeRequired: '2-3 Hours' },
            { city: 'Rio De Janeiro', activity: 'Sydney Harbour Cruise & Taronga Zoo', type: 'Airlines/Standard', timeRequired: '2-3 Hours' }
        ],
        totalAmount: 900000,
        tcsCollected: false,
        installments: [
            { installment: 1, amount: 450000, dueDate: 'Initial Payment' },
            { installment: 2, amount: 400000, dueDate: 'Post Visa Approval' },
            { installment: 3, amount: 'Remaining', dueDate: '20 Days Before Departure' }
        ],
        visaType: '123456',
        visaValidity: '123456',
        visaProcessingDate: '123456'
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDayActivityChange = (dayIndex, field, value) => {
        const newActivities = [...formData.dailyActivities];
        newActivities[dayIndex][field] = value;
        setFormData(prev => ({ ...prev, dailyActivities: newActivities }));
    };

    const handleFlightChange = (flightIndex, field, value) => {
        const newFlights = [...formData.flights];
        newFlights[flightIndex][field] = value;
        setFormData(prev => ({ ...prev, flights: newFlights }));
    };

    const handleHotelChange = (hotelIndex, field, value) => {
        const newHotels = [...formData.hotels];
        newHotels[hotelIndex][field] = value;
        setFormData(prev => ({ ...prev, hotels: newHotels }));
    };

    const addDay = () => {
        setFormData(prev => ({
            ...prev,
            dailyActivities: [
                ...prev.dailyActivities,
                {
                    day: prev.dailyActivities.length + 1,
                    date: '',
                    title: '',
                    morning: '',
                    afternoon: '',
                    evening: ''
                }
            ]
        }));
    };

    const removeDay = (dayIndex) => {
        const newActivities = formData.dailyActivities.filter((_, index) => index !== dayIndex);
        setFormData(prev => ({ ...prev, dailyActivities: newActivities }));
    };

    const addFlight = () => {
        setFormData(prev => ({
            ...prev,
            flights: [
                ...prev.flights,
                { date: '', airline: '', route: '' }
            ]
        }));
    };

    const removeFlight = (flightIndex) => {
        const newFlights = formData.flights.filter((_, index) => index !== flightIndex);
        setFormData(prev => ({ ...prev, flights: newFlights }));
    };

    const addHotel = () => {
        setFormData(prev => ({
            ...prev,
            hotels: [
                ...prev.hotels,
                { city: '', checkIn: '', checkOut: '', nights: 0, hotelName: '' }
            ]
        }));
    };

    const removeHotel = (hotelIndex) => {
        const newHotels = formData.hotels.filter((_, index) => index !== hotelIndex);
        setFormData(prev => ({ ...prev, hotels: newHotels }));
    };

    const handleGeneratePDF = () => {
        generatePDF(formData);
    };

    return (
        <div className="container">
            <div className="gradient-header">
                <h1>Vigovia Itinerary Builder</h1>
                <p>Create your perfect travel plan</p>
            </div>

            {/* Trip Details Section */}
            <div className="section-card">
                <h2 className="section-title">Trip Details</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Destination</label>
                        <input
                            type="text"
                            value={formData.destination}
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Departure From</label>
                        <input
                            type="text"
                            value={formData.departureFrom}
                            onChange={(e) => handleInputChange('departureFrom', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Departure Date</label>
                        <input
                            type="text"
                            value={formData.departureDate}
                            onChange={(e) => handleInputChange('departureDate', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Arrival Date</label>
                        <input
                            type="text"
                            value={formData.arrivalDate}
                            onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Days</label>
                        <input
                            type="number"
                            value={formData.days}
                            onChange={(e) => handleInputChange('days', parseInt(e.target.value))}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nights</label>
                        <input
                            type="number"
                            value={formData.nights}
                            onChange={(e) => handleInputChange('nights', parseInt(e.target.value))}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Number of Travelers</label>
                        <input
                            type="number"
                            value={formData.travelers}
                            onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                            className="form-input"
                        />
                    </div>
                </div>
            </div>

            {/* Daily Activities Section */}
            <div className="section-card">
                <h2 className="section-title">Daily Activities</h2>
                {formData.dailyActivities.map((day, index) => (
                    <div key={index} className="day-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="day-title">Day {day.day}</h3>
                            {formData.dailyActivities.length > 1 && (
                                <button onClick={() => removeDay(index)} className="btn btn-red">
                                    Remove Day
                                </button>
                            )}
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="text"
                                    value={day.date}
                                    onChange={(e) => handleDayActivityChange(index, 'date', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    value={day.title}
                                    onChange={(e) => handleDayActivityChange(index, 'title', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Morning Activities</label>
                            <textarea
                                value={day.morning}
                                onChange={(e) => handleDayActivityChange(index, 'morning', e.target.value)}
                                rows="2"
                                className="form-textarea"
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Afternoon Activities</label>
                            <textarea
                                value={day.afternoon}
                                onChange={(e) => handleDayActivityChange(index, 'afternoon', e.target.value)}
                                rows="3"
                                className="form-textarea"
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Evening Activities</label>
                            <textarea
                                value={day.evening}
                                onChange={(e) => handleDayActivityChange(index, 'evening', e.target.value)}
                                rows="2"
                                className="form-textarea"
                            />
                        </div>
                    </div>
                ))}
                <button onClick={addDay} className="btn btn-blue">
                    Add Another Day
                </button>
            </div>

            {/* Flights Section */}
            <div className="section-card">
                <h2 className="section-title">Flights</h2>
                {formData.flights.map((flight, index) => (
                    <div key={index} className="day-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="day-title">Flight {index + 1}</h3>
                            {formData.flights.length > 1 && (
                                <button onClick={() => removeFlight(index)} className="btn btn-red">
                                    Remove Flight
                                </button>
                            )}
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="text"
                                    value={flight.date}
                                    onChange={(e) => handleFlightChange(index, 'date', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Airline</label>
                                <input
                                    type="text"
                                    value={flight.airline}
                                    onChange={(e) => handleFlightChange(index, 'airline', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Route</label>
                                <input
                                    type="text"
                                    value={flight.route}
                                    onChange={(e) => handleFlightChange(index, 'route', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={addFlight} className="btn btn-blue">
                    Add Another Flight
                </button>
            </div>

            {/* Hotels Section */}
            <div className="section-card">
                <h2 className="section-title">Hotels</h2>
                {formData.hotels.map((hotel, index) => (
                    <div key={index} className="day-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="day-title">Hotel {index + 1}</h3>
                            {formData.hotels.length > 1 && (
                                <button onClick={() => removeHotel(index)} className="btn btn-red">
                                    Remove Hotel
                                </button>
                            )}
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    value={hotel.city}
                                    onChange={(e) => handleHotelChange(index, 'city', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Check In</label>
                                <input
                                    type="text"
                                    value={hotel.checkIn}
                                    onChange={(e) => handleHotelChange(index, 'checkIn', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Check Out</label>
                                <input
                                    type="text"
                                    value={hotel.checkOut}
                                    onChange={(e) => handleHotelChange(index, 'checkOut', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nights</label>
                                <input
                                    type="number"
                                    value={hotel.nights}
                                    onChange={(e) => handleHotelChange(index, 'nights', parseInt(e.target.value))}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">Hotel Name</label>
                                <input
                                    type="text"
                                    value={hotel.hotelName}
                                    onChange={(e) => handleHotelChange(index, 'hotelName', e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <button onClick={addHotel} className="btn btn-blue">
                    Add Another Hotel
                </button>
            </div>

            {/* Payment Details */}
            <div className="section-card">
                <h2 className="section-title">Payment Details</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Total Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.totalAmount}
                            onChange={(e) => handleInputChange('totalAmount', parseInt(e.target.value))}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">TCS Collected</label>
                        <select
                            value={formData.tcsCollected}
                            onChange={(e) => handleInputChange('tcsCollected', e.target.value === 'true')}
                            className="form-input"
                        >
                            <option value="false">Not Collected</option>
                            <option value="true">Collected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Visa Details */}
            <div className="section-card">
                <h2 className="section-title">Visa Details</h2>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Visa Type</label>
                        <input
                            type="text"
                            value={formData.visaType}
                            onChange={(e) => handleInputChange('visaType', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Validity</label>
                        <input
                            type="text"
                            value={formData.visaValidity}
                            onChange={(e) => handleInputChange('visaValidity', e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Processing Date</label>
                        <input
                            type="text"
                            value={formData.visaProcessingDate}
                            onChange={(e) => handleInputChange('visaProcessingDate', e.target.value)}
                            className="form-input"
                        />
                    </div>
                </div>
            </div>

            {/* Generate PDF Button */}
            <div className="center-btn">
                <button onClick={handleGeneratePDF} className="btn btn-purple">
                    Generate Itinerary PDF
                </button>
            </div>
        </div>
    );
};

export default ItineraryBuilder;