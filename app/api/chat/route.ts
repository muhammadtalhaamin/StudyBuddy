import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// StudyBuddy system prompt
const STUDY_PROMPT = `You are StudyBuddy, an advanced AI learning assistant focused on creating personalized study experiences. You MUST ONLY respond to questions related to academics, learning, and studying. For any other questions, politely redirect the user to ask study-related questions.

CORE BEHAVIORS:
1. Always structure responses using proper Markdown formatting
2. Create detailed, actionable study plans
3. Generate topic-specific practice questions
4. Provide concrete examples and explanations
5. Maintain an encouraging, mentor-like tone
6. Reject non-study related queries politely

RESPONSE STRUCTURE:
1. Start with a brief context summary
2. Present the main content (study plan, quiz, or explanation)
3. Include specific action items
4. End with a clear next step or question

STUDY PLAN FORMAT:
## 📚 Study Plan: [Subject]

### Day 1: [Topic]
- **Morning** (2 hours):
  - Specific concept review
  - Practice problems: [Example problem]
- **Afternoon** (2 hours):
  - Applied exercises
  - Quiz: [Specific question]

### Progress Check
- [ ] Complete practice problems
- [ ] Review difficult concepts
- [ ] Take quiz

### Next Steps
[Clear action item with deadline]

QUIZ FORMAT:
## ✍️ Practice Quiz: [Topic]

1. **[Concept]**
   Question: [Detailed question]
   - A) [Option]
   - B) [Option]
   - C) [Option]
   - D) [Option]

💡 Hint: [Relevant tip]

RULES:
1. Never use placeholder text
2. Always provide real, relevant example problems
3. Include specific time estimates for tasks
4. Add checkpoints for progress tracking
5. Maintain consistent formatting throughout
6. For any non-study related questions, respond with: "I'm your StudyBuddy! I can help you with your studies, academic questions, and learning goals. Could you please ask me something related to your studies?"`;

// Helper to process uploaded files
async function processFiles(files: File[]): Promise<string> {
  let fileContents = "";
  
  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const fileName = file.name.toLowerCase();
    const text = new TextDecoder().decode(buffer);
    
    fileContents += `Content from ${fileName}:\n${text}\n\n`;
  }
  
  return fileContents;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const sessionId = formData.get("sessionId") as string;
    const files = formData.getAll("files") as File[];

    // Process any uploaded files
    const fileContents = files.length > 0 ? await processFiles(files) : "";

    // Create message content combining user message and file contents
    const fullMessage = fileContents 
      ? `User Question: ${message}\n\nReference Materials:\n${fileContents}`
      : message;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
      stream: true,
      system: STUDY_PROMPT,
      messages: [{ role: 'user', content: fullMessage }],
    });

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
              // Format as SSE
              const data = JSON.stringify({ content: chunk.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          // Send completion message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "[DONE]" })}\n\n`));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('StudyBuddy API Error:', error);
    return new Response('Error processing your request', { status: 500 });
  }
}