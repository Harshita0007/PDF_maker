import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (formData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Color scheme matching Vigovia branding
  const primaryPurple = [74, 20, 140];
  const gradientBlue = [91, 159, 237];

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Header with gradient background
  doc.setFillColor(...gradientBlue);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Vigovia logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('vigovia', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('PLAN.PACK.GO!', pageWidth / 2, 22, { align: 'center' });

  // Trip title box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, 30, pageWidth - 40, 20, 3, 3, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Hi, Rahul!`, pageWidth / 2, 38, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${formData.destination} Itinerary`, pageWidth / 2, 46, { align: 'center' });
  
  yPosition = 60;

  // Trip details section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.days} Days ${formData.nights} Nights`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Departure info
  doc.setFontSize(9);
  doc.text(`Departure From: ${formData.departureFrom}`, 20, yPosition);
  doc.text(`Departure: ${formData.departureDate}`, 80, yPosition);
  doc.text(`Arrival: ${formData.arrivalDate}`, 135, yPosition);
  doc.text(`Destination: ${formData.destination}`, 20, yPosition + 6);
  doc.text(`No. of Travelers: ${formData.travelers}`, 80, yPosition + 6);
  
  yPosition += 20;

  // Daily activities
  formData.dailyActivities.forEach((day, index) => {
    checkPageBreak(60);

    // Day header with purple background
    doc.setFillColor(...primaryPurple);
    doc.roundedRect(15, yPosition, 15, 50, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    // Save the current transform
    doc.saveGraphicsState();
    doc.text(`Day ${day.day}`, 22.5, yPosition + 25, { align: 'center', angle: 90 });
    doc.restoreGraphicsState();

    // Day content
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(32, yPosition, pageWidth - 47, 50, 2, 2, 'F');

    // Image placeholder (circular)
    doc.setFillColor(200, 200, 200);
    doc.circle(50, yPosition + 25, 15, 'F');

    // Date and title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(day.date, 70, yPosition + 8);
    doc.setFontSize(9);
    const titleLines = doc.splitTextToSize(day.title, pageWidth - 85);
    doc.text(titleLines[0], 70, yPosition + 14);

    // Activities timeline
    const activities = [
      { time: 'Morning', content: day.morning },
      { time: 'Afternoon', content: day.afternoon },
      { time: 'Evening', content: day.evening }
    ];

    let activityY = yPosition + 20;
    doc.setFontSize(8);
    activities.forEach(activity => {
      if (activity.content && activityY < yPosition + 48) {
        doc.setFont('helvetica', 'bold');
        doc.text(activity.time, 70, activityY);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(activity.content, pageWidth - 95);
        doc.text(lines.slice(0, 2), 95, activityY);
        activityY += 8;
      }
    });

    yPosition += 58;
  });

  // Flight Summary
  checkPageBreak(40);
  yPosition += 5;
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Flight Summary', 22, yPosition + 5.5);
  yPosition += 12;

  formData.flights.forEach(flight => {
    checkPageBreak(12);
    doc.setFillColor(250, 250, 250);
    doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(flight.date, 25, yPosition + 6);
    doc.setFont('helvetica', 'bold');
    doc.text(flight.airline, 80, yPosition + 6);
    doc.setFont('helvetica', 'normal');
    const routeText = doc.splitTextToSize(flight.route, 60);
    doc.text(routeText[0], 130, yPosition + 6);
    yPosition += 12;
  });

  // Hotel Bookings
  checkPageBreak(40);
  yPosition += 5;
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Hotel Bookings', 22, yPosition + 5.5);
  yPosition += 12;

  // Hotel table using autoTable
  doc.autoTable({
    startY: yPosition,
    head: [['City', 'Check In', 'Check Out', 'Nights', 'Hotel Name']],
    body: formData.hotels.map(hotel => [
      hotel.city,
      hotel.checkIn,
      hotel.checkOut,
      hotel.nights.toString(),
      hotel.hotelName
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryPurple,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Important Notes
  checkPageBreak(40);
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Important Notes', 22, yPosition + 5.5);
  yPosition += 12;

  doc.autoTable({
    startY: yPosition,
    head: [['Point', 'Details']],
    body: formData.importantNotes.map(note => [note.point, note.details]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryPurple,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    margin: { left: 20, right: 20 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Scope of Service
  checkPageBreak(40);
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Scope of Service', 22, yPosition + 5.5);
  yPosition += 12;

  doc.autoTable({
    startY: yPosition,
    head: [['Service', 'Details']],
    body: formData.scopeOfService.map(service => [service.service, service.details]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryPurple,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Inclusion Summary
  checkPageBreak(40);
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Inclusion Summary', 22, yPosition + 5.5);
  yPosition += 12;

  doc.autoTable({
    startY: yPosition,
    head: [['Category', 'Count', 'Details', 'Status/Comments']],
    body: formData.inclusionSummary.map(item => [
      item.category,
      item.count.toString(),
      item.details,
      item.status
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryPurple,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Activity Table
  checkPageBreak(40);
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Activity Table', 22, yPosition + 5.5);
  yPosition += 12;

  doc.autoTable({
    startY: yPosition,
    head: [['City', 'Activity', 'Type', 'Time Required']],
    body: formData.activities.map(activity => [
      activity.city,
      activity.activity,
      activity.type,
      activity.timeRequired
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryPurple,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Terms and Conditions link
  checkPageBreak(15);
  doc.setFontSize(9);
  doc.setTextColor(47, 128, 237);
  doc.setFont('helvetica', 'normal');
  doc.text('View all terms and conditions', 20, yPosition);
  yPosition += 10;

  // Payment Plan
  checkPageBreak(40);
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Payment Plan', 22, yPosition + 5.5);
  yPosition += 12;

  // Total Amount
  doc.setFillColor(250, 250, 250);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount', 25, yPosition + 6);
  doc.text(`₹${formData.totalAmount.toLocaleString('en-IN')} For 3 Pax (Inclusive Of GST)`, pageWidth - 25, yPosition + 6, { align: 'right' });
  yPosition += 12;

  // TCS
  doc.setFillColor(250, 250, 250);
  doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
  doc.setFont('helvetica', 'normal');
  doc.text('TCS', 25, yPosition + 6);
  doc.text(formData.tcsCollected ? 'Collected' : 'Not Collected', pageWidth - 25, yPosition + 6, { align: 'right' });
  yPosition += 12;

  // Installments
  doc.autoTable({
    startY: yPosition,
    head: [['Installment', 'Amount', 'Due Date']],
    body: formData.installments.map(inst => [
      `Installment ${inst.installment}`,
      typeof inst.amount === 'number' ? `₹${inst.amount.toLocaleString('en-IN')}` : inst.amount,
      inst.dueDate
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryPurple,
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    margin: { left: 20, right: 20 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Visa Details
  checkPageBreak(25);
  doc.setFillColor(...primaryPurple);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
  doc.text('Visa Details', 22, yPosition + 5.5);
  yPosition += 12;

  doc.setFillColor(250, 250, 250);
  doc.rect(20, yPosition, pageWidth - 40, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Visa Type: ${formData.visaType}`, 25, yPosition + 5);
  doc.text(`Validity: ${formData.visaValidity}`, 90, yPosition + 5);
  doc.text(`Processing Date: ${formData.visaProcessingDate}`, 25, yPosition + 11);
  yPosition += 20;

  // Final Call to Action
  checkPageBreak(20);
  doc.setFillColor(...gradientBlue);
  doc.roundedRect(20, yPosition, pageWidth - 40, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PLAN.PACK.GO!', pageWidth / 2, yPosition + 10, { align: 'center' });

  // Footer on every page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    // Company info
    doc.text('Vigovia Tech Pvt. Ltd', 20, pageHeight - 10);
    doc.text('Phone: +91-9504061112', 20, pageHeight - 6);
    
    doc.text('Registered Office: 1st/109 Omdalar Hills,', pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Lillis Business Park, Karnataka, India.', pageWidth / 2, pageHeight - 6, { align: 'center' });
    
    doc.text('Email ID: Ukarsh@Vigovia.Com', pageWidth - 20, pageHeight - 10, { align: 'right' });
    doc.text('CIN: U79110KA2024PTC191810', pageWidth - 20, pageHeight - 6, { align: 'right' });
  }

  // Save the PDF
  doc.save(`Vigovia_Itinerary_${formData.destination}_${new Date().getTime()}.pdf`);
};