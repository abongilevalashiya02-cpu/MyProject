import emailjs from '@emailjs/browser';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { appConfig } from '@/config/environment';
import '@/utils/emailConfig'; // Initialize EmailJS configuration

interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

interface EmailData {
  to_email: string;
  to_name: string;
  from_name: string;
  subject: string;
  message: string;
  [key: string]: string | number | boolean;
}

interface QuotationData {
  id: string;
  venue_name: string;
  retreat_goal: string;
  attendee_count: string;
  preferred_dates: string;
  contact_name: string;
  contact_email: string;
  special_requests?: string;
  status: string;
  // Enhanced data for comprehensive footer
  quotation_number?: string;
  created_at?: string;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  valid_until?: string;
  discount_amount?: number;
  // ESG & BEE data
  esg_commitments?: string[];
  bee_level?: string;
  bee_certificate_number?: string;
  bee_valid_until?: string;
  // Notes and event details
  quote_notes?: string;
  internal_notes?: string;
  client_notes?: string;
  event_type?: string;
  event_date?: string;
  event_venue?: string;
  estimated_pax?: number;
  // Vendor/client profile data
  vendor_profile?: {
    esg_certified?: boolean;
    bee_level?: string;
    certifications?: string[];
  };
  client_profile?: {
    company_name?: string;
    industry?: string;
  };
}

interface BookingData {
  id: string;
  user: {
    email: string;
    fullName: string;
  };
  experience: {
    title: string;
    type: string;
    location: {
      city: string;
      country: string;
    };
  };
  preferredDate: string;
  participantCount: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
}

interface QuotationEmailData extends EmailData {
  quotation_id: string;
  venue_name: string;
  retreat_goal: string;
  attendee_count: string;
  preferred_dates: string;
  contact_name: string;
  special_requests?: string;
  status?: string;
}

class EmailService {
  private config: EmailConfig;
  private initialized: boolean = false;

  constructor() {
    this.config = {
      serviceId: appConfig.integrations.emailJs.serviceId,
      templateId: appConfig.integrations.emailJs.templateId,
      publicKey: appConfig.integrations.emailJs.publicKey
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      emailjs.init(this.config.publicKey);
      this.initialized = true;
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      throw new Error('Email service initialization failed');
    }
  }

  async sendEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      await this.initialize();

      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        data
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'Email sent successfully'
        };
      } else {
        throw new Error(`Email service returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }

  async sendQuotationConfirmation(data: QuotationEmailData): Promise<{ success: boolean; message: string }> {
    const emailData: EmailData = {
      ...data,
      subject: `Quotation Request Confirmation - ${data.venue_name}`,
      message: this.generateQuotationConfirmationTemplate(data)
    };

    return this.sendEmail(emailData);
  }

  async sendQuotationUpdate(data: QuotationEmailData & { status: string }): Promise<{ success: boolean; message: string }> {
    const emailData: EmailData = {
      ...data,
      subject: `Quotation Update - ${data.venue_name}`,
      message: this.generateQuotationUpdateTemplate(data)
    };

    return this.sendEmail(emailData);
  }

  async sendBookingConfirmation(bookingData: BookingData): Promise<{ success: boolean; message: string }> {
    try {
      const emailData: EmailData = {
        to_email: bookingData.user.email,
        to_name: bookingData.user.fullName,
        from_name: 'Bantu Stall Team',
        subject: `Booking Confirmation - ${bookingData.experience.title}`,
        message: `Dear ${bookingData.user.fullName},

Your booking has been confirmed! Here are the details:

Experience: ${bookingData.experience.title}
Type: ${bookingData.experience.type}
Date: ${bookingData.preferredDate}
Participants: ${bookingData.participantCount}
Total Price: $${bookingData.totalPrice}
Status: ${bookingData.status}

Location: ${bookingData.experience.location.city}, ${bookingData.experience.location.country}

We will send you more details closer to your experience date.

Best regards,
The Bantu Stall Team
Nontombi@bantustall.com`,
        booking_id: bookingData.id,
        experience_title: bookingData.experience.title,
        booking_date: bookingData.preferredDate,
        total_price: bookingData.totalPrice.toString()
      };

      return this.sendEmail(emailData);
    } catch (error) {
      console.error('Booking confirmation email failed:', error);
      return {
        success: false,
        message: 'Failed to send booking confirmation email'
      };
    }
  }

  async sendBookingStatusUpdate(updateData: { booking: BookingData; newStatus: string; message?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const { booking, newStatus, message } = updateData;
      const emailData: EmailData = {
        to_email: booking.user.email,
        to_name: booking.user.fullName,
        from_name: 'Bantu Stall Team',
        subject: `Booking Update - ${booking.experience.title}`,
        message: `Dear ${booking.user.fullName},

Your booking status has been updated:

Experience: ${booking.experience.title}
New Status: ${newStatus}
Booking ID: ${booking.id}

${message || 'Please contact us if you have any questions.'}

Best regards,
The Bantu Stall Team
Nontombi@bantustall.com`,
        booking_id: booking.id,
        new_status: newStatus,
        experience_title: booking.experience.title
      };

      return this.sendEmail(emailData);
    } catch (error) {
      console.error('Booking status update email failed:', error);
      return {
        success: false,
        message: 'Failed to send booking status update email'
      };
    }
  }

  private generateQuotationEmailTemplate(data: QuotationEmailData): string {
    return `
      Dear ${data.contact_name},

      Thank you for your quotation request. We have received your inquiry for ${data.venue_name} and will process it shortly.

      Request Details:
      - Quotation ID: ${data.quotation_id}
      - Venue: ${data.venue_name}
      - Retreat Goal: ${data.retreat_goal}
      - Attendee Count: ${data.attendee_count}
      - Preferred Dates: ${data.preferred_dates}
      ${data.special_requests ? `- Special Requests: ${data.special_requests}` : ''}

      Our team will review your request and get back to you within 24-48 hours with a detailed quotation.

      You can track the status of your request in your Retreat Planning Dashboard.

      Best regards,
      The Bantu Stall Team
      Nontombi@bantustall.com
    `;
  }

  private generateQuotationConfirmationTemplate(data: QuotationEmailData): string {
    return `
Dear ${data.contact_name},

Thank you for your quotation request! We have received your inquiry and our team is preparing a customized quote for you.

Request Details:
- Venue: ${data.venue_name}
- Retreat Goal: ${data.retreat_goal}
- Number of Attendees: ${data.attendee_count}
- Preferred Dates: ${data.preferred_dates}
- Quotation ID: ${data.quotation_id}

${data.special_requests ? `Special Requests: ${data.special_requests}` : ''}

We will review your requirements and get back to you within 24-48 hours with a detailed quotation.

If you have any questions in the meantime, please don't hesitate to contact us.

Best regards,
The Bantu Stall Team
Nontombi@bantustall.com
    `.trim();
  }

  private generateQuotationUpdateTemplate(data: QuotationEmailData & { status: string }): string {
    const statusMessage = this.getStatusMessage(data.status);
    
    return `
      Dear ${data.contact_name},

      Your quotation request for ${data.venue_name} has been updated.

      Status: ${statusMessage}
      Quotation ID: ${data.quotation_id}

      ${this.getStatusSpecificMessage(data.status)}

      Please check your Retreat Planning Dashboard for the complete details.

      Best regards,
      The Bantu Stall Team
      Nontombi@bantustall.com
    `;
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case 'pending': return 'Under Review';
      case 'quotation_sent': return 'Quotation Ready';
      case 'in_review': return 'Client Review';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Declined';
      default: return 'Updated';
    }
  }

  private getStatusSpecificMessage(status: string): string {
    switch (status) {
      case 'quotation_sent':
        return 'Your detailed quotation is now available. Please review the proposal and let us know if you have any questions.';
      case 'accepted':
        return 'Congratulations! Your quotation has been accepted. Our team will contact you shortly to finalize the booking details.';
      case 'rejected':
        return 'We understand this quotation may not have met your requirements. Please feel free to submit a new request with different parameters.';
      default:
        return 'Your request status has been updated. Please check your dashboard for more information.';
    }
  }

  async generateQuotationPDF(quotationData: QuotationData): Promise<Blob> {
    try {
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      
      // Add company header with logo space
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BANTU STALL', 20, 25);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('African Travel & Retreat Platform', 20, 35);
      
      // Add contact info
      pdf.setFontSize(10);
      pdf.text('Email: nontombi@bantustall.com', 140, 25);
      pdf.text('Phone: +27 61 397 2802', 140, 35);
      
      // Add line separator
      pdf.line(20, 45, 190, 45);
      
      // Add quotation title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUOTATION', 20, 60);
      
      // Add generation date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 140, 60);
      
      // Add quotation details
      pdf.setFontSize(12);
      let yPosition = 80;
      
      const addLine = (label: string, value: string) => {
        pdf.text(`${label}: ${value}`, 20, yPosition);
        yPosition += 10;
      };
      
      addLine('Quotation ID', quotationData.quotation_number || quotationData.id);
      addLine('Venue', quotationData.venue_name);
      addLine('Retreat Goal', quotationData.retreat_goal);
      addLine('Attendee Count', quotationData.attendee_count);
      addLine('Preferred Dates', quotationData.preferred_dates);
      addLine('Contact Name', quotationData.contact_name);
      addLine('Status', quotationData.status);
      
      // Add pricing details if available
      if (quotationData.subtotal || quotationData.total_amount) {
        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.text('PRICING BREAKDOWN:', 20, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        
        if (quotationData.subtotal) {
          addLine('Subtotal', `R${quotationData.subtotal.toLocaleString()}`);
        }
        if (quotationData.tax_amount) {
          addLine('VAT', `R${quotationData.tax_amount.toLocaleString()}`);
        }
        if (quotationData.discount_amount) {
          addLine('Discount', `-R${quotationData.discount_amount.toLocaleString()}`);
        }
        if (quotationData.total_amount) {
          pdf.setFont('helvetica', 'bold');
          addLine('TOTAL', `R${quotationData.total_amount.toLocaleString()}`);
          pdf.setFont('helvetica', 'normal');
        }
      }
      
      if (quotationData.special_requests) {
        yPosition += 5;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Special Requests:', 20, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text(quotationData.special_requests, 20, yPosition);
      }
      
      // Add quote notes if available
      if (quotationData.quote_notes) {
        yPosition += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Quote Notes:', 20, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        const noteText = quotationData.quote_notes.length > 300 
          ? quotationData.quote_notes.substring(0, 297) + '...'
          : quotationData.quote_notes;
        pdf.text(noteText, 20, yPosition, { maxWidth: 170 });
        yPosition += Math.ceil(noteText.length / 80) * 5;
      }
      
      // Add terms and conditions
      yPosition += 20;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Terms & Conditions:', 20, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.text('- Quote valid for 30 days from date of issue', 20, yPosition);
      yPosition += 5;
      pdf.text('- 50% deposit required to confirm booking', 20, yPosition);
      yPosition += 5;
      pdf.text('- Final payment due 14 days before event', 20, yPosition);
      
      // Add comprehensive footer
      this.addComprehensiveFooter(pdf, quotationData, pageHeight, pageWidth);
      
      return pdf.output('blob');
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  private addComprehensiveFooter(pdf: any, quotationData: QuotationData, pageHeight: number, pageWidth: number): void {
    const footerStartY = pageHeight - 50; // Start footer 50px from bottom
    let currentY = footerStartY;
    
    // Footer separator line
    pdf.setLineWidth(0.5);
    pdf.line(20, footerStartY - 5, pageWidth - 20, footerStartY - 5);
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    // Create 3-column layout for footer content
    const col1X = 20;  // Left column
    const col2X = 85;  // Middle column  
    const col3X = 150; // Right column
    
    // Column 1: ESG & BEE Information
    currentY = footerStartY;
    pdf.setFont('helvetica', 'bold');
    pdf.text('ESG & BEE STATUS', col1X, currentY);
    currentY += 8;
    pdf.setFont('helvetica', 'normal');
    
    // ESG Information
    const esgInfo = this.formatESGInfo(quotationData);
    if (esgInfo) {
      pdf.text(`ESG: ${esgInfo}`, col1X, currentY);
      currentY += 6;
    }
    
    // BEE Information
    const beeInfo = this.formatBEEInfo(quotationData);
    if (beeInfo) {
      pdf.text(`BEE: ${beeInfo}`, col1X, currentY);
      currentY += 6;
    }
    
    // Column 2: Event Details & Notes
    currentY = footerStartY;
    pdf.setFont('helvetica', 'bold');
    pdf.text('EVENT & NOTES', col2X, currentY);
    currentY += 8;
    pdf.setFont('helvetica', 'normal');
    
    // Event Details
    const eventInfo = this.formatEventInfo(quotationData);
    if (eventInfo) {
      const eventLines = this.splitTextToFit(eventInfo, 55);
      eventLines.forEach(line => {
        pdf.text(line, col2X, currentY);
        currentY += 6;
      });
    }
    
    // Client Notes (if visible)
    if (quotationData.client_notes) {
      const clientNotes = quotationData.client_notes.length > 100 
        ? quotationData.client_notes.substring(0, 97) + '...'
        : quotationData.client_notes;
      const noteLines = this.splitTextToFit(`Notes: ${clientNotes}`, 55);
      noteLines.forEach(line => {
        pdf.text(line, col2X, currentY);
        currentY += 6;
      });
    }
    
    // Column 3: Quote Metrics
    currentY = footerStartY;
    pdf.setFont('helvetica', 'bold');
    pdf.text('QUOTE METRICS', col3X, currentY);
    currentY += 8;
    pdf.setFont('helvetica', 'normal');
    
    // Quote metrics
    const metrics = this.formatQuoteMetrics(quotationData);
    metrics.forEach(metric => {
      pdf.text(metric, col3X, currentY);
      currentY += 6;
    });
    
    // Company footer at bottom
    const bottomY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Bantu Stall - African Travel & Retreat Platform', 20, bottomY);
    pdf.text('Email: nontombi@bantustall.com | Phone: +27 61 397 2802', 20, bottomY + 5);
    
    // Generated timestamp
    pdf.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth - 70, bottomY + 5);
  }

  private formatESGInfo(data: QuotationData): string | null {
    if (data.esg_commitments && data.esg_commitments.length > 0) {
      return data.esg_commitments.join(' | ');
    }
    
    if (data.vendor_profile?.esg_certified) {
      const certs = data.vendor_profile.certifications || [];
      if (certs.length > 0) {
        return certs.slice(0, 3).join(' | ');
      }
      return 'Eco-Certified | Community Upliftment | Ethical Sourcing';
    }
    
    return '—';
  }

  private formatBEEInfo(data: QuotationData): string | null {
    if (data.bee_level) {
      let beeInfo = `Level ${data.bee_level}`;
      if (data.bee_certificate_number) {
        beeInfo += ` | Cert#: ${data.bee_certificate_number}`;
      }
      if (data.bee_valid_until) {
        beeInfo += ` | Valid till: ${data.bee_valid_until}`;
      }
      return beeInfo;
    }
    
    if (data.vendor_profile?.bee_level) {
      return `Level ${data.vendor_profile.bee_level}`;
    }
    
    return '—';
  }

  private formatEventInfo(data: QuotationData): string | null {
    if (data.event_type && data.event_date) {
      let eventInfo = `Event: ${data.event_type}`;
      if (data.event_date) eventInfo += ` | Date: ${data.event_date}`;
      if (data.event_venue) eventInfo += ` | Venue: ${data.event_venue}`;
      if (data.estimated_pax) eventInfo += ` | Est. Pax: ${data.estimated_pax}`;
      return eventInfo;
    }
    
    // Fallback to retreat details
    if (data.retreat_goal && data.preferred_dates) {
      return `Retreat: ${data.retreat_goal} | Dates: ${data.preferred_dates} | Attendees: ${data.attendee_count}`;
    }
    
    return null;
  }

  private formatQuoteMetrics(data: QuotationData): string[] {
    const metrics: string[] = [];
    
    // Quote number and creation date
    if (data.quotation_number) {
      metrics.push(`Quote #${data.quotation_number}`);
    }
    
    if (data.created_at) {
      const createdDate = new Date(data.created_at).toLocaleDateString();
      metrics.push(`Created: ${createdDate}`);
    }
    
    // Financial totals
    if (data.total_amount) {
      const totalText = data.tax_amount 
        ? `Total: R${data.total_amount.toLocaleString()} incl. VAT`
        : `Total: R${data.total_amount.toLocaleString()}`;
      metrics.push(totalText);
    }
    
    // Validity and status
    if (data.valid_until) {
      const expiryDate = new Date(data.valid_until).toLocaleDateString();
      metrics.push(`Expires: ${expiryDate}`);
    }
    
    metrics.push(`Status: ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`);
    
    return metrics;
  }

  private splitTextToFit(text: string, maxChars: number): string[] {
    if (text.length <= maxChars) return [text];
    
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + ' ' + word).length <= maxChars) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  async generateBookingReceiptPDF(bookingData: BookingData): Promise<Blob> {
    try {
      const pdf = new jsPDF();
      
      // Set up the document
      pdf.setFontSize(20);
      pdf.text('Booking Receipt', 20, 30);
      
      pdf.setFontSize(12);
      let yPosition = 50;
      
      const addLine = (label: string, value: string) => {
        pdf.text(`${label}: ${value}`, 20, yPosition);
        yPosition += 10;
      };
      
      // Add booking details
      addLine('Booking ID', bookingData.id);
      addLine('Experience', bookingData.experience.title);
      addLine('Type', bookingData.experience.type);
      addLine('Date', bookingData.preferredDate);
      addLine('Participants', bookingData.participantCount.toString());
      addLine('Total Price', `$${bookingData.totalPrice}`);
      addLine('Status', bookingData.status);
      addLine('Location', `${bookingData.experience.location.city}, ${bookingData.experience.location.country}`);
      
      if (bookingData.specialRequests) {
        yPosition += 5;
        pdf.text('Special Requests:', 20, yPosition);
        yPosition += 10;
        pdf.text(bookingData.specialRequests, 20, yPosition);
      }
      
      // Add footer
      yPosition += 20;
      pdf.setFontSize(10);
      pdf.text('Generated by Bantu Stall - African Travel & Retreat Platform', 20, yPosition);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 10);
      
      return pdf.output('blob');
    } catch (error) {
      console.error('Booking receipt PDF generation failed:', error);
      throw new Error('Failed to generate booking receipt PDF');
    }
  }

  async captureAndEmailScreenshot(elementId: string, emailData: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found for screenshot');
      }

      const canvas = await html2canvas(element);
      const imageData = canvas.toDataURL('image/png');
      
      // In a real implementation, you would upload this image to a service
      // and include the URL in the email
      const enhancedEmailData = {
        ...emailData,
        attachment_url: imageData // This would be a real URL in production
      };

      return this.sendEmail(enhancedEmailData);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return {
        success: false,
        message: 'Failed to capture and send screenshot'
      };
    }
  }

  async generateAndDownloadPDF(data: BookingData | QuotationData, type: 'receipt' | 'quotation' = 'receipt'): Promise<{ success: boolean; message: string }> {
    try {
      let pdfBlob: Blob;
      
      if (type === 'receipt') {
        pdfBlob = await this.generateBookingReceiptPDF(data as BookingData);
      } else {
        pdfBlob = await this.generateQuotationPDF(data as QuotationData);
      }
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${data.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, message: `${type} PDF downloaded successfully` };
    } catch (error) {
      console.error(`${type} PDF generation failed:`, error);
      return {
        success: false,
        message: `Failed to generate ${type} PDF`
      };
    }
  }
}

// Singleton instance
export const emailService = new EmailService();

// React hook for email functionality
export const useEmailService = () => {
  const sendQuotationEmail = async (quotationData: QuotationData) => {
    try {
      const emailData: QuotationEmailData = {
        to_email: quotationData.contact_email,
        to_name: quotationData.contact_name,
        from_name: 'Bantu Stall Team',
        subject: '',
        message: '',
        quotation_id: quotationData.id,
        venue_name: quotationData.venue_name,
        retreat_goal: quotationData.retreat_goal,
        attendee_count: quotationData.attendee_count,
        preferred_dates: quotationData.preferred_dates,
        contact_name: quotationData.contact_name,
        special_requests: quotationData.special_requests
      };

      return await emailService.sendQuotationConfirmation(emailData);
    } catch (error) {
      console.error('Failed to send quotation email:', error);
      return {
        success: false,
        message: 'Failed to send quotation email'
      };
    }
  };

  const sendStatusUpdateEmail = async (quotationData: QuotationData, newStatus: string) => {
    try {
      const emailData = {
        to_email: quotationData.contact_email,
        to_name: quotationData.contact_name,
        from_name: 'Bantu Stall Team',
        subject: '',
        message: '',
        quotation_id: quotationData.id,
        venue_name: quotationData.venue_name,
        retreat_goal: quotationData.retreat_goal,
        attendee_count: quotationData.attendee_count,
        preferred_dates: quotationData.preferred_dates,
        contact_name: quotationData.contact_name,
        special_requests: quotationData.special_requests,
        status: newStatus
      };

      return await emailService.sendQuotationUpdate(emailData);
    } catch (error) {
      console.error('Failed to send status update email:', error);
      return {
        success: false,
        message: 'Failed to send status update email'
      };
    }
  };

  const sendBookingConfirmationEmail = async (bookingData: BookingData) => {
    try {
      return await emailService.sendBookingConfirmation(bookingData);
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      return {
        success: false,
        message: 'Failed to send booking confirmation email'
      };
    }
  };

  const sendBookingStatusUpdateEmail = async (bookingData: BookingData, newStatus: string) => {
    try {
      return await emailService.sendBookingStatusUpdate({ booking: bookingData, newStatus });
    } catch (error) {
      console.error('Failed to send booking status update email:', error);
      return {
        success: false,
        message: 'Failed to send booking status update email'
      };
    }
  };

  const generateAndDownloadPDF = async (quotationData: QuotationData) => {
    try {
      const pdfBlob = await emailService.generateQuotationPDF(quotationData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quotation-${quotationData.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, message: 'PDF downloaded successfully' };
    } catch (error) {
      console.error('PDF generation failed:', error);
      return {
        success: false,
        message: 'Failed to generate PDF'
      };
    }
  };

  const generateAndDownloadReceiptPDF = async (bookingData: BookingData) => {
    try {
      const pdfBlob = await emailService.generateBookingReceiptPDF(bookingData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${bookingData.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true, message: 'Receipt PDF downloaded successfully' };
    } catch (error) {
      console.error('Receipt PDF generation failed:', error);
      return {
        success: false,
        message: 'Failed to generate receipt PDF'
      };
    }
  };

  return {
    sendQuotationEmail,
    sendStatusUpdateEmail,
    sendBookingConfirmationEmail,
    sendBookingStatusUpdateEmail,
    generateAndDownloadPDF,
    generateAndDownloadReceiptPDF
  };
};
