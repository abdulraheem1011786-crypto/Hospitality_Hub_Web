"""
RAG Chain Setup for Hospitality Hub Chatbot
This module sets up the LangChain RAG pipeline with conversational memory,
retrieval, and LLM integration.
"""

import os
from typing import Any
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate

# Load environment variables
load_dotenv()

# Define paths and configurations
VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./vector_db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# =====================================================================
# SYSTEM PROMPT FOR THE CHATBOT
# =====================================================================

SYSTEM_PROMPT = """You are the Hospitality Hub Support Agent, a knowledgeable and friendly assistant for our premium hospitality platform in Lahore, Pakistan.

Your role is to help customers with:
- Hotel bookings and inquiries
- High-tea venue information and reservations
- Event hall details and bookings
- Pricing information and special offers
- Cancellation and refund policies
- General booking policies

IMPORTANT GUIDELINES:
1. ALWAYS base your responses ONLY on the provided context and knowledge base
2. If a question is outside the scope of Hospitality Hub services, politely redirect to relevant topics
3. Keep responses concise, friendly, and helpful (2-4 sentences maximum)
4. Provide specific pricing and contact information when relevant
5. Always mention that customers can contact support@hospitalityhub.com for complex inquiries
6. Be professional but warm in tone
7. Ask clarifying questions if the customer's need is unclear
8. If you don't know something, admit it and suggest they contact support

PROHIBITED ACTIONS:
- Do NOT provide information about competitors
- Do NOT make promises about services not mentioned in the knowledge base
- Do NOT provide personal advice unrelated to hospitality services
- Do NOT attempt to collect sensitive payment information (that's handled by the booking system)

When answering:
- Start with a direct answer to their question
- Provide relevant details from the knowledge base
- Offer next steps or additional help if needed
- End with a call to action when appropriate
"""


def load_vector_database() -> FAISS:
    """
    Load the FAISS vector database from disk.
    Returns the loaded vector store.
    """
    if not os.path.exists(VECTOR_DB_PATH):
        raise FileNotFoundError(
            f"Vector database not found at {VECTOR_DB_PATH}. "
            "Please run ingestion.py first to create the database."
        )
    
    print(f"Loading vector database from {VECTOR_DB_PATH}...")
    
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        api_key=OPENAI_API_KEY
    )
    
    vector_db = FAISS.load_local(
        VECTOR_DB_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )
    
    print("✓ Vector database loaded successfully")
    return vector_db


def create_rag_chain(vector_db: FAISS) -> ConversationalRetrievalChain:
    """
    Create a LangChain ConversationalRetrievalChain.
    This combines retrieval with conversational memory.
    
    Args:
        vector_db: The FAISS vector database
    
    Returns:
        A ConversationalRetrievalChain object
    """
    
    # Initialize the LLM
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7,  # Balanced between creative and factual
        api_key=OPENAI_API_KEY,
        max_tokens=500  # Keep responses concise
    )
    
    # Create a retriever from the vector store
    retriever = vector_db.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}  # Retrieve top 4 relevant documents
    )
    
    # Create memory for conversation history
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer"
    )
    
    # Create custom prompt for the chain
    qa_prompt = PromptTemplate(
        input_variables=["question", "chat_history", "context"],
        template=f"""{SYSTEM_PROMPT}

Chat History:
{{chat_history}}

Context from knowledge base:
{{context}}

Customer Question: {{question}}

Hospitality Hub Support Agent Response:"""
    )
    
    # Create the conversational retrieval chain
    rag_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        return_source_documents=False,
        verbose=False,
        max_tokens_limit=4000
    )
    
    # Update the combine_docs_chain prompt
    rag_chain.combine_docs_chain.llm_chain.prompt = qa_prompt
    
    print("✓ RAG chain created successfully")
    return rag_chain


def initialize_rag_pipeline() -> ConversationalRetrievalChain:
    """
    Initialize the complete RAG pipeline.
    This is the main entry point for the chatbot.
    
    Returns:
        A ConversationalRetrievalChain ready to answer questions
    """
    try:
        if not OPENAI_API_KEY:
            raise ValueError(
                "OPENAI_API_KEY not found. Please set it in your .env file"
            )
        
        vector_db = load_vector_database()
        rag_chain = create_rag_chain(vector_db)
        
        return rag_chain
    
    except Exception as e:
        print(f"✗ Error initializing RAG pipeline: {str(e)}")
        raise


def test_rag_chain():
    """
    Test the RAG chain with sample questions.
    Useful for debugging and validation.
    """
    try:
        print("\nTesting RAG Chain...")
        print("=" * 60)
        
        rag_chain = initialize_rag_pipeline()
        
        test_questions = [
            "What hotels do you have in Lahore?",
            "What is your cancellation policy?",
            "How much does high-tea cost at Avari Lounge?"
        ]
        
        for i, question in enumerate(test_questions, 1):
            print(f"\nTest {i}: {question}")
            response = rag_chain.invoke({"question": question})
            print(f"Answer: {response['answer']}")
            print("-" * 60)
        
        print("\n✓ RAG chain test completed successfully!")
    
    except Exception as e:
        print(f"✗ Error testing RAG chain: {str(e)}")
        raise


if __name__ == "__main__":
    # Run test if executed directly
    test_rag_chain()
