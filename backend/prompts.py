"""
Prompts for LLM-based summary generation.

This file contains all the prompt templates used for generating summaries.
You can easily edit these prompts to improve summary quality or adapt them
for different use cases.
"""

# Prompt for summarizing individual chunks of a document
CHUNK_SUMMARY_PROMPT = """Please provide a concise summary of this section from a larger document. 
This is chunk {chunk_index} of {total_chunks}.

Focus on:
- Key concepts and main ideas
- Important details and facts
- Conclusions or findings

Keep the summary clear and informative while being concise.

Text to summarize:
{chunk}

Summary:"""

# Prompt for combining chunk summaries into a final coherent summary
COMBINE_SUMMARIES_PROMPT = """Please create a comprehensive and coherent summary by combining these section summaries from a document.

Original document title: {title}

Section summaries:
{combined_text}

Create a unified summary that:
- Flows naturally and coherently
- Maintains the logical structure
- Highlights the most important points
- Eliminates redundancy between sections
- Provides a clear overview of the entire document

Final Summary:"""

# Alternative prompts for different summary styles (can be selected via API)
PROMPTS = {
    "default": {
        "chunk_summary": CHUNK_SUMMARY_PROMPT,
        "combine_summaries": COMBINE_SUMMARIES_PROMPT
    },
    
    "detailed": {
        "chunk_summary": """Please provide a detailed summary of this section from a larger document.
This is chunk {chunk_index} of {total_chunks}.

Include:
- All key concepts and main ideas
- Important details, facts, and data points
- Examples and case studies mentioned
- Conclusions, findings, or recommendations
- Any methodologies or processes described

Maintain technical accuracy while being comprehensive.

Text to summarize:
{chunk}

Detailed Summary:""",
        
        "combine_summaries": """Please create a comprehensive and detailed summary by combining these section summaries from a document.

Original document title: {title}

Section summaries:
{combined_text}

Create a detailed unified summary that:
- Preserves important details from each section
- Maintains the logical flow and structure
- Includes key facts, data, and findings
- Highlights methodologies and processes
- Provides actionable insights and conclusions
- Organizes information clearly with appropriate headings

Comprehensive Summary:"""
    },
    
    "brief": {
        "chunk_summary": """Provide a brief summary of this section (chunk {chunk_index} of {total_chunks}):

{chunk}

Focus only on the most essential points in 2-3 sentences.

Brief Summary:""",
        
        "combine_summaries": """Create a brief overview by combining these section summaries from "{title}":

{combined_text}

Provide a concise summary that captures only the most important points in a few paragraphs.

Brief Overview:"""
    }
}

def get_prompt(prompt_type: str, style: str = "default") -> str:
    """
    Get a prompt template by type and style.
    
    Args:
        prompt_type: Either 'chunk_summary' or 'combine_summaries'
        style: Prompt style - 'default', 'detailed', or 'brief'
    
    Returns:
        The prompt template string
    
    Raises:
        KeyError: If the prompt_type or style doesn't exist
    """
    if style not in PROMPTS:
        style = "default"
    
    if prompt_type not in PROMPTS[style]:
        raise KeyError(f"Prompt type '{prompt_type}' not found for style '{style}'")
    
    return PROMPTS[style][prompt_type]

def format_chunk_summary_prompt(chunk: str, chunk_index: int, total_chunks: int, style: str = "default") -> str:
    """Format the chunk summary prompt with the given parameters."""
    template = get_prompt("chunk_summary", style)
    return template.format(
        chunk=chunk,
        chunk_index=chunk_index + 1,  # Convert to 1-based indexing for display
        total_chunks=total_chunks
    )

def format_combine_summaries_prompt(combined_text: str, title: str = "", style: str = "default") -> str:
    """Format the combine summaries prompt with the given parameters."""
    template = get_prompt("combine_summaries", style)
    return template.format(
        combined_text=combined_text,
        title=title or "Document"
    )