"""
Ingestion Pipeline for Hospitality Hub RAG Chatbot
This script loads custom hospitality data, chunks it, creates embeddings, 
and stores them in a FAISS vector database.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

# Load environment variables
load_dotenv()

# Define the vector database path
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./vector_db")

# =====================================================================
# CUSTOM DATA FOR HOSPITALITY HUB
# =====================================================================

HOSPITALITY_DATA = """
=== HOSPITALITY HUB WELCOME ===
Welcome to Hospitality Hub, your premier platform for booking hotels, event halls, and high-tea venues in Lahore, Pakistan.
We offer a seamless experience for planning your perfect event or getaway.

=== HOTELS ===

1. AVARI LAHORE HOTEL
   Location: Mall Road, Lahore, Punjab, Pakistan
   Category: 5-Star Luxury Hotel
   
   Rooms & Pricing:
   - Standard Double Room: Rs. 12,000 - 15,000 per night
   - Deluxe Double Room: Rs. 18,000 - 22,000 per night
   - Junior Suite: Rs. 25,000 - 30,000 per night
   - Presidential Suite: Rs. 50,000 - 70,000 per night
   
   Amenities:
   - Free high-speed WiFi throughout the hotel
   - 24-hour room service and concierge
   - 3 on-site restaurants and bars
   - Fitness center with modern equipment
   - Swimming pool and spa facilities
   - Business center with meeting rooms
   - Free parking for hotel guests
   - 24-hour security and CCTV monitoring
   
   Special Services:
   - Wedding and event coordination
   - Personalized dietary accommodations
   - Laundry and dry cleaning services
   - Airport transfer arrangements
   
   Contact: +92-42-111-000-111
   Email: reservations@avarihotels.com

2. LAHORE FORT VIEW HOTEL
   Location: Badshahi Mosque Road, Lahore
   Category: 4-Star Hotel
   
   Rooms & Pricing:
   - Standard Room: Rs. 8,000 - 10,000 per night
   - Superior Room: Rs. 12,000 - 15,000 per night
   - Deluxe Room: Rs. 15,000 - 18,000 per night
   - Suite: Rs. 22,000 - 28,000 per night
   
   Amenities:
   - Views of Lahore Fort and Badshahi Mosque
   - Restaurant with Pakistani and international cuisine
   - Rooftop lounge and bar
   - Conference facilities
   - WiFi and cable TV in all rooms
   - 24-hour front desk
   
   Contact: +92-42-999-888-777
   Email: info@lahorfortview.com

3. PC LAHORE HOTEL
   Location: Thokar Niaz Baig, Lahore
   Category: 3-Star Hotel
   
   Rooms & Pricing:
   - Budget Room: Rs. 4,000 - 5,500 per night
   - Standard Room: Rs. 6,000 - 7,500 per night
   - Deluxe Room: Rs. 9,000 - 11,000 per night
   - Family Room: Rs. 15,000 - 18,000 per night
   
   Amenities:
   - Restaurant and café
   - Free WiFi
   - TV and air conditioning
   - 24-hour reception
   - Basic gym facilities
   - Parking available
   
   Contact: +92-42-666-555-444
   Email: bookings@pclahore.com

=== HIGH-TEA VENUES ===

1. AVARI LOUNGE HIGH-TEA EXPERIENCE
   Location: Avari Lahore Hotel, Mall Road
   Ambiance: Luxury and elegance with traditional décor
   
   Pricing Per Head:
   - Classic High-Tea: Rs. 2,500 per person
   - Premium High-Tea with Champagne: Rs. 3,500 per person
   - Deluxe High-Tea (6-course with wine): Rs. 4,500 per person
   
   Includes:
   - Selection of sandwiches and pastries
   - Freshly baked scones with jam and cream
   - Assorted petit fours and macarons
   - Selection of specialty teas and coffee
   - Optional: Champagne or wine pairing
   
   Operating Hours: 3:00 PM - 6:00 PM, Daily
   Minimum Group Size: 4 persons
   Maximum Group Size: 50 persons
   
   Reservations: +92-42-111-000-111

2. LAHORE HERITAGE HIGH-TEA
   Location: Fort Road, Walled City
   Ambiance: Traditional Pakistani with modern comfort
   
   Pricing Per Head:
   - Standard High-Tea: Rs. 1,500 per person
   - Premium High-Tea: Rs. 2,200 per person
   
   Includes:
   - Traditional Pakistani snacks and pastries
   - Fresh fruit platters
   - Selection of Pakistani and international teas
   - Complimentary mineral water
   
   Operating Hours: 2:00 PM - 7:00 PM, Daily
   Minimum Group Size: 2 persons
   
   Reservations: +92-42-999-888-777

3. PARKSIDE HIGH-TEA GARDEN
   Location: Mall Road, Thokar Niaz Baig
   Ambiance: Casual garden setting
   
   Pricing Per Head:
   - Garden High-Tea: Rs. 1,200 per person
   - Premium Garden Experience: Rs. 1,800 per person
   
   Includes:
   - Seasonal snacks and pastries
   - Selection of beverages
   - Desserts and confectioneries
   
   Operating Hours: 1:00 PM - 8:00 PM, Daily
   Reservations: +92-42-666-555-444

=== EVENT HALLS ===

1. AVARI GRAND BALLROOM
   Location: Avari Lahore Hotel
   Capacity: 800 seated, 1200 cocktail reception
   
   Pricing:
   - Half Day (4 hours): Rs. 250,000 - 400,000
   - Full Day (8 hours): Rs. 400,000 - 600,000
   - Multi-day Events: Custom pricing
   
   Features:
   - Crystal chandeliers and marble flooring
   - State-of-the-art sound and lighting system
   - Built-in stage with AV capabilities
   - Air-conditioned comfort
   - Adjacent pre-function areas
   - Dedicated event coordinator
   - In-house catering options
   
   Suitable For: Weddings, corporate events, galas, conferences
   Contact: events@avarihotels.com

2. HERITAGE HALL LAHORE
   Location: Walled City, Fort Area
   Capacity: 300 seated, 500 cocktail
   
   Pricing:
   - Half Day: Rs. 100,000 - 150,000
   - Full Day: Rs. 150,000 - 250,000
   
   Features:
   - Traditional and modern décor blend
   - Professional sound and lighting
   - Separate entrance for VIP guests
   - Climate control
   - On-site parking
   - Catering options available
   
   Contact: bookings@heritage-hall.com

3. MODERN CONVENTION CENTER
   Location: Gulberg, Lahore
   Capacity: 500 seated, 800 cocktail
   
   Pricing:
   - Half Day: Rs. 150,000 - 200,000
   - Full Day: Rs. 200,000 - 350,000
   
   Features:
   - Modern architecture with flexible layouts
   - Breakout rooms for multiple sessions
   - Advanced AV and projection systems
   - WiFi throughout venue
   - Multiple entrance/exits
   - Accessible parking
   
   Contact: events@moderncc.com

=== CANCELLATION AND REFUND POLICY ===

GENERAL CANCELLATION POLICY:
- Cancellation up to 7 days before the event: Full refund (100%)
- Cancellation 3-7 days before the event: 50% refund
- Cancellation less than 3 days before: No refund (0%)
- No-show without cancellation: No refund (0%)

SPECIAL CONDITIONS:
- For Force Majeure events (natural disasters, extreme weather): 75% refund regardless of timing
- Wedding packages: Extended cancellation window (up to 30 days) with graduated refunds
- Group bookings (10+ rooms): Negotiable cancellation terms
- Corporate events: Standard policy applies unless custom contract is signed

REFUND PROCESSING TIME: 7-10 business days after cancellation confirmation

MODIFICATION POLICY:
- Modifications to event date/time: Allowed up to 7 days before event, no additional charge
- Upgrades: Available anytime, charges apply
- Downgrades: Only allowed 7+ days before event

CONTACT FOR CANCELLATION: cancellations@hospitalityhub.com or call +92-42-1234-5678

=== BOOKING POLICIES ===

GENERAL BOOKING TERMS:
1. Deposits and Payments:
   - 25% deposit required to confirm booking
   - Full payment due 7 days before event date
   - Multiple payment methods accepted (card, bank transfer)
   - Invoice issued upon booking confirmation

2. Group Bookings:
   - Groups of 10+ rooms: 10-15% group discount available
   - Groups of 50+ guests for events: Custom pricing
   - Corporate rate available for repeat bookings

3. Advance Booking Discounts:
   - Book 3+ months in advance: 10% discount
   - Book 2-3 months in advance: 5% discount
   - Last-minute bookings (within 7 days): Subject to availability, no discount

4. Special Offers:
   - Loyalty program members: 5-10% recurring discount
   - Referral bonus: 5% discount when referred guest books
   - Seasonal promotions: Check website for current offers

5. Guest Policies:
   - Check-in: 2:00 PM, Check-out: 12:00 PM (noon)
   - Early check-in/Late check-out: Subject to availability, may incur charges
   - Additional guests in room: Rs. 2,000 - 3,000 per person per night
   - Children under 12 stay free with parents (max 2 children per room)
   - Pets: Only service animals allowed without charge

6. Terms and Conditions:
   - Age of majority (18+) required for independent bookings
   - Valid ID required at check-in
   - Hotel reserves right to cancel if guest violates conduct policy
   - No smoking in rooms (smoking area available)
   - Quiet hours: 11:00 PM - 8:00 AM

=== COMMONLY ASKED QUESTIONS ===

Q: What are your check-in and check-out times?
A: Standard check-in is 2:00 PM and check-out is 12:00 PM noon. Early check-in and late check-out are subject to availability and may incur additional charges.

Q: Do you offer airport transportation?
A: Yes, airport transfers are available. Please contact your hotel's concierge at the time of booking or during your stay.

Q: Are meals included in room rates?
A: Room rates are typically room-only. However, meal packages and special rate inclusions may be available; please inquire during booking.

Q: Can I modify my booking after confirmation?
A: Yes, modifications are allowed up to 7 days before your event/check-in date. Contact our reservations team for assistance.

Q: What is your WiFi situation?
A: Free high-speed WiFi is provided throughout all our properties for all guests.

Q: Do you accommodate dietary restrictions?
A: Yes, we happily accommodate vegetarian, vegan, gluten-free, and other dietary preferences. Please mention during booking.

Q: What is your payment policy?
A: A 25% deposit secures your booking, with full payment due 7 days before arrival/event.

Q: Do you have parking facilities?
A: Yes, free parking is available at all our hotels. Valet parking services are also available at premium properties.

=== CONTACT INFORMATION ===

Main Hospitality Hub: +92-42-1234-5678
General Email: support@hospitalityhub.com
Bookings: bookings@hospitalityhub.com
Events: events@hospitalityhub.com
Cancellations: cancellations@hospitalityhub.com
Website: www.hospitalityhub.com
"""


def load_and_split_documents() -> list:
    """
    Load custom hospitality data and split into chunks.
    Returns a list of Document objects.
    """
    print("Loading hospitality data...")
    
    # Create a Document object with the hospitality data
    doc = Document(
        page_content=HOSPITALITY_DATA,
        metadata={
            "source": "hospitality_hub_knowledge_base",
            "type": "company_information",
        }
    )
    
    # Initialize text splitter with optimal chunk size for RAG
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    # Split the document
    print("Splitting documents into chunks...")
    chunks = text_splitter.split_documents([doc])
    print(f"Created {len(chunks)} chunks from documents")
    
    return chunks


def create_vector_database(chunks: list) -> FAISS:
    """
    Create FAISS vector database from document chunks.
    Uses OpenAI embeddings.
    """
    print("Creating embeddings and vector database...")
    print("This may take a moment on first run...")
    
    # Initialize OpenAI embeddings
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        api_key=os.getenv("OPENAI_API_KEY")
    )
    
    # Create FAISS vector store from documents
    vector_db = FAISS.from_documents(chunks, embeddings)
    
    print(f"Vector database created with {len(chunks)} documents")
    return vector_db


def save_vector_database(vector_db: FAISS, path: str):
    """Save the vector database to disk."""
    # Create directory if it doesn't exist
    Path(path).mkdir(parents=True, exist_ok=True)
    
    vector_db.save_local(path)
    print(f"Vector database saved to {path}")


def main():
    """Main ingestion pipeline."""
    try:
        # Check if OpenAI API key is set
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError(
                "OPENAI_API_KEY environment variable not set. "
                "Please create a .env file and add your OpenAI API key."
            )
        
        print("=" * 60)
        print("Hospitality Hub RAG Chatbot - Ingestion Pipeline")
        print("=" * 60)
        
        # Step 1: Load and split documents
        chunks = load_and_split_documents()
        
        # Step 2: Create vector database
        vector_db = create_vector_database(chunks)
        
        # Step 3: Save vector database
        save_vector_database(vector_db, VECTOR_DB_PATH)
        
        print("\n" + "=" * 60)
        print("✓ Ingestion pipeline completed successfully!")
        print("✓ Vector database is ready for the RAG chatbot")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error during ingestion: {str(e)}")
        raise


if __name__ == "__main__":
    main()
