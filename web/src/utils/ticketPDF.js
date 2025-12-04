import jsPDF from 'jspdf';

/**
 * Generate and download a PDF e-ticket for a booking
 */
export const downloadTicketPDF = async (booking) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Parse QR data if it's JSON
  let qrData = {};
  try {
    if (booking.qrCodeText && booking.qrCodeText.startsWith('{')) {
      qrData = JSON.parse(booking.qrCodeText);
    }
  } catch (e) {
    // Use booking data directly if QR is not JSON
  }

  // Colors
  const primaryColor = [21, 93, 252];
  const darkColor = [15, 23, 42];
  const grayColor = [100, 116, 139];
  const lightGray = [241, 245, 249];
  const white = [255, 255, 255];

  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BusMate', 20, 18);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('E-Ticket / Boarding Pass', 20, 30);

  // Booking ID badge
  const bookingId = qrData.bookingId || `BM-${String(booking.id).padStart(6, '0')}`;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - 70, 8, 55, 24, 3, 3, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(bookingId, pageWidth - 42, 17, { align: 'center' });

  // Status badge
  const status = qrData.status || booking.status || 'CONFIRMED';
  if (status === 'CONFIRMED') {
    doc.setFillColor(34, 197, 94);
  } else if (status === 'PENDING') {
    doc.setFillColor(234, 179, 8);
  } else {
    doc.setFillColor(239, 68, 68);
  }
  doc.roundedRect(pageWidth - 65, 23, 45, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.text(status, pageWidth - 42, 29, { align: 'center' });

  // Route section
  let yPos = 50;
  doc.setFillColor(...lightGray);
  doc.roundedRect(15, yPos, pageWidth - 30, 30, 3, 3, 'F');
  
  const origin = qrData.origin || booking.schedule?.route?.origin || 'Origin';
  const destination = qrData.destination || booking.schedule?.route?.destination || 'Destination';
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('FROM', 25, yPos + 10);
  doc.text('TO', pageWidth / 2 + 15, yPos + 10);
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(origin, 25, yPos + 22);
  doc.text(destination, pageWidth / 2 + 15, yPos + 22);
  
  // Simple text arrow
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);

  yPos += 40;

  // Travel details grid
  const details = [
    { label: 'TRAVEL DATE', value: qrData.travelDate || booking.schedule?.travelDate || '-' },
    { label: 'DEPARTURE', value: qrData.departureTime || booking.schedule?.departureTime || '-' },
    { label: 'ARRIVAL', value: qrData.arrivalTime || booking.schedule?.arrivalTime || '-' },
    { label: 'BUS NUMBER', value: qrData.busNumber || booking.schedule?.bus?.busNumber || '-' },
    { label: 'BUS TYPE', value: qrData.busType || booking.schedule?.bus?.busType?.name || '-' },
    { label: 'PLATE NUMBER', value: qrData.plateNumber || booking.schedule?.bus?.plateNo || '-' },
  ];

  const colWidth = (pageWidth - 40) / 3;
  details.forEach((detail, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const xPos = 20 + (col * colWidth);
    const detailYPos = yPos + (row * 22);
    
    doc.setTextColor(...grayColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(detail.label, xPos, detailYPos);
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(String(detail.value), xPos, detailYPos + 8);
  });

  yPos += 50;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Passenger and seat info
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('PASSENGER NAME', 20, yPos);
  doc.text('SEAT(S)', pageWidth / 2 - 10, yPos);

  yPos += 8;
  
  const passengerName = qrData.passenger || booking.user?.name || 'Passenger';
  const seats = qrData.seats || booking.bookingSeats?.map(s => s.seatNumber).join(', ') || '-';
  const amount = qrData.amount || `PHP ${booking.amount?.toFixed(2)}` || '-';
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(passengerName, 20, yPos);
  doc.text(seats, pageWidth / 2 - 10, yPos);

  yPos += 10;

  // Dashed divider
  doc.setDrawColor(180, 180, 180);
  doc.setLineDashPattern([3, 3], 0);
  doc.line(20, yPos, pageWidth - 20, yPos);
  doc.setLineDashPattern([], 0);
  
  yPos += 8;

  // QR Code Section
  const qrCodeText = booking.qrCodeText || bookingId;
  const qrSize = 50;
  const qrX = 45;
  
  // QR Code background
  doc.setFillColor(...lightGray);
  doc.roundedRect(qrX - 8, yPos, qrSize + 16, qrSize + 20, 4, 4, 'F');

  // Load and embed QR code image
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(qrCodeText)}`;
    
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    
    doc.addImage(base64, 'PNG', qrX, yPos + 4, qrSize, qrSize);
  } catch (error) {
    console.error('Failed to load QR code:', error);
    doc.setFillColor(...white);
    doc.rect(qrX, yPos + 4, qrSize, qrSize, 'F');
    doc.setDrawColor(...grayColor);
    doc.rect(qrX, yPos + 4, qrSize, qrSize, 'S');
    doc.setTextColor(...grayColor);
    doc.setFontSize(8);
    doc.text('QR Code', qrX + qrSize / 2, yPos + qrSize / 2 + 4, { align: 'center' });
  }
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text('Scan for verification', qrX + qrSize / 2, yPos + qrSize + 14, { align: 'center' });
  
  // Total Amount to the right of QR
  const amountX = qrX + qrSize + 30;
  const amountY = yPos + 20;
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL AMOUNT', amountX, amountY);
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(amount, amountX, amountY + 12);

  // Verification code
  if (qrData.verificationCode) {
    yPos += qrSize + 28;
    doc.setTextColor(...grayColor);
    doc.setFontSize(8);
    doc.text('Verification Code:', pageWidth / 2 - 20, yPos);
    doc.setTextColor(...darkColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(qrData.verificationCode, pageWidth / 2 + 5, yPos);
  }

  // Footer
  yPos = 255;
  
  doc.setFillColor(...lightGray);
  doc.rect(0, yPos, pageWidth, 42, 'F');
  
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Important Information:', 20, yPos + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.setFontSize(7);
  const notices = [
    '- Please arrive at the terminal at least 30 minutes before departure.',
    '- Bring a valid government-issued ID for verification.',
    '- This e-ticket is non-transferable.',
    '- For cancellations, please contact support at least 24 hours before departure.',
  ];
  notices.forEach((notice, index) => {
    doc.text(notice, 20, yPos + 18 + (index * 6));
  });

  // Save
  const fileName = `BusMate-Ticket-${bookingId}.pdf`;
  doc.save(fileName);
};

export default downloadTicketPDF;