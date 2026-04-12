'use server';
/**
 * @fileOverview An AI agent for generating engaging product descriptions.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product (e.g., Phones, Laptops, CoD Accounts, CP Top-up, Gadgets).'),
  keyFeatures: z.array(z.string()).describe('A list of key features or selling points of the product.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in gaming products. Your task is to create a detailed, engaging, and persuasive product description based on the provided product information.

Product Name: {{{productName}}}
Category: {{{category}}}
Key Features:
{{#each keyFeatures}}
- {{{this}}}
{{/each}}

Generate a product description that highlights the benefits, appeals to gamers, and entices potential customers to purchase. Make it sound professional yet exciting. Focus on the gaming aspect for all categories.

`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
